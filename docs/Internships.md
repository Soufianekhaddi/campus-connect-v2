# 💼 Internships Page Documentation

## 📋 Overview

The Internships page displays all available internship opportunities in a scrollable list with filtering and statistics. Students can browse internships by location, type, and view detailed job information.

## 🎯 Purpose

- Show comprehensive list of internship opportunities
- Allow filtering by location and payment status
- Display company information and job requirements
- Provide quick statistics about available positions
- Enable application and favoriting

## 🔧 Key Functions

### 1. Data Import and Setup

```javascript
import { mockInternship } from "../mockData/mockInternship";
```

**What it does**: Imports internship data from mock file  
**In real app**: Would fetch from job board API or database

### 2. State Management

```javascript
const [selectedFilter, setSelectedFilter] = useState("all");
```

**What it does**: Tracks which location/type filter is currently active  
**Why**: Controls which internships are displayed to user

### 3. Advanced Filtering System

```javascript
const filterInternships = (internships) => {
  let filtered = internships;

  if (selectedFilter !== "all") {
    switch (selectedFilter) {
      case "remote":
        filtered = filtered.filter((internship) =>
          internship.location.toLowerCase().includes("remote")
        );
        break;
      case "casablanca":
        filtered = filtered.filter((internship) =>
          internship.location.toLowerCase().includes("casablanca")
        );
        break;
      case "paid":
        filtered = filtered.filter((internship) =>
          internship.salary.toLowerCase().includes("rémunéré")
        );
        break;
    }
  }
  return filtered;
};
```

**What it does**: Filters internships based on location or payment status  
**Why**: Helps students find opportunities that match their preferences

### 4. Company Initials Generator

```javascript
const getCompanyInitials = (company) => {
  return company
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
};
```

**What it does**: "Startup Tech Maroc" → "ST"  
**Why**: Creates consistent company logos when no image is available

## 🏗️ Page Structure

### 1. Header with Dynamic Count

```javascript
<View style={styles.header}>
  <Text style={styles.headerTitle}>Stages</Text>
  <Text style={styles.headerSubtitle}>
    {filteredInternships.length} offre
    {filteredInternships.length > 1 ? "s" : ""} disponible
    {filteredInternships.length > 1 ? "s" : ""}
  </Text>
</View>
```

- Page title
- Dynamic count that updates with filtering
- Proper French pluralization

### 2. Filter System

```javascript
const filters = [
  { id: "all", label: "Tous" },
  { id: "remote", label: "Remote" },
  { id: "casablanca", label: "Casablanca" },
  { id: "rabat", label: "Rabat" },
  { id: "paid", label: "Rémunéré" },
];
```

**Categories**:

- **All**: Show everything
- **Remote**: Work from home opportunities
- **Cities**: Location-specific filtering
- **Paid**: Only paid internships

### 3. Quick Statistics Dashboard

```javascript
<View style={styles.statsContainer}>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{mockInternship.length}</Text>
    <Text style={styles.statLabel}>Total Offres</Text>
  </View>

  <View style={styles.statItem}>
    <Text style={styles.statNumber}>
      {mockInternship.filter((job) => job.salary.includes("rémunéré")).length}
    </Text>
    <Text style={styles.statLabel}>Rémunérées</Text>
  </View>

  <View style={styles.statItem}>
    <Text style={styles.statNumber}>
      {mockInternship.filter((job) => job.location.includes("Remote")).length}
    </Text>
    <Text style={styles.statLabel}>Remote</Text>
  </View>
</View>
```

**What it does**: Shows quick overview of all opportunities  
**Why**: Helps students understand the job market at a glance

### 4. Internship List

```javascript
<FlatList
  data={filteredInternships}
  renderItem={renderInternshipCard}
  keyExtractor={(item) => item.id}
  showsVerticalScrollIndicator={false}
/>
```

## 🎨 Internship Card Components

### Complete Card Structure

```javascript
const renderInternshipCard = ({ item }) => (
  <TouchableOpacity style={styles.internshipCard}>
    {/* Header Section */}
    <View style={styles.cardHeader}>
      <View style={styles.companyIconContainer}>
        <Text style={styles.companyIcon}>
          {getCompanyInitials(item.company)}
        </Text>
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.internshipTitle}>{item.title}</Text>
        <Text style={styles.companyName}>{item.company}</Text>
      </View>

      <TouchableOpacity style={styles.favoriteButton}>
        <Text style={styles.favoriteIcon}>♡</Text>
      </TouchableOpacity>
    </View>

    {/* Description */}
    <Text style={styles.internshipDescription} numberOfLines={3}>
      {item.description}
    </Text>

    {/* Job Details */}
    <View style={styles.internshipDetails}>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>📍</Text>
        <Text style={styles.detailText}>{item.location}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>💰</Text>
        <Text style={styles.detailText}>{item.salary}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailIcon}>📋</Text>
        <Text style={styles.detailText}>{item.type}</Text>
      </View>
    </View>

    {/* Skills Section */}
    <View style={styles.skillsContainer}>
      {item.requiredSkills.slice(0, 4).map((skill, index) => (
        <View key={index} style={styles.skillTag}>
          <Text style={styles.skillText}>{skill}</Text>
        </View>
      ))}
      {item.requiredSkills.length > 4 && (
        <View style={[styles.skillTag, styles.moreSkillsTag]}>
          <Text style={styles.skillText}>
            +{item.requiredSkills.length - 4}
          </Text>
        </View>
      )}
    </View>

    {/* Footer with Actions */}
    <View style={styles.cardFooter}>
      <Text style={styles.postedDate}>{item.postedDate}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Voir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Postuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);
```

