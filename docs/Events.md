# 📅 Events Page Documentation

## 📋 Overview

The Events page displays all campus events in a scrollable list with filtering capabilities. Students can browse events by category and view detailed information about each event.

## 🎯 Purpose

- Show comprehensive list of all campus events
- Allow filtering by event category (Career Day, Workshops, etc.)
- Provide detailed event information (date, time, location, skills)
- Enable event registration

## 🔧 Key Functions

### 1. Data Import and Setup

```javascript
import { mockEvents } from "../mockData/mockEvents";
```

**What it does**: Imports event data from mock file  
**In real app**: Would fetch from API/database

### 2. State Management

```javascript
const [selectedFilter, setSelectedFilter] = useState("all");
```

**What it does**: Tracks which category filter is currently active  
**Why**: Controls which events are displayed to user

### 3. Category Filtering

```javascript
const filteredEvents = mockEvents
  .filter((event) => selectedFilter === "all" || event.type === selectedFilter)
  .sort((a, b) => new Date(a.date) - new Date(b.date));
```

**What it does**: Shows only events matching selected category, sorted by date  
**Why**: Helps users find specific types of events quickly

### 4. Event Icon System

```javascript
const getEventIcon = (type) => {
  switch (type) {
    case "Career Day":
      return require("../assets/Career_Day.png");
    case "Workshop":
      return require("../assets/Workshop.png");
    // ...more cases
  }
};
```

**What it does**: Returns PNG image for each event type  
**Why**: Professional visual identification of event categories

### 5. Event Color System

```javascript
const getEventColor = (type) => {
  switch (type) {
    case "Career Day":
      return "#FEF3C7"; // Yellow
    case "Workshop":
      return "#D1FAE5"; // Green
    // ...more colors
  }
};
```

**What it does**: Returns background color for event type  
**Why**: Consistent visual branding and quick recognition

### 6. Date Formatting

```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
```

**What it does**: Converts "2024-01-15" → "15 janvier 2024"  
**Why**: More readable format for French users

## 🏗️ Page Structure

### 1. Header

```javascript
<View style={styles.header}>
  <Text style={styles.headerTitle}>Événements</Text>
  <Text style={styles.headerSubtitle}>
    {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""}{" "}
    disponible{filteredEvents.length > 1 ? "s" : ""}
  </Text>
</View>
```

- Page title
- Dynamic count of available events
- Updates when filter changes

### 2. Filter Tabs

```javascript
const filters = [
  { id: "all", label: "Tous" },
  { id: "Career Day", label: "Career Day" },
  { id: "Workshop", label: "Ateliers" },
  { id: "Conference", label: "Conférences" },
  { id: "Networking", label: "Networking" },
];

<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {filters.map(renderFilterButton)}
</ScrollView>;
```

**What it does**: Creates horizontal scrolling filter buttons  
**Visual feedback**: Active tab has different styling  
**Functionality**: Updates `selectedFilter` state when tapped

### 3. Event List

```javascript
<FlatList
  data={filteredEvents}
  renderItem={renderEventCard}
  keyExtractor={(item) => item.id}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.eventsList}
/>
```

**What it does**: Displays filtered events as scrollable cards  
**Performance**: Only renders visible items for smooth scrolling

## 🎨 Event Card Components

### Event Card Structure

```javascript
const renderEventCard = ({ item }) => (
  <TouchableOpacity style={styles.eventCard}>
    <View style={styles.eventIconContainer}>
      <Image source={getEventIcon(item.type)} style={styles.eventIcon} />
    </View>

    <View style={styles.eventContent}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventTypeBadge}>
          <Text style={styles.eventTypeText}>{item.type}</Text>
        </View>
      </View>

      <Text style={styles.eventDescription}>{item.description}</Text>

      <View style={styles.eventDetails}>
        <Text>📅 {formatDate(item.date)}</Text>
        <Text>⏰ {formatTime(item.time)}</Text>
        <Text>📍 {item.location}</Text>
      </View>

      <View style={styles.skillsContainer}>
        {item.requiredSkills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);
```

### Card Components Explained

#### 1. Icon Container

- Colored background based on event type
- Professional PNG icon
- Consistent size and positioning

#### 2. Event Header

- **Title**: Event name
- **Type Badge**: Colored category label

#### 3. Event Details

```javascript
<View style={styles.eventDetails}>
  <Text>📅 {formatDate(item.date)}</Text>
  <Text>⏰ {formatTime(item.time)}</Text>
  <Text>📍 {item.location}</Text>
</View>
```

- Date, time, and location with emoji icons
- Formatted for easy reading

#### 4. Skills Section

```javascript
<View style={styles.skillsContainer}>
  {item.requiredSkills.slice(0, 3).map((skill, index) => (
    <View key={index} style={styles.skillTag}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  ))}
</View>
```

**What it does**: Shows up to 3 skills as colored tags  
**Why**: Helps students see what they'll learn/need  
**Limitation**: Only shows first 3 to keep cards clean

#### 5. Registration Button

```javascript
<TouchableOpacity style={styles.registerButton}>
  <Text style={styles.registerButtonText}>S'inscrire</Text>
</TouchableOpacity>
```

**What it does**: Action button for event registration  
**Future enhancement**: Would connect to registration system

## 🔄 Data Flow

1. **Import**: Get events from `mockEvents.js`
2. **Filter**: Apply category filter based on `selectedFilter` state
3. **Sort**: Order events by date (earliest first)
4. **Render**: Display filtered events in FlatList
5. **Update**: Re-render when filter changes

## 🎨 Styling Features

### Card Design

```javascript
eventCard: {
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
}
```

- White background with shadow
- Rounded corners for modern look
- Proper spacing between cards

### Filter Buttons

```javascript
filterButton: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#F3F4F6',
  marginRight: 8,
},
activeFilterButton: {
  backgroundColor: '#0F8A5F',
}
```

- Pill-shaped buttons
- Different color when active
- Smooth horizontal scrolling

## 💡 React Native Concepts Used

1. **useState Hook**: Track filter selection
2. **FlatList**: Efficient list rendering
3. **ScrollView**: Horizontal filter scrolling
4. **TouchableOpacity**: Clickable elements
5. **Image Component**: Display PNG icons
6. **Array Methods**: filter(), sort(), map(), slice()
7. **Conditional Rendering**: Different styles for active/inactive states

## 🔍 Common Beginner Questions

**Q: Why use FlatList instead of ScrollView with map()?**  
A: FlatList is optimized for long lists - it recycles views and only renders visible items

**Q: How does the filter system work?**  
A: It compares `event.type` with `selectedFilter` and only shows matching events

**Q: Why limit skills to 3?**  
A: Keeps cards uniform size and prevents text overflow on smaller screens

**Q: What's the difference between horizontal ScrollView and FlatList?**  
A: ScrollView loads all items, FlatList only loads visible ones (better for long lists)

## 🎓 Learning Tips

1. **Experiment with filters** - try adding new categories
2. **Modify the card layout** - change what information is displayed
3. **Play with styling** - adjust colors, spacing, and shadows
4. **Add console.log()** - see how data flows through filters
5. **Try different sorting** - alphabetical, by popularity, etc.

## 🚀 Potential Enhancements

1. **Search functionality** - filter by event title or description
2. **Date range filtering** - show events for specific time periods
3. **Favorites system** - let users save favorite events
4. **Calendar integration** - add events to device calendar
5. **Registration tracking** - show which events user is registered for
