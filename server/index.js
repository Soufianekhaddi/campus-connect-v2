require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
let Resend = null;
try {
  Resend = require('resend').Resend;
} catch (e) {
  // optional
}
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin (only if service account exists)
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'serviceAccountKey.json');
let adminInitialized = false;
let db = null;
if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    adminInitialized = true;
    console.log('Firebase admin initialized from', serviceAccountPath);
  } catch (err) {
    console.warn('Firebase admin initialization failed — check service account file and format:', err.message);
  }
} else {
  console.warn('Firebase service account not found at', serviceAccountPath, '\nPlace your service account JSON at this path or set GOOGLE_APPLICATION_CREDENTIALS in .env');
}

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

app.post('/send-confirmation', async (req, res) => {
  if (!adminInitialized) return res.status(500).json({ error: 'Server not configured: missing Firebase service account. See server/README.md.' });
  const { uid, email, name, redirectBase } = req.body;
  if (!uid || !email) return res.status(400).json({ error: 'Missing uid or email' });

  const token = uuidv4();
  const expiresAt = Date.now() + (1000 * 60 * 60 * 24); // 24h

  try {
    await db.collection('emailVerifications').doc(token).set({ uid, email, name, expiresAt });

    const verifyUrl = `${req.protocol}://${req.get('host')}/verify?token=${token}` + (redirectBase ? `&redirect=${encodeURIComponent(redirectBase)}` : '');

    const html = `
      <p>Bonjour ${name || ''},</p>
      <p>Cliquez sur le lien suivant pour vérifier votre adresse email :</p>
      <p><a href="${verifyUrl}">Vérifier mon email</a></p>
      <p>Si vous n'avez pas demandé ceci, ignorez ce message.</p>
    `;

    // If RESEND_API_KEY is provided, use Resend (preferred)
    if (process.env.RESEND_API_KEY && Resend) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'Confirmez votre email - Campus Connect',
          html: html,
        });
        return res.json({ success: true, via: 'resend' });
      } catch (err) {
        console.error('Resend error:', err.message || err);
        // fallback to nodemailer below
      }
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Confirmez votre email - Campus Connect',
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, via: 'nodemailer' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Append application to Excel and Firestore
app.post('/applications', async (req, res) => {
  if (!adminInitialized) return res.status(500).json({ error: 'Server not configured: missing Firebase service account.' });
  const data = req.body;
  if (!data || !data.email) return res.status(400).json({ error: 'Missing application data' });

  try {
    // Save to Firestore
    await db.collection('applications').add({ ...data, createdAt: new Date().toISOString() });

    // Append to Excel file
    const ExcelJS = require('exceljs');
    const fs = require('fs');
    const filePath = path.join(__dirname, 'exports', 'applications.xlsx');
    await fs.promises.mkdir(path.join(__dirname, 'exports'), { recursive: true });

    const workbook = new ExcelJS.Workbook();
    let sheet;
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      sheet = workbook.getWorksheet('Applications') || workbook.addWorksheet('Applications');
    } else {
      sheet = workbook.addWorksheet('Applications');
      sheet.addRow(['Timestamp', 'InternshipId', 'InternshipTitle', 'UserId', 'Name', 'Email', 'Phone', 'Message', 'CvUrl']);
    }

    sheet.addRow([new Date().toISOString(), data.internshipId || '', data.internshipTitle || '', data.userId || '', data.name || '', data.email || '', data.phone || '', data.message || '', data.cvUrl || '']);
    await workbook.xlsx.writeFile(filePath);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Append event registration to Excel and Firestore
app.post('/event-registrations', async (req, res) => {
  if (!adminInitialized) return res.status(500).json({ error: 'Server not configured: missing Firebase service account.' });
  const data = req.body;
  if (!data || !data.email) return res.status(400).json({ error: 'Missing registration data' });

  try {
    await db.collection('eventRegistrations').add({ ...data, createdAt: new Date().toISOString() });

    const ExcelJS = require('exceljs');
    const fs = require('fs');
    const filePath = path.join(__dirname, 'exports', 'event_registrations.xlsx');
    await fs.promises.mkdir(path.join(__dirname, 'exports'), { recursive: true });

    const workbook = new ExcelJS.Workbook();
    let sheet;
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      sheet = workbook.getWorksheet('Registrations') || workbook.addWorksheet('Registrations');
    } else {
      sheet = workbook.addWorksheet('Registrations');
      sheet.addRow(['Timestamp', 'EventId', 'EventTitle', 'Name', 'Email', 'Phone']);
    }

    sheet.addRow([new Date().toISOString(), data.eventId || '', data.eventTitle || '', data.name || '', data.email || '', data.phone || '']);
    await workbook.xlsx.writeFile(filePath);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/verify', async (req, res) => {
  if (!adminInitialized) return res.status(500).send('Server not configured: missing Firebase service account. See server/README.md.');
  const { token, redirect } = req.query;
  if (!token) return res.status(400).send('Token manquant');

  try {
    const doc = await db.collection('emailVerifications').doc(token).get();
    if (!doc.exists) return res.status(400).send('Token invalide');
    const data = doc.data();
    if (Date.now() > data.expiresAt) return res.status(400).send('Token expiré');

    // Marquer utilisateur comme vérifié dans Firestore (collection 'users')
    await db.collection('users').doc(data.uid).update({ emailVerified: true });

    // Supprimer le token
    await db.collection('emailVerifications').doc(token).delete();

    if (redirect) return res.redirect(redirect);
    return res.send('<h2>Email vérifié</h2><p>Merci ! Vous pouvez fermer cette page.</p>');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur serveur');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
