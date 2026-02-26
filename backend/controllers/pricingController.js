import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// Pricing configuration
const PRICING_CONFIG = {
  TAX_RATE: 0.12,           // 12% GST
  SERVICE_FEE_RATE: 0.05,  // 5% service fee
  GROUP_DISCOUNT_RATE: 0.10, // 10% discount for groups > 5
  EARLY_BIRD_DISCOUNT_RATE: 0.05, // 5% early bird discount
  EARLY_BIRD_DAYS: 30,      // Days in advance for early bird
  GROUP_SIZE_THRESHOLD: 5, // Min group size for group discount
};

// Calculate number of nights
const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 1;
  
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 1;
};

// Calculate days until check-in
const daysUntilCheckIn = (checkInDate) => {
  if (!checkInDate) return 0;
  
  const checkIn = new Date(checkInDate);
  const today = new Date();
  const diffTime = checkIn - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// @desc    Calculate dynamic pricing
// @route   POST /api/pricing/calculate
// @access  Public
export const calculatePricing = asyncHandler(async (req, res) => {
  const { hotel, checkInDate, checkOutDate, rooms, memberCount, customSplits } = req.body;

  if (!hotel || !hotel.Price) {
    throw new AppError('Hotel data with price is required', 400);
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  const basePrice = hotel.Price.TotalPrice || 0;

  // Calculate additional costs
  const tax = Math.round(basePrice * PRICING_CONFIG.TAX_RATE);
  const serviceFee = Math.round(basePrice * PRICING_CONFIG.SERVICE_FEE_RATE);
  
  // Calculate discounts
  const groupDiscount = memberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD 
    ? Math.round(basePrice * PRICING_CONFIG.GROUP_DISCOUNT_RATE)
    : 0;
  
  const daysUntil = daysUntilCheckIn(checkInDate);
  const earlyBirdDiscount = daysUntil > PRICING_CONFIG.EARLY_BIRD_DAYS
    ? Math.round(basePrice * PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE)
    : 0;
  
  const totalDiscount = groupDiscount + earlyBirdDiscount;

  // Calculate final totals
  const subtotal = basePrice + tax + serviceFee;
  const total = subtotal - totalDiscount;

  // Calculate per person and per room
  const validMemberCount = memberCount || 1;
  const validRooms = rooms || 1;
  const perPerson = Math.round(total / validMemberCount);
  const perRoom = Math.round(total / validRooms);

  res.json({
    success: true,
    data: {
      // Base price info
      basePrice: {
        perNight: Math.round(basePrice / nights),
        totalForNights: basePrice,
        perRoomPerNight: Math.round(basePrice / (nights * validRooms))
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
        rooms: validRooms,
        memberCount: validMemberCount,
        perPerson,
        perRoom
      },
      
      // Discount status
      discounts: {
        earlyBird: {
          applies: daysUntil > PRICING_CONFIG.EARLY_BIRD_DAYS,
          daysUntil,
          requiredDays: PRICING_CONFIG.EARLY_BIRD_DAYS,
          rate: PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE * 100,
          amount: earlyBirdDiscount
        },
        group: {
          applies: validMemberCount > PRICING_CONFIG.GROUP_SIZE_THRESHOLD,
          memberCount: validMemberCount,
          threshold: PRICING_CONFIG.GROUP_SIZE_THRESHOLD,
          rate: PRICING_CONFIG.GROUP_DISCOUNT_RATE * 100,
          amount: groupDiscount
        }
      },
      
      // Configuration used
      config: {
        taxRate: PRICING_CONFIG.TAX_RATE * 100,
        serviceFeeRate: PRICING_CONFIG.SERVICE_FEE_RATE * 100
      }
    }
  });
});

// @desc    Get pricing configuration
// @route   GET /api/pricing/config
// @access  Public
export const getPricingConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      taxRate: PRICING_CONFIG.TAX_RATE * 100,
      serviceFeeRate: PRICING_CONFIG.SERVICE_FEE_RATE * 100,
      groupDiscountRate: PRICING_CONFIG.GROUP_DISCOUNT_RATE * 100,
      earlyBirdDiscountRate: PRICING_CONFIG.EARLY_BIRD_DISCOUNT_RATE * 100,
      earlyBirdDays: PRICING_CONFIG.EARLY_BIRD_DAYS,
      groupSizeThreshold: PRICING_CONFIG.GROUP_SIZE_THRESHOLD
    }
  });
});
