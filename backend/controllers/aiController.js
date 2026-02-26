import Guest from '../models/Guest.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// Calculate similarity score between two guests
const calculateSimilarity = (guest1, guest2) => {
  let score = 0;
  let factors = 0;

  // Dietary similarity (40% weight)
  const diet1 = guest1.dietaryRequirements || [];
  const diet2 = guest2.dietaryRequirements || [];
  const dietMatch = diet1.filter(d => diet2.includes(d)).length;
  const dietSimilarity = diet1.length + diet2.length > 0 
    ? (dietMatch * 2) / (diet1.length + diet2.length) 
    : 1;
  score += dietSimilarity * 0.4;
  factors += 0.4;

  // Interests similarity (40% weight)
  const int1 = guest1.interests || [];
  const int2 = guest2.interests || [];
  const intMatch = int1.filter(i => int2.includes(i)).length;
  const intSimilarity = int1.length + int2.length > 0 
    ? (intMatch * 2) / (int1.length + int2.length) 
    : 1;
  score += intSimilarity * 0.4;
  factors += 0.4;

  // Accessibility compatibility (20% weight)
  const access1 = guest1.wheelchairAccessible || guest1.mobilityAssistance;
  const access2 = guest2.wheelchairAccessible || guest2.mobilityAssistance;
  if (access1 === access2) {
    score += 0.2;
  }
  factors += 0.2;

  return factors > 0 ? score / factors * 100 : 0;
};

// @desc    AI-powered guest matching
// @route   POST /api/ai/guest-matching
// @access  Private
export const guestMatching = asyncHandler(async (req, res) => {
  const { eventId, bookingId, limit } = req.body;

  let query = {};
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }
  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;

  const guests = await Guest.find(query);

  if (guests.length < 2) {
    throw new AppError('Need at least 2 guests for matching', 400);
  }

  // Calculate similarity scores
  const pairings = [];
  const usedGuests = new Set();

  for (let i = 0; i < guests.length; i++) {
    if (usedGuests.has(guests[i]._id.toString())) continue;

    const bestMatch = { guest: null, score: 0, index: -1 };

    for (let j = i + 1; j < guests.length; j++) {
      if (usedGuests.has(guests[j]._id.toString())) continue;

      const score = calculateSimilarity(guests[i], guests[j]);
      
      if (score > bestMatch.score) {
        bestMatch = {
          guest: guests[j],
          score,
          index: j
        };
      }
    }

    if (bestMatch.guest) {
      pairings.push({
        guest1: {
          _id: guests[i]._id,
          name: guests[i].name,
          email: guests[i].email,
          interests: guests[i].interests,
          dietaryRequirements: guests[i].dietaryRequirements
        },
        guest2: {
          _id: bestMatch.guest._id,
          name: bestMatch.guest.name,
          email: bestMatch.guest.email,
          interests: bestMatch.guest.interests,
          dietaryRequirements: bestMatch.guest.dietaryRequirements
        },
        compatibilityScore: Math.round(bestMatch.score),
        matchReasons: getMatchReasons(guests[i], bestMatch.guest)
      });

      usedGuests.add(guests[i]._id.toString());
      usedGuests.add(bestMatch.guest._id.toString());
    }
  }

  // Sort by compatibility score
  pairings.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Limit results
  const limitedPairings = limit ? pairings.slice(0, limit) : pairings;

  res.json({
    success: true,
    data: {
      pairings: limitedPairings,
      totalMatches: pairings.length,
      summary: {
        highCompatibility: pairings.filter(p => p.compatibilityScore >= 70).length,
        mediumCompatibility: pairings.filter(p => p.compatibilityScore >= 40 && p.compatibilityScore < 70).length,
        lowCompatibility: pairings.filter(p => p.compatibilityScore < 40).length
      }
    }
  });
});

