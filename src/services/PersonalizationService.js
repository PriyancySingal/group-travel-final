/**
 * Personalization Service
 * Handles guest itinerary customization, activity recommendations, and preferences
 */

class PersonalizationService {
  constructor() {
    this.guestPreferences = new Map();
    this.customItineraries = new Map();
    this.activitySignups = new Map();
    this.recommendations = new Map();
    this.interests = [];
  }

  /**
   * GUEST PREFERENCES
   */

  /**
   * Initialize guest preferences
   */
  initializePreferences(guestId, initialPrefs = {}) {
    const preferences = {
      guestId,
      interests: initialPrefs.interests || [],
      dietaryRestrictions: initialPrefs.dietaryRestrictions || [],
      mobilityNeeds: initialPrefs.mobilityNeeds || null,
      activityLevel: initialPrefs.activityLevel || 'moderate', // 'low', 'moderate', 'high'
      socialPreference: initialPrefs.socialPreference || 'mixed', // 'solo', 'small-group', 'large-group', 'mixed'
      budget: initialPrefs.budget || 'moderate',
      language: initialPrefs.language || 'english',
      timezone: initialPrefs.timezone || 'UTC',
      notificationPreference: initialPrefs.notificationPreference || 'all', // 'all', 'important', 'none'
      updatedAt: new Date(),
    };

    this.guestPreferences.set(guestId, preferences);
    return preferences;
  }

  /**
   * Update guest preferences
   */
  updatePreferences(guestId, updates) {
    let prefs = this.guestPreferences.get(guestId);
    if (!prefs) {
      prefs = this.initializePreferences(guestId);
    }

    Object.assign(prefs, updates);
    prefs.updatedAt = new Date();
    this.guestPreferences.set(guestId, prefs);

    return prefs;
  }

  /**
   * Get guest preferences
   */
  getPreferences(guestId) {
    return this.guestPreferences.get(guestId) || this.initializePreferences(guestId);
  }

  /**
   * CUSTOM ITINERARIES
   */

  /**
   * Create custom itinerary for guest
   */
  createItinerary(guestId, itineraryData) {
    const itinerary = {
      id: `itinerary-${guestId}-${Date.now()}`,
      guestId,
      name: itineraryData.name || `${new Date().toLocaleDateString()} Itinerary`,
      description: itineraryData.description || '',
      events: {}, // { eventId: { date, time, confirmed: boolean, notes: '' } }
      activities: {}, // { activityId: { date, time, category, notes: '' } }
      meals: {}, // { mealId: { date, time, type, location } }
      customEvents: [], // User-added custom activities
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: itineraryData.isPublic || false,
      theme: itineraryData.theme || 'default',
    };

    this.customItineraries.set(itinerary.id, itinerary);
    return itinerary;
  }

  /**
   * Add activity to itinerary
   */
  addActivityToItinerary(itineraryId, activityId, scheduleData) {
    const itinerary = this.customItineraries.get(itineraryId);
    if (!itinerary) return null;

    itinerary.activities[activityId] = {
      activityId,
      date: scheduleData.date,
      time: scheduleData.time,
      category: scheduleData.category || 'general',
      notes: scheduleData.notes || '',
      status: 'added', // 'added', 'confirmed', 'completed'
    };

    itinerary.updatedAt = new Date();
    return itinerary;
  }

  /**
   * Remove activity from itinerary
   */
  removeActivityFromItinerary(itineraryId, activityId) {
    const itinerary = this.customItineraries.get(itineraryId);
    if (!itinerary) return null;

    delete itinerary.activities[activityId];
    itinerary.updatedAt = new Date();
    return itinerary;
  }

  /**
   * Add custom event to itinerary
   */
  addCustomEvent(itineraryId, customEventData) {
    const itinerary = this.customItineraries.get(itineraryId);
    if (!itinerary) return null;

    const customEvent = {
      id: `custom-${Date.now()}`,
      title: customEventData.title,
      date: customEventData.date,
      time: customEventData.time,
      duration: customEventData.duration || '1 hour',
      location: customEventData.location || '',
      description: customEventData.description || '',
      category: customEventData.category || 'personal',
      reminder: customEventData.reminder || null, // minutes before
    };

    itinerary.customEvents.push(customEvent);
    itinerary.updatedAt = new Date();
    return customEvent;
  }

  /**
   * Get guest itinerary
   */
  getItinerary(itineraryId) {
    return this.customItineraries.get(itineraryId) || null;
  }

