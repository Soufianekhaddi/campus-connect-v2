import React, { useState, useMemo, useEffect } from 'react';
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
const INTERNSHIPS_API = 'https://69623fc9d9d64c761907562a.mockapi.io/stages';

export default function Internships({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect pour charger les données au démarrage
  useEffect(() => {
    fetchInternships();
  }, []);

  // Fonction pour récupérer les stages depuis l'API
  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(INTERNSHIPS_API);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des stages');
      }
      
      const data = await response.json();
      setInternships(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'remote', label: 'Remote' },
    { id: 'casablanca', label: 'Casablanca' },
    { id: 'rabat', label: 'Rabat' },
    { id: 'paid', label: 'Rémunéré' }
  ];

  // Filtrer les stages (mémorisé)
  const filteredInternships = useMemo(() => {
    if (selectedFilter === 'all') return internships;
    
    switch (selectedFilter) {
      case 'remote':
        return internships.filter(i => i.location?.toLowerCase().includes('remote'));
      case 'casablanca':
        return internships.filter(i => i.location?.toLowerCase().includes('casablanca'));
      case 'rabat':
        return internships.filter(i => i.location?.toLowerCase().includes('rabat'));
      case 'paid':
        return internships.filter(i => i.salary?.toLowerCase().includes('rémunéré'));
      default:
        return internships;
    }
  }, [selectedFilter, internships]);

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

  const getCompanyInitials = (company) => {
    return company
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderInternshipCard = ({ item }) => (
    <TouchableOpacity style={styles.internshipCard}>
      <View style={styles.cardHeader}>
        <View style={styles.companyIconContainer}>
          <Text style={styles.companyIcon}>{getCompanyInitials(item.company)}</Text>
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.internshipTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
        
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.internshipDescription} numberOfLines={3}>
        {item.description}
      </Text>
      
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
      
      {item.requiredSkills && (
        <View style={styles.skillsContainer}>
          {item.requiredSkills.slice(0, 4).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {item.requiredSkills.length > 4 && (
            <View style={[styles.skillTag, styles.moreSkillsTag]}>
              <Text style={styles.skillText}>+{item.requiredSkills.length - 4}</Text>
            </View>
          )}
        </View>
      )}
      
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

  // Écran de chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement des stages...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchInternships}>
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
        <Text style={styles.headerTitle}>Stages</Text>
        <Text style={styles.headerSubtitle}>
          {filteredInternships.length} offre{filteredInternships.length > 1 ? 's' : ''} disponible{filteredInternships.length > 1 ? 's' : ''}
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

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{internships.length}</Text>
          <Text style={styles.statLabel}>Total Offres</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {internships.filter(job => job.salary?.includes('rémunéré')).length}
          </Text>
          <Text style={styles.statLabel}>Rémunérées</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {internships.filter(job => job.location?.includes('Remote')).length}
          </Text>
          <Text style={styles.statLabel}>Remote</Text>
        </View>
      </View>

      {/* Internships List */}
      <FlatList
        data={filteredInternships}
        renderItem={renderInternshipCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.internshipsList}
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
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  
  // Stats
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
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  
  // Internships List
  internshipsList: {
    padding: 20,
    paddingTop: 4,
  },
  internshipCard: {
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
  
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  headerInfo: {
    flex: 1,
  },
  internshipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  
  // Content
  internshipDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // Details
  internshipDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  detailText: {
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
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  moreSkillsTag: {
    backgroundColor: '#F3F4F6',
  },
  skillText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
  
  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  applyButtonText: {
    fontSize: 14,
    color: 'white',
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
    backgroundColor: '#3B82F6',
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
