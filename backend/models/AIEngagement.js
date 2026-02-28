import mongoose from 'mongoose';

const aiEngagementSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  // Real-time engagement metrics
  engagementScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  participationRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  activityLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very_high'],
    default: 'moderate'
  },
  // Interaction tracking
  messagesSent: {
    type: Number,
    default: 0
  },
  messagesReceived: {
    type: Number,
    default: 0
  },
  groupActivitiesJoined: {
    type: Number,
    default: 0
  },
  networkingConnectionsMade: {
    type: Number,
    default: 0
  },
  // Session data
  currentSession: {
    sessionId: String,
    sessionName: String,
    startTime: Date,
    duration: Number
  },
  // Location/presence
  lastLocation: String,
  isActive: {
    type: Boolean,
    default: true
  },
  // Timestamps
  checkedInAt: Date,
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
aiEngagementSchema.index({ eventId: 1, guestId: 1 });
aiEngagementSchema.index({ eventId: 1, lastActivityAt: -1 });

const AIEngagement = mongoose.model('AIEngagement', aiEngagementSchema);

export default AIEngagement;

