import { useState, useEffect } from 'react';
import PersonalizationService from '../../services/PersonalizationService';

const PersonalizedItinerary = ({ guestId, eventData = {} }) => {
  const [itinerary, setItinerary] = useState(null);
  const [itineraryList, setItineraryList] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [editingItinerary, setEditingItinerary] = useState(null);

  useEffect(() => {
    loadItineraries();
  }, [guestId]);

  const loadItineraries = () => {
    const itins = PersonalizationService.getGuestItineraries(guestId);
    setItineraryList(itins);
    if (itins.length > 0) {
      setItinerary(itins[0]);
    }
  };

  const createNewItinerary = () => {
    const newItin = PersonalizationService.createItinerary(guestId, {
      name: `${new Date().toLocaleDateString()} Itinerary`,
      isPublic: false,
    });
    setItineraryList([newItin, ...itineraryList]);
    setItinerary(newItin);
  };

  const addCustomEvent = () => {
    if (!itinerary || !newEventName || !newEventTime) return;

    PersonalizationService.addCustomEvent(itinerary.id, {
      title: newEventName,
      date: new Date().toISOString().split('T')[0],
      time: newEventTime,
      category: 'personal',
    });

    setNewEventName('');
    setNewEventTime('');
    loadItineraries();
  };

  if (!itinerary) {
    return (
      <div className="itinerary-view">
        <div className="empty-state">
          <p>No itinerary yet. Create one to get started!</p>
          <button className="btn-primary" onClick={createNewItinerary}>
            ➕ Create New Itinerary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="itinerary-view">
      <div className="view-header">
        <h2>📝 My Itinerary</h2>
        <p>Plan your perfect event experience</p>
      </div>

      <div className="itinerary-selector">
        {itineraryList.map(itin => (
          <button
            key={itin.id}
            className={`itinerary-tab ${itinerary.id === itin.id ? 'active' : ''}`}
            onClick={() => setItinerary(itin)}
          >
            {itin.name}
          </button>
        ))}
        <button className="btn-new" onClick={createNewItinerary}>
          ➕ New
        </button>
      </div>

      <div className="itinerary-content">
        {/* Add Custom Event */}
        <div className="add-event-form">
          <h3>🎯 Add Custom Event</h3>
          <div className="form-row">
            <input
              type="text"
              value={newEventName}
              onChange={e => setNewEventName(e.target.value)}
              placeholder="Event name"
            />
            <input
              type="time"
              value={newEventTime}
              onChange={e => setNewEventTime(e.target.value)}
            />
            <button onClick={addCustomEvent} className="btn-add">
              Add
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="itinerary-timeline">
          {itinerary.customEvents && itinerary.customEvents.length > 0 ? (
            itinerary.customEvents.map(event => (
              <div key={event.id} className="timeline-event">
                <div className="event-time">{event.time}</div>
                <div className="event-content">
                  <h4>{event.title}</h4>
                  {event.description && <p>{event.description}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-timeline">No events added yet</p>
          )}
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h3>📤 Export</h3>
          <button className="btn-export">
            📥 Download Calendar (.ics)
          </button>
          <button className="btn-share">
            🔗 Share Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedItinerary;
