import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { SERVER_URL } from '../config/server';

// Create the context
export const AuthContext = createContext();

// Fonction pour traduire les erreurs Firebase
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé par un autre compte';
    case 'auth/invalid-email':
      return "Format d'email invalide";
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères';
    case 'auth/user-not-found':
      return 'Aucun compte associé à cet email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/invalid-credential':
      return 'Email ou mot de passe incorrect';
    case 'auth/too-many-requests':
      return 'Trop de tentatives, réessayez plus tard';
    case 'auth/network-request-failed':
      return 'Erreur de connexion réseau';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // D'abord, définir l'utilisateur avec les infos de base (rapide)
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.email.split('@')[0],
        });
        setLoading(false);
        
        // Ensuite, récupérer les données Firestore en arrière-plan (async)
        /*try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData?.name || firebaseUser.email.split('@')[0],
              ...userData
            });
          }
        } catch (error) {
          console.log('Erreur Firestore (non bloquant):', error.message);
        }*/
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Inscription
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Sauvegarder les infos supplémentaires dans Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      // Tentative non-bloquante : demander au serveur d'envoyer un email de confirmation
      (async () => {
        try {
          await fetch(`${SERVER_URL}/send-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: firebaseUser.uid, email, name }),
          });
        } catch (err) {
          // ignore failures — server may not be configured locally
          console.log('Email confirmation request failed (non-blocking):', err.message || err);
        }
      })();

      // Envoyer un email de confirmation via le serveur SMTP (si configuré)
      try {
        const serverUrl = global?.SERVER_URL || 'http://localhost:4000';
        await fetch(`${serverUrl}/send-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: firebaseUser.uid, email, name })
        });
      } catch (e) {
        console.log('Envoi email confirmation échoué (non bloquant):', e.message);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getFirebaseErrorMessage(error.code) 
      };
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getFirebaseErrorMessage(error.code) 
      };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getFirebaseErrorMessage(error.code) 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};