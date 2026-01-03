// Screens/MainApp.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Home from './Home';
import Events from './Events';
import Internship from './Internships';
import Profile from './Profile';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('Home');


  const navigation = {
    navigate: (screenName, params) => {
      if (screenName === 'Events') {
        setActiveTab('Events');
      } else if (screenName === 'Internships') {
        setActiveTab('Internship');
      } else if (screenName === 'Profile') {
        setActiveTab('Profile');
      } else if (screenName === 'Home') {
        setActiveTab('Home');
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Events':
        return <Events />;
      case 'Jobs':
        return <Internship/>;
      case 'Profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
          onPress={() => setActiveTab('Home')}
        >
          <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>
            🏠 Accueil
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Events' && styles.activeTab]}
          onPress={() => setActiveTab('Events')}
        >
          <Text style={[styles.tabText, activeTab === 'Events' && styles.activeTabText]}>
            📅 Événements
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Jobs' && styles.activeTab]}
          onPress={() => setActiveTab('Jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'Jobs' && styles.activeTabText]}>
            💼 Emplois
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
          onPress={() => setActiveTab('Profile')}
        >
          <Text style={[styles.tabText, activeTab === 'Profile' && styles.activeTabText]}>
            👤 Profil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
