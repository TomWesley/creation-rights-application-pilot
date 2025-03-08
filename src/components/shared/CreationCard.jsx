// src/components/shared/CreationCard.jsx

import React from 'react';
import { Edit, Trash2, FileText, ImageIcon, Music, Video, Code, ExternalLink, Youtube } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAppContext } from '../../contexts/AppContext';

const CreationCard = ({ creation }) => {
  const { handleEdit, handleDelete } = useAppContext();

  // Get icon for creation type
  const getCreationTypeIcon = (type, source) => {
    // If it's from YouTube, use the YouTube icon
    if (source === 'YouTube') {
      return <Youtube className="creation-type-icon text-red-500" />;
    }
    
    // Otherwise use the normal type icons
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
  
  // Determine if this is a YouTube video
  const isYouTubeVideo = creation.source === 'YouTube';
  
  return (
    <Card className="creation-card">
      <div className="creation-content">
        {/* YouTube videos show the thumbnail */}
        {isYouTubeVideo && creation.thumbnailUrl ? (
          <div className="creation-thumbnail" style={{ width: '160px', minWidth: '160px' }}>
            <img 
              src={creation.thumbnailUrl} 
              alt={creation.title} 
              className="w-full h-full object-cover"
              style={{ height: '90px' }}
            />
          </div>
        ) : null}
        
        <div className="creation-info-sidebar">
          <div>
            {getCreationTypeIcon(creation.type, creation.source)}
          </div>
          <div className="creation-meta">
            <p className="creation-title">{creation.title}</p>
            <p className="creation-date">{creation.dateCreated}</p>
            
            {isYouTubeVideo && creation.sourceUrl && (
              <a 
                href={creation.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs flex items-center text-blue-600 hover:underline mt-1"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> View on YouTube
              </a>
            )}
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
              
              {isYouTubeVideo && (
                <span className="tag bg-red-100 text-red-700">
                  YouTube
                </span>
              )}
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
          
          {isYouTubeVideo && creation.sourceUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(creation.sourceUrl, '_blank')}
              className="view-button"
            >
              <ExternalLink className="button-icon-small" /> View
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CreationCard;