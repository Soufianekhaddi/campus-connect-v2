import React, { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

// Create the context
export const ProfileContext = createContext();

// Create the provider component
export const ProfileProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    field: '',
    skills: [], // Array of skills
  });

  // Update profile
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  // Add a skill
  const addSkill = (skill) => {
    if (skill.trim() && !profile.skills.includes(skill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skill.trim()]
      });
    }
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, addSkill, removeSkill }}>
      {children}
    </ProfileContext.Provider>
  );
};