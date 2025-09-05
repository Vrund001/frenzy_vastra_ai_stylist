import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SessionContextIndicator = ({ 
  currentSession = null, 
  hasActiveAnalysis = false,
  analysisProgress = 0,
  onViewResults 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // Don't show on admin pages
  if (location?.pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewResults = () => {
    if (onViewResults) {
      onViewResults();
    }
    setIsExpanded(false);
  };

  // Show analysis progress
  if (hasActiveAnalysis && analysisProgress < 100) {
    return (
      <div className="fixed top-20 right-4 z-90 bg-surface border border-border rounded-lg shadow-modal p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} color="var(--color-accent)" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">Analyzing your style...</p>
            <div className="mt-2 bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">{analysisProgress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  // Show session results indicator
  if (currentSession) {
    return (
      <div className="fixed top-20 right-4 z-90">
        <div className="bg-surface border border-border rounded-lg shadow-modal overflow-hidden">
          {/* Collapsed State */}
          <div className="flex items-center p-3">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-primary">Style Analysis Complete</p>
                <p className="text-xs text-text-secondary">
                  {currentSession?.recommendationCount || 0} recommendations found
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to="/style-recommendations">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  View Results
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="sm:hidden"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
              </Button>
            </div>
          </div>

          {/* Expanded State (Mobile) */}
          {isExpanded && (
            <div className="border-t border-border p-3 sm:hidden">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-primary">Style Analysis Complete</p>
                  <p className="text-xs text-text-secondary">
                    {currentSession?.recommendationCount || 0} recommendations found
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Link to="/style-recommendations" className="flex-1">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={handleViewResults}
                    >
                      <Icon name="Eye" size={16} className="mr-2" />
                      View Results
                    </Button>
                  </Link>
                  
                  <Link to="/user-session-history">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                    >
                      <Icon name="Clock" size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show quick access when no active session
  if (location?.pathname !== '/photo-upload-analysis') {
    return (
      <div className="fixed top-20 right-4 z-90">
        <Link to="/photo-upload-analysis">
          <Button 
            variant="default" 
            className="shadow-modal hover-scale"
            iconName="Camera"
            iconPosition="left"
          >
            <span className="hidden sm:inline">Get Styled</span>
            <span className="sm:hidden">Style Me</span>
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

export default SessionContextIndicator;