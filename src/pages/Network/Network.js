import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PrimaryButton, IconButton } from '../../general/buttons';
import NetworkStats from '../../general/network/NetworkStats/NetworkStats';
import ContactCard from '../../general/network/ContactCard/ContactCard';
import AddContactModal from '../../general/network/AddContactModal/AddContactModal';
import { networkAPI } from '../../services/api';
import './Network.css';

const Network = () => {
  // Consolidated state for better management
  const [state, setState] = useState({
    contacts: [],
    stats: {},
    loading: true,
    searchLoading: false,
    showAddContactModal: false,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    filters: {
      type: 'all',     // all, platform, manual
      search: ''       // search query
    }
  });
  
  const contactsPerPage = 16;
  const debounceTimeoutRef = useRef(null);

  // Memoized derived values
  const { contacts, stats, loading, searchLoading, showAddContactModal, 
          currentPage, totalPages, hasNext, hasPrevious, filters } = state;

  // Enhanced contacts loading with debouncing and improved state management
  const loadContacts = useCallback(async (page = 1, searchQuery = '', filterType = 'all') => {
    try {
      const isSearching = searchQuery.trim().length > 0;
      
      setState(prev => ({
        ...prev,
        [isSearching ? 'searchLoading' : 'loading']: true
      }));

      // Map filter type to backend parameter
      const backendFilterType = filterType === 'all' ? null : filterType;

      const response = await networkAPI.getContacts({
        page: page,
        page_size: contactsPerPage,
        sort: 'alphabetical',
        filter_type: backendFilterType,
        search: searchQuery
      });
      
      if (response.data.success) {
        const { contacts: newContacts, stats: newStats, pagination } = response.data.data;
        
        setState(prev => ({
          ...prev,
          contacts: newContacts || [],
          stats: newStats || {},
          hasNext: pagination?.has_next || false,
          hasPrevious: pagination?.has_previous || false,
          totalPages: pagination?.total_pages || 1,
          currentPage: pagination?.current_page || page,
          loading: false,
          searchLoading: false
        }));
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        searchLoading: false
      }));
    }
  }, [contactsPerPage]);

  // Initial load
  useEffect(() => {
    loadContacts(currentPage, filters.search, filters.type);
  }, [loadContacts, currentPage, filters.search, filters.type]);

  // Handle filter changes from NetworkStats
  const handleStatsFilter = useCallback((filterType) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, type: filterType },
      currentPage: 1
    }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setState(prev => ({ ...prev, currentPage: newPage }));
  }, []);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((e) => {
    const searchValue = e.target.value;
    
    // Update search input immediately for responsiveness
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, search: searchValue }
    }));

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for API call
    debounceTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, currentPage: 1 }));
    }, 300); // 300ms debounce
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle contact actions
  const handleConnectRequest = useCallback((contact) => {
    console.log('Send connection request to:', contact);
    // TODO: Implement connection request
  }, []);

  const handleMessage = useCallback((contact) => {
    console.log('Message contact:', contact);
    // TODO: Implement messaging
  }, []);

  const handleContactAdded = useCallback((newContact) => {
    setState(prev => ({ ...prev, showAddContactModal: false }));
    // Reload contacts to get updated data from backend
    loadContacts(1, filters.search, filters.type);
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, [loadContacts, filters.search, filters.type]);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page context, and last page
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="network-page">
        <div className="network-header">
          <h1>My Network</h1>
        </div>
        <div className="network-loading">
          <p>Loading your network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="network-page">
      {/* Page Header */}
      <div className="network-header">
        <div className="network-header__content">
          <h1>My Network</h1>
          <p className="network-subtitle">Manage your professional connections and contacts</p>
        </div>
        <div className="network-header__actions">
          <PrimaryButton onClick={() => setState(prev => ({ ...prev, showAddContactModal: true }))}>
            Add Contact
          </PrimaryButton>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="network-stats-section">
        <NetworkStats 
          stats={stats}  // Now uses standardized stats directly from backend
          size="full"
          interactive={true}
          activeFilter={filters.type}
          onFilterChange={handleStatsFilter}
        />
      </div>

      {/* Search and Filters Section */}
      <div className="network-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search contacts by name, email, or phone..."
            value={filters.search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        {/* Results Info */}
        {(filters.search || filters.type !== 'all') && (
          <div className="filter-results-info">
            <p>
              {searchLoading ? 'Searching...' : 
                `Showing ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`
              }
              {filters.search && ` matching "${filters.search}"`}
              {filters.type !== 'all' && ` (${filters.type} contacts)`}
            </p>
          </div>
        )}
      </div>

      {/* Contacts Grid */}
      <div className="network-content">
        {searchLoading ? (
          <div className="network-loading">
            <p>Searching contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="network-empty-state">
            <h3>No contacts found</h3>
            <p>
              {filters.search ? 
                `No contacts match "${filters.search}"` : 
                'Start building your network by adding contacts'
              }
            </p>              <PrimaryButton onClick={() => setState(prev => ({ ...prev, showAddContactModal: true }))}>
                Add Your First Contact
              </PrimaryButton>
          </div>
        ) : (
          <>
            <div className="contacts-grid">
              {contacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onConnect={handleConnectRequest}
                  onMessage={handleMessage}
                />
              ))}
            </div>
            
            {/* Numbered Pagination */}
            {totalPages > 1 && (
              <div className="pagination-section">
                <div className="pagination">
                  {/* Previous Button */}
                  <button
                    className={`pagination-btn ${!hasPrevious ? 'disabled' : ''}`}
                    onClick={() => hasPrevious && handlePageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="pagination-numbers">
                    {generatePageNumbers().map((page, index) => (
                      <button
                        key={index}
                        className={`pagination-number ${
                          page === currentPage ? 'active' : ''
                        } ${page === '...' ? 'ellipsis' : ''}`}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    className={`pagination-btn ${!hasNext ? 'disabled' : ''}`}
                    onClick={() => hasNext && handlePageChange(currentPage + 1)}
                    disabled={!hasNext}
                  >
                    Next →
                  </button>
                </div>
                
                {/* Page Info */}
                <div className="pagination-info">
                  <p>
                    Page {currentPage} of {totalPages} 
                    ({stats.total || 0} total contacts)
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddContactModal}
        onClose={() => setState(prev => ({ ...prev, showAddContactModal: false }))}
        onContactAdded={handleContactAdded}
      />
    </div>
  );
};

export default Network;
