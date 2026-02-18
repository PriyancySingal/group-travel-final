import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please provide guest name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide guest email'],
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  dietaryRequirements: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher', 'other']
  }],
  specialNeeds: [String],
  wheelchairAccessible: {
    type: Boolean,
    default: false
  },
  mobilityAssistance: {
    type: Boolean,
    default: false
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  interests: [String],
  allergies: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  notes: String,
  status: {
    type: String,
    enum: ['invited', 'confirmed', 'declined', 'attended'],
    default: 'invited'
  }
}, {
  timestamps: true
});

// Index for faster queries
guestSchema.index({ email: 1 });
guestSchema.index({ eventId: 1 });
guestSchema.index({ bookingId: 1 });

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
