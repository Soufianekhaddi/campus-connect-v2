# 👤 Profile Page Documentation

## 📋 Overview

The Profile page displays user information, account statistics, and app settings. It provides access to user preferences and account management features.

## 🎯 Purpose

- Display personalized user information
- Show user activity statistics
- Provide access to app settings and preferences
- Allow account management (logout)
- Show app version and support options

## 🔧 Key Functions

### 1. User Context Integration

```javascript
const { user, logout } = useContext(AuthContext);
```

**What it does**: Gets user data and logout function from authentication context  
**Why**: Centralizes user management and allows logout functionality

### 2. Username Extraction

```javascript
const getUserName = () => {
  if (user && user.email) {
    const name = user.email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return "User";
};
```

**What it does**: Extracts and capitalizes username from email  
**Example**: "john.doe@example.com" → "John"  
**Why**: Creates friendly display name without requiring additional user data

### 3. Avatar Initials Generator

```javascript
const getUserInitials = () => {
  const name = getUserName();
  return name.substring(0, 2).toUpperCase();
};
```

**What it does**: Creates two-letter initials for avatar  
**Example**: "John" → "JO"  
**Why**: Provides visual avatar when no profile picture is available

### 4. Logout Handler

```javascript
const handleLogout = () => {
  logout();
};
```

**What it does**: Calls logout function from AuthContext  
**Result**: Clears user data and returns to login screen

## 🏗️ Page Structure

### 1. Header

```javascript
<View style={styles.header}>
  <Text style={styles.headerTitle}>Profil</Text>
</View>
```

Simple centered page title

### 2. Profile Information Section

```javascript
<View style={styles.profileSection}>
  <View style={styles.avatarContainer}>
    <Text style={styles.avatarText}>{getUserInitials()}</Text>
  </View>
  <Text style={styles.userName}>{getUserName()}</Text>
  <Text style={styles.userEmail}>{user?.email || "user@email.com"}</Text>
  <Text style={styles.userRole}>Étudiant</Text>
</View>
```

**Components**:

- **Circular avatar** with user initials
- **User name** extracted from email
- **Full email address** for reference
- **Role badge** indicating user type

### 3. Statistics Dashboard

```javascript
<View style={styles.statsSection}>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>12</Text>
    <Text style={styles.statLabel}>Événements suivis</Text>
  </View>
  <View style={styles.statDivider} />
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>5</Text>
    <Text style={styles.statLabel}>Candidatures</Text>
  </View>
  <View style={styles.statDivider} />
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>3</Text>
    <Text style={styles.statLabel}>Favoris</Text>
  </View>
</View>
```

**Statistics shown**:

- **Événements suivis**: Events user is registered for
- **Candidatures**: Job applications submitted
- **Favoris**: Saved events/jobs

**Note**: Currently shows static numbers, would be dynamic in real app

### 4. Menu Options

```javascript
<View style={styles.menuSection}>
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuIcon}>👤</Text>
    <Text style={styles.menuText}>Modifier le profil</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuIcon}>🔔</Text>
    <Text style={styles.menuText}>Notifications</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
  // ... more menu items
</View>
```

**Menu items include**:

- **Modifier le profil**: Edit personal information
- **Notifications**: Notification preferences
- **Mes favoris**: View saved items
- **Mes candidatures**: Application history
- **Paramètres**: App settings
- **Aide et support**: Help and support

### 5. Logout Section

```javascript
<View style={styles.logoutSection}>
  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
    <Text style={styles.logoutText}>Se déconnecter</Text>
  </TouchableOpacity>
</View>
```

**What it does**: Red button that logs user out of the app  
**Why separate**: Visually distinct from other options to prevent accidental logout

### 6. App Version

```javascript
<View style={styles.versionSection}>
  <Text style={styles.versionText}>Campus Connect v1.0.0</Text>
</View>
```

Shows app version for support purposes

## 🎨 Styling Features

### Avatar Design

```javascript
avatarContainer: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#3B82F6',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 16,
}
```

- **Perfect circle** (width = height, radius = half)
- **Blue background** matching app theme
- **Large size** for prominence
- **Centered initials** in white text

### Statistics Layout

```javascript
statsSection: {
  flexDirection: 'row',
  backgroundColor: 'white',
  marginHorizontal: 20,
  marginBottom: 20,
  borderRadius: 16,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
}
```

- **Horizontal layout** with equal spacing
- **White card** with shadow
- **Dividers** between statistics
- **Clean, professional** appearance

### Menu Item Design

```javascript
menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#F3F4F6',
}
```

- **Horizontal layout**: Icon, text, arrow
- **Consistent padding** for touch targets
- **Bottom border** to separate items
- **Touch feedback** on press

### Role Badge

```javascript
userRole: {
  fontSize: 14,
  color: '#0F8A5F',
  backgroundColor: '#D1FAE5',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
  fontWeight: '500',
}
```

- **Green color scheme** for student role
- **Pill shape** with rounded corners
- **Clear typography** for readability

## 💡 React Native Concepts Used

1. **useContext Hook**: Access authentication data
2. **TouchableOpacity**: Clickable menu items and buttons
3. **ScrollView**: Scrollable page content
4. **StyleSheet**: Organized styling
5. **String Methods**: split(), charAt(), substring(), toUpperCase()
6. **Conditional Rendering**: Optional chaining (user?.email)
7. **Component Composition**: Reusable card layouts

## 🔄 Data Flow

1. **Context**: Get user data from AuthContext
2. **Processing**: Extract name and initials from email
3. **Display**: Show user info and statistics
4. **Interaction**: Handle menu taps and logout
5. **Navigation**: (Future) Navigate to settings pages

## 🔍 Common Beginner Questions

**Q: Why use initials instead of profile pictures?**  
A: Simpler to implement and doesn't require image upload/storage system

**Q: What's the difference between userName and user initials?**  
A: userName is the full extracted name, initials are just the first 2 letters

**Q: Why separate the logout button from menu items?**  
A: Visual separation prevents accidental logout, follows UX best practices

**Q: How does the menu navigation work?**  
A: Currently menu items are styled but not functional - would need navigation setup

## 🎓 Learning Tips

1. **Experiment with avatar styles** - try different colors, sizes
2. **Add real statistics** - connect to actual user data
3. **Practice with string manipulation** - try different name extraction methods
4. **Add navigation** - make menu items functional
5. **Implement profile editing** - create forms for user data

## 🚀 Potential Enhancements

1. **Profile picture upload** - replace initials with photos
2. **Real statistics** - connect to user activity data
3. **Settings pages** - create actual settings screens
4. **Profile editing** - allow users to update information
5. **Theme switching** - dark/light mode toggle
6. **Language selection** - multi-language support
7. **Notification preferences** - customize alert settings
8. **Account deletion** - full account management

## 🔐 Security Considerations

1. **Secure logout** - clear all user data and tokens
2. **Input validation** - validate any user-entered data
3. **Privacy settings** - control what information is visible
4. **Data encryption** - protect sensitive user information

The Profile page serves as the user's personal dashboard and gateway to account management features!
