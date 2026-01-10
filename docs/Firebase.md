# 🔥 Intégration Firebase - Campus Connect

## 📋 Vue d'ensemble

Ce document explique comment Firebase Authentication a été intégré dans l'application Campus Connect pour gérer l'inscription, la connexion et la déconnexion des utilisateurs.

---

## 🏗️ Architecture

```
campus-connect/
├── config/
│   └── firebase.js          # Configuration Firebase
├── Contexts/
│   └── AuthContext.js       # Gestion de l'état d'authentification
├── Screens/
│   ├── Login.js             # Page de connexion
│   └── Signup.js            # Page d'inscription
└── App.js                   # Point d'entrée avec AuthProvider
```

---

## 📦 Dépendances installées

```bash
npx expo install firebase
npx expo install @react-native-async-storage/async-storage
```

| Package                                     | Version | Description                          |
| ------------------------------------------- | ------- | ------------------------------------ |
| `firebase`                                  | ^11.x   | SDK Firebase pour JavaScript         |
| `@react-native-async-storage/async-storage` | ^2.x    | Persistance locale pour React Native |

---

## ⚙️ Configuration Firebase

### Fichier : `config/firebase.js`

```javascript
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-ViLHOVdirr_zxrUJ-i9dc-P16sEjfhc",
  authDomain: "campus-connect-bdfda.firebaseapp.com",
  projectId: "campus-connect-bdfda",
  storageBucket: "campus-connect-bdfda.firebasestorage.app",
  messagingSenderId: "289600934752",
  appId: "1:289600934752:web:ba8427ade576774eeb8405",
  measurementId: "G-MBPX2SFHKW",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default app;
```

---

## 🔧 Explication des fonctions Firebase utilisées

### 1. Configuration et Initialisation

#### `initializeApp(firebaseConfig)`

```javascript
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
```

| Aspect           | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| **But**          | Initialiser l'application Firebase avec les credentials du projet  |
| **Paramètre**    | `firebaseConfig` - Objet contenant les clés API du projet Firebase |
| **Retour**       | Instance de l'application Firebase                                 |
| **Utilisé dans** | `config/firebase.js`                                               |

---

#### `initializeAuth(app, options)`

```javascript
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

| Aspect                         | Description                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| **But**                        | Initialiser le service d'authentification avec des options personnalisées                |
| **Paramètres**                 | `app` - Instance Firebase, `options` - Configuration (persistance)                       |
| **Retour**                     | Instance Auth configurée                                                                 |
| **Pourquoi pas `getAuth()` ?** | `initializeAuth` permet de configurer la persistance avec AsyncStorage pour React Native |
| **Utilisé dans**               | `config/firebase.js`                                                                     |

---

#### `getReactNativePersistence(storage)`

```javascript
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

persistence: getReactNativePersistence(AsyncStorage);
```

| Aspect                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| **But**               | Configurer où Firebase stocke les données de session       |
| **Paramètre**         | `AsyncStorage` - Système de stockage local React Native    |
| **Effet**             | L'utilisateur reste connecté même après fermeture de l'app |
| **Sans cette config** | L'utilisateur serait déconnecté à chaque redémarrage       |
| **Utilisé dans**      | `config/firebase.js`                                       |

---

#### `getFirestore(app)`

```javascript
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
```

| Aspect           | Description                                        |
| ---------------- | -------------------------------------------------- |
| **But**          | Obtenir l'instance de la base de données Firestore |
| **Paramètre**    | `app` - Instance Firebase                          |
| **Retour**       | Instance Firestore pour les opérations CRUD        |
| **Utilisé dans** | `config/firebase.js`                               |

---

### 2. Authentification - Fonctions principales

#### `createUserWithEmailAndPassword(auth, email, password)`

```javascript
import { createUserWithEmailAndPassword } from "firebase/auth";

const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);
const user = userCredential.user;
```

| Aspect                | Description                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| **But**               | Créer un nouveau compte utilisateur                                                   |
| **Paramètres**        | `auth` - Instance Auth, `email` - Email, `password` - Mot de passe (min 6 caractères) |
| **Retour**            | `UserCredential` contenant l'objet `user` avec `uid`, `email`, etc.                   |
| **Erreurs possibles** | `auth/email-already-in-use`, `auth/weak-password`, `auth/invalid-email`               |
| **Utilisé dans**      | `AuthContext.js` → fonction `register()`                                              |

**Exemple complet :**

```javascript
const register = async (email, password, name) => {
  try {
    // 1. Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // firebaseUser contient :
    // - uid: "abc123xyz" (identifiant unique)
    // - email: "user@example.com"
    // - emailVerified: false
    // - metadata: { creationTime, lastSignInTime }

    return { success: true, user: firebaseUser };
  } catch (error) {
    // error.code = "auth/email-already-in-use"
    // error.message = "Firebase: Error (auth/email-already-in-use)."
    return { success: false, error: error.code };
  }
};
```

---

#### `signInWithEmailAndPassword(auth, email, password)`

```javascript
import { signInWithEmailAndPassword } from "firebase/auth";

