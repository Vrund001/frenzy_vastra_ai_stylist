import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionContextIndicator from '../../components/ui/SessionContextIndicator';
import SessionFilters from './components/SessionFilters';
import SessionTimeline from './components/SessionTimeline';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';

import Button from '../../components/ui/Button';

const UserSessionHistory = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    occasion: 'all',
    status: 'all',
    sortBy: 'date_desc',
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Mock session data
  const mockSessions = [
    {
      id: 'session_001',
      uploadDate: new Date('2025-01-02T10:30:00'),
      photoThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      occasion: 'Office',
      status: 'completed',
      bodyType: 'Athletic',
      recommendedSize: 'M',
      productCount: 12,
      topMatches: [
        {
          id: 'prod_001',
          name: 'Classic White Dress Shirt',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop',
          price: 49.99
        },
        {
          id: 'prod_002',
          name: 'Navy Blue Polo',
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=150&h=150&fit=crop',
          price: 39.99
        },
        {
          id: 'prod_003',
          name: 'Light Blue Oxford',
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&h=150&fit=crop',
          price: 54.99
        }
      ]
    },
    {
      id: 'session_002',
      uploadDate: new Date('2025-01-01T15:45:00'),
      photoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      occasion: 'Casual',
      status: 'completed',
      bodyType: 'Slim',
      recommendedSize: 'S',
      productCount: 8,
      topMatches: [
        {
          id: 'prod_004',
          name: 'Vintage Graphic Tee',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop',
          price: 24.99
        },
        {
          id: 'prod_005',
          name: 'Striped Long Sleeve',
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=150&h=150&fit=crop',
          price: 32.99
        }
      ]
    },
    {
      id: 'session_003',
      uploadDate: new Date('2024-12-30T09:15:00'),
      photoThumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      occasion: 'Party',
      status: 'failed',
      errorMessage: 'Photo quality too low for accurate analysis',
      bodyType: null,
      recommendedSize: null,
      productCount: 0,
      topMatches: []
    },
    {
      id: 'session_004',
      uploadDate: new Date('2024-12-28T14:20:00'),
      photoThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      occasion: 'Sports',
      status: 'completed',
      bodyType: 'Muscular',
      recommendedSize: 'L',
      productCount: 15,
      topMatches: [
        {
          id: 'prod_006',
          name: 'Performance Athletic Tee',
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&h=150&fit=crop',
          price: 29.99
        },
        {
          id: 'prod_007',
          name: 'Moisture-Wicking Tank',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop',
          price: 34.99
        }
      ]
    },
    {
      id: 'session_005',
      uploadDate: new Date('2024-12-25T11:00:00'),
      photoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      occasion: 'Wedding/Festival',
      status: 'completed',
      bodyType: 'Regular',
      recommendedSize: 'M',
      productCount: 6,
      topMatches: [
        {
          id: 'prod_008',
          name: 'Formal White Shirt',
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=150&h=150&fit=crop',
          price: 69.99
        }
      ]
    }
  ];

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load sessions
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSessions(mockSessions);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...sessions];

    // Search filter
    if (filters?.search?.trim()) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(session => 
        session?.occasion?.toLowerCase()?.includes(searchTerm) ||
        new Date(session.uploadDate)?.toLocaleDateString()?.includes(searchTerm)
      );
    }

    // Occasion filter
    if (filters?.occasion !== 'all') {
      filtered = filtered?.filter(session => 
        session?.occasion?.toLowerCase() === filters?.occasion?.toLowerCase()
      );
    }

    // Status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(session => session?.status === filters?.status);
    }

    // Date range filter
    if (filters?.dateRange?.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered?.filter(session => 
        new Date(session.uploadDate) >= startDate
      );
    }

    if (filters?.dateRange?.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(session => 
        new Date(session.uploadDate) <= endDate
      );
    }

    // Sort
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date_asc':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'date_desc':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'occasion':
          return a?.occasion?.localeCompare(b?.occasion);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedSessions([]);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      occasion: 'all',
      status: 'all',
      sortBy: 'date_desc',
      dateRange: {
        start: '',
        end: ''
      }
    });
    setSelectedSessions([]);
  };

  const handleReanalyze = (session) => {
    // Navigate to photo upload with session data
    navigate('/photo-upload-analysis', { 
      state: { 
        reanalyzeSession: session 
      } 
    });
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      setSessions(prev => prev?.filter(s => s?.id !== sessionId));
      setSelectedSessions(prev => prev?.filter(id => id !== sessionId));
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleViewRecommendations = (session) => {
    navigate('/style-recommendations', { 
      state: { 
        sessionData: session 
      } 
    });
  };

  const handleSelectAll = () => {
    setSelectedSessions(filteredSessions?.map(s => s?.id));
  };

  const handleDeselectAll = () => {
    setSelectedSessions([]);
  };

  const handleBulkDelete = async (sessionIds) => {
    try {
      setSessions(prev => prev?.filter(s => !sessionIds?.includes(s?.id)));
      setSelectedSessions([]);
    } catch (error) {
      console.error('Failed to bulk delete sessions:', error);
    }
  };

  const hasActiveFilters = () => {
    return filters?.occasion !== 'all' || 
           filters?.status !== 'all' || 
           filters?.search?.trim() !== '' ||
           filters?.dateRange?.start || 
           filters?.dateRange?.end;
  };

  const isAllSelected = selectedSessions?.length === filteredSessions?.length && filteredSessions?.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SessionContextIndicator onViewResults={() => navigate('/style-recommendations')} />
        
        <main className="pt-20 pb-8">
          <div className="max-w-6xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading your session history...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionContextIndicator onViewResults={() => navigate('/style-recommendations')} />
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                Session History
              </h1>
              <p className="text-text-secondary">
                Review your previous photo analyses and style recommendations
              </p>
            </div>
            
            <Button
              variant="default"
              onClick={() => navigate('/photo-upload-analysis')}
              iconName="Plus"
              iconPosition="left"
              className="hidden sm:flex"
            >
              New Analysis
            </Button>
          </div>

          {sessions?.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <>
              <SessionFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                resultCount={filteredSessions?.length}
              />

              <BulkActions
                selectedSessions={selectedSessions}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkDelete={handleBulkDelete}
                totalSessions={filteredSessions?.length}
                isAllSelected={isAllSelected}
              />

              {filteredSessions?.length === 0 ? (
                <EmptyState 
                  hasFilters={hasActiveFilters()} 
                  onClearFilters={handleClearFilters}
                />
              ) : (
                <SessionTimeline
                  sessions={filteredSessions}
                  onReanalyze={handleReanalyze}
                  onDelete={handleDeleteSession}
                  onViewRecommendations={handleViewRecommendations}
                  isMobile={isMobile}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserSessionHistory;