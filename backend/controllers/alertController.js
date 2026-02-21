import Alert from '../models/Alert.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
export const getAlerts = asyncHandler(async (req, res) => {
  const { type, isRead, limit } = req.query;

  let query = {};

  // Regular users see only their alerts, admins see all
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }

  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead === 'true';

  let alertsQuery = Alert.find(query).sort('-createdAt');

  if (limit) {
    alertsQuery = alertsQuery.limit(parseInt(limit));
  }

  const alerts = await alertsQuery;

  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  });
});

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private
export const createAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.create({
    ...req.body,
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    data: alert
  });
});

// @desc    Mark alert as read
// @route   PATCH /api/alerts/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    throw new AppError('Alert not found', 404);
  }

  // Check if user owns the alert or is admin
  if (alert.userId && alert.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this alert', 403);
  }

  alert.isRead = true;
  await alert.save();

  res.json({
    success: true,
    data: alert
  });
});

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private
export const deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    throw new AppError('Alert not found', 404);
  }

  // Check if user owns the alert or is admin
  if (alert.userId && alert.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this alert', 403);
  }

  await alert.deleteOne();

  res.json({
    success: true,
    message: 'Alert deleted successfully'
  });
});

// @desc    Clear all alerts
// @route   DELETE /api/alerts
// @access  Private
export const clearAlerts = asyncHandler(async (req, res) => {
  let query = {};

  // Regular users delete only their alerts, admins can delete all
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }

  await Alert.deleteMany(query);

  res.json({
    success: true,
    message: 'All alerts cleared successfully'
  });
});

// @desc    Get unread alerts count
// @route   GET /api/alerts/unread/count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  let query = { isRead: false };

  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }

  const count = await Alert.countDocuments(query);

  res.json({
    success: true,
    data: { unreadCount: count }
  });
});
