import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AlertCircle, 
  Plus, 
  Save, 
  Trash2, 
  Edit, 
  Eye, 
  Folder, 
  FolderPlus, 
  ChevronDown, 
  ChevronRight,
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ImageIcon,
  Music,
  Video,
  Code,
  BarChart2,
  Search,
  User,
  UserPlus,
  Building2
} from 'lucide-react';
import './CreationRightsApp.css';

// Mock authentication and user data for demonstration
const CreationRightsApp = () => {
  // Application state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('creator'); // 'creator' or 'agency'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Folder & file management
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  
  // Creation management
  const [creations, setCreations] = useState([]);
  const [filteredCreations, setFilteredCreations] = useState([]);
  const [currentCreation, setCurrentCreation] = useState({
    id: '',
    title: '',
    type: '',
    dateCreated: '',
    rights: '',
    notes: '',
    folderId: '',
    tags: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '', accountType: 'creator' });

  // Sample users for mock login
  const sampleUsers = {
    creator: { id: 'user1', name: 'Jane Creator', email: 'jane@example.com', type: 'creator' },
    agency: { id: 'agency1', name: 'ABC Agency', email: 'agency@example.com', type: 'agency' }
  };

  // Sample folder structure
  const initialFolders = [
    { id: 'f1', name: 'Images', parentId: null },
    { id: 'f2', name: 'Written Works', parentId: null },
    { id: 'f3', name: 'Music', parentId: null },
    { id: 'f4', name: 'Photography', parentId: 'f1' },
    { id: 'f5', name: 'Illustrations', parentId: 'f1' },
    { id: 'f6', name: 'Short Stories', parentId: 'f2' },
    { id: 'f7', name: 'Blog Posts', parentId: 'f2' },
  ];

  // Sample creations
  const sampleCreations = [
    {
      id: 'c1',
      title: 'Mountain Landscape',
      type: 'Image',
      dateCreated: '2023-04-15',
      rights: 'All rights reserved, Copyright 2023',
      notes: 'Shot in Colorado during summer trip',
      folderId: 'f4',
      tags: ['nature', 'landscape']
    },
    {
      id: 'c2',
      title: 'Character Concept Art',
      type: 'Image',
      dateCreated: '2023-05-22',
      rights: 'Creative Commons Attribution',
      notes: 'Fantasy character design for personal project',
      folderId: 'f5',
      tags: ['fantasy', 'character']
    },
    {
      id: 'c3',
      title: 'The Lost Path',
      type: 'Text',
      dateCreated: '2023-03-10',
      rights: 'Copyright 2023, pending publication',
      notes: 'Short story for anthology submission',
      folderId: 'f6',
      tags: ['fiction', 'horror']
    },
    {
      id: 'c4',
      title: 'Summer Melody',
      type: 'Music',
      dateCreated: '2023-06-05',
      rights: 'All rights reserved, registered with ASCAP',
      notes: 'Acoustic guitar composition',
      folderId: 'f3',
      tags: ['acoustic', 'instrumental']
    }
  ];

  // Initialize state with sample data
  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    const savedCreations = localStorage.getItem('creations');
    const savedAuth = localStorage.getItem('authState');
    
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      setFolders(initialFolders);
    }
    
    if (savedCreations) {
      setCreations(JSON.parse(savedCreations));
    } else {
      setCreations(sampleCreations);
    }
    
    if (savedAuth) {
      const authState = JSON.parse(savedAuth);
      setIsAuthenticated(authState.isAuthenticated);
      setUserType(authState.userType);
      setCurrentUser(authState.currentUser);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('creations', JSON.stringify(creations));
    localStorage.setItem('authState', JSON.stringify({
      isAuthenticated,
      userType,
      currentUser
    }));
  }, [folders, creations, isAuthenticated, userType, currentUser]);

  // Filter creations based on current folder and search
  useEffect(() => {
    let filtered = [...creations];
    
    // Filter by folder
    if (currentFolder) {
      filtered = filtered.filter(creation => creation.folderId === currentFolder.id);
    }
    
    // Filter by type (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(creation => 
        creation.type.toLowerCase() === activeTab
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(creation => 
        creation.title.toLowerCase().includes(query) ||
        creation.notes.toLowerCase().includes(query) ||
        creation.rights.toLowerCase().includes(query) ||
        creation.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredCreations(filtered);
  }, [creations, currentFolder, activeTab, searchQuery]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCreation({
      ...currentCreation,
      [name]: value
    });
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!currentCreation.tags.includes(newTag)) {
        setCurrentCreation({
          ...currentCreation,
          tags: [...currentCreation.tags, newTag]
        });
      }
      e.target.value = '';
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setCurrentCreation({
      ...currentCreation,
      tags: currentCreation.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Reset creation form
  const resetForm = () => {
    setCurrentCreation({
      id: '',
      title: '',
      type: '',
      dateCreated: '',
      rights: '',
      notes: '',
      folderId: currentFolder ? currentFolder.id : '',
      tags: [],
    });
    setEditMode(false);
  };

  // Submit creation form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentCreation.title || !currentCreation.type) {
      alert('Title and type are required fields');
      return;
    }
    
    if (editMode) {
      // Update existing creation
      const updatedCreations = creations.map(creation => 
        creation.id === currentCreation.id ? currentCreation : creation
      );
      setCreations(updatedCreations);
    } else {
      // Add new creation with unique ID
      const newCreation = {
        ...currentCreation,
        id: `c${Date.now()}`,
        dateCreated: currentCreation.dateCreated || new Date().toISOString().split('T')[0],
        folderId: currentCreation.folderId || (currentFolder ? currentFolder.id : '')
      };
      setCreations([...creations, newCreation]);
    }
    
    resetForm();
  };

  // Edit creation
  const handleEdit = (creation) => {
    setCurrentCreation(creation);
    setEditMode(true);
    setActiveView('editCreation');
  };

  // Delete creation
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this creation?')) {
      setCreations(creations.filter(creation => creation.id !== id));
    }
  };

  // Create new folder
  const createFolder = () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }
    
    const newFolder = {
      id: `f${Date.now()}`,
      name: newFolderName,
      parentId: currentFolder ? currentFolder.id : null
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  // Delete folder
  const deleteFolder = (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder and all contents?')) {
      // Remove the folder
      const updatedFolders = folders.filter(folder => folder.id !== folderId);
      
      // Remove all subfolders
      const allSubFolderIds = getSubFolderIds(folderId);
      const foldersAfterSubFolderRemoval = updatedFolders.filter(
        folder => !allSubFolderIds.includes(folder.id)
      );
      
      // Remove creations in those folders
      const updatedCreations = creations.filter(
        creation => creation.folderId !== folderId && !allSubFolderIds.includes(creation.folderId)
      );
      
      setFolders(foldersAfterSubFolderRemoval);
      setCreations(updatedCreations);
      
      // If we deleted the current folder, reset to root
      if (currentFolder && (currentFolder.id === folderId || allSubFolderIds.includes(currentFolder.id))) {
        setCurrentFolder(null);
        setBreadcrumbs([]);
      }
    }
  };

  // Get all subfolders for a folder
  const getSubFolderIds = (folderId) => {
    const directChildren = folders.filter(folder => folder.parentId === folderId).map(folder => folder.id);
    let allChildren = [...directChildren];
    
    directChildren.forEach(childId => {
      allChildren = [...allChildren, ...getSubFolderIds(childId)];
    });
    
    return allChildren;
  };

  // Toggle folder expansion in navigation
  const toggleFolderExpanded = (folderId) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId]
    });
  };

  // Navigate to folder
  const navigateToFolder = (folder) => {
    setCurrentFolder(folder);
    
    // Build breadcrumbs
    if (folder === null) {
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = buildBreadcrumbs(folder.id);
      setBreadcrumbs(newBreadcrumbs);
    }
    
    setActiveView('myCreations');
  };

  // Build breadcrumb trail for navigation
  const buildBreadcrumbs = (folderId) => {
    const breadcrumbArray = [];
    let currentId = folderId;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        breadcrumbArray.unshift(folder);
        currentId = folder.parentId;
      } else {
        currentId = null;
      }
    }
    
    return breadcrumbArray;
  };

  // Create nested folder structure for sidebar
  const renderFolderStructure = (parentId = null, depth = 0) => {
    const folderList = folders.filter(folder => folder.parentId === parentId);
    
    if (folderList.length === 0) {
      return null;
    }
    
    return (
      <ul className={`folder-list depth-${depth}`}>
        {folderList.map(folder => {
          const hasChildren = folders.some(f => f.parentId === folder.id);
          const isExpanded = expandedFolders[folder.id];
          
          return (
            <li key={folder.id} className="folder-item">
              <div 
                className={`folder-row ${
                  currentFolder && currentFolder.id === folder.id ? 'folder-active' : ''
                }`}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggleFolderExpanded(folder.id)}
                    className="folder-toggle"
                  >
                    {isExpanded ? <ChevronDown className="folder-icon-small" /> : <ChevronRight className="folder-icon-small" />}
                  </button>
                ) : (
                  <span className="folder-toggle-placeholder"></span>
                )}
                
                <Folder className="folder-icon" />
                
                <span 
                  onClick={() => navigateToFolder(folder)} 
                  className="folder-name"
                >
                  {folder.name}
                </span>
                
                {currentFolder && currentFolder.id === folder.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="folder-delete"
                  >
                    <Trash2 className="folder-icon-small" />
                  </button>
                )}
              </div>
              
              {hasChildren && isExpanded && renderFolderStructure(folder.id, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  // Handle login form input
  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLoginCredentials({
      ...loginCredentials,
      [name]: value
    });
  };

  // Process login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple mock login for demonstration
    // In a real app, this would validate against a backend
    if (loginCredentials.accountType === 'creator') {
      setCurrentUser(sampleUsers.creator);
      setUserType('creator');
    } else {
      setCurrentUser(sampleUsers.agency);
      setUserType('agency');
    }
    
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setActiveView('dashboard');
  };

  // Process logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowLoginModal(false);
  };

  // Get icon for creation type
  const getCreationTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <ImageIcon className="creation-type-icon image-icon" />;
      case 'text':
        return <FileText className="creation-type-icon text-icon" />;
      case 'music':
        return <Music className="creation-type-icon music-icon" />;
      case 'video':
        return <Video className="creation-type-icon video-icon" />;
      case 'software':
        return <Code className="creation-type-icon software-icon" />;
      default:
        return <FileText className="creation-type-icon default-icon" />;
    }
  };

  // Render the login form
  const renderLoginForm = () => (
    <div className="modal-overlay">
      <Card className="login-modal">
        <CardHeader>
          <CardTitle className="login-title">Sign In</CardTitle>
          <CardDescription>
            Sign in to your Creation Rights account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="login-form">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={loginCredentials.email}
                onChange={handleLoginInput}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={loginCredentials.password}
                onChange={handleLoginInput}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                name="accountType"
                value={loginCredentials.accountType}
                onChange={handleLoginInput}
                className="account-type-select"
              >
                <option value="creator">Creator</option>
                <option value="agency">Agency</option>
              </select>
            </div>
            
            <Button type="submit" className="login-button">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="login-footer">
          <Button variant="ghost" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="link">Forgot password?</Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Render new folder modal
  const renderNewFolderModal = () => (
    <div className="modal-overlay">
      <Card className="folder-modal">
        <CardHeader>
          <CardTitle>Create New Folder</CardTitle>
          <CardDescription>
            {currentFolder 
              ? `Creating a subfolder in ${currentFolder.name}` 
              : 'Creating a root folder'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="folder-form">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="folder-modal-footer">
          <Button variant="ghost" onClick={() => setShowNewFolderModal(false)}>
            Cancel
          </Button>
          <Button onClick={createFolder}>
            Create Folder
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Render dashboard view
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="stats-container">
        <Card>
          <CardHeader className="stats-header">
            <CardTitle className="stats-title">Total Creations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="stats-value">{creations.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="stats-header">
            <CardTitle className="stats-title">Total Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="stats-value">{folders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="stats-header">
            <CardTitle className="stats-title">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="activity-date">Last update: Today</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Creations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="recent-creations">
            {creations.slice(0, 5).map(creation => (
              <div key={creation.id} className="recent-creation-item">
                {getCreationTypeIcon(creation.type)}
                <div className="recent-creation-info">
                  <p className="recent-creation-title">{creation.title}</p>
                  <p className="recent-creation-date">Created: {creation.dateCreated}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="view-button"
                  onClick={() => handleEdit(creation)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setActiveView('myCreations')}>
            View All Creations
          </Button>
        </CardFooter>
      </Card>
      
      {userType === 'agency' && (
        <Card className="creator-management-card">
          <CardHeader>
            <CardTitle>Creator Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="creator-management">
              <Users className="creator-icon" />
              <p className="creator-management-title">Manage Your Creators</p>
              <p className="creator-management-desc">Connect with creators and manage rights assignments</p>
              <Button>View Creators</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render my creations view
  const renderMyCreations = () => {
    const creationTypes = ['Image', 'Text', 'Music', 'Video', 'Software', 'Other'];
    
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
                  {breadcrumbs.slice(0, -1).map((folder, i) => (
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
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
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
                  <Card key={creation.id} className="creation-card">
                    <div className="creation-content">
                      <div className="creation-info-sidebar">
                        <div>
                          {getCreationTypeIcon(creation.type)}
                        </div>
                        <div className="creation-meta">
                          <p className="creation-title">{creation.title}</p>
                          <p className="creation-date">{creation.dateCreated}</p>
                        </div>
                      </div>
                      <div className="creation-details">
                        {creation.rights && (
                          <div className="creation-rights">
                            <p className="details-label">Rights</p>
                            <p>{creation.rights}</p>
                          </div>
                        )}
                        {creation.notes && (
                          <div className="creation-notes">
                            <p className="details-label">Notes</p>
                            <p className="notes-text">{creation.notes}</p>
                          </div>
                        )}
                        {creation.tags && creation.tags.length > 0 && (
                          <div className="creation-tags">
                            {creation.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="tag"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="creation-actions">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(creation)}
                          className="edit-button"
                        >
                          <Edit className="button-icon-small" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(creation.id)}
                          className="delete-button"
                        >
                          <Trash2 className="button-icon-small" /> Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render new/edit creation form
  const renderCreationForm = () => {
    const creationTypes = ['Image', 'Text', 'Music', 'Video', 'Software', 'Other'];
    
    return (
      <div className="creation-form-container">
        <div className="form-header">
          <h1 className="form-title">
            {editMode ? 'Edit Creation' : 'New Creation'}
          </h1>
          {currentFolder && (
            <p className="folder-path">
              In folder: {breadcrumbs.map(f => f.name).join(' / ')}
              {breadcrumbs.length > 0 && ' / '}
              {currentFolder.name}
            </p>
          )}
        </div>
        
        <Card>
          <CardContent className="creation-form-content">
            <form onSubmit={handleSubmit} className="creation-form">
              <div className="form-grid">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={currentCreation.title}
                    onChange={handleInputChange}
                    placeholder="Title of your creation"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    name="type"
                    value={currentCreation.type}
                    onChange={handleInputChange}
                    className="type-select"
                    required
                  >
                    <option value="">Select a type</option>
                    {creationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="dateCreated">Date Created</Label>
                  <Input 
                    id="dateCreated"
                    name="dateCreated"
                    type="date"
                    value={currentCreation.dateCreated}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="folderId">Folder</Label>
                  <select
                    id="folderId"
                    name="folderId"
                    value={currentCreation.folderId}
                    onChange={handleInputChange}
                    className="folder-select"
                  >
                    <option value="">Root (No Folder)</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {buildBreadcrumbs(folder.id).map(f => f.name).join(' / ')}
                        {buildBreadcrumbs(folder.id).length > 0 ? ' / ' : ''}
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="rights">Rights Information</Label>
                <Textarea 
                  id="rights"
                  name="rights"
                  value={currentCreation.rights}
                  onChange={handleInputChange}
                  placeholder="Copyright details, licensing terms, etc."
                  rows={3}
                  className="rights-textarea"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  value={currentCreation.notes}
                  onChange={handleInputChange}
                  placeholder="Additional information about your creation"
                  rows={3}
                  className="notes-textarea"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="tags-container">
                  {currentCreation.tags.map(tag => (
                    <div 
                      key={tag} 
                      className="tag-item"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="tag-remove"
                      >
                        <X className="tag-remove-icon" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  id="tags"
                  placeholder="Add tags (press Enter after each tag)"
                  onKeyDown={handleTagInput}
                  className="tags-input"
                />
              </div>

              <div className="form-actions">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setActiveView('myCreations');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </Button>
                <Button type="submit" className="submit-button">
                  {editMode ? 'Update Creation' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main application layout
  return (
    <div className="app-container">
      {/* Show login modal if not authenticated */}
      {!isAuthenticated && (
        <div className="landing-container">
          {/* Header for landing page */}
          <header className="landing-header">
            <div className="header-content">
              <div className="logo-container">
                <img src="/crlogo.svg" alt="Creation Rights Logo" className="logo" />
                
              </div>
              <Button onClick={() => setShowLoginModal(true)} className="signin-button">Sign In</Button>
            </div>
          </header>
          
          {/* Landing page content */}
          <main className="landing-main">
            <div className="landing-content">
              <div className="hero-section">
                <h1 className="hero-title">
                  Protect Your Creative Works
                </h1>
                <p className="hero-subtitle">
                  Easily manage, track, and secure your intellectual property rights
                  across all your creative endeavors.
                </p>
                <div className="hero-actions">
                  <Button size="lg" onClick={() => setShowLoginModal(true)} className="get-started-button">
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" className="learn-more-button">
                    Learn More
                  </Button>
                </div>
              </div>
              
              {/* Feature highlights */}
              <div className="features-section">
                <Card className="feature-card">
                  <CardHeader>
                    <CardTitle className="feature-title">
                      <FileText className="feature-icon" />
                      Organize Your Creations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Keep all your creative works organized with our intuitive folder system and tagging features.</p>
                  </CardContent>
                </Card>
                
                <Card className="feature-card">
                  <CardHeader>
                    <CardTitle className="feature-title">
                      <Users className="feature-icon" />
                      Creator & Agency Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Whether you're an individual creator or an agency, our platform adapts to your specific needs.</p>
                  </CardContent>
                </Card>
                
                <Card className="feature-card">
                  <CardHeader>
                    <CardTitle className="feature-title">
                      <BarChart2 className="feature-icon" />
                      Track Your Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Never lose track of your intellectual property rights with comprehensive details for each creation.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
          
          {/* Footer */}
          <footer className="app-footer">
            <div className="footer-content">
              <div className="footer-brand">
                <div className="footer-logo">
                  <img src="/crlogo.svg" alt="Creation Rights Logo" className="footer-logo-img" />
                  
                </div>
                <p className="footer-copyright">Copyright © 2025</p>
              </div>
              <div className="footer-links">
                <a href="#" className="footer-link">About</a>
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
              </div>
            </div>
          </footer>
          
          {showLoginModal && renderLoginForm()}
        </div>
      )}
      
      {/* Authenticated app layout */}
      {isAuthenticated && (
        <div className="app-layout">
          {/* Top navigation bar */}
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
          
          <div className="app-content">
            {/* Sidebar navigation */}
            <aside className={`app-sidebar ${isMobileMenuOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <div className="sidebar-content">
                <nav className="sidebar-nav">
                  <div>
                    <button
                      className="nav-item"
                      onClick={() => {
                        setActiveView('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Home className="nav-icon" />
                      Dashboard
                    </button>
                  </div>
                  
                  <div className="nav-group">
                    <button
                      className="nav-item"
                      onClick={() => {
                        setCurrentFolder(null);
                        setBreadcrumbs([]);
                        setActiveView('myCreations');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FileText className="nav-icon" />
                      My Creations
                    </button>
                    
                    <div className="folder-tree">
                      {renderFolderStructure()}
                    </div>
                  </div>
                  
                  {userType === 'agency' && (
                    <div>
                      <button
                        className="nav-item"
                        onClick={() => {
                          setActiveView('creators');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Users className="nav-icon" />
                        Creators
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <button
                      className="nav-item"
                      onClick={() => {
                        setActiveView('settings');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="nav-icon" />
                      Settings
                    </button>
                  </div>
                </nav>
              </div>
            </aside>
            
            {/* Mobile overlay to close menu when clicked */}
            {isMobileMenuOpen && (
              <div 
                className="sidebar-overlay"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            
            {/* Main content area */}
            <main className="main-content">
              <div className="content-container">
                {activeView === 'dashboard' && renderDashboard()}
                {activeView === 'myCreations' && renderMyCreations()}
                {(activeView === 'newCreation' || activeView === 'editCreation') && renderCreationForm()}
                {activeView === 'creators' && userType === 'agency' && (
                  <div className="creators-dashboard">
                    <Building2 className="creators-icon" />
                    <h2 className="creators-title">Creator Management</h2>
                    <p className="creators-subtitle">
                      Connect with creators and manage rights assignments
                    </p>
                    <div className="creators-actions">
                      <Button className="add-creator-button">
                        <UserPlus className="button-icon" /> Add Creator
                      </Button>
                      <Button variant="outline" className="view-creators-button">
                        <User className="button-icon" /> View Creators
                      </Button>
                    </div>
                  </div>
                )}
                {activeView === 'settings' && (
                  <div className="settings-view">
                    <h1 className="settings-title">Account Settings</h1>
                    <Card className="settings-card">
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="profile-settings">
                          <div className="profile-form">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" defaultValue={currentUser?.name} />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" defaultValue={currentUser?.email} />
                            </div>
                          </div>
                          <Button className="save-profile-button">Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="settings-card">
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="password-settings">
                          <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                          </div>
                          <Button className="password-button">Update Password</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
      
      {/* Modals */}
      {showNewFolderModal && renderNewFolderModal()}
    </div>
  );
};

export default CreationRightsApp;