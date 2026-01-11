import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SERVER_URL } from '../config/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { AuthContext } from '../Contexts/AuthContext';

export default function ApplyForm({ route, navigation }) {
  const internship = route?.params?.internship || null;
  const { user } = useContext(AuthContext);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (res.type === 'success') setCvFile(res);
  };

  const handleSubmit = async () => {
    console.log('ApplyForm handleSubmit', { fullName, email, phone });
    if (!fullName || !email) {
      Alert.alert('Erreur', 'Remplissez au moins le nom et l\'email');
      return;
    }

    setLoading(true);
    try {
      let cvUrl = null;
      if (cvFile) {
        const response = await fetch(cvFile.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `applications/${internship?.id || 'general'}/${user?.uid || 'anonymous'}/${cvFile.name}`);
        await uploadBytes(storageRef, blob);
        cvUrl = await getDownloadURL(storageRef);
      }

      // First attempt: call server endpoint to record and append to Excel
      const payload = {
        internshipId: internship?.id || null,
        internshipTitle: internship?.title || null,
        userId: user?.uid || null,
        name: fullName,
        email,
        phone,
        message,
        cvUrl,
      };

      try {
        await fetch(`${SERVER_URL}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // fallback to Firestore if server not available
        await addDoc(collection(db, 'applications'), { ...payload, createdAt: new Date().toISOString() });
      }

      Alert.alert('Succès', 'Votre candidature a été envoyée.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Échec de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Postuler{internship ? `: ${internship.title}` : ''}</Text>

        <TextInput style={styles.input} placeholder="Nom complet" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={[styles.input, { height: 100 }]} placeholder="Message" value={message} onChangeText={setMessage} multiline />

        <TouchableOpacity style={styles.fileButton} onPress={pickDocument} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.85}>
          <Text style={styles.fileButtonText}>{cvFile ? `CV: ${cvFile.name}` : 'Joindre CV (PDF)'} </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.85}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Envoyer</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginBottom: 12 },
  fileButton: { backgroundColor: '#E5E7EB', padding: 12, borderRadius: 10, marginBottom: 12 },
  fileButtonText: { color: '#374151' },
  submitButton: { backgroundColor: '#0F8A5F', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: 'white', fontWeight: '700' },
});