await signInWithEmailAndPassword(auth, email, password);
```

| Aspect                | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| **But**               | Connecter un utilisateur existant                                       |
| **Paramètres**        | `auth` - Instance Auth, `email`, `password`                             |
| **Retour**            | `UserCredential` avec les infos de l'utilisateur                        |
| **Erreurs possibles** | `auth/user-not-found`, `auth/wrong-password`, `auth/invalid-credential` |
| **Effet secondaire**  | Déclenche `onAuthStateChanged` avec le nouvel utilisateur               |
| **Utilisé dans**      | `AuthContext.js` → fonction `login()`                                   |

**Exemple complet :**

```javascript
const login = async (email, password) => {
  try {
    // Tenter la connexion
    await signInWithEmailAndPassword(auth, email, password);
    // Si succès, onAuthStateChanged sera déclenché automatiquement
    return { success: true };
  } catch (error) {
    return { success: false, error: getFirebaseErrorMessage(error.code) };
  }
};
```

---

#### `signOut(auth)`

```javascript
import { signOut } from "firebase/auth";

await signOut(auth);
```

| Aspect           | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| **But**          | Déconnecter l'utilisateur actuel                                |
| **Paramètre**    | `auth` - Instance Auth                                          |
| **Retour**       | `Promise<void>`                                                 |
| **Effet**        | Supprime la session, déclenche `onAuthStateChanged` avec `null` |
| **Utilisé dans** | `AuthContext.js` → fonction `logout()`                          |

**Exemple complet :**

```javascript
const logout = async () => {
  try {
    await signOut(auth);
    // onAuthStateChanged sera déclenché avec user = null
    // L'app redirigera automatiquement vers Login
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

#### `onAuthStateChanged(auth, callback)`

```javascript
import { onAuthStateChanged } from "firebase/auth";

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // Utilisateur connecté
      console.log("Connecté:", user.email);
    } else {
      // Utilisateur déconnecté
      console.log("Déconnecté");
    }
  });

  return () => unsubscribe(); // Cleanup
}, []);
```

| Aspect              | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| **But**             | Écouter les changements d'état de connexion en temps réel                 |
| **Paramètres**      | `auth` - Instance Auth, `callback` - Fonction appelée à chaque changement |
| **Retour**          | Fonction `unsubscribe` pour arrêter l'écoute                              |
| **Quand déclenché** | Au démarrage, après login, après logout, après register                   |
| **Utilisé dans**    | `AuthContext.js` → `useEffect`                                            |

**Flux de déclenchement :**

```
App démarre
    │
    ▼
onAuthStateChanged vérifie la session
    │
    ├─► Session existe → callback(user) → Affiche MainApp
    │
    └─► Pas de session → callback(null) → Affiche Login
```

---

### 3. Firestore - Opérations base de données

#### `doc(db, collection, documentId)`

```javascript
import { doc } from "firebase/firestore";

const userRef = doc(db, "users", "abc123xyz");
// Crée une référence au document : /users/abc123xyz
```

| Aspect           | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **But**          | Créer une référence vers un document spécifique                                               |
| **Paramètres**   | `db` - Instance Firestore, `collection` - Nom de la collection, `documentId` - ID du document |
| **Retour**       | `DocumentReference` - Pointeur vers le document                                               |
| **Note**         | Ne fait pas de requête réseau, juste une référence                                            |
| **Utilisé dans** | `AuthContext.js` → `register()`                                                               |

---

#### `setDoc(documentRef, data)`

```javascript
import { setDoc, doc } from "firebase/firestore";

await setDoc(doc(db, "users", firebaseUser.uid), {
  name: "Yassine",
  email: "yassine@email.com",
  createdAt: new Date().toISOString(),
});
```

| Aspect           | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| **But**          | Créer ou écraser un document avec les données fournies                 |
| **Paramètres**   | `documentRef` - Référence au document, `data` - Objet avec les données |
| **Retour**       | `Promise<void>`                                                        |
| **Comportement** | Si le document existe → écrase tout. Si n'existe pas → crée            |
| **Utilisé dans** | `AuthContext.js` → `register()` pour sauvegarder le profil             |

**Structure créée dans Firestore :**

```
📁 users (collection)
  └── 📄 abc123xyz (document = user.uid)
        ├── name: "Yassine"
        ├── email: "yassine@email.com"
        └── createdAt: "2026-01-10T12:00:00.000Z"
```

---

#### `getDoc(documentRef)`

```javascript
import { getDoc, doc } from "firebase/firestore";

const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

if (userDoc.exists()) {
  const userData = userDoc.data();
  console.log(userData.name); // "Yassine"
}
```

| Aspect           | Description                                             |
| ---------------- | ------------------------------------------------------- |
| **But**          | Récupérer un document depuis Firestore                  |
| **Paramètre**    | `documentRef` - Référence au document                   |
| **Retour**       | `DocumentSnapshot` avec méthodes `exists()` et `data()` |
| **Utilisé dans** | `AuthContext.js` → récupération du profil après login   |

**Méthodes du DocumentSnapshot :**

```javascript
const snapshot = await getDoc(docRef);

snapshot.exists(); // true si le document existe
snapshot.data(); // Retourne l'objet avec les données
snapshot.id; // ID du document
```

---

## 🔐 AuthContext - Code complet expliqué

```javascript
// Contexts/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

// ═══════════════════════════════════════════════════════════
// TRADUCTION DES ERREURS FIREBASE
// ═══════════════════════════════════════════════════════════
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Cet email est déjà utilisé par un autre compte";
    case "auth/invalid-email":
      return "Format d'email invalide";
    case "auth/weak-password":
      return "Le mot de passe doit contenir au moins 6 caractères";
    case "auth/user-not-found":
      return "Aucun compte associé à cet email";
    case "auth/wrong-password":
      return "Mot de passe incorrect";
    case "auth/invalid-credential":
      return "Email ou mot de passe incorrect";
    case "auth/too-many-requests":
      return "Trop de tentatives, réessayez plus tard";
    case "auth/network-request-failed":
      return "Erreur de connexion réseau";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Données utilisateur
  const [loading, setLoading] = useState(true); // État de chargement

  // ═══════════════════════════════════════════════════════════
  // LISTENER D'AUTHENTIFICATION
  // Écoute les changements de connexion en temps réel
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ✅ Utilisateur connecté
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.email.split("@")[0], // Nom temporaire
        });
        setLoading(false);
      } else {
        // ❌ Utilisateur déconnecté
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup: arrêter l'écoute quand le composant est démonté
    return () => unsubscribe();
  }, []);

  // ═══════════════════════════════════════════════════════════
  // INSCRIPTION
  // 1. Crée un compte Firebase Auth
  // 2. Sauvegarde le profil dans Firestore
  // ═══════════════════════════════════════════════════════════
  const register = async (email, password, name) => {
    try {
      // Étape 1: Créer le compte
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Étape 2: Sauvegarder le profil dans Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error.code),
      };
    }
  };

  // ═══════════════════════════════════════════════════════════
  // CONNEXION
  // Authentifie l'utilisateur avec email/password
  // ═══════════════════════════════════════════════════════════
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged sera déclenché automatiquement
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error.code),
      };
    }
  };

  // ═══════════════════════════════════════════════════════════
  // DÉCONNEXION
  // Termine la session utilisateur
  // ═══════════════════════════════════════════════════════════
  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged sera déclenché avec user = null
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getFirebaseErrorMessage(error.code),
      };
    }
  };

  // ═══════════════════════════════════════════════════════════
  // PROVIDER
  // Expose user, loading et les fonctions à toute l'app
  // ═══════════════════════════════════════════════════════════
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📱 Utilisation dans les écrans

### Login.js - Connexion

```javascript
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

export default function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error); // Message traduit en français
    }
    // Si succès, onAuthStateChanged redirige automatiquement

    setLoading(false);
  };

  return (
    // ... JSX du formulaire
  );
}
```

### Signup.js - Inscription

```javascript
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

