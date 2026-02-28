import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true,
    index: true
  },
  targetGuestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    default: null
  },
  type: {
    type: String,
    required: true,
    enum: ['message', 'activity_join', 'activity_leave', 'pairing_accept', 'check_in', 'feedback_positive', 'feedback_negative', 'networking_scan', 'inactivity']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
interactionSchema.index({ eventId: 1, guestId: 1, timestamp: -1 });
interactionSchema.index({ eventId: 1, type: 1, timestamp: -1 });
interactionSchema.index({ guestId: 1, targetGuestId: 1 });

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
