import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  status: {
    type: String,
    enum: ['Pending', 'Confirmed'],
    default: 'Pending'
  },
  dietaryRequirements: [String],
  specialNeeds: String
});

const pricingBreakdownSchema = new mongoose.Schema({
  basePrice: Number,
  tax: Number,
  serviceFee: Number,
  groupDiscount: Number,
  earlyBirdDiscount: Number,
  totalDiscount: Number,
  total: Number,
  perPerson: Number,
  perRoom: Number
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotelId: {
    type: String,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
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
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  members: [memberSchema],
  bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  pricingBreakdown: pricingBreakdownSchema,
  eventType: {
    type: String,
    enum: ['wedding', 'conference', 'mice', 'other'],
    default: 'other'
  },
  eventName: String,
  specialRequests: String
}, {
  timestamps: true
});

// Auto-update booking status when all members confirmed
bookingSchema.methods.updateStatus = function() {
  const allConfirmed = this.members.every(m => m.status === 'Confirmed');
  if (allConfirmed && this.members.length > 0) {
    this.bookingStatus = 'Confirmed';
  }
  return this.bookingStatus;
};

// Virtual for confirmed members count
bookingSchema.virtual('confirmedMembersCount').get(function() {
  return this.members.filter(m => m.status === 'Confirmed').length;
});

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