  /**
   * Get all itineraries for guest
   */
  getGuestItineraries(guestId) {
    return Array.from(this.customItineraries.values()).filter(
      it => it.guestId === guestId
    );
  }

  /**
   * Get itinerary conflicts and suggestions
   */
  analyzeItinerary(itineraryId) {
    const itinerary = this.customItineraries.get(itineraryId);
    if (!itinerary) return null;

    const allEvents = [
      ...Object.values(itinerary.activities).map(a => ({
        id: a.activityId,
        time: a.time,
        date: a.date,
        type: 'activity',
      })),
      ...itinerary.customEvents.map(e => ({
        id: e.id,
        time: e.time,
        date: e.date,
        type: 'custom',
      })),
    ];

    const issues = [];
    const suggestions = [];

    // Check for overlaps
    for (let i = 0; i < allEvents.length; i++) {
      for (let j = i + 1; j < allEvents.length; j++) {
        if (this.hasTimeConflict(allEvents[i], allEvents[j])) {
          issues.push({
            type: 'overlap',
            events: [allEvents[i].id, allEvents[j].id],
            message: `${allEvents[i].id} overlaps with ${allEvents[j].id}`,
          });
        }
      }
    }

    // Check for tight schedule
    const eventsByDate = {};
    allEvents.forEach(e => {
      if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
      eventsByDate[e.date].push(e);
    });

    Object.entries(eventsByDate).forEach(([date, events]) => {
      if (events.length > 4) {
        suggestions.push({
          type: 'packed-day',
          date,
          message: `You have ${events.length} events on ${date}. Consider spreading them out for better pacing.`,
        });
      }
    });

    return {
      itineraryId,
      issues,
      suggestions,
      totalEvents: allEvents.length,
      isOptimal: issues.length === 0 && suggestions.length === 0,
    };
  }

  /**
   * Check if two events have time conflict
   */
  hasTimeConflict(event1, event2) {
    if (event1.date !== event2.date) return false;

    const time1 = this.parseTime(event1.time);
    const time2 = this.parseTime(event2.time);

    if (!time1 || !time2) return false;

    // Assume each activity is 1 hour
    const end1 = time1.getTime() + 60 * 60 * 1000;
    const end2 = time2.getTime() + 60 * 60 * 1000;

    return (
      (time1 >= time2 && time1 < end2) ||
      (time2 >= time1 && time2 < end1)
    );
  }

  /**
   * Parse time string
   */
  parseTime(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  }

  /**
   * ACTIVITY SIGNUPS
   */

  /**
   * Sign up guest for activity
   */
  signUpForActivity(guestId, activityId, signupData = {}) {
    const signup = {
      id: `signup-${guestId}-${activityId}-${Date.now()}`,
      guestId,
      activityId,
      signupDate: new Date(),
      status: 'confirmed', // 'pending', 'confirmed', 'attended', 'cancelled'
      groupSize: signupData.groupSize || 1,
      specialRequests: signupData.specialRequests || '',
      dietaryRestrictions: signupData.dietaryRestrictions || [],
      notes: signupData.notes || '',
    };

    if (!this.activitySignups.has(activityId)) {
      this.activitySignups.set(activityId, []);
    }

    this.activitySignups.get(activityId).push(signup);
    return signup;
  }

  /**
   * Cancel activity signup
   */
  cancelSignup(signupId) {
    let found = false;
    this.activitySignups.forEach(signups => {
      const signup = signups.find(s => s.id === signupId);
      if (signup) {
        signup.status = 'cancelled';
        found = true;
      }
    });
    return found;
  }

  /**
   * Get guest's activity signups
   */
  getGuestSignups(guestId) {
    const signups = [];
    this.activitySignups.forEach(actSignups => {
      signups.push(...actSignups.filter(s => s.guestId === guestId));
    });
    return signups;
  }

  /**
   * Get activity participants
   */
  getActivityParticipants(activityId) {
    return this.activitySignups.get(activityId) || [];
  }

  /**
   * RECOMMENDATIONS
   */

