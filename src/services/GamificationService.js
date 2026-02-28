/**
 * Gamification Service
 * Handles challenges, leaderboards, points, badges, and social engagement
 */

class GamificationService {
  constructor() {
    this.challenges = new Map();
    this.leaderboards = new Map();
    this.guestPoints = new Map();
    this.badges = new Map();
    this.guestBadges = new Map();
    this.participants = new Map();
  }

  /**
   * CHALLENGES
   */

  /**
   * Create a new challenge
   */
  createChallenge(challengeData) {
    const challenge = {
      id: `challenge-${Date.now()}`,
      name: challengeData.name,
      description: challengeData.description,
      icon: challengeData.icon || '🎯',
      category: challengeData.category, // 'networking', 'activity', 'social', 'exploration'
      difficulty: challengeData.difficulty || 'medium', // 'easy', 'medium', 'hard'
      pointsReward: challengeData.pointsReward || 50,
      badgeId: challengeData.badgeId,
      startTime: challengeData.startTime || new Date(),
      endTime: challengeData.endTime,
      isActive: true,
      participants: new Map(),
      progress: new Map(
        challengeData.participantIds?.map(id => [id, { attempts: 0, completed: false, completionTime: null }]) || []
      ),
      conditions: challengeData.conditions, // {type: 'attend', target: 'activity-1'}
      completedBy: [],
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  /**
   * Get active challenges
   */
  getActiveChallenges() {
    const now = new Date();
    return Array.from(this.challenges.values()).filter(
      c => c.isActive && (!c.endTime || c.endTime > now)
    );
  }

  /**
   * Complete a challenge for a guest
   */
  completeChallenge(challengeId, guestId) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return null;

    const progress = challenge.progress.get(guestId) || { attempts: 0, completed: false };
    progress.attempts++;

    // Mark as completed
    progress.completed = true;
    progress.completionTime = new Date();

    challenge.progress.set(guestId, progress);
    
    if (!challenge.completedBy.includes(guestId)) {
      challenge.completedBy.push(guestId);
    }

    // Award points
    this.addPoints(guestId, challenge.pointsReward, `Completed challenge: ${challenge.name}`);

    // Award badge if exists
    if (challenge.badgeId) {
      this.awardBadge(guestId, challenge.badgeId);
    }

    return progress;
  }

  /**
   * Get challenge progress for guest
   */
  getChallengeProgress(guestId) {
    return Array.from(this.challenges.values())
      .map(challenge => ({
        challengeId: challenge.id,
        name: challenge.name,
        icon: challenge.icon,
        category: challenge.category,
        progress: challenge.progress.get(guestId) || { attempts: 0, completed: false },
        pointsReward: challenge.pointsReward,
      }))
      .sort((a, b) => b.progress.completed - a.progress.completed);
  }

  /**
   * LEADERBOARDS
   */

  /**
   * Create leaderboard
   */
  createLeaderboard(boardData) {
    const leaderboard = {
      id: `lb-${Date.now()}`,
      name: boardData.name,
      type: boardData.type, // 'points', 'challenges', 'engagement', 'custom'
      metric: boardData.metric,
      period: boardData.period || 'event', // 'event', 'daily', 'weekly'
      rankings: [],
      lastUpdated: new Date(),
    };

    this.leaderboards.set(leaderboard.id, leaderboard);
    this.updateLeaderboard(leaderboard.id);
    return leaderboard;
  }

  /**
   * Update leaderboard rankings
   */
  updateLeaderboard(leaderboardId) {
    const lb = this.leaderboards.get(leaderboardId);
    if (!lb) return null;

    let rankings = [];

    if (lb.type === 'points') {
      rankings = Array.from(this.guestPoints.entries())
        .map(([guestId, entry]) => ({
          guestId,
          name: entry.name,
          avatar: entry.avatar,
          score: entry.totalPoints,
          icon: '⭐',
        }))
        .sort((a, b) => b.score - a.score);
    } else if (lb.type === 'challenges') {
      const challengeCompletions = new Map();
      this.challenges.forEach(challenge => {
        challenge.completedBy.forEach(guestId => {
          challengeCompletions.set(guestId, (challengeCompletions.get(guestId) || 0) + 1);
        });
      });

      rankings = Array.from(challengeCompletions.entries())
        .map(([guestId, count]) => ({
          guestId,
          name: this.guestPoints.get(guestId)?.name || `Guest ${guestId}`,
          avatar: this.guestPoints.get(guestId)?.avatar,
          score: count,
          icon: '🏆',
        }))
        .sort((a, b) => b.score - a.score);
    }

    // Add rank and medal
    rankings = rankings.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      medal: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎖️',
    }));

    lb.rankings = rankings;
    lb.lastUpdated = new Date();

    return lb;
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(leaderboardId, limit = 10) {
    const lb = this.leaderboards.get(leaderboardId);
    if (!lb) return null;

    return {
      ...lb,
      rankings: lb.rankings.slice(0, limit),
    };
  }

  /**
   * Get guest position on leaderboard
   */
  getGuestPosition(leaderboardId, guestId) {
    const lb = this.leaderboards.get(leaderboardId);
    if (!lb) return null;

    const position = lb.rankings.findIndex(r => r.guestId === guestId);
    if (position === -1) return null;

    return {
      rank: position + 1,
      ...lb.rankings[position],
    };
  }

  /**
   * POINTS SYSTEM
   */

  /**
   * Initialize points for guest
   */
  initializeGuest(guestId, guestName, avatar = null) {
    if (!this.guestPoints.has(guestId)) {
      this.guestPoints.set(guestId, {
        guestId,
        name: guestName,
        avatar,
        totalPoints: 0,
        history: [],
      });
    }
  }

  /**
   * Add points to guest
   */
  addPoints(guestId, amount, reason = '') {
    const entry = this.guestPoints.get(guestId);
    if (!entry) {
      this.initializeGuest(guestId, `Guest ${guestId}`);
    }

    const guest = this.guestPoints.get(guestId);
    guest.totalPoints += amount;
    guest.history.push({
      amount,
      reason,
      timestamp: new Date(),
      type: 'earned',
    });

    // Update all leaderboards
    this.leaderboards.forEach((_, lbId) => {
      this.updateLeaderboard(lbId);
    });

    return guest;
  }

  /**
   * Deduct points from guest
   */
  deductPoints(guestId, amount, reason = '') {
    const entry = this.guestPoints.get(guestId);
    if (!entry) return null;

    entry.totalPoints = Math.max(0, entry.totalPoints - amount);
    entry.history.push({
      amount,
      reason,
      timestamp: new Date(),
      type: 'deducted',
    });

    // Update all leaderboards
    this.leaderboards.forEach((_, lbId) => {
      this.updateLeaderboard(lbId);
    });

    return entry;
  }

  /**
   * Get guest points
   */
  getGuestPoints(guestId) {
    return this.guestPoints.get(guestId) || null;
  }

  /**
   * BADGES
   */

  /**
   * Create badge
   */
  createBadge(badgeData) {
    const badge = {
      id: `badge-${Date.now()}`,
      name: badgeData.name,
      description: badgeData.description,
      icon: badgeData.icon,
      rarity: badgeData.rarity || 'common', // 'common', 'uncommon', 'rare', 'legendary'
      criteria: badgeData.criteria, // What needs to be done to earn it
      earnedBy: [],
    };

    this.badges.set(badge.id, badge);
    return badge;
  }

  /**
   * Award badge to guest
   */
  awardBadge(guestId, badgeId) {
    const badge = this.badges.get(badgeId);
    if (!badge) return null;

    if (!this.guestBadges.has(guestId)) {
      this.guestBadges.set(guestId, []);
    }

    const guestBadges = this.guestBadges.get(guestId);
    if (!guestBadges.find(b => b.id === badgeId)) {
      guestBadges.push({
        ...badge,
        awardedAt: new Date(),
      });

      if (!badge.earnedBy.includes(guestId)) {
        badge.earnedBy.push(guestId);
      }
    }

    return badge;
  }

  /**
   * Get guest badges
   */
  getGuestBadges(guestId) {
    return this.guestBadges.get(guestId) || [];
  }

  /**
   * Get badge info
   */
  getBadgeInfo(badgeId) {
    return this.badges.get(badgeId) || null;
  }

  /**
   * NETWORKING CHALLENGES
   */

  /**
   * Create networking challenge between guests
   */
  createNetworkingChallenge(guestId1, guestId2, challengeType = 'meet') {
    const challenge = {
      id: `net-${Date.now()}`,
      participants: [guestId1, guestId2],
      type: challengeType, // 'meet', 'collaborate', 'exchange_contacts'
      status: 'pending', // 'pending', 'accepted', 'completed'
      createdAt: new Date(),
      completedAt: null,
      reward: 50,
    };

    return challenge;
  }

  /**
   * STATISTICS & ANALYTICS
   */

  /**
   * Get gamification statistics
   */
  getGamificationStats() {
    const guests = Array.from(this.guestPoints.values());
    const totalPoints = guests.reduce((sum, g) => sum + g.totalPoints, 0);
    const avgPoints = guests.length ? totalPoints / guests.length : 0;

    return {
      totalGuests: guests.length,
      totalPointsDistributed: totalPoints,
      averagePointsPerGuest: Math.round(avgPoints),
      activeChallenges: Array.from(this.challenges.values()).filter(c => c.isActive).length,
      totalChallengesCreated: this.challenges.size,
      totalBadgesCreated: this.badges.size,
      leaderboards: this.leaderboards.size,
      mostPopularChallenge: this.getMostPopularChallenge(),
      raresBadges: Array.from(this.badges.values()).filter(b => b.rarity === 'rare' || b.rarity === 'legendary'),
    };
  }

  /**
   * Get most popular challenge
   */
  getMostPopularChallenge() {
    const challenges = Array.from(this.challenges.values());
    if (challenges.length === 0) return null;

    let mostPopular = challenges[0];
    challenges.forEach(challenge => {
      if (challenge.completedBy.length > mostPopular.completedBy.length) {
        mostPopular = challenge;
      }
    });

    return {
      id: mostPopular.id,
      name: mostPopular.name,
      completions: mostPopular.completedBy.length,
      icon: mostPopular.icon,
    };
  }

  /**
   * Get trending challenges this week
   */
  getTrendingChallenges(limit = 5) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return Array.from(this.challenges.values())
      .filter(c => c.startTime > oneWeekAgo)
      .sort((a, b) => b.completedBy.length - a.completedBy.length)
      .slice(0, limit)
      .map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        participants: c.completedBy.length,
        difficulty: c.difficulty,
        points: c.pointsReward,
      }));
  }

  /**
   * Reset all data (for testing)
   */
  reset() {
    this.challenges.clear();
    this.leaderboards.clear();
    this.guestPoints.clear();
    this.badges.clear();
    this.guestBadges.clear();
    this.participants.clear();
  }
}

// Export singleton instance
export default new GamificationService();
