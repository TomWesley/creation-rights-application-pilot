import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import LandingPage from './components/pages/LandingPage';
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';
import CreatorDashboard from './components/pages/CreatorDashboard';
import AgencyDashboard from './components/pages/AgencyDashboard';
import CreationsList from './components/pages/CreationsList';
import CreationForm from './components/pages/CreationForm';
import CreatorManagement from './components/pages/CreatorManagement';
import Settings from './components/pages/Settings';
import NewFolderModal from './components/shared/NewFolderModal';
import './CreationRightsApp.css';

const AppContent = () => {
  const { 
    isAuthenticated, 
    userType,
    activeView,
    showNewFolderModal
  } = useAppContext();
  
  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  
  // Render the appropriate view based on activeView state
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return userType === 'creator' ? <CreatorDashboard /> : <AgencyDashboard />;
      case 'myCreations':
        return <CreationsList />;
      case 'newCreation':
      case 'editCreation':
        return <CreationForm />;
      case 'creators':
        return userType === 'agency' ? <CreatorManagement /> : <CreatorDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return userType === 'creator' ? <CreatorDashboard /> : <AgencyDashboard />;
    }
  };
  
  return (
    <div className="app-layout">
      <AppHeader />
      
      <div className="app-content">
        <AppSidebar />
        
        <main className="main-content">
          <div className="content-container">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {showNewFolderModal && <NewFolderModal />}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;