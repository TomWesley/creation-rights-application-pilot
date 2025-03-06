import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useAppContext } from '../../contexts/AppContext';

const CreationForm = () => {
  const { 
    editMode, 
    currentCreation, 
    currentFolder, 
    breadcrumbs,
    folders,
    handleInputChange,
    handleTagInput,
    removeTag,
    resetForm,
    handleSubmit,
    buildBreadcrumbs,
    setActiveView
  } = useAppContext();
  
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

export default CreationForm;