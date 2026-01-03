# 🏠 Home Page Documentation

## 📋 Overview

The Home page is the main dashboard that students see when they open the app. It shows a personalized overview of campus events and internships.

## 🎯 Purpose

- Welcome students with personalized greeting
- Show quick statistics about available opportunities
- Display mixed dashboard of recent events and internships
- Provide easy navigation to other sections

## 🔧 Key Functions

### 1. User Authentication

```javascript
const { user } = useContext(AuthContext);
```

**What it does**: Gets the logged-in user's information  
**Why we need it**: To personalize the greeting and show user-specific data

### 2. Getting User Name

```javascript
const getUserName = () => {
  if (user && user.email) {
    const name = user.email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return "User";
};
```

**What it does**: Extracts username from email (john.doe@email.com → John)  
**Why**: Creates a personalized greeting without storing additional user data

### 3. Event Icon Management

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

**What it does**: Returns the correct PNG icon based on event type  
**Why**: Makes each event type visually distinct and professional looking

### 4. Event Color Coding

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

**What it does**: Assigns background colors to different event types  
**Why**: Visual categorization helps users quickly identify event types

### 5. Dashboard Data Preparation

```javascript
const prepareDashboardData = () => {
  const eventsForDashboard = mockEvents.slice(0, 2).map((event) => ({
    ...event,
    dashboardType: "event",
    icon: getEventIcon(event.type),
    iconBg: getEventColor(event.type),
  }));

  const internshipsForDashboard = mockInternship
    .slice(0, 2)
    .map((internship) => ({
      ...internship,
      dashboardType: "internship",
      icon: require("../assets/job.png"),
      iconBg: "#DBEAFE",
    }));

  return [...eventsForDashboard, ...internshipsForDashboard].sort(
    () => Math.random() - 0.5
  ); // Shuffle randomly
};
```

**What it does**: Takes 2 events + 2 internships and mixes them randomly  
**Why**: Shows variety of opportunities on the main dashboard

### 6. Date Formatting

```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
```

**What it does**: Converts "2024-01-15" → "15 janv. 2024"  
**Why**: Makes dates more readable for French users

### 7. Upcoming Events Filter

```javascript
const upcomingEvents = mockEvents
  .filter((event) => new Date(event.date) > new Date()) // Only future events
  .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
  .slice(0, 3) // Take first 3
  .map((event) => ({
    ...event,
    icon: getEventIcon(event.type),
    iconBg: getEventColor(event.type),
    formattedDate: formatDate(event.date),
  }));
```

**What it does**: Shows only the next 3 future events  
**Why**: Keeps interface clean and shows most relevant events

## 🏗️ Page Structure

### 1. Header Section

```javascript
<Text style={styles.welcome}>Bonjour {getUserName()}</Text>
<Text style={styles.subtitle}>Découvrez les opportunités du jour</Text>
```

- Personalized greeting with user's name
- Encouraging subtitle

### 2. Quick Statistics

```javascript
<TouchableOpacity onPress={() => navigation.navigate("Events")}>
  <Text style={styles.statNumber}>{mockEvents.length}</Text>
  <Text style={styles.statLabel}>Événements</Text>
</TouchableOpacity>
```

- Shows total counts (events, internships, upcoming)
- **Clickable** - tapping navigates to full pages
- Updates automatically when data changes

### 3. Mixed Dashboard (Opportunités du moment)

```javascript
<FlatList
  data={mixedDashboardItems}
  renderItem={renderDashboardItem}
  numColumns={2}
  scrollEnabled={false}
/>
```

- Shows 4 random cards (2 events + 2 internships)
- Grid layout (2 columns)
- Each card shows different info based on type:
  - **Events**: Date, time, location, event type badge
  - **Internships**: Company, location, salary, type badge

### 4. Upcoming Events Section

```javascript
<FlatList
  data={upcomingEvents}
  renderItem={renderUpcomingItem}
  scrollEnabled={false}
/>
```

- Lists next 3 future events
- Shows event details and required skills
- "Voir tout" link → navigates to Events page

### 5. Recent Internships Section

```javascript
{
  mockInternship
    .slice(0, 2)
    .map((internship) => (
      <TouchableOpacity key={internship.id}>
        // Internship card content
      </TouchableOpacity>
    ));
}
```

- Shows latest 2 internships
- Displays company, location, skills, post date
- Cards are clickable → navigate to Internships page

## 🔄 Data Flow

1. **Data Source**: Import from `mockEvents.js` and `mockInternship.js`
2. **Processing**: Functions filter, sort, format, and enhance the data
3. **Rendering**: React components display the processed data
4. **User Interaction**: Touch events trigger navigation

## 🎨 Visual Elements

### Card Layout

- **Shadow effects** for depth
- **Rounded corners** for modern look
- **Color coding** by category
- **Professional icons** instead of emojis

### Typography

- **Bold headings** for emphasis
- **Color hierarchy** (dark for important, gray for secondary)
- **Consistent sizing** throughout

## 🚀 Navigation

```javascript
navigation.navigate("Events"); // → Events page
navigation.navigate("Internships"); // → Internships page
```

Navigation is handled by the custom tab system in `MainApp.js`

## 💡 React Native Concepts Used

1. **useContext Hook**: Access user data from AuthContext
2. **FlatList Component**: Efficient list rendering
3. **TouchableOpacity**: Clickable components
4. **StyleSheet**: Organized styling
5. **Data Transformation**: Array methods (map, filter, slice, sort)
6. **Conditional Rendering**: Different content based on data type
7. **Props Passing**: Navigation and data between components

## 🔍 Common Beginner Questions

**Q: Why use FlatList instead of map()?**  
A: FlatList is optimized for mobile - it only renders visible items, improving performance

**Q: What's the difference between TouchableOpacity and Button?**  
A: TouchableOpacity is more customizable and can wrap any content, Button is more basic

**Q: Why split functions like getUserName()?**  
A: Keeps code organized, reusable, and easier to test

**Q: How does the random shuffle work?**  
A: `Math.random() - 0.5` gives random positive/negative numbers, causing random sorting

## 🎓 Learning Tips

1. **Start with the data flow** - understand where data comes from
2. **Break down components** - each section is a separate piece
3. **Practice with styling** - modify colors and spacing to see changes
4. **Add console.log()** - debug by logging data at different steps
5. **Experiment** - try changing the number of items displayed
