import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { SERVER_URL } from '../config/server';
import { db } from '../config/firebase';

export default function EventRegistration({ route, navigation }) {
  const event = route?.params?.event || null;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    console.log('handleRegister called', { name, email, phone });
    if (!name || !email) {
      Alert.alert('Erreur', 'Remplissez au moins le nom et l\'email');
      return;
    }

    try {
      const payload = { eventId: event?.id || null, eventTitle: event?.title || null, name, email, phone };
      try {
        await fetch(`${SERVER_URL}/event-registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        await addDoc(collection(db, 'eventRegistrations'), { ...payload, createdAt: new Date().toISOString() });
      }

      Alert.alert('Succès', 'Inscription enregistrée.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Échec');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Inscription{event ? ` : ${event.title}` : ''}</Text>
        <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleRegister} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.85}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#3B82F6', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '700' },
});