export default function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useContext(AuthContext);

  const handleSignup = async () => {
    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(email, password, name);

    if (!result.success) {
      setError(result.error);
    }
    // Si succès, l'utilisateur est connecté automatiquement

    setLoading(false);
  };

  return (
    // ... JSX du formulaire
  );
}
```

### Profile.js - Déconnexion

```javascript
import React, { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    // onAuthStateChanged redirige vers Login automatiquement
  };

  return (
    <View>
      <Text>Bonjour, {user?.name}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🔄 Flux complet d'authentification

### Inscription (Register)

```
┌─────────────────────────────────────────────────────────────┐
│  Utilisateur remplit le formulaire Signup                   │
│  (nom, email, mot de passe)                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  createUserWithEmailAndPassword(auth, email, password)      │
│  → Firebase Auth crée le compte                             │
│  → Retourne UserCredential avec uid                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  setDoc(doc(db, 'users', uid), { name, email, createdAt }) │
│  → Firestore sauvegarde le profil                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  onAuthStateChanged détecte le nouvel utilisateur           │
│  → setUser({ uid, email, name })                            │
│  → App affiche MainApp                                      │
└─────────────────────────────────────────────────────────────┘
```

### Connexion (Login)

```
┌─────────────────────────────────────────────────────────────┐
│  Utilisateur entre email + mot de passe                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  signInWithEmailAndPassword(auth, email, password)          │
│  → Firebase vérifie les credentials                         │
│  → Si OK: crée une session                                  │
│  → Si KO: throw error avec code                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  onAuthStateChanged(user)                                   │
│  → setUser({ uid, email, name })                            │
│  → setLoading(false)                                        │
│  → App affiche MainApp                                      │
└─────────────────────────────────────────────────────────────┘
```

### Déconnexion (Logout)

```
┌─────────────────────────────────────────────────────────────┐
│  Utilisateur clique "Se déconnecter"                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  signOut(auth)                                              │
│  → Firebase supprime la session                             │
│  → AsyncStorage nettoie les données locales                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  onAuthStateChanged(null)                                   │
│  → setUser(null)                                            │
│  → App affiche Login                                        │
└─────────────────────────────────────────────────────────────┘
```

### Persistance (App Restart)

```
┌─────────────────────────────────────────────────────────────┐
│  App démarre                                                │
│  → loading = true                                           │
│  → Affiche écran de chargement                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  onAuthStateChanged vérifie AsyncStorage                    │
│  → Session trouvée? → callback(user)                        │
│  → Pas de session? → callback(null)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  user existe    │     │  user = null    │
│  → MainApp      │     │  → Login        │
└─────────────────┘     └─────────────────┘
```

---

## 🌍 Gestion des erreurs (en français)

Les erreurs Firebase sont automatiquement traduites :

| Code Firebase                 | Message affiché                                     |
| ----------------------------- | --------------------------------------------------- |
| `auth/email-already-in-use`   | Cet email est déjà utilisé par un autre compte      |
| `auth/invalid-email`          | Format d'email invalide                             |
| `auth/weak-password`          | Le mot de passe doit contenir au moins 6 caractères |
| `auth/user-not-found`         | Aucun compte associé à cet email                    |
| `auth/wrong-password`         | Mot de passe incorrect                              |
| `auth/invalid-credential`     | Email ou mot de passe incorrect                     |
| `auth/too-many-requests`      | Trop de tentatives, réessayez plus tard             |
| `auth/network-request-failed` | Erreur de connexion réseau                          |

---

## 🗄️ Structure Firestore

Lors de l'inscription, un document utilisateur est créé :

```
Collection: users
└── Document: {userId}
    ├── name: "Nom de l'utilisateur"
    ├── email: "email@example.com"
    └── createdAt: "2026-01-10T12:00:00.000Z"
```

---

## 🧪 Tester l'intégration

### 1. Vérifier Firebase Console

- Aller sur [Firebase Console](https://console.firebase.google.com/)
- Projet : **campus-connect-bdfda**
- **Authentication** → **Users** : voir les utilisateurs créés

### 2. Tester l'inscription

1. Lancer l'app : `npx expo start`
2. Cliquer sur "Créer un compte"
3. Remplir le formulaire
4. Vérifier dans Firebase Console

### 3. Tester la connexion

1. Utiliser les identifiants créés
2. Vérifier la redirection vers l'app

### 4. Tester la persistance

1. Se connecter
2. Fermer l'app complètement
3. Rouvrir → Doit rester connecté

---

## ⚠️ Sécurité

### Règles Firestore recommandées

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs: lecture/écriture uniquement pour le propriétaire
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### À faire en production :

- [ ] Stocker les credentials dans des variables d'environnement
- [ ] Configurer les règles Firestore
- [ ] Activer App Check pour sécuriser les requêtes
- [ ] Limiter les domaines autorisés dans Firebase Console

---

## 📚 Ressources

- [Documentation Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase + React Native](https://firebase.google.com/docs/auth/web/start)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Expo + Firebase](https://docs.expo.dev/guides/using-firebase/)

---

## ✅ Checklist de l'intégration

- [x] Firebase SDK installé
- [x] AsyncStorage installé (persistance)
- [x] Configuration Firebase créée
- [x] AuthContext avec Firebase Auth
- [x] Page Login connectée
- [x] Page Signup connectée
- [x] Gestion des erreurs en français
- [x] Loader pendant l'authentification
- [x] Persistance de session
- [x] Stockage profil dans Firestore