  /**
   * Generate activity recommendations for guest
   */
  generateRecommendations(guestId, availableActivities) {
    const prefs = this.getPreferences(guestId);
    const signups = this.getGuestSignups(guestId);
    const signedUpIds = new Set(signups.map(s => s.activityId));

    const recommendations = availableActivities
      .filter(activity => !signedUpIds.has(activity.id))
      .map(activity => {
        let score = 50; // Base score

        // Interest matching
        if (prefs.interests.length > 0) {
          const matchedInterests = prefs.interests.filter(interest =>
            activity.tags?.includes(interest) || activity.category?.includes(interest)
          );
          score += matchedInterests.length * 20;
        }

        // Activity level matching
        if (activity.level === prefs.activityLevel) {
          score += 15;
        } else if (
          (prefs.activityLevel === 'low' && activity.level === 'low') ||
          (prefs.activityLevel === 'high' && activity.level === 'high')
        ) {
          score += 10;
        }

        // Group size preference
        if (activity.maxParticipants) {
          if (prefs.socialPreference === 'large-group' && activity.maxParticipants > 20) {
            score += 10;
          } else if (prefs.socialPreference === 'small-group' && activity.maxParticipants <= 10) {
            score += 10;
          }
        }

        // Budget matching
        if (activity.cost === prefs.budget) {
          score += 10;
        }

        // Dietary accommodation
        if (activity.provideMeals && activity.dietaryOptions?.includes('vegetarian')) {
          if (prefs.dietaryRestrictions.includes('vegetarian')) {
            score += 10;
          }
        }

        return {
          activityId: activity.id,
          name: activity.name,
          description: activity.description,
          category: activity.category,
          matchScore: Math.min(100, score),
          reasons: this.getMatchReasons(activity, prefs),
          activity,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    this.recommendations.set(guestId, recommendations);
    return recommendations;
  }

  /**
   * Get match reasons for recommendation
   */
  getMatchReasons(activity, prefs) {
    const reasons = [];

    if (prefs.interests.some(i => activity.tags?.includes(i))) {
      reasons.push('Matches your interests');
    }

    if (activity.level === prefs.activityLevel) {
      reasons.push('Matches your activity level');
    }

    if (activity.maxParticipants > 15 && prefs.socialPreference !== 'solo') {
      reasons.push('Great for group participation');
    }

    if (!activity.cost || activity.cost === 'free') {
      reasons.push('No additional cost');
    }

    return reasons.slice(0, 3);
  }

  /**
   * Get recommendations for guest
   */
  getRecommendations(guestId, limit = 5) {
    const recs = this.recommendations.get(guestId) || [];
    return recs.slice(0, limit);
  }

  /**
   * SCHEDULE EXPORT
   */

  /**
   * Export itinerary as ICS (calendar format)
   */
  exportAsICS(itineraryId) {
    const itinerary = this.customItineraries.get(itineraryId);
    if (!itinerary) return null;

    const events = [];
    const allEvents = [
      ...Object.values(itinerary.activities),
      ...itinerary.customEvents,
    ];

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Group Travel//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${itinerary.name}
X-WR-TIMEZONE:UTC
`;

    allEvents.forEach(event => {
      icsContent += `BEGIN:VEVENT
UID:${event.id}@grouptravel.com
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${this.formatICSDate(new Date(event.date + ' ' + event.time))}
SUMMARY:${event.title || event.activityId}
DESCRIPTION:${event.description || event.notes || ''}
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';
    return icsContent;
  }

  /**
   * Format date for ICS
   */
  formatICSDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  /**
   * STATISTICS
   */

  /**
   * Get personalization statistics
   */
  getPersonalizationStats() {
    const guests = Array.from(this.guestPreferences.values());
    const signups = Array.from(this.activitySignups.values()).flat();

    return {
      totalGuestsWithPrefs: guests.length,
      totalItineraries: this.customItineraries.size,
      totalSignups: signups.length,
      avgSignupsPerGuest: guests.length
        ? (signups.length / guests.length).toFixed(1)
        : 0,
      signupsByStatus: {
        confirmed: signups.filter(s => s.status === 'confirmed').length,
        attended: signups.filter(s => s.status === 'attended').length,
        cancelled: signups.filter(s => s.status === 'cancelled').length,
      },
      popularInterests: this.getPopularInterests(),
      preferredActivityLevels: this.getActivityLevelDistribution(),
    };
  }

  /**
   * Get popular interests
   */
  getPopularInterests() {
    const interestCounts = {};
    this.guestPreferences.forEach(prefs => {
      prefs.interests.forEach(interest => {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      });
    });

    return Object.entries(interestCounts)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Get activity level distribution
   */
  getActivityLevelDistribution() {
    const distribution = { low: 0, moderate: 0, high: 0, unknown: 0 };
    this.guestPreferences.forEach(prefs => {
      distribution[prefs.activityLevel] = (distribution[prefs.activityLevel] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Reset all data (for testing)
   */
  reset() {
    this.guestPreferences.clear();
    this.customItineraries.clear();
    this.activitySignups.clear();
    this.recommendations.clear();
  }
}

// Export singleton instance
export default new PersonalizationService();
