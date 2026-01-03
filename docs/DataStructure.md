# 📊 Data Structure Documentation

## 📋 Overview

Campus Connect uses mock data files to simulate real data that would typically come from APIs or databases. This documentation explains the structure and purpose of each data file.

## 🗂️ Data Files Location

```
mockData/
├── mockEvents.js      # Campus events data
└── mockInternship.js  # Internship opportunities data
```

## 📅 Events Data Structure (`mockEvents.js`)

### Complete Event Object

```javascript
{
  id: '1',
  title: 'EMSI Tech Career Day 2024',
  description: 'Rencontrez des entreprises partenaires à la recherche de stagiaires et jeunes diplômés EMSI.',
  date: '2024-10-24',
  time: '10:00 AM - 4:00 PM',
  location: 'Campus EMSI Central',
  requiredSkills: ['Développement', 'Réseaux', 'Ingénierie'],
  type: 'Career Day'
}
```

### Field Explanations

#### Basic Information

- **`id`**: Unique identifier for the event (string)
- **`title`**: Event name displayed to users
- **`description`**: Detailed explanation of what the event offers
- **`type`**: Category for filtering and styling

#### Date & Time

- **`date`**: ISO format date string (YYYY-MM-DD)
- **`time`**: Human-readable time range
- **`location`**: Where the event takes place

#### Skills & Requirements

- **`requiredSkills`**: Array of relevant skills/topics
  - Used for filtering and recommendations
  - Displayed as colored tags in UI
  - Helps students identify relevant events

### Event Types

| Type         | Description                | Icon | Color              |
| ------------ | -------------------------- | ---- | ------------------ |
| `Career Day` | Job fairs and recruitment  | 🏢   | Yellow (`#FEF3C7`) |
| `Workshop`   | Hands-on learning sessions | 🎨   | Green (`#D1FAE5`)  |
| `Conference` | Presentations and talks    | 🎤   | Blue (`#E0E7FF`)   |
| `Networking` | Professional networking    | 🤝   | Purple (`#F3E8FF`) |
| `Hackathon`  | Coding competitions        | 💻   | Red (`#FEE2E2`)    |

### How Events Data is Used

#### In Home Page

```javascript
// Get upcoming events
const upcomingEvents = mockEvents
  .filter((event) => new Date(event.date) > new Date())
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 3);

// Mix with internships for dashboard
const eventsForDashboard = mockEvents.slice(0, 2);
```

#### In Events Page

```javascript
// Filter by category
const filteredEvents = mockEvents.filter(
  (event) => selectedFilter === "all" || event.type === selectedFilter
);

// Display in cards
const renderEventCard = ({ item }) => (
  <View>
    <Text>{item.title}</Text>
    <Text>{formatDate(item.date)}</Text>
    {/* Show skills as tags */}
    {item.requiredSkills.map((skill) => (
      <Tag>{skill}</Tag>
    ))}
  </View>
);
```

## 💼 Internships Data Structure (`mockInternship.js`)

### Complete Internship Object

```javascript
{
  id: '1',
  title: 'Stagiaire Développeur Frontend',
  company: 'Startup Tech Maroc',
  location: 'Casablanca',
  salary: 'Stage rémunéré',
  type: 'Internship',
  description: 'Développement d\'interfaces web modernes avec React et JavaScript.',
  requiredSkills: ['React', 'JavaScript', 'HTML/CSS'],
  postedDate: 'Il y a 2 jours'
}
```

### Field Explanations

#### Job Details

- **`id`**: Unique identifier for the internship
- **`title`**: Job position name
- **`company`**: Company offering the internship
- **`location`**: Job location (city or "Remote")
- **`type`**: Usually "Internship" but could be "Full-time", etc.

#### Compensation & Requirements

- **`salary`**: Payment information (often "Stage rémunéré" or "Non rémunéré")
- **`description`**: Detailed job responsibilities and requirements
- **`requiredSkills`**: Array of technical skills needed
- **`postedDate`**: When the job was posted (human-readable)

### Location Categories

- **Casablanca**: Major business hub
- **Rabat**: Capital city opportunities
- **Remote**: Work from home positions
- **Other cities**: Fès, Marrakech, etc.

### Salary Types

- **"Stage rémunéré"**: Paid internship
- **"Non rémunéré"**: Unpaid internship
- **"À négocier"**: Salary to be negotiated

### How Internships Data is Used

#### In Home Page

