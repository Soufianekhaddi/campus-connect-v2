# Campus Connect - Minimal SMTP Server

This small Express server sends confirmation emails via SMTP and marks users verified in Firestore.

Setup:
1. Copy your Firebase service account JSON into `server/serviceAccountKey.json` or set `GOOGLE_APPLICATION_CREDENTIALS`.
2. Create a `.env` file in `server/` with:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="Campus Connect <no-reply@example.com>"
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
PORT=4000
```

3. Install and run:

```bash
cd server
npm install
npm start
```

Usage from app:
POST `/send-confirmation` with JSON `{ uid, email, name, redirectBase }`.

The verification link will open `/verify?token=...` which will set `emailVerified: true` on the user document in Firestore.

Using Resend
---------------
This server supports sending via Resend when you add `RESEND_API_KEY` to `server/.env`. If present the server will try Resend first and fall back to Nodemailer if Resend fails.

To use Resend add to `.env`:

```
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Campus Connect <no-reply@yourdomain.com>"
```

React-email templates
---------------------
Resend works well with `react-email` templates. See `server/emails/README.md` for guidance on wiring React-based templates into this server. I can add a build step to pre-render `react-email` templates if you want fully-React templates rendered server-side.

Security note: this is a minimal example. For production use, validate requests, add rate limiting, store tokens securely, and use HTTPS.