### Card Components Explained

#### 1. Company Header

```javascript
<View style={styles.companyIconContainer}>
  <Text style={styles.companyIcon}>{getCompanyInitials(item.company)}</Text>
</View>
```

- **Company initials** as circular logo
- **Job title** and **company name**
- **Heart icon** for favorites (future feature)

#### 2. Job Description

```javascript
<Text style={styles.internshipDescription} numberOfLines={3}>
  {item.description}
</Text>
```

**What it does**: Shows job description with 3-line limit  
**Why**: Prevents cards from becoming too tall while showing key info

#### 3. Job Details Grid

```javascript
<View style={styles.internshipDetails}>
  <Text>📍 {item.location}</Text>
  <Text>💰 {item.salary}</Text>
  <Text>📋 {item.type}</Text>
</View>
```

- **Location**: Where the job is based
- **Salary**: Payment information
- **Type**: Internship vs full-time

#### 4. Skills with Overflow Handling

```javascript
{
  item.requiredSkills.slice(0, 4).map((skill, index) => (
    <View key={index} style={styles.skillTag}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  ));
}
{
  item.requiredSkills.length > 4 && (
    <View style={styles.moreSkillsTag}>
      <Text>+{item.requiredSkills.length - 4}</Text>
    </View>
  );
}
```

**What it does**: Shows first 4 skills, then "+2" if there are more  
**Why**: Keeps cards uniform while indicating there are more skills

#### 5. Action Footer

```javascript
<View style={styles.cardFooter}>
  <Text style={styles.postedDate}>{item.postedDate}</Text>
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.viewButton}>
      <Text>Voir</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.applyButton}>
      <Text>Postuler</Text>
    </TouchableOpacity>
  </View>
</View>
```

- **Posted date**: When job was published
- **View button**: See full details
- **Apply button**: Submit application

## 🔄 Data Flow

1. **Import**: Get internships from `mockInternship.js`
2. **Filter**: Apply location/type filters
3. **Statistics**: Calculate counts for dashboard
4. **Render**: Display filtered internships in cards
5. **Update**: Re-render when filters change

## 🎨 Styling Features

### Statistics Dashboard

```javascript
statsContainer: {
  flexDirection: 'row',
  backgroundColor: 'white',
  marginHorizontal: 20,
  marginTop: 16,
  marginBottom: 16,
  borderRadius: 12,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
}
```

- **Horizontal layout** with equal spacing
- **Dividers** between statistics
- **Clean white card** design

### Company Icon Design

```javascript
companyIconContainer: {
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: '#DBEAFE',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
}
```

- **Rounded square** shape
- **Blue background** for tech feel
- **Consistent sizing** across all cards

### Skills Tags

```javascript
skillTag: {
  backgroundColor: '#E0F2FE',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  marginRight: 6,
  marginBottom: 4,
}
```

- **Light blue background** for tech skills
- **Pill shape** with rounded corners
- **Proper spacing** for readability

## 💡 React Native Concepts Used

1. **useState Hook**: Track filter selection
2. **FlatList**: Efficient scrolling list
3. **TouchableOpacity**: Clickable cards and buttons
4. **Array Methods**: filter(), map(), slice(), includes()
5. **String Methods**: split(), charAt(), toUpperCase()
6. **Conditional Rendering**: Show "+X" only when needed
7. **Dynamic Styling**: Different colors for different button types

## 🔍 Common Beginner Questions

**Q: Why create company initials instead of using images?**  
A: In real apps, not all companies have logos. Initials provide consistent branding

**Q: How does the skills overflow system work?**  
A: We show first 4 skills, then check if there are more and display "+X" count

**Q: Why limit description to 3 lines?**  
A: Prevents cards from becoming different heights, maintains clean grid layout

**Q: What's the difference between View and Apply buttons?**  
A: View would show full job details, Apply would start application process

## 🎓 Learning Tips

1. **Practice with filter logic** - try adding new filter categories
2. **Experiment with card layouts** - rearrange information
3. **Play with the skills system** - change how many skills are shown
4. **Add debug logging** - see how data flows through filters
5. **Modify the statistics** - add new calculations

## 🚀 Potential Enhancements

1. **Search functionality** - filter by company name or job title
2. **Sorting options** - by date, salary, company name
3. **Favorites system** - save interesting positions
4. **Application tracking** - see which jobs you've applied to
5. **Salary filtering** - filter by salary ranges
6. **Company profiles** - detailed company information pages
