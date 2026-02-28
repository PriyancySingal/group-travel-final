import mongoose from 'mongoose';

const aiSentimentSchema = new mongoose.Schema({
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
  // Feedback content
  feedback: {
    type: String,
    required: true
  },
  // Sentiment analysis results
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
  },
  // Rating (1-5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Category/topic of feedback
  category: {
    type: String,
    enum: ['food', 'venue', 'activities', 'networking', 'overall', 'other'],
    default: 'other'
  },
  // Context
  context: {
    activityId: String,
    sessionName: String,
    timestamp: Date
  },
  // Keywords extracted
  keywords: [String],
  // Emotional indicators
  emotions: {
    happy: { type: Number, default: 0 },
    excited: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    disappointed: { type: Number, default: 0 },
    frustrated: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for efficient queries
aiSentimentSchema.index({ eventId: 1, createdAt: -1 });
aiSentimentSchema.index({ eventId: 1, sentiment: 1 });
aiSentimentSchema.index({ guestId: 1 });

const AISentiment = mongoose.model('AISentiment', aiSentimentSchema);

export default AISentiment;