```javascript
// Show recent internships
const recentInternships = mockInternship.slice(0, 2);

// Mix with events for dashboard
const internshipsForDashboard = mockInternship
  .slice(0, 2)
  .map((internship) => ({
    ...internship,
    dashboardType: "internship",
    icon: require("../assets/job.png"),
    iconBg: "#DBEAFE",
  }));
```

#### In Internships Page

```javascript
// Filter by location
const filteredInternships = mockInternship.filter((internship) => {
  if (selectedFilter === "casablanca") {
    return internship.location.toLowerCase().includes("casablanca");
  }
  if (selectedFilter === "remote") {
    return internship.location.toLowerCase().includes("remote");
  }
  if (selectedFilter === "paid") {
    return internship.salary.includes("rémunéré");
  }
  return true;
});

// Generate company initials for logo
const getCompanyInitials = (company) => {
  return company
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
```

## 🔄 Data Processing Patterns

### Date Handling

```javascript
// Convert string to Date object for filtering
const futureEvents = mockEvents.filter(
  (event) => new Date(event.date) > new Date()
);

// Format for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
```

### Skills Processing

```javascript
// Limit skills display
const limitedSkills = item.requiredSkills.slice(0, 3);

// Show overflow count
const hasMoreSkills = item.requiredSkills.length > 3;
const additionalCount = item.requiredSkills.length - 3;
```

### Search and Filtering

```javascript
// Text search (when implemented)
const searchResults = mockEvents.filter(
  (event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
);

// Category filtering
const categoryResults = mockEvents.filter(
  (event) => event.type === selectedCategory
);
```

## 📊 Statistics and Calculations

### Event Statistics

```javascript
// Total events
const totalEvents = mockEvents.length;

// Upcoming events count
const upcomingCount = mockEvents.filter(
  (event) => new Date(event.date) > new Date()
).length;

// Events by type
const eventsByType = mockEvents.reduce((acc, event) => {
  acc[event.type] = (acc[event.type] || 0) + 1;
  return acc;
}, {});
```

### Internship Statistics

```javascript
// Total internships
const totalInternships = mockInternship.length;

// Paid internships count
const paidInternships = mockInternship.filter((job) =>
  job.salary.includes("rémunéré")
).length;

// Remote opportunities count
const remoteJobs = mockInternship.filter((job) =>
  job.location.includes("Remote")
).length;

// Jobs by location
const jobsByLocation = mockInternship.reduce((acc, job) => {
  acc[job.location] = (acc[job.location] || 0) + 1;
  return acc;
}, {});
```

## 🔍 Common Data Operations

### Array Methods Used

- **`.filter()`**: Remove items that don't match criteria
- **`.map()`**: Transform data structure
- **`.slice()`**: Get subset of items
- **`.sort()`**: Order items by criteria
- **`.reduce()`**: Calculate statistics
- **`.includes()`**: Check if string contains substring

### Date Operations

- **`new Date()`**: Convert string to Date object
- **`new Date() > new Date()`**: Compare dates
- **`.toLocaleDateString()`**: Format date for display

### String Operations

- **`.toLowerCase()`**: Case-insensitive comparison
- **`.split()`**: Break string into array
- **`.charAt()`**: Get character at position
- **`.includes()`**: Check if substring exists

## 🎓 Learning Tips

1. **Explore the data structure** - understand what each field represents
2. **Practice filtering** - try different filter combinations
3. **Experiment with sorting** - sort by different criteria
4. **Add new fields** - extend the data structure with new properties
5. **Create test data** - add your own events and internships

## 🚀 Potential Enhancements

### Events Data

1. **Registration status**: Track if user is registered
2. **Capacity limits**: Maximum attendees
3. **Prerequisites**: Required knowledge level
4. **Event images**: URLs to event photos
5. **Organizer info**: Contact details
6. **Registration deadline**: Last date to sign up
7. **Event tags**: More granular categorization

### Internships Data

1. **Application deadline**: When applications close
2. **Company logo**: URL to company image
3. **Application requirements**: Documents needed
4. **Job level**: Junior, Mid, Senior
5. **Work schedule**: Full-time, Part-time, Flexible
6. **Benefits**: What the company offers
7. **Application URL**: Direct link to apply

### Advanced Features

1. **Relationships**: Link events to companies offering internships
2. **User preferences**: Match opportunities to user skills
3. **Application tracking**: Status of user applications
4. **Favorites system**: Save interesting opportunities
5. **Recommendations**: Suggest based on user activity

The mock data structure provides a solid foundation that closely mirrors what you'd find in real-world applications!
