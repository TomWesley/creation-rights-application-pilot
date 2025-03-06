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
      <ul className={`pl-${depth > 0 ? 4 : 0}`}>
        {folderList.map(folder => {
          const hasChildren = folders.some(f => f.parentId === folder.id);
          const isExpanded = expandedFolders[folder.id];
          
          return (
            <li key={folder.id} className="my-1">
              <div 
                className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer ${
                  currentFolder && currentFolder.id === folder.id ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggleFolderExpanded(folder.id)}
                    className="mr-1 text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                ) : (
                  <span className="ml-5 mr-1"></span>
                )}
                
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
                
                <span 
                  onClick={() => navigateToFolder(folder)} 
                  className="flex-1 truncate"
                >
                  {folder.name}
                </span>
                
                {currentFolder && currentFolder.id === folder.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
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
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'text':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'music':
        return <Music className="h-5 w-5 text-purple-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'software':
        return <Code className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Render the login form
  const renderLoginForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Sign in to your Creation Rights account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full p-2 border rounded"
              >
                <option value="creator">Creator</option>
                <option value="agency">Agency</option>
              </select>
            </div>
            
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Create New Folder</CardTitle>
          <CardDescription>
            {currentFolder 
              ? `Creating a subfolder in ${currentFolder.name}` 
              : 'Creating a root folder'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
        <CardFooter className="flex justify-end space-x-2">
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Creations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{creations.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{folders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Last update: Today</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Creations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creations.slice(0, 5).map(creation => (
              <div key={creation.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                {getCreationTypeIcon(creation.type)}
                <div className="ml-3">
                  <p className="font-medium">{creation.title}</p>
                  <p className="text-sm text-gray-500">Created: {creation.dateCreated}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto"
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
        <Card>
          <CardHeader>
            <CardTitle>Creator Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded text-center">
              <Users className="h-12 w-12 mx-auto text-blue-500 mb-2" />
              <p className="text-lg font-medium">Manage Your Creators</p>
              <p className="text-gray-500 mb-4">Connect with creators and manage rights assignments</p>
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {currentFolder ? currentFolder.name : 'All Creations'}
            </h1>
            
            {/* Breadcrumb navigation */}
            {breadcrumbs.length > 0 && (
              <nav className="text-sm mb-4">
                <ol className="flex items-center space-x-1">
                  <li>
                    <button 
                      onClick={() => navigateToFolder(null)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Root
                    </button>
                  </li>
                  {breadcrumbs.slice(0, -1).map((folder, i) => (
                    <li key={folder.id} className="flex items-center">
                      <span className="mx-1 text-gray-500">/</span>
                      <button 
                        onClick={() => navigateToFolder(folder)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {folder.name}
                      </button>
                    </li>
                  ))}
                  {breadcrumbs.length > 0 && (
                    <li className="flex items-center">
                      <span className="mx-1 text-gray-500">/</span>
                      <span className="text-gray-700">{breadcrumbs[breadcrumbs.length - 1].name}</span>
                    </li>
                  )}
                </ol>
              </nav>
            )}
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search creations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setActiveView('newCreation')}>
              <Plus className="h-4 w-4 mr-2" /> New Creation
            </Button>
            <Button variant="outline" onClick={() => setShowNewFolderModal(true)}>
              <FolderPlus className="h-4 w-4 mr-2" /> New Folder
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
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
              <div className="text-center p-8 bg-gray-50 rounded">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-xl font-medium text-gray-500">No creations found</p>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : "Add your first creation or create a new folder"}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setActiveView('newCreation')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Creation
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewFolderModal(true)}>
                    <FolderPlus className="h-4 w-4 mr-2" /> New Folder
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCreations.map(creation => (
                  <Card key={creation.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center p-4 md:w-64 bg-gray-50">
                        <div>
                          {getCreationTypeIcon(creation.type)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{creation.title}</p>
                          <p className="text-sm text-gray-500">{creation.dateCreated}</p>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        {creation.rights && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 font-medium">Rights</p>
                            <p>{creation.rights}</p>
                          </div>
                        )}
                        {creation.notes && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 font-medium">Notes</p>
                            <p className="line-clamp-2">{creation.notes}</p>
                          </div>
                        )}
                        {creation.tags && creation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {creation.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex md:flex-col justify-end p-4 space-x-2 md:space-x-0 md:space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(creation)}
                          className="flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(creation.id)}
                          className="flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
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
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {editMode ? 'Edit Creation' : 'New Creation'}
          </h1>
          {currentFolder && (
            <p className="text-gray-500">
              In folder: {breadcrumbs.map(f => f.name).join(' / ')}
              {breadcrumbs.length > 0 && ' / '}
              {currentFolder.name}
            </p>
          )}
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentCreation.tags.map(tag => (
                    <div 
                      key={tag} 
                      className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  id="tags"
                  placeholder="Add tags (press Enter after each tag)"
                  onKeyDown={handleTagInput}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setActiveView('myCreations');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
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
    <div className="min-h-screen bg-gray-50">
      {/* Show login modal if not authenticated */}
      {!isAuthenticated && (
        <div className="flex flex-col min-h-screen">
          {/* Header for landing page */}
        
          <main className="flex-1">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                  Protect Your Creative Works
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Easily manage, track, and secure your intellectual property rights
                  across all your creative endeavors.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" onClick={() => setShowLoginModal(true)}>
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              
              {/* Feature highlights */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      Organize Your Creations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Keep all your creative works organized with our intuitive folder system and tagging features.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      Creator & Agency Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Whether you're an individual creator or an agency, our platform adapts to your specific needs.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
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
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-400 mr-2" />
                    <span className="text-lg font-bold">Creation Rights</span>
                  </div>
                  <p className="text-sm text-gray-400">Copyright © 2025</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">About</a>
                  <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                  <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-white">Terms</a>
                </div>
              </div>
            </div>
          </footer>
          
          {showLoginModal && renderLoginForm()}
        </div>
      )}
      
      {/* Authenticated app layout */}
      {isAuthenticated && (
        <div className="flex flex-col min-h-screen">
          {/* Top navigation bar */}
          <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-lg font-bold hidden sm:inline">Creation Rights</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 text-sm hidden md:block">
                  <span>Hello, </span>
                  <span className="font-medium">{currentUser?.name}</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {userType === 'creator' ? 'Creator' : 'Agency'}
                  </span>
                </div>
                
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 flex">
            {/* Sidebar navigation */}
            <aside 
              className={`
                ${isMobileMenuOpen ? 'block' : 'hidden'} 
                md:block fixed inset-y-0 left-0 md:relative z-10
                w-64 bg-white shadow-md pt-16 md:pt-0 transform transition-transform duration-300 ease-in-out
              `}
            >
              <div className="p-4">
                <nav className="space-y-6">
                  <div>
                    <button
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium mb-2"
                      onClick={() => {
                        setActiveView('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Home className="h-5 w-5 mr-2" />
                      Dashboard
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <button
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium mb-2"
                      onClick={() => {
                        setCurrentFolder(null);
                        setBreadcrumbs([]);
                        setActiveView('myCreations');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      My Creations
                    </button>
                    
                    <div className="ml-2">
                      {renderFolderStructure()}
                    </div>
                  </div>
                  
                  {userType === 'agency' && (
                    <div>
                      <button
                        className="flex items-center text-gray-700 hover:text-blue-600 font-medium mb-2"
                        onClick={() => {
                          setActiveView('creators');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Users className="h-5 w-5 mr-2" />
                        Creators
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <button
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => {
                        setActiveView('settings');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Settings
                    </button>
                  </div>
                </nav>
              </div>
            </aside>
            
            {/* Mobile overlay to close menu when clicked */}
            {isMobileMenuOpen && (
              <div 
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            
            {/* Main content area */}
            <main className="flex-1 p-6">
              <div className="container mx-auto">
                {activeView === 'dashboard' && renderDashboard()}
                {activeView === 'myCreations' && renderMyCreations()}
                {(activeView === 'newCreation' || activeView === 'editCreation') && renderCreationForm()}
                {activeView === 'creators' && userType === 'agency' && (
                  <div className="text-center p-12 bg-gray-50 rounded-lg">
                    <Building2 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Creator Management</h2>
                    <p className="text-gray-600 mb-6">
                      Connect with creators and manage rights assignments
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" /> Add Creator
                      </Button>
                      <Button variant="outline">
                        <User className="h-4 w-4 mr-2" /> View Creators
                      </Button>
                    </div>
                  </div>
                )}
                {activeView === 'settings' && (
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" defaultValue={currentUser?.name} />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" defaultValue={currentUser?.email} />
                            </div>
                          </div>
                          <Button className="mt-4">Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
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
                          <Button className="mt-4">Update Password</Button>
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