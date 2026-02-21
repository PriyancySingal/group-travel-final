/**
 * Pricing Service - Dynamic pricing calculations for group bookings
 * Pulls price from TBO API response and calculates:
 * - Base price
 * - Tax (GST)
 * - Service fee
 * - Group discount
 * - Early bird discount
 * - Per-room allocation
 * - Dynamic split (equal/custom)
 */

// Pricing configuration
const PRICING_CONFIG = {
  TAX_RATE: 0.12,           // 12% GST
  SERVICE_FEE_RATE: 0.05,  // 5% service fee
  GROUP_DISCOUNT_RATE: 0.10, // 10% discount for groups > 5
  EARLY_BIRD_DISCOUNT_RATE: 0.05, // 5% early bird discount
  EARLY_BIRD_DAYS: 30,      // Days in advance for early bird
  GROUP_SIZE_THRESHOLD: 5, // Min group size for group discount
  MIN_ROOMS: 1,
  DEFAULT_ROOMS: 1
};

/**
 * Calculate number of nights between check-in and check-out dates
 */
export const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 1;
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 1;
};

/**
 * Calculate days until check-in date
 */
export const daysUntilCheckIn = (checkInDate) => {
  if (!checkInDate) return 0;
  
  const checkIn = new Date(checkInDate);
  const today = new Date();
  const diffTime = checkIn - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Calculate base price from TBO hotel response
 */
export const calculateBasePrice = (hotel, nights, rooms = 1) => {
  if (!hotel || !hotel.Price) return 0;
  
  // TBO API returns TotalPrice for the entire stay
  // We need to calculate per night and per room
  const totalPrice = hotel.Price.TotalPrice || 0;
  
  // If price is for the whole stay, calculate per night
  // Otherwise assume it's per night
  const perNight = totalPrice / nights;
  
  return {
    perNight: Math.round(perNight),
    totalForNights: totalPrice,
    perRoomPerNight: Math.round(perNight / rooms)
  };
};

/**
 * Calculate tax amount
 */
export const calculateTax = (baseAmount) => {
  return Math.round(baseAmount * PRICING_CONFIG.TAX_RATE);
};

/**
 * Calculate service fee
 */
export const calculateServiceFee = (baseAmount) => {
  return Math.round(baseAmount * PRICING_CONFIG.SERVICE_FEE_RATE);
};

/**
 * Calculate group discount (for groups > 5 members)
 */
export const calculateGroupDiscount = (baseAmount, memberCount) => {
  if (memberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD) {
    return Math.round(baseAmount * PRICING_CONFIG.GROUP_DISCOUNT_RATE);
  }
  return 0;
};

/**
 * Calculate early bird discount (if booked > 30 days in advance)
 */
export const calculateEarlyBirdDiscount = (baseAmount, checkInDate) => {
  const daysUntil = daysUntilCheckIn(checkInDate);
  if (daysUntil > PRICING_CONFIG.EARLY_BIRD_DAYS) {
    return Math.round(baseAmount * PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE);
  }
  return 0;
};

/**
 * Main pricing calculation function
 */
export const calculateDynamicPricing = (hotel, options = {}) => {
  const {
    checkInDate = new Date(),
    checkOutDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    rooms = PRICING_CONFIG.DEFAULT_ROOMS,
    memberCount = 1,
    customSplits = null
  } = options;

  // Calculate nights
  const nights = calculateNights(checkInDate, checkOutDate);
  
  // Get base price from hotel
  const basePriceInfo = calculateBasePrice(hotel, nights, rooms);
  const basePrice = basePriceInfo.totalForNights;

  // Calculate additional costs
  const tax = calculateTax(basePrice);
  const serviceFee = calculateServiceFee(basePrice);
  
  // Calculate discounts
  const groupDiscount = calculateGroupDiscount(basePrice, memberCount);
  const earlyBirdDiscount = calculateEarlyBirdDiscount(basePrice, checkInDate);
  const totalDiscount = groupDiscount + earlyBirdDiscount;

  // Calculate final totals
  const subtotal = basePrice + tax + serviceFee;
  const total = subtotal - totalDiscount;

  // Calculate per person and per room
  const perPerson = Math.round(total / memberCount);
  const perRoom = Math.round(total / rooms);

  // Calculate equal split
  const equalSplit = memberCount > 0 ? Math.round(total / memberCount) : 0;

  // Calculate custom splits if provided
  let customSplitBreakdown = null;
  if (customSplits && Array.isArray(customSplits)) {
    customSplitBreakdown = customSplits.map((amount, index) => ({
      memberIndex: index,
      amount: Math.round(amount)
    }));
  }

  // Determine if early bird applies
  const daysUntil = daysUntilCheckIn(checkInDate);
  const earlyBirdApplies = daysUntil > PRICING_CONFIG.EARLY_BIRD_DAYS;
  const groupDiscountApplies = memberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD;

  return {
    // Base price info
    basePrice: {
      perNight: basePriceInfo.perNight,
      totalForNights: basePrice,
      perRoomPerNight: basePriceInfo.perRoomPerNight
    },
    
    // Breakdown
    breakdown: {
      basePrice,
      tax,
      serviceFee,
      groupDiscount,
      earlyBirdDiscount,
      totalDiscount,
      subtotal,
      total
    },
    
    // Allocation
    allocation: {
      nights,
      rooms,
      memberCount,
      perPerson,
      perRoom,
      equalSplit
    },
    
    // Discount status
    discounts: {
      earlyBird: {
        applies: earlyBirdApplies,
        daysUntil: daysUntil,
        requiredDays: PRICING_CONFIG.EARLY_BIRD_DAYS,
        rate: PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE * 100,
        amount: earlyBirdDiscount
      },
      group: {
        applies: groupDiscountApplies,
        memberCount,
        threshold: PRICING_CONFIG.GROUP_SIZE_THRESHOLD,
        rate: PRICING_CONFIG.GROUP_DISCOUNT_RATE * 100,
        amount: groupDiscount
      }
    },
    
    // Split options
    splits: {
      equal: equalSplit,
      custom: customSplitBreakdown,
      type: customSplits ? 'custom' : 'equal'
    },
    
    // Configuration used
    config: {
      taxRate: PRICING_CONFIG.TAX_RATE * 100,
      serviceFeeRate: PRICING_CONFIG.SERVICE_FEE_RATE * 100
    }
  };
};

/**
 * Calculate custom split amounts
 */
export const calculateCustomSplit = (total, splitPercentages) => {
  if (!splitPercentages || !Array.isArray(splitPercentages)) {
    return null;
  }

  return splitPercentages.map((percentage, index) => {
    const amount = Math.round(total * (percentage / 100));
    return {
      memberIndex: index,
      percentage,
      amount
    };
  });
};

/**
 * Format price for display
 */
export const formatPrice = (amount, currency = '₹') => {
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Default pricing config for export
 */
export const getPricingConfig = () => ({ ...PRICING_CONFIG });
