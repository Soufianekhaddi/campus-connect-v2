// File: /screens/Login.js
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';

export default function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez entrer votre email et mot de passe');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Campus Connect</Text>
          <Text style={styles.tagline}>Lancez votre carrière professionnelle</Text>
        </View>
      </View>
      
      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Bon retour !</Text>
        <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
        
        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setEmail('')}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {password && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setPassword('')}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>
        
        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Nouveau sur Campus Connect ? </Text>
          <TouchableOpacity onPress={onSwitchToSignup}>
            <Text style={styles.signupLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F8A5F',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  
  // Simple Input Styles
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    paddingRight: 50, // Space for clear button
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Rest of the styles remain the same
  loginButton: {
    backgroundColor: '#0F8A5F',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    shadowColor: '#0F8A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0F8A5F',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  googleButtonText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signupLink: {
    color: '#0F8A5F',
    fontWeight: '600',
    fontSize: 14,
  },
});