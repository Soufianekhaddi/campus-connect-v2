import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';

// URL de l'API MockAPI
const EVENTS_API = 'https://69623fc9d9d64c761907562a.mockapi.io/evenements';

export default function Events({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect pour charger les données au démarrage
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fonction pour récupérer les événements depuis l'API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(EVENTS_API);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'Career Day': return require('../assets/Career_Day.png');
      case 'Workshop': return require('../assets/Workshop.png');
      case 'Conference': return require('../assets/Conference.png');
      case 'Networking': return require('../assets/networking.png');
      case 'Hackathon': return require('../assets/hackathon.png');
      default: return require('../assets/events.png');
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'Career Day': return '#FEF3C7';
      case 'Workshop': return '#D1FAE5';
      case 'Conference': return '#E0E7FF';
      case 'Networking': return '#F3E8FF';
      case 'Hackathon': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString || '9:00 AM - 5:00 PM';
  };

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'Career Day', label: 'Career Day' },
    { id: 'Workshop', label: 'Ateliers' },
    { id: 'Conference', label: 'Conférences' },
    { id: 'Networking', label: 'Networking' }
  ];

  const filteredEvents = events
    .filter(event => selectedFilter === 'all' || event.type === selectedFilter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter.id && styles.activeFilterButtonText
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={[styles.eventIconContainer, { backgroundColor: getEventColor(item.type) }]}>
        <Image source={getEventIcon(item.type)} style={styles.eventIcon} />
      </View>
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.eventTypeBadge, { backgroundColor: getEventColor(item.type) }]}>
            <Text style={styles.eventTypeText}>{item.type}</Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Text style={styles.eventDetailIcon}>📅</Text>
            <Text style={styles.eventDetailText}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.eventDetailItem}>
            <Text style={styles.eventDetailIcon}>⏰</Text>
            <Text style={styles.eventDetailText}>{formatTime(item.time)}</Text>
          </View>
          
          <View style={styles.eventDetailItem}>
            <Text style={styles.eventDetailIcon}>📍</Text>
            <Text style={styles.eventDetailText}>{item.location}</Text>
          </View>
        </View>
        
        {item.requiredSkills && item.requiredSkills.length > 0 && (
          <View style={styles.skillsContainer}>
            {item.requiredSkills.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}
        
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('EventRegistration', { event: item })}>
          <Text style={styles.registerButtonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Écran de chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F8A5F" />
          <Text style={styles.loadingText}>Chargement des événements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Événements</Text>
        <Text style={styles.headerSubtitle}>
          {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} disponible{filteredEvents.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map(renderFilterButton)}
      </ScrollView>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Filters
  filtersContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#0F8A5F',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  
  // Events List
  eventsList: {
    padding: 20,
  },
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
  },
  
  // Event Card Content
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // Event Details
  eventDetails: {
    marginBottom: 12,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  
  // Skills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  
  // Register Button
  registerButton: {
    backgroundColor: '#0F8A5F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Loading & Error states
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0F8A5F',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
