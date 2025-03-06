import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppContext } from '../../contexts/AppContext';

const AppHeader = () => {
  const { 
    currentUser, 
    userType, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    handleLogout 
  } = useAppContext();
  
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="menu-icon" />
          </button>
          
          <div className="app-brand">
            <img src="/crlogo.svg" alt="Creation Rights Logo" className="app-logo" />
            <span className="app-name">Creation Rights</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span>Hello, </span>
            <span className="user-name">{currentUser?.name}</span>
            <span className="user-type">
              {userType === 'creator' ? 'Creator' : 'Agency'}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleLogout} className="logout-button">
            <LogOut className="logout-icon" />
            <span className="logout-text">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;