// Event Suitability Service
// Calculates how suitable a hotel is for different event types

const eventTypeConfigs = {
  MICE: {
    name: "MICE (Meetings, Incentives, Conferences, Exhibitions)",
    requiredAmenities: [
      "Conference Room",
      "WiFi",
      "Parking",
      "Projector",
      "Audio System"
    ],
    preferredAmenities: [
      "Gym",
      "Restaurant",
      "Business Lounge",
      "24/7 Service"
    ],
    features: {
      networking: "Advanced networking AI panel",
      seating: "Smart seating algorithm",
      schedule: "Event scheduling tools"
    },
    averageGroupSize: "20-100",
    rentalWeight: {
      conferenceRoom: 0.3,
      wifi: 0.25,
      parking: 0.2,
      accommodation: 0.15,
      dining: 0.1
    }
  },

  Wedding: {
    name: "Wedding Events",
    requiredAmenities: [
      "Banquet Hall",
      "Kitchen",
      "Parking",
      "Decoration Services"
    ],
    preferredAmenities: [
      "Garden",
      "Photography Allowed",
      "Catering",
      "Guest Accommodation"
    ],
    features: {
      dietary: "Dietary restriction management",
      grouping: "Smart room grouping by relations",
      coordination: "Vendor coordination tools"
    },
    averageGroupSize: "50-500",
    rentalWeight: {
      banquetHall: 0.35,
      kitchen: 0.25,
      parking: 0.15,
      accommodation: 0.15,
      decor: 0.1
    }
  },

  Conference: {
    name: "Conference & Summit",
    requiredAmenities: [
      "Auditorium",
      "WiFi",
      "Projector",
      "Microphones",
      "Event Support"
    ],
    preferredAmenities: [
      "Multiple Breakout Rooms",
      "Recording Studio",
      "Tech Support",
      "Catering"
    ],
    features: {
      scheduling: "Session scheduling system",
      tagging: "Speaker and session tagging",
      networking: "Digital badge system"
    },
    averageGroupSize: "100-1000",
    rentalWeight: {
      auditorium: 0.35,
      wifi: 0.2,
      techSupport: 0.25,
      breakoutRooms: 0.15,
      catering: 0.05
    }
  },

  General: {
    name: "General Group Travel",
    requiredAmenities: ["WiFi", "Parking"],
    preferredAmenities: ["Restaurant", "Gym", "Room Service"],
    features: {
      basic: "Basic group coordination"
    },
    averageGroupSize: "5-50",
    rentalWeight: {}
  }
};

/**
 * Calculate event suitability score
 * @param {Object} hotel - Hotel object with amenities
 * @param {String} eventType - Type of event (MICE, Wedding, Conference, General)
 * @returns {Object} - Suitability score and recommendations
 */
