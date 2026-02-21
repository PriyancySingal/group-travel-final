import mongoose from 'mongoose';

// Member schema with payment tracking
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  amountToPay: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
}, { _id: false });

// Pricing breakdown schema  
const pricingBreakdownSchema = new mongoose.Schema({
  basePrice: Number,
  gst: Number,
  serviceFee: Number,
  discount: Number,
  totalPrice: Number,
  perPersonSplit: Number
}, { _id: false });

// Hotel info schema (denormalized for easier access)
const hotelInfoSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  city: String,
  rating: Number
}, { _id: false });

// Main Group Plan Schema  
const groupPlanSchema = new mongoose.Schema({
  // User who created this group plan  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Hotel information (denormalized)
  hotelName: {
    type: String,
    required: true
  },
  hotelImage: {
    type: String
  },
  city: {
    type: String
  },
  hotelRating: {
    type: Number
  },

  // Trip details
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  rooms: {
    type: Number,
    required: true,
    min: [1, 'At least one room is required']
  },

  // Guests/Members
  guests: [memberSchema],

  // Pricing
  basePrice: {
    type: Number,
    default: 0
  },
  gst: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  perPersonSplit: {
    type: Number,
    default: 0
  },

  // Split type (equal or custom)
  splitType: {
    type: String,
    enum: ['equal', 'custom'],
    default: 'equal'
  },

  // Payment tracking
  paymentProgress: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'ready_for_confirmation', 'confirmed', 'cancelled'],
    default: 'pending'
  },

  // Booking status
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },

  // Share code for group link
  shareCode: {
    type: String,
    unique: true
  },

  // Confirmation number (generated when confirmed)
  confirmationNumber: {
    type: String
  },

  // Admin notes
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate share code before saving
groupPlanSchema.pre('save', function(next) {
  if (!this.shareCode) {
    this.shareCode = 'GRP' + Date.now().toString(36).toUpperCase() + 
                     Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  
  // Calculate payment progress
  if (this.guests && this.guests.length > 0) {
    const paidCount = this.guests.filter(g => g.paymentStatus === 'paid').length;
    this.paymentProgress = Math.round((paidCount / this.guests.length) * 100);
    
    // If all paid, mark as ready for confirmation
    if (this.guests.every(g => g.paymentStatus === 'paid')) {
      this.paymentStatus = 'ready_for_confirmation';
    }
  }
  
  next();
});

// Method to generate confirmation number
groupPlanSchema.methods.generateConfirmationNumber = function() {
  return 'GTB' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};

// Indexes for better query performance
groupPlanSchema.index({ shareCode: 1 });
groupPlanSchema.index({ bookingStatus: 1 });
groupPlanSchema.index({ createdAt: -1 });

const GroupPlan = mongoose.model('GroupPlan', groupPlanSchema);

export default GroupPlan;
