import React from 'react';
import { Plus, FolderPlus, Search, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import CreationCard from '../shared/CreationCard';
import { useAppContext } from '../../contexts/AppContext';

const CreationsList = () => {
  const { 
    currentFolder, 
    breadcrumbs, 
    searchQuery, 
    setSearchQuery,
    activeTab,
    setActiveTab,
    navigateToFolder,
    setActiveView,
    setShowNewFolderModal,
    getFilteredCreations
  } = useAppContext();
  
  const filteredCreations = getFilteredCreations();
  
  return (
    <div className="creations-view">
      <div className="creations-header">
        <div>
          <h1 className="creations-title">
            {currentFolder ? currentFolder.name : 'All Creations'}
          </h1>
          
          {/* Breadcrumb navigation */}
          {breadcrumbs.length > 0 && (
            <nav className="breadcrumb-nav">
              <ol className="breadcrumb-list">
                <li>
                  <button 
                    onClick={() => navigateToFolder(null)}
                    className="breadcrumb-root"
                  >
                    Root
                  </button>
                </li>
                {breadcrumbs.slice(0, -1).map((folder) => (
                  <li key={folder.id} className="breadcrumb-item">
                    <span className="breadcrumb-separator">/</span>
                    <button 
                      onClick={() => navigateToFolder(folder)}
                      className="breadcrumb-link"
                    >
                      {folder.name}
                    </button>
                  </li>
                ))}
                {breadcrumbs.length > 0 && (
                  <li className="breadcrumb-item">
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{breadcrumbs[breadcrumbs.length - 1].name}</span>
                  </li>
                )}
              </ol>
            </nav>
          )}
        </div>
        
        <div className="creations-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search creations..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setActiveView('newCreation')} className="new-creation-button">
            <Plus className="button-icon" /> New Creation
          </Button>
          <Button variant="outline" onClick={() => setShowNewFolderModal(true)} className="new-folder-button">
            <FolderPlus className="button-icon" /> New Folder
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="tabs-header">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredCreations.length === 0 ? (
            <div className="empty-state">
              <AlertCircle className="empty-icon" />
              <p className="empty-title">No creations found</p>
              <p className="empty-message">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Add your first creation or create a new folder"}
              </p>
              <div className="empty-actions">
                <Button onClick={() => setActiveView('newCreation')}>
                  <Plus className="button-icon" /> Add Creation
                </Button>
                <Button variant="outline" onClick={() => setShowNewFolderModal(true)}>
                  <FolderPlus className="button-icon" /> New Folder
                </Button>
              </div>
            </div>
          ) : (
            <div className="creation-list">
              {filteredCreations.map(creation => (
                <CreationCard key={creation.id} creation={creation} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreationsList;