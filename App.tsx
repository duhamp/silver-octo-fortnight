import React, { useState } from 'react';
import { Profile } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import MockupGenerator from './components/MockupGenerator';
import ProfileEditor from './components/ProfileEditor';
import ProfileManager from './components/ProfileManager';
import { deleteImage } from './db';

type View = 'generator' | 'profile_editor' | 'profile_manager';

const App: React.FC = () => {
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('mockup-profiles', []);
  const [currentView, setCurrentView] = useState<View>('generator');
  const [profileToEdit, setProfileToEdit] = useState<Profile | undefined>(undefined);

  const handleSaveProfile = (profile: Profile) => {
    const index = profiles.findIndex((p) => p.id === profile.id);
    if (index > -1) {
      const updatedProfiles = [...profiles];
      updatedProfiles[index] = profile;
      setProfiles(updatedProfiles);
    } else {
      setProfiles([...profiles, profile]);
    }
    setCurrentView('profile_manager');
    setProfileToEdit(undefined);
  };

  const handleEditProfile = (profile: Profile) => {
    setProfileToEdit(profile);
    setCurrentView('profile_editor');
  };
  
  const handleAddProfile = () => {
    setProfileToEdit(undefined);
    setCurrentView('profile_editor');
  }

  const handleDeleteProfile = async (profileId: string) => {
    const profileToDelete = profiles.find(p => p.id === profileId);
    if (profileToDelete) {
        // Asynchronously delete all associated images from IndexedDB
        await Promise.all(profileToDelete.mockups.map(mockup => deleteImage(mockup.imageId)));
    }
    setProfiles(profiles.filter(p => p.id !== profileId));
  }
  
  const handleCancelEdit = () => {
    setProfileToEdit(undefined);
    setCurrentView('profile_manager');
  }

  const renderView = () => {
    switch (currentView) {
      case 'profile_editor':
        return <ProfileEditor 
                    profileToEdit={profileToEdit} 
                    onSave={handleSaveProfile} 
                    onCancel={handleCancelEdit} 
                />;
      case 'profile_manager':
        return <ProfileManager 
                    profiles={profiles}
                    onAdd={handleAddProfile}
                    onEdit={handleEditProfile}
                    onDelete={handleDeleteProfile}
                    onBack={() => setCurrentView('generator')}
                />;
      case 'generator':
      default:
        return <MockupGenerator 
                    profiles={profiles} 
                    onManageProfiles={() => setCurrentView('profile_manager')} 
                />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <main className="container mx-auto py-8 px-4">
        {renderView()}
      </main>
    </div>
  );
};

export default App;