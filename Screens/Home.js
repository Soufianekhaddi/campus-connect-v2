import { useContext, useState, useEffect, useMemo } from 'react';
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
import { AuthContext } from '../Contexts/AuthContext';

// URLs de l'API MockAPI
const EVENTS_API = 'https://69623fc9d9d64c761907562a.mockapi.io/evenements';
const INTERNSHIPS_API = 'https://69623fc9d9d64c761907562a.mockapi.io/stages';

export default function Home({ navigation }) {
  const { user } = useContext(AuthContext);
  
  // États pour les données de l'API
  const [events, setEvents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect pour charger les données au démarrage
  useEffect(() => {
    fetchData();
  }, []);

  // Fonction pour récupérer les données depuis l'API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsResponse, internshipsResponse] = await Promise.all([
        fetch(EVENTS_API),
        fetch(INTERNSHIPS_API)
      ]);

      if (!eventsResponse.ok || !internshipsResponse.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const eventsData = await eventsResponse.json();
      const internshipsData = await internshipsResponse.json();

      setEvents(eventsData);
      setInternships(internshipsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour obtenir l'icône /colors de l'événement
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
      case 'Career Day': return '#FEF3C7'; // Jaune
      case 'Workshop': return '#D1FAE5'; // Vert
      case 'Conference': return '#E0E7FF'; // Bleu
      case 'Networking': return '#F3E8FF'; // Violet
      case 'Hackathon': return '#FEE2E2'; // Rouge
      default: return '#F3F4F6'; // Gris
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Données du dashboard mixte (mémorisées)
  const mixedDashboardItems = useMemo(() => {
    const eventsForDashboard = events.slice(0, 2).map(event => ({
      ...event,
      dashboardType: 'event',
      icon: getEventIcon(event.type),
      iconBg: getEventColor(event.type),
    }));
    
    const internshipsForDashboard = internships.slice(0, 2).map(internship => ({
      ...internship,
      dashboardType: 'internship',
      icon: require('../assets/job.png'),
      iconBg: '#DBEAFE',
    }));
    
    // Mélanger les événements et stages
    return [...eventsForDashboard, ...internshipsForDashboard]
      .sort(() => Math.random() - 0.5);
  }, [events, internships]);
  
  // Événements à venir (les 3 prochains)
  const upcomingEvents = useMemo(() => events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
    .map(event => ({
      ...event,
      icon: getEventIcon(event.type),
      iconBg: getEventColor(event.type),
      formattedDate: formatDate(event.date),
    })), [events]);

  const getUserName = () => {
    if (user && user.email) {
      const name = user.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'User';
  };

  const renderDashboardItem = ({ item }) => {
    const isEvent = item.dashboardType === 'event';
    
    return (
      <TouchableOpacity
        style={styles.card}
       
      >
        <View style={[styles.cardIcon, { backgroundColor: item.iconBg }]}>
          <Image source={item.icon} style={styles.cardIconImage} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.cardCompany} numberOfLines={1}>
            {isEvent ? item.location : item.company}
          </Text>
          
          {isEvent ? (
            <>
              <View style={styles.cardDetails}>
                <Text style={styles.cardDate}>📅 {formatDate(item.date)}</Text>
                <Text style={styles.cardTime}>⏰ {item.time}</Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.type}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.cardDetails}>
                <Text style={styles.cardLocation}>📍 {item.location}</Text>
                <Text style={styles.cardSalary}>💰 {item.salary}</Text>
              </View>
              <View style={[styles.typeBadge, styles.internshipBadge]}>
                <Text style={styles.typeBadgeText}>{item.type}</Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderUpcomingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.upcomingItem}
    >
      <View style={[styles.upcomingIcon, { backgroundColor: item.iconBg }]}>
        <Image source={item.icon} style={styles.upcomingIconImage} />
      </View>
      <View style={styles.upcomingContent}>
        <Text style={styles.upcomingTitle}>{item.title}</Text>
        <View style={styles.upcomingDetails}>
          <Text style={styles.upcomingLocation}>{item.location}</Text>
          <Text style={styles.upcomingDate}>📅 {item.formattedDate}</Text>
        </View>
        <View style={styles.skillsContainer}>
          {item.requiredSkills?.slice(0, 2).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Écran de chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F8A5F" />
          <Text style={styles.loadingText}>Chargement...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcome}>Bonjour {getUserName()}</Text>
              <Text style={styles.subtitle}>Découvrez les opportunités du jour</Text>
            </View>
          </View>
        </View>

        {/* Statistiques rapides */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statItem}
          >
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Événements</Text>
          </TouchableOpacity>
          
          <View style={styles.statDivider} />
          
          <TouchableOpacity 
            style={styles.statItem}
          >
            <Text style={styles.statNumber}>{internships.length}</Text>
            <Text style={styles.statLabel}>Stages</Text>
          </TouchableOpacity>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>À venir</Text>
          </View>
        </View>

        {/* Tableau de bord mixte */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Opportunités du moment</Text>
          </View>
          
          <FlatList
            data={mixedDashboardItems}
            renderItem={renderDashboardItem}
            keyExtractor={item => `${item.dashboardType}-${item.id}`}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.dashboardRow}
            contentContainerStyle={styles.dashboardList}
          />
        </View>

        {/* Section Événements à venir */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Événements à venir</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={upcomingEvents}
            renderItem={renderUpcomingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.upcomingList}
          />
        </View>

        {/* Stages récents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stages récents</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Internship')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {internships.slice(0, 2).map((internship) => (
            <TouchableOpacity
              key={internship.id}
              style={styles.internshipItem}
            >
              <View style={styles.internshipIcon}>
                <Image 
                  source={require('../assets/job.png')} 
                  style={styles.internshipIconImage}
                />
              </View>
              <View style={styles.internshipContent}>
                <Text style={styles.internshipTitle}>{internship.title}</Text>
                <View style={styles.internshipDetails}>
                  <Text style={styles.internshipCompany}>{internship.company}</Text>
                  <Text style={styles.internshipLocation}>📍 {internship.location}</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {internship.requiredSkills?.slice(0, 3).map((skill, index) => (
                    <View key={index} style={[styles.skillTag, styles.internshipSkill]}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.postedDate}>{internship.postedDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
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
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
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
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F8A5F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F3F4F6',
    alignSelf: 'center',
  },
  
  // Section
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAll: {
    fontSize: 14,
    color: '#0F8A5F',
    fontWeight: '500',
  },
  
  // Dashboard Cards
  dashboardList: {
    paddingBottom: 8,
  },
  dashboardRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minHeight: 160,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardCompany: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardDetails: {
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  cardLocation: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardSalary: {
    fontSize: 10,
    color: '#6B7280',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  internshipBadge: {
    backgroundColor: '#DBEAFE',
  },
  typeBadgeText: {
    fontSize: 9,
    color: '#92400E',
    fontWeight: '500',
  },
  
  // Événements à venir
  upcomingList: {
    paddingTop: 4,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  upcomingIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  upcomingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  upcomingLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
    marginBottom: 2,
  },
  upcomingDate: {
    fontSize: 11,
    color: '#0F8A5F',
    fontWeight: '500',
  },
  
  // Stages récents
  internshipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  internshipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  internshipIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  internshipIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  internshipContent: {
    flex: 1,
  },
  internshipTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  internshipDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  internshipCompany: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 2,
  },
  internshipLocation: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  postedDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  
  // Compétences
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  internshipSkill: {
    backgroundColor: '#E0E7FF',
  },
  skillText: {
    fontSize: 9,
    color: '#4B5563',
    fontWeight: '500',
  },
});