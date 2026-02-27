// Pricing Service for Group Bookings
// Calculates dynamic pricing with discounts and taxes

const calculateGroupPricing = (basePrice, numberOfRooms = 1, nights = 1, memberCount = 1) => {
  const TAX_RATE = 0.12; // 12% GST
  const SERVICE_FEE_RATE = 0.05; // 5% Service Fee

  // Base calculation
  const baseTotal = basePrice * numberOfRooms * nights;

  // Calculate tax and service fee
  const gst = Math.round(baseTotal * TAX_RATE);
  const serviceFee = Math.round(baseTotal * SERVICE_FEE_RATE);

  // Apply discounts
  let groupDiscount = 0;
  let earlyBirdDiscount = 0;

  // Group Discount: 10% if 5 or more members
  if (memberCount >= 5) {
    groupDiscount = Math.round((baseTotal + gst + serviceFee) * 0.1);
  }

  // Early Bird Discount: 7% if booking 30+ days in advance
  const bookingDate = new Date();
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 30);
  
  if (bookingDate <= checkInDate) {
    earlyBirdDiscount = Math.round((baseTotal + gst + serviceFee) * 0.07);
  }

  // Calculate totals
  const subtotalWithTaxes = baseTotal + gst + serviceFee;
  const totalDiscount = groupDiscount + earlyBirdDiscount;
  const totalPerRoom = basePrice * nights;
  const totalForAllRooms = subtotalWithTaxes - totalDiscount;
  const pricePerMember = memberCount > 0 ? Math.round(totalForAllRooms / memberCount) : 0;

  return {
    basePrice: basePrice,
    baseTotal,
    gst,
    serviceFee,
    groupDiscount,
    earlyBirdDiscount,
    totalDiscount,
    totalPerRoom,
    totalForAllRooms,
    pricePerMember,
    breakdown: {
      base: baseTotal,
      tax: gst,
      service: serviceFee,
      subtotal: subtotalWithTaxes,
      discounts: {
        group: groupDiscount,
        earlyBird: earlyBirdDiscount,
        total: totalDiscount
      },
      finalTotal: totalForAllRooms
    },
    lastUpdatedAt: new Date()
  };
};

// Calculate per-member split
const calculateMemberSplit = (totalAmount, memberCount, customSplits = null) => {
  if (customSplits) {
    // Validate custom splits
    const totalCustom = Object.values(customSplits).reduce((a, b) => a + b, 0);
    if (totalCustom !== totalAmount) {
      console.warn("Custom splits do not match total, using equal split instead");
      return calculateEqualSplit(totalAmount, memberCount);
    }
    return customSplits;
  }

  return calculateEqualSplit(totalAmount, memberCount);
};

// Equal split calculation
const calculateEqualSplit = (totalAmount, memberCount) => {
  const perMember = Math.ceil(totalAmount / memberCount);
  const splits = {};
  let distributed = 0;

  for (let i = 0; i < memberCount; i++) {
    const remaining = totalAmount - distributed;
    const share = i === memberCount - 1 ? remaining : perMember;
    splits[`member_${i}`] = share;
    distributed += share;
  }

  return splits;
};

// Apply surge pricing for last-minute bookings
const calculateSurgePrice = (basePrice, daysUntilCheckIn) => {
  if (daysUntilCheckIn <= 7) {
    return basePrice * 1.2; // 20% surge
  } else if (daysUntilCheckIn <= 14) {
    return basePrice * 1.1; // 10% surge
  }
  return basePrice;
};

// Calculate occupancy-based pricing (higher when availability is low)
const calculateOccupancyPrice = (basePrice, occupancyRate) => {
  if (occupancyRate >= 0.9) {
    return basePrice * 1.25; // 25% premium
  } else if (occupancyRate >= 0.75) {
    return basePrice * 1.15; // 15% premium
  } else if (occupancyRate >= 0.5) {
    return basePrice * 1.05; // 5% premium
  }
  return basePrice;
};

// Get pricing recommendations
const getPricingRecommendation = (bookingData) => {
  const {
    basePrice,
    memberCount,
    daysUntilCheckIn,
    occupancyRate,
    eventType
  } = bookingData;

  const recommendations = [];
  const savings = {};

  // Group discount info
  if (memberCount >= 5) {
    savings.groupDiscount = basePrice * 0.1;
    recommendations.push({
      type: "group_discount",
      message: `🎉 You qualify for 10% group discount!`,
      savings: Math.round(basePrice * 0.1)
    });
  } else if (memberCount >= 3) {
    recommendations.push({
      type: "group_growth",
      message: `Add ${5 - memberCount} more members to unlock 10% group discount`,
      potentialSavings: Math.round(basePrice * 0.1)
    });
  }

  // Early bird info
  if (daysUntilCheckIn >= 30) {
    savings.earlyBirdDiscount = basePrice * 0.07;
    recommendations.push({
      type: "early_bird",
      message: `✈️ You booked early! Save 7% on your total`,
      savings: Math.round(basePrice * 0.07)
    });
  } else if (daysUntilCheckIn < 7) {
    recommendations.push({
      type: "surge_warning",
      message: `⚠️ Last-minute booking may incur surge pricing`,
      surgePercentage: 20
    });
  }

  // Event type recommendations
  const eventTypeBoosts = {
    MICE: { text: "MICE events get networking tools", bonus: 0 },
    Wedding: { text: "Wedding bookings include dietary management", bonus: 0 },
    Conference: { text: "Conference events get session scheduling", bonus: 0 }
  };

  if (eventTypeBoosts[eventType]) {
    recommendations.push({
      type: "event_feature",
      message: eventTypeBoosts[eventType].text
    });
  }

  return {
    recommendations,
    totalSavings: Object.values(savings).reduce((a, b) => a + b, 0),
    savingsBreakdown: savings
  };
};

module.exports = {
  calculateGroupPricing,
  calculateMemberSplit,
  calculateEqualSplit,
  calculateSurgePrice,
  calculateOccupancyPrice,
  getPricingRecommendation
};
