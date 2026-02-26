import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['booking', 'guest', 'payment', 'system', 'reminder'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  relatedGuest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
alertSchema.index({ userId: 1, createdAt: -1 });
alertSchema.index({ type: 1 });
alertSchema.index({ isRead: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
