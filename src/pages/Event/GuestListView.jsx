import { useState } from 'react';

const GuestListView = ({ guestId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sample guest list
  const allGuests = [
    {
      id: 'guest-2',
      name: 'Sarah Anderson',
      location: 'New York, USA',
      interests: ['Adventure', 'Photography', 'Culture'],
      bio: 'Travel enthusiast and photographer',
      engagementScore: 85,
      online: true,
    },
    {
      id: 'guest-3',
      name: 'Marcus Johnson',
      location: 'London, UK',
      interests: ['Networking', 'Business', 'Food'],
      bio: 'Always looking to connect and explore',
      engagementScore: 72,
      online: true,
    },
    {
      id: 'guest-4',
      name: 'Elena Rodriguez',
      location: 'Barcelona, Spain',
      interests: ['Culture', 'Art', 'Wine Tasting'],
      bio: 'Art curator and wine lover',
      engagementScore: 65,
      online: false,
    },
  ];

  const filteredGuests = allGuests.filter(guest => {
    if (guestId === guest.id) return false; // Don't show self
    if (searchQuery && !guest.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter === 'online' && !guest.online) return false;
    return true;
  });

  const handleConnect = (guest) => {
    // Handle connection/messaging
    alert(`Contact request sent to ${guest.name}`);
  };

  return (
    <div className="guest-list-view">
      <div className="view-header">
        <h2>👥 Guest Directory</h2>
        <p>Meet and connect with fellow attendees</p>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search guests by name or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({allGuests.length - 1})
          </button>
          <button
            className={`filter-btn ${filter === 'online' ? 'active' : ''}`}
            onClick={() => setFilter('online')}
          >
            Online ({allGuests.filter(g => g.online).length})
          </button>
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="guests-grid">
        {filteredGuests.length > 0 ? (
          filteredGuests.map(guest => (
            <div key={guest.id} className="guest-card">
              <div className="guest-header">
                <div className="guest-avatar">
                  {guest.online && <div className="online-indicator" />}
                  <div className="avatar-letter">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="guest-name-info">
                  <h3>{guest.name}</h3>
                  <p className="location">📍 {guest.location}</p>
                  {guest.online && <span className="online-status">🟢 Online</span>}
                </div>
              </div>

              <p className="guest-bio">{guest.bio}</p>

              <div className="guest-interests">
                <strong>Interests:</strong>
                <div className="interests-tags">
                  {guest.interests.map(interest => (
                    <span key={interest} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="guest-stats">
                <div className="stat">
                  <span className="stat-value">⭐ {guest.engagementScore}</span>
                  <span className="stat-label">Engagement</span>
                </div>
              </div>

              <div className="guest-actions">
                <button className="btn-connect" onClick={() => handleConnect(guest)}>
                  💬 Connect
                </button>
                <button
                  className="btn-view"
                  onClick={() => setSelectedGuest(guest)}
                >
                  👁️ View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-guests">
            <p>No guests found matching your search</p>
          </div>
        )}
      </div>

      {/* Guest Profile Modal */}
      {selectedGuest && (
        <div className="modal-overlay" onClick={() => setSelectedGuest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedGuest(null)}>
              ✕
            </button>
            <div className="profile-detail">
              <h2>{selectedGuest.name}</h2>
              <p className="location">📍 {selectedGuest.location}</p>
              <p className="bio">{selectedGuest.bio}</p>
              <div className="interests-detail">
                <strong>Interests:</strong>
                {selectedGuest.interests.map(i => (
                  <span key={i} className="tag">{i}</span>
                ))}
              </div>
              <button className="btn-message" onClick={() => handleConnect(selectedGuest)}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestListView;
