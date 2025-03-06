import React from 'react';
import { Edit, Trash2, FileText, ImageIcon, Music, Video, Code } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAppContext } from '../../contexts/AppContext';

const CreationCard = ({ creation }) => {
  const { handleEdit, handleDelete } = useAppContext();

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
  
  return (
    <Card className="creation-card">
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
  );
};

export default CreationCard;