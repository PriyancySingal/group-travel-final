import mongoose from 'mongoose';

const aiPredictionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // Prediction type
  predictionType: {
    type: String,
    enum: ['social_engagement', 'networking', 'guest_pairings', 'emotional_state', 'sentiment_trend'],
    required: true
  },
  // Prediction data
  predictions: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Metadata
  guestCount: {
    type: Number,
    default: 0
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  // Model version used
  modelVersion: {
    type: String,
    default: '1.0.0'
  },
  // Valid until (predictions expire)
  validUntil: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  },
  // Status
  isStale: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
aiPredictionSchema.index({ eventId: 1, predictionType: 1 });
aiPredictionSchema.index({ eventId: 1, createdAt: -1 });

const AIPrediction = mongoose.model('AIPrediction', aiPredictionSchema);

export default AIPrediction;

