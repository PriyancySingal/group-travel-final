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
  },
  // ============== AI-RELATED FIELDS ==============
  // Social Media & Activity
  socialMediaActivity: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
    description: 'Social media activity level (0-100)'
  },
  eventAttendanceCount: {
    type: Number,
    default: 0,
    description: 'Number of events attended previously'
  },
  // Personality & Preferences
  personalityType: {
    type: String,
    enum: ['introvert', 'extravert', 'ambivert'],
    default: 'ambivert'
  },
  openToNetworking: {
    type: Boolean,
    default: true
  },
  groupActivityPreference: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  communicationStyle: {
    type: String,
    enum: ['formal', 'casual', 'balanced'],
    default: 'balanced'
  },
  // Professional & Hobbies
  professionalIndustry: String,
  professionalInterests: [String],
  hobbyInterests: [String],
  // First-time & Risk Factors
  firstTimeEvent: {
    type: Boolean,
    default: false
  },
  likesMixingWithStrangers: {
    type: Boolean,
    default: true
  },
  languageBarrier: {
    type: Boolean,
    default: false
  },
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  // Emotional State Tracking
  energyLevel: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  stressLevel: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  emotionalState: {
    type: String,
    enum: ['excited', 'happy', 'neutral', 'tired', 'disengaged', 'stressed'],
    default: 'neutral'
  },
  socialExhaustion: {
    type: Boolean,
    default: false
  },
  // Engagement History (for trend detection)
  engagementHistory: [{
    score: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  engagementTrend: {
    type: String,
    enum: ['rising', 'falling', 'stable'],
    default: 'stable'
  },
  // Event Goals
  goals: [{
    type: String,
    enum: ['networking', 'learning', 'relaxation', 'business', 'socializing', 'collaboration', 'funding', 'mentorship', 'partnerships']
  }],
  // Current Location for proximity-based networking
  currentLocation: {
    type: String,
    default: 'lobby'
  },
  // Availability status for real-time networking
  availabilityStatus: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  // App Usage
  appFeedbackHistory: [{
    feedback: String,
    rating: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  recentSocialActivity: String,
  // Preferred Times
  preferredTimeSlots: [String],
  // Check-in status
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: Date
}, {
  timestamps: true
});

// Index for faster queries
guestSchema.index({ email: 1 });
guestSchema.index({ eventId: 1 });
guestSchema.index({ bookingId: 1 });

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