// Helper function to get match reasons
const getMatchReasons = (guest1, guest2) => {
  const reasons = [];

  // Check dietary
  const diet1 = guest1.dietaryRequirements || [];
  const diet2 = guest2.dietaryRequirements || [];
  const commonDiet = diet1.filter(d => diet2.includes(d));
  if (commonDiet.length > 0) {
    reasons.push(`Common dietary preferences: ${commonDiet.join(', ')}`);
  }

  // Check interests
  const int1 = guest1.interests || [];
  const int2 = guest2.interests || [];
  const commonInterests = int1.filter(i => int2.includes(i));
  if (commonInterests.length > 0) {
    reasons.push(`Shared interests: ${commonInterests.join(', ')}`);
  }

  // Check accessibility needs
  if (guest1.wheelchairAccessible && guest2.wheelchairAccessible) {
    reasons.push('Both guests require wheelchair accessibility');
  }
  if (guest1.mobilityAssistance && guest2.mobilityAssistance) {
    reasons.push('Both guests need mobility assistance');
  }

  return reasons;
};

// @desc    Get networking recommendations
// @route   POST /api/ai/networking
// @access  Private
export const getNetworkingRecommendations = asyncHandler(async (req, res) => {
  const { eventId, bookingId } = req.body;

  let query = {};
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }
  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;

  const guests = await Guest.find(query);

  // Group by interests
  const interestGroups = {};
  guests.forEach(guest => {
    (guest.interests || []).forEach(interest => {
      if (!interestGroups[interest]) {
        interestGroups[interest] = [];
      }
      interestGroups[interest].push(guest);
    });
  });

  // Create recommendations
  const recommendations = Object.keys(interestGroups)
    .filter(key => interestGroups[key].length >= 2)
    .map(interest => ({
      activity: `Networking session: ${interest}`,
      participants: interestGroups[interest].map(g => ({
        name: g.name,
        email: g.email
      })),
      suggestedSize: interestGroups[interest].length,
      description: `Connect with others interested in ${interest}`
    }));

  res.json({
    success: true,
    data: recommendations
  });
});

// @desc    Get activity suggestions based on guest profiles
// @route   POST /api/ai/activities
// @access  Private
export const getActivitySuggestions = asyncHandler(async (req, res) => {
  const { eventId, bookingId } = req.body;

  let query = {};
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }
  if (eventId) query.eventId = eventId;
  if (bookingId) query.bookingId = bookingId;

  const guests = await Guest.find(query);

  // Aggregate interests and dietary requirements
  const allInterests = {};
  const allDietary = {};
  let wheelchairCount = 0;
  let mobilityCount = 0;

  guests.forEach(guest => {
    (guest.interests || []).forEach(interest => {
      allInterests[interest] = (allInterests[interest] || 0) + 1;
    });
    (guest.dietaryRequirements || []).forEach(diet => {
      allDietary[diet] = (allDietary[diet] || 0) + 1;
    });
    if (guest.wheelchairAccessible) wheelchairCount++;
    if (guest.mobilityAssistance) mobilityCount++;
  });

  // Generate activity suggestions
  const activities = [];

  // Add activities based on top interests
  const topInterests = Object.entries(allInterests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  topInterests.forEach(([interest, count]) => {
    activities.push({
      name: `${interest.charAt(0).toUpperCase() + interest.slice(1)} Session`,
      type: 'interest-based',
      expectedAttendance: count,
      accessibility: wheelchairCount > 0 || mobilityCount > 0 
        ? 'May need accessibility accommodations' 
        : 'Standard accessibility',
      dietaryConsiderations: Object.keys(allDietary)
    });
  });

  // Add general activities
  activities.push({
    name: 'Welcome Reception',
    type: 'general',
    expectedAttendance: guests.length,
    dietaryConsiderations: Object.keys(allDietary),
    accessibility: wheelchairCount > 0 || mobilityCount > 0 
      ? 'Wheelchair accessible venue required' 
      : 'Standard accessibility'
  });

  res.json({
    success: true,
    data: {
      activities,
      summary: {
        totalGuests: guests.length,
        topInterests: topInterests.map(([k, v]) => ({ interest: k, count: v })),
        dietaryBreakdown: allDietary,
        accessibilityNeeds: {
          wheelchairAccessible: wheelchairCount,
          mobilityAssistance: mobilityCount
        }
      }
    }
  });
});
