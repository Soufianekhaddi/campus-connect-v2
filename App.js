import React, { useState, useContext } from 'react';
import { View, StatusBar, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './Contexts/AuthContext';
import { ProfileProvider } from './Contexts/ProfileContext';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import Events from './Screens/Events';
import Internship from './Screens/Internships';
import Profile from './Screens/Profile';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
          <AppContent />
        </View>
      </ProfileProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#0F8A5F" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Chargement...</Text>
      </View>
    );
  }
  
  if (!user) {
    if (isLogin) {
      return <Login onSwitchToSignup={() => setIsLogin(false)} />;
    }
    return <Signup onSwitchToLogin={() => setIsLogin(true)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingVertical: 10,
            paddingHorizontal: 5,
            height: 70,
          },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginBottom: 5,
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{
            tabBarLabel: 'Accueil',
            tabBarIcon: ({ focused, color, size }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer
              ]}>
                <Image 
                  source={require('./assets/home.png')} 
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? 'white' : '#9CA3AF' }
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Events" 
          component={Events}
          options={{
            tabBarLabel: 'Événements',
            tabBarIcon: ({ focused, color, size }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer
              ]}>
                <Image 
                  source={require('./assets/events.png')} 
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? 'white' : '#9CA3AF' }
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Internship" 
          component={Internship}
          options={{
            tabBarLabel: 'Stages',
            tabBarIcon: ({ focused, color, size }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer
              ]}>
                <Image 
                  source={require('./assets/job.png')} 
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? 'white' : '#9CA3AF' }
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({ focused, color, size }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.activeTabIconContainer
              ]}>
                <Image 
                  source={require('./assets/profil.png')} 
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? 'white' : '#9CA3AF' }
                  ]}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  activeTabIconContainer: {
    backgroundColor: '#3B82F6',
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
});