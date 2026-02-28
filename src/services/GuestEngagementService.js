/**
 * Guest Engagement Service
 * Handles real-time feedback, polling, Q&A, notifications, and engagement metrics
 */

class GuestEngagementService {
  constructor() {
    this.feedback = [];
    this.polls = new Map();
    this.qaQuestions = [];
    this.notifications = new Map();
    this.engagementMetrics = new Map();
    this.subscribers = new Set();
    this.notificationQueue = [];
  }

  /**
   * FEEDBACK MANAGEMENT
   */

  /**
   * Submit feedback on an event or activity
   */
  submitFeedback(guestId, feedbackData) {
    const feedbackEntry = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      guestId,
      type: feedbackData.type, // 'event', 'activity', 'service'
      targetId: feedbackData.targetId,
      rating: feedbackData.rating, // 1-5
      comment: feedbackData.comment,
      tags: feedbackData.tags || [], // e.g., ['food', 'service', 'timing']
      sentiment: this.analyzeSentiment(feedbackData.comment),
      timestamp: new Date(),
      isAnonymous: feedbackData.isAnonymous || false,
    };

    this.feedback.push(feedbackEntry);
    this.notifySubscribers('feedback:submitted', feedbackEntry);
    this.updateEngagementMetrics(guestId, 'gave-feedback');

    return feedbackEntry;
  }

  /**
   * Get feedback for an event or activity
   */
  getFeedback(targetId = null) {
    if (!targetId) return this.feedback;
    return this.feedback.filter(f => f.targetId === targetId);
  }

  /**
   * Analyze sentiment from feedback comment
   */
  analyzeSentiment(comment) {
    const lowerComment = comment.toLowerCase();
    
    const positiveKeywords = ['amazing', 'great', 'excellent', 'fantastic', 'wonderful', 'loved', 'awesome', 'perfect', 'best', 'brilliant', 'outstanding'];
    const negativeKeywords = ['terrible', 'awful', 'bad', 'poor', 'worst', 'horrible', 'disappointing', 'waste', 'boring', 'frustrated', 'angry'];

    let positiveCount = positiveKeywords.filter(word => lowerComment.includes(word)).length;
    let negativeCount = negativeKeywords.filter(word => lowerComment.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * POLLING SYSTEM
   */

  /**
   * Create a live poll
   */
  createPoll(pollData) {
    const poll = {
      id: `poll-${Date.now()}`,
      question: pollData.question,
      options: pollData.options.map((opt, idx) => ({
        id: idx,
        text: opt,
        votes: 0,
        voters: [],
      })),
      startTime: new Date(),
      endTime: pollData.endTime || new Date(Date.now() + 5 * 60 * 1000), // Default 5 min
      isActive: true,
      createdBy: pollData.createdBy,
      displayType: pollData.displayType || 'multiple', // 'single' or 'multiple'
      results: {
        totalVotes: 0,
        participationRate: 0,
      },
    };

    this.polls.set(poll.id, poll);
    this.notifySubscribers('poll:created', poll);
    return poll;
  }

  /**
   * Vote on a poll
   */
  votePoll(pollId, guestId, optionIds) {
    const poll = this.polls.get(pollId);
    if (!poll || !poll.isActive) return null;

    // Convert single option to array if needed
    const optionsToVote = Array.isArray(optionIds) ? optionIds : [optionIds];

    optionsToVote.forEach(optionId => {
      const option = poll.options[optionId];
      if (option && !option.voters.includes(guestId)) {
        option.votes++;
        option.voters.push(guestId);
        poll.results.totalVotes++;
      }
    });

    this.updateEngagementMetrics(guestId, 'voted-poll');
    this.notifySubscribers('poll:voted', { pollId, guestId, optionIds: optionsToVote });

    return poll;
  }

  /**
   * Get active polls
   */
  getActivePolls() {
    const now = new Date();
    return Array.from(this.polls.values()).filter(
      poll => poll.isActive && poll.endTime > now
    );
  }

  /**
   * Close a poll
   */
  closePoll(pollId) {
    const poll = this.polls.get(pollId);
    if (poll) {
      poll.isActive = false;
      const totalParticipants = new Set(
        poll.options.flatMap(opt => opt.voters)
      ).size;
      poll.results.participationRate = (totalParticipants / 100) * 100; // Adjust divisor based on event size
      this.notifySubscribers('poll:closed', poll);
    }
    return poll;
  }

  /**
   * Q&A SYSTEM
   */

  /**
   * Submit a question
   */
  submitQuestion(guestId, questionData) {
    const question = {
      id: `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      guestId,
      guestName: questionData.guestName,
      content: questionData.content,
      category: questionData.category || 'general', // 'logistics', 'activity', 'general'
      isAnonymous: questionData.isAnonymous || false,
      timestamp: new Date(),
      upvotes: 0,
      upvoters: [],
      answers: [],
      isAnswered: false,
      priority: 'normal',
    };

    this.qaQuestions.push(question);
    this.updateEngagementMetrics(guestId, 'asked-question');
    this.notifySubscribers('question:submitted', question);

    return question;
  }

  /**
   * Answer a question
   */
  answerQuestion(questionId, answerer, answerText) {
    const question = this.qaQuestions.find(q => q.id === questionId);
    if (!question) return null;

    const answer = {
      id: `ans-${Date.now()}`,
      answerer,
      content: answerText,
      timestamp: new Date(),
      upvotes: 0,
      upvoters: [],
      isOfficial: answerer === 'admin' || answerer === 'organizer',
    };

    question.answers.push(answer);
    if (answerer === 'admin' || answerer === 'organizer') {
      question.isAnswered = true;
      question.priority = 'answered';
    }

    this.notifySubscribers('question:answered', { questionId, answer });
    return answer;
  }

  /**
   * Upvote a question or answer
   */
  upvoteQuestion(questionId, guestId) {
    const question = this.qaQuestions.find(q => q.id === questionId);
    if (question && !question.upvoters.includes(guestId)) {
      question.upvotes++;
      question.upvoters.push(guestId);
    }
    return question;
  }

  /**
   * Get Q&A by category
   */
  getQuestions(category = null, sortBy = 'recent') {
    let questions = category
      ? this.qaQuestions.filter(q => q.category === category)
      : this.qaQuestions;

    // Sort options
    if (sortBy === 'upvotes') {
      questions.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'answered') {
      questions.sort((a, b) => b.isAnswered - a.isAnswered);
    } else {
      questions.sort((a, b) => b.timestamp - a.timestamp);
    }

    return questions;
  }

  /**
   * NOTIFICATION SYSTEM
   */

  /**
   * Send notification to guest(s)
   */
  sendNotification(notificationData) {
    const notification = {
      id: `notif-${Date.now()}`,
      type: notificationData.type, // 'event', 'activity', 'poll', 'message', 'achievement'
      targetGuests: Array.isArray(notificationData.guestId)
        ? notificationData.guestId
        : [notificationData.guestId],
      title: notificationData.title,
      message: notificationData.message,
      icon: notificationData.icon || '🔔',
      actionUrl: notificationData.actionUrl,
      timestamp: new Date(),
      isRead: new Map(),
      priority: notificationData.priority || 'normal', // 'high', 'normal', 'low'
    };

    // Initialize read status for each guest
    notification.targetGuests.forEach(guestId => {
      notification.isRead.set(guestId, false);
    });

    this.notificationQueue.push(notification);
    this.notifySubscribers('notification:sent', notification);

    return notification;
  }

  /**
   * Get notifications for guest
   */
  getNotifications(guestId, unreadOnly = false) {
    return this.notificationQueue.filter(notif => {
      const isTarget = notif.targetGuests.includes(guestId);
      if (!unreadOnly) return isTarget;
      return isTarget && !notif.isRead.get(guestId);
    });
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(notificationId, guestId) {
    const notification = this.notificationQueue.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead.set(guestId, true);
    }
    return notification;
  }

  /**
   * Clear old notifications
   */
  clearNotificationHistory(olderThanMinutes = 1440) {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    this.notificationQueue = this.notificationQueue.filter(
      notif => notif.timestamp > cutoffTime
    );
  }

  /**
   * ENGAGEMENT METRICS
   */

  /**
   * Update engagement metrics for a guest
   */
  updateEngagementMetrics(guestId, action) {
    const metrics = this.engagementMetrics.get(guestId) || {
      guestId,
      engagementScore: 0,
      activities: [],
      lastActive: null,
    };

    const actionScores = {
      'gave-feedback': 10,
      'voted-poll': 15,
      'asked-question': 20,
      'answered-question': 25,
      'signed-up-activity': 20,
      'completed-activity': 50,
      'participated-challenge': 30,
      'attended-event': 40,
    };

    metrics.engagementScore += actionScores[action] || 5;
    metrics.activities.push({
      action,
      timestamp: new Date(),
    });
    metrics.lastActive = new Date();

    this.engagementMetrics.set(guestId, metrics);
    this.notifySubscribers('engagement:updated', metrics);

    return metrics;
  }

  /**
   * Get engagement metrics for guest
   */
  getEngagementMetrics(guestId) {
    return this.engagementMetrics.get(guestId) || null;
  }

  /**
   * Get top engaged guests
   */
  getTopEngagedGuests(limit = 10) {
    return Array.from(this.engagementMetrics.values())
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit);
  }

  /**
   * Get engagement insights
   */
  getEngagementInsights() {
    const metrics = Array.from(this.engagementMetrics.values());
    const avgScore = metrics.length 
      ? metrics.reduce((sum, m) => sum + m.engagementScore, 0) / metrics.length 
      : 0;

    return {
      totalParticipants: metrics.length,
      averageEngagementScore: Math.round(avgScore),
      mostEngagedGuests: this.getTopEngagedGuests(5),
      membersByEngagementLevel: {
        high: metrics.filter(m => m.engagementScore >= 150).length,
        medium: metrics.filter(m => m.engagementScore >= 75 && m.engagementScore < 150).length,
        low: metrics.filter(m => m.engagementScore < 75).length,
      },
      interactions: {
        totalFeedback: this.feedback.length,
        totalPolls: this.polls.size,
        totalQuestions: this.qaQuestions.length,
        averageResponseTime: this.calculateAverageResponseTime(),
      },
    };
  }

  /**
   * Calculate average response time for Q&A
   */
  calculateAverageResponseTime() {
    const answeredQuestions = this.qaQuestions.filter(q => q.answers.length > 0);
    if (answeredQuestions.length === 0) return 0;

    const times = answeredQuestions.map(q => {
      const firstAnswer = q.answers[0];
      return firstAnswer.timestamp - q.timestamp;
    });

    const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
    return Math.round(avgMs / 1000 / 60); // Convert to minutes
  }

  /**
   * SUBSCRIPTION SYSTEM
   */

  /**
   * Subscribe to engagement events
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers
   */
  notifySubscribers(eventType, data) {
    this.subscribers.forEach(callback => {
      try {
        callback({ eventType, data, timestamp: new Date() });
      } catch (error) {
        console.error('Subscriber notification error:', error);
      }
    });
  }

  /**
   * LIVE FEEDBACK
   */

  /**
   * Submit live feedback during event (quick rating without comment)
   */
  submitLiveFeedback(guestId, eventId, rating) {
    return this.submitFeedback(guestId, {
      type: 'event',
      targetId: eventId,
      rating,
      comment: `Quick rating: ${rating} stars`,
      tags: [],
      isAnonymous: true,
    });
  }

  /**
   * Get real-time sentiment for ongoing event
   */
  getLiveEventSentiment(eventId) {
    const eventFeedback = this.feedback.filter(
      f => f.targetId === eventId && 
      Date.now() - f.timestamp < 30 * 60 * 1000 // Last 30 minutes
    );

    const sentiments = {
      positive: eventFeedback.filter(f => f.sentiment === 'positive').length,
      neutral: eventFeedback.filter(f => f.sentiment === 'neutral').length,
      negative: eventFeedback.filter(f => f.sentiment === 'negative').length,
    };

    const avgRating = eventFeedback.length 
      ? (eventFeedback.reduce((sum, f) => sum + f.rating, 0) / eventFeedback.length).toFixed(1)
      : 0;

    return {
      eventId,
      sentiments,
      averageRating: parseFloat(avgRating),
      totalResponses: eventFeedback.length,
      trend: sentiments.positive > sentiments.negative ? 'positive' : 'negative',
    };
  }

  /**
   * Reset all data (for testing)
   */
  reset() {
    this.feedback = [];
    this.polls.clear();
    this.qaQuestions = [];
    this.notifications.clear();
    this.engagementMetrics.clear();
    this.notificationQueue = [];
  }
}

// Export singleton instance
export default new GuestEngagementService();