const calculateEventSuitability = (hotel, eventType) => {
  const config = eventTypeConfigs[eventType] || eventTypeConfigs.General;
  const hotelAmenities = (hotel.amenities || []).map((a) =>
    a.toLowerCase().trim()
  );

  let score = 0;
  const criteria = {};

  // Check required amenities
  const requiredMatches = config.requiredAmenities.filter((required) =>
    hotelAmenities.some((amenity) =>
      amenity.includes(required.toLowerCase())
    )
  );
  const requiredScore =
    (requiredMatches.length / config.requiredAmenities.length) * 40;
  criteria.requiredAmenities = {
    found: requiredMatches.length,
    total: config.requiredAmenities.length,
    score: requiredScore
  };

  // Check preferred amenities
  const preferredMatches = config.preferredAmenities.filter((preferred) =>
    hotelAmenities.some((amenity) =>
      amenity.includes(preferred.toLowerCase())
    )
  );
  const preferredScore =
    (preferredMatches.length / config.preferredAmenities.length) * 30;
  criteria.preferredAmenities = {
    found: preferredMatches.length,
    total: config.preferredAmenities.length,
    score: preferredScore
  };

  // Star rating impact
  const starRating = hotel.starRating || 3;
  const ratingScore = Math.min(starRating * 5, 20); // Max 20 points
  criteria.starRating = {
    rating: starRating,
    score: ratingScore
  };

  // Price factor (if available)
  let priceScore = 10;
  if (hotel.price) {
    if (hotel.price < 3000) {
      priceScore = 5; // Budget - 5 points
    } else if (hotel.price < 7000) {
      priceScore = 10; // Mid-range - 10 points
    } else {
      priceScore = 10; // Premium - 10 points
    }
  }
  criteria.priceValue = {
    price: hotel.price,
    score: priceScore
  };

  // Calculate total score
  score = requiredScore + preferredScore + ratingScore + priceScore;

  // Generate recommendations
  const recommendations = [];

  if (requiredMatches.length < config.requiredAmenities.length) {
    const missing = config.requiredAmenities.filter(
      (req) => !requiredMatches.includes(req)
    );
    recommendations.push({
      type: "missing_essential",
      severity: "high",
      message: `Missing essential amenities: ${missing.join(", ")}`,
      amenities: missing
    });
  }

  if (preferredMatches.length < config.preferredAmenities.length * 0.5) {
    recommendations.push({
      type: "limited_amenities",
      severity: "medium",
      message: "Hotel has limited preferred amenities for this event type"
    });
  }

  if (starRating < 4) {
    recommendations.push({
      type: "lower_rating",
      severity: "low",
      message: `${starRating}-star property. Consider 4+ star hotels for premium events.`
    });
  }

  // Event type specific recommendations
  if (eventType === "MICE" && !hotelAmenities.some((a) => a.includes("wifi"))) {
    recommendations.push({
      type: "critical",
      severity: "critical",
      message:
        "MICE events require strong WiFi connectivity. Verify with hotel."
    });
  }

  if (eventType === "Wedding" && !hotelAmenities.some((a) => a.includes("kitchen"))) {
    recommendations.push({
      type: "catering_concern",
      severity: "high",
      message: "No kitchen available. Coordinate external catering options."
    });
  }

  if (
    eventType === "Conference" &&
    !hotelAmenities.some((a) => a.includes("auditorium"))
  ) {
    recommendations.push({
      type: "venue_concern",
      severity: "high",
      message:
        "No auditorium available. Check conference room capacity instead."
    });
  }

  // Generate recommendation text
  let recommendationText = "";
  if (score >= 85) {
    recommendationText = `🌟 Excellent for ${eventType} events! This hotel has ${requiredMatches.length}/${config.requiredAmenities.length} required and ${preferredMatches.length}/${config.preferredAmenities.length} preferred amenities.`;
  } else if (score >= 70) {
    recommendationText = `✅ Good choice for ${eventType} events. Some amenities may need confirmation.`;
  } else if (score >= 55) {
    recommendationText = `⚠️ Moderate suitability. Verify essential amenities with hotel before booking.`;
  } else {
    recommendationText = `❌ Limited suitability for ${eventType}. Consider other options or discuss customization.`;
  }

  return {
    overallScore: Math.round(score),
    eventType,
    eventTypeFullName: config.name,
    criteria,
    requiredAmenitiesMatch: `${requiredMatches.length}/${config.requiredAmenities.length}`,
    preferredAmenitiesMatch: `${preferredMatches.length}/${config.preferredAmenities.length}`,
    recommendationText,
    recommendations,
    features: config.features,
    averageGroupSize: config.averageGroupSize,
    missingAmenities: config.requiredAmenities.filter(
      (req) => !requiredMatches.includes(req)
    ),
    matchedAmenities: requiredMatches,
    scoreBreakdown: {
      requiredAmenities: requiredScore,
      preferredAmenities: preferredScore,
      starRating: ratingScore,
      priceValue: priceScore
    }
  };
};

/**
 * Compare hotel suitability across multiple event types
 */
const compareEventTypeSuitability = (hotel) => {
  const eventTypes = ["MICE", "Wedding", "Conference", "General"];
  const comparisons = eventTypes.map((type) =>
    calculateEventSuitability(hotel, type)
  );

  const bestMatch = comparisons.reduce((prev, current) =>
    prev.overallScore > current.overallScore ? prev : current
  );

  return {
    bestMatch: bestMatch.eventType,
    bestScore: bestMatch.overallScore,
    allComparisons: comparisons.sort((a, b) => b.overallScore - a.overallScore)
  };
};

module.exports = {
  calculateEventSuitability,
  compareEventTypeSuitability,
  eventTypeConfigs
};
