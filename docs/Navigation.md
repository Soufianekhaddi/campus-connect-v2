# 🧭 Navigation System Documentation

## 📋 Overview

Campus Connect uses a custom tab-based navigation system instead of React Navigation. This system allows seamless switching between the four main pages of the app.

## 🎯 Purpose

- Provide easy access to all main app sections
- Maintain app state when switching between tabs
- Create a native mobile app feel
- Handle navigation between related pages

## 🏗️ Navigation Structure

### Main Navigation File: `MainApp.js`

```javascript
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Home from "./Home";
import Events from "./Events";
import Jobs from "./Internships";
import Profile from "./Profile";
```

The navigation system imports all main screens and manages which one is displayed.

## 🔧 Key Components

### 1. State Management

```javascript
const [activeTab, setActiveTab] = useState("Home");
```

**What it does**: Tracks which tab is currently active  
**Why**: Determines which screen to display and which tab to highlight

### 2. Navigation Object

```javascript
const navigation = {
  navigate: (screenName, params) => {
    if (screenName === "Events") {
      setActiveTab("Events");
    } else if (screenName === "Internships" || screenName === "Jobs") {
      setActiveTab("Jobs");
    } else if (screenName === "Profile") {
      setActiveTab("Profile");
    } else if (screenName === "Home") {
      setActiveTab("Home");
    }
  },
};
```

**What it does**: Creates a navigation object that mimics React Navigation  
**Why**: Allows other screens to call `navigation.navigate()` like in standard React Navigation

### 3. Screen Rendering Logic

```javascript
const renderContent = () => {
  switch (activeTab) {
    case "Home":
      return <Home navigation={navigation} />;
    case "Events":
      return <Events navigation={navigation} />;
    case "Jobs":
      return <Jobs navigation={navigation} />;
    case "Profile":
      return <Profile navigation={navigation} />;
    default:
      return <Home navigation={navigation} />;
  }
};
```

**What it does**: Renders the appropriate screen based on `activeTab`  
**Important**: Each screen receives the `navigation` prop

### 4. Bottom Tab Bar

```javascript
<View style={styles.tabContainer}>
  <TouchableOpacity
    style={[styles.tab, activeTab === "Home" && styles.activeTab]}
    onPress={() => setActiveTab("Home")}
    >
    <Text
      style={[styles.tabText, activeTab === "Home" && styles.activeTabText]}
    >
      🏠 Accueil
    </Text>
  </TouchableOpacity>

  {/* ... other tabs */}
</View>
```

**What it does**: Creates bottom navigation bar with visual feedback  
**Features**:

- **Visual feedback**: Active tab has different styling
- **Direct navigation**: Tapping immediately switches tabs
- **Emoji icons**: Simple visual indicators

## 🎨 Visual Design

### Tab Bar Layout

```javascript
tabContainer: {
  flexDirection: 'row',
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
  paddingVertical: 10,
  paddingHorizontal: 5,
}
```

- **Fixed position**: Always visible at bottom
- **Horizontal layout**: Tabs spread across width
- **Border**: Subtle top border for separation

### Individual Tabs

```javascript
tab: {
  flex: 1,
  alignItems: 'center',
  paddingVertical: 8,
  borderRadius: 8,
  marginHorizontal: 2,
}
activeTab: {
  backgroundColor: '#3B82F6',
}
```

- **Equal width**: `flex: 1` distributes space evenly
- **Rounded corners**: Modern appearance
- **Active state**: Blue background when selected

### Text Styling

```javascript
tabText: {
  fontSize: 12,
  color: '#6B7280',
  fontWeight: '500',
}
activeTabText: {
  color: '#FFFFFF',
}
```

- **Small font**: Fits in tab space
- **Color changes**: Gray → White when active
- **Emoji + text**: Visual and textual indicators

## 🔄 Navigation Flow

### 1. Direct Tab Navigation

User taps bottom tab → `setActiveTab()` → Screen renders

### 2. Programmatic Navigation

Screen calls `navigation.navigate('Events')` → Navigation object updates `activeTab` → Events screen renders

### 3. Navigation with Parameters

```javascript
navigation.navigate("Events", { eventId: item.id });
```

**Current limitation**: Parameters are accepted but not used  
**Future enhancement**: Could be used to highlight specific items

## 💡 How Other Screens Use Navigation

### From Home Page

```javascript
// Navigate to Events page
<TouchableOpacity onPress={() => navigation.navigate('Events')}>
  <Text>Voir tout</Text>
</TouchableOpacity>

// Navigate to Internships page
<TouchableOpacity onPress={() => navigation.navigate('Internships')}>
  <Text>Voir tout</Text>
</TouchableOpacity>
```

### Screen Name Mapping

| Screen Call     | Actual Tab |
| --------------- | ---------- |
| `'Events'`      | Events     |
| `'Internships'` | Jobs       |
| `'Jobs'`        | Jobs       |
| `'Profile'`     | Profile    |
| `'Home'`        | Home       |

**Why multiple names**: Allows flexibility in calling navigation from different contexts

## 🔧 Technical Implementation

### App Structure

```
App.js
└── AppContent (handles login state)
    └── MainApp.js (navigation container)
        ├── Home.js
        ├── Events.js
        ├── Internships.js
        └── Profile.js
```

### Props Flow

```
MainApp.js
├── Creates navigation object
├── Passes to each screen as prop
└── Screens can call navigation.navigate()
```

## 🆚 Comparison with React Navigation

### Custom Navigation (Current)

**Pros**:

- Simple to understand
- No external dependencies
- Full control over behavior
- Lightweight

**Cons**:

- Limited features
- No deep linking
- No stack navigation
- Manual parameter handling

### React Navigation (Industry Standard)

**Pros**:

- Rich feature set
- Deep linking support
- Stack, tab, drawer navigation
- Automatic parameter handling
- Animation transitions

**Cons**:

- Learning curve
- Additional dependency
- More complex setup

## 🔍 Common Beginner Questions

**Q: Why not use React Navigation?**  
A: This custom solution is simpler for learning and doesn't require additional dependencies

**Q: How do you add a new tab?**  
A: Add new case to `renderContent()` and new TouchableOpacity to tab bar

**Q: Can you navigate to a sub-screen?**  
A: Currently no - would need stack navigation or modal system

**Q: How do you pass data between screens?**  
A: Through React Context (like AuthContext) or by lifting state up

## 🎓 Learning Tips

1. **Study the navigation object** - understand how it mimics React Navigation
2. **Experiment with new tabs** - try adding a fifth tab
3. **Practice parameter passing** - modify the system to handle parameters
4. **Add navigation animations** - experiment with transitions
5. **Compare with React Navigation** - understand the differences

## 🚀 Potential Enhancements

1. **Stack Navigation**: Navigate to detail screens
2. **Back Button Support**: Handle Android back button
3. **Deep Linking**: Navigate to specific screens from URLs
4. **Navigation Animation**: Smooth transitions between screens
5. **Navigation History**: Track user navigation patterns
6. **Modal Support**: Overlay screens for forms/details
7. **Tab Badges**: Show notification counts on tabs
8. **Dynamic Tabs**: Show/hide tabs based on user role

## ⚡ Performance Considerations

### Current Approach

- **All screens render**: Every screen mounts when app starts
- **State preservation**: Switching tabs maintains screen state
- **Memory usage**: All screens stay in memory

### Optimization Options

1. **Lazy loading**: Only render screens when needed
2. **State persistence**: Save/restore screen state
3. **Component unmounting**: Remove unused screens from memory

The custom navigation system provides a solid foundation while keeping the codebase simple and understandable for learning purposes!
