import React, { createContext, useState, useEffect, useContext } from 'react';

// Sample data
const initialFolders = [
  { id: 'f1', name: 'Images', parentId: null },
  { id: 'f2', name: 'Written Works', parentId: null },
  { id: 'f3', name: 'Music', parentId: null },
  { id: 'f4', name: 'Photography', parentId: 'f1' },
  { id: 'f5', name: 'Illustrations', parentId: 'f1' },
  { id: 'f6', name: 'Short Stories', parentId: 'f2' },
  { id: 'f7', name: 'Blog Posts', parentId: 'f2' },
];

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

const sampleUsers = {
  creator: { id: 'user1', name: 'Jane Creator', email: 'jane@example.com', type: 'creator' },
  agency: { id: 'agency1', name: 'ABC Agency', email: 'agency@example.com', type: 'agency' }
};

// Create context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('creator');
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI state
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  
  // Content state
  const [folders, setFolders] = useState([]);
  const [creations, setCreations] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
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
  const [newFolderName, setNewFolderName] = useState('');
  
  // Login credentials
  const [loginCredentials, setLoginCredentials] = useState({ 
    email: '', 
    password: '', 
    accountType: 'creator' 
  });

  // Load initial state
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
      try {
        const authState = JSON.parse(savedAuth);
        if (authState.isAuthenticated) {
          setIsAuthenticated(true);
          setUserType(authState.userType || 'creator');
          setCurrentUser(authState.currentUser);
          
          // Make sure we have a valid user object
          if (!authState.currentUser) {
            const defaultUser = authState.userType === 'agency' 
              ? sampleUsers.agency 
              : sampleUsers.creator;
            setCurrentUser(defaultUser);
          }
        }
      } catch (error) {
        console.error('Error parsing auth state:', error);
        // Clear corrupted auth state
        localStorage.removeItem('authState');
      }
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
  const getFilteredCreations = () => {
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
    
    return filtered;
  };

  // Actions
  const handleLogin = (e) => {
    e.preventDefault();
    
    let user;
    if (loginCredentials.accountType === 'creator') {
      user = sampleUsers.creator;
      setUserType('creator');
    } else {
      user = sampleUsers.agency;
      setUserType('agency');
    }
    
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // Immediately save to localStorage to ensure persistence
    const authState = {
      isAuthenticated: true,
      userType: loginCredentials.accountType,
      currentUser: user
    };
    localStorage.setItem('authState', JSON.stringify(authState));
    
    setShowLoginModal(false);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowLoginModal(false);
    
    // Clear auth state from localStorage
    localStorage.removeItem('authState');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCreation({
      ...currentCreation,
      [name]: value
    });
  };

  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLoginCredentials({
      ...loginCredentials,
      [name]: value
    });
  };

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

  const removeTag = (tagToRemove) => {
    setCurrentCreation({
      ...currentCreation,
      tags: currentCreation.tags.filter(tag => tag !== tagToRemove)
    });
  };

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
    setActiveView('myCreations');
  };

  const handleEdit = (creation) => {
    setCurrentCreation(creation);
    setEditMode(true);
    setActiveView('editCreation');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this creation?')) {
      setCreations(creations.filter(creation => creation.id !== id));
    }
  };

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

  const getSubFolderIds = (folderId) => {
    const directChildren = folders.filter(folder => folder.parentId === folderId).map(folder => folder.id);
    let allChildren = [...directChildren];
    
    directChildren.forEach(childId => {
      allChildren = [...allChildren, ...getSubFolderIds(childId)];
    });
    
    return allChildren;
  };

  const toggleFolderExpanded = (folderId) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId]
    });
  };

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

  return (
    <AppContext.Provider value={{
      // State
      isAuthenticated,
      userType,
      currentUser,
      activeView,
      isMobileMenuOpen,
      showLoginModal,
      showNewFolderModal,
      folders,
      creations,
      currentFolder,
      expandedFolders,
      breadcrumbs,
      currentCreation,
      editMode,
      activeTab,
      searchQuery,
      newFolderName,
      loginCredentials,
      
      // Methods
      setIsAuthenticated,
      setUserType,
      setCurrentUser,
      setActiveView,
      setIsMobileMenuOpen,
      setShowLoginModal,
      setShowNewFolderModal,
      setFolders,
      setCreations,
      setCurrentFolder,
      setBreadcrumbs,
      setCurrentCreation,
      setEditMode,
      setActiveTab,
      setSearchQuery,
      setNewFolderName,
      setLoginCredentials,
      getFilteredCreations,
      handleLogin,
      handleLogout,
      handleInputChange,
      handleLoginInput,
      handleTagInput,
      removeTag,
      resetForm,
      handleSubmit,
      handleEdit,
      handleDelete,
      createFolder,
      deleteFolder,
      toggleFolderExpanded,
      navigateToFolder,
      buildBreadcrumbs,
      getSubFolderIds,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);