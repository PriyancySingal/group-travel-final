import AISentiment from '../models/AISentiment.js';
import Guest from '../models/Guest.js';

// ==========================================
// SENTIMENT ANALYSIS ENGINE
// Simple keyword-based scoring for hackathon
// Production: Replace with NLP service (AWS Comprehend, Google NLP)
// ==========================================

// Keyword dictionaries
const POSITIVE_WORDS = [
  'great', 'amazing', 'excellent', 'fantastic', 'wonderful', 'awesome', 'perfect',
  'love', 'loved', 'like', 'enjoyed', 'fun', 'exciting', 'energizing', 'helpful',
  'good', 'nice', 'cool', 'best', 'happy', 'pleased', 'satisfied', 'impressed',
  'organized', 'smooth', 'efficient', 'friendly', 'welcoming', 'inspiring'
];

const NEGATIVE_WORDS = [
  'terrible', 'awful', 'bad', 'worst', 'hate', 'hated', 'boring', 'tired', 'exhausted',
  'disappointing', 'poor', 'slow', 'confusing', 'crowded', 'rushed', 'disorganized',
  'frustrated', 'annoyed', 'angry', 'upset', 'sad', 'unhappy', 'unsatisfied',
  'waste', 'wasted', 'mess', 'chaos', 'uncomfortable', 'stressed', 'anxious'
];

const INTENSITY_WORDS = {
  'very': 1.5,
  'extremely': 2.0,
  'really': 1.3,
  'totally': 1.4,
  'absolutely': 1.5,
  'quite': 1.2,
  'somewhat': 0.8,
  'slightly': 0.6,
  'a bit': 0.7
};

/**
 * Analyze sentiment from text feedback
 * Returns: { sentiment, score, keywords, intensity }
 */
export const analyzeTextSentiment = (text) => {
  if (!text || typeof text !== 'string') {
    return { sentiment: 'neutral', score: 0, keywords: [], intensity: 1 };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  let detectedKeywords = [];
  let intensityMultiplier = 1;
  
  // Check for intensity modifiers
  Object.entries(INTENSITY_WORDS).forEach(([modifier, multiplier]) => {
    if (lowerText.includes(modifier)) {
      intensityMultiplier = Math.max(intensityMultiplier, multiplier);
    }
  });
  
  // Count sentiment words
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    
    if (POSITIVE_WORDS.includes(cleanWord)) {
      positiveCount++;
      detectedKeywords.push({ word: cleanWord, type: 'positive' });
    } else if (NEGATIVE_WORDS.includes(cleanWord)) {
      negativeCount++;
      detectedKeywords.push({ word: cleanWord, type: 'negative' });
    }
  });
  
  // Calculate score (-1 to +1)
  let score = 0;
  if (positiveCount > 0 || negativeCount > 0) {
    const total = positiveCount + negativeCount;
    const rawScore = (positiveCount - negativeCount) / total;
    score = rawScore * intensityMultiplier;
    score = Math.max(-1, Math.min(1, score)); // Clamp to -1 to 1
  }
  
  // Determine sentiment category
  let sentiment = 'neutral';
  if (score > 0.2) sentiment = 'positive';
  else if (score < -0.2) sentiment = 'negative';
  
  return {
    sentiment,
    score: Math.round(score * 100) / 100, // Round to 2 decimals
    keywords: detectedKeywords,
    intensity: intensityMultiplier,
    positiveCount,
    negativeCount
  };
};

/**
 * Extract issues/themes from feedback text
 */
export const extractThemes = (text) => {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const themes = [];
  
  const themeKeywords = {
    'networking': ['networking', 'meet people', 'connections', 'social', ' mingle'],
    'food': ['food', 'meal', 'lunch', 'dinner', 'catering', 'delicious', 'hungry'],
    'venue': ['venue', 'location', 'room', 'space', 'accommodation', 'hotel'],
    'schedule': ['schedule', 'timing', 'rushed', 'slow', 'wait', 'delayed', 'time'],
    'activities': ['activity', 'session', 'workshop', 'game', 'fun', 'boring'],
    'organization': ['organized', 'disorganized', 'chaos', 'smooth', 'efficient', 'mess'],
    'staff': ['staff', 'host', 'organizer', 'volunteer', 'helpful', 'rude'],
    'content': ['content', 'topic', 'speaker', 'presentation', 'learn', 'informative']
  };
  
  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    if (keywords.some(kw => lowerText.includes(kw))) {
      themes.push(theme);
    }
  });
  
  return themes;
};

/**
 * Record guest feedback with sentiment analysis
 */
export const recordFeedback = async (eventId, guestId, feedbackData) => {
  const { text, rating, category = 'general', context = {} } = feedbackData;
  
  // Analyze sentiment
  const sentimentAnalysis = analyzeTextSentiment(text);
  const themes = extractThemes(text);
  
  // Create sentiment record
  const sentimentEntry = new AISentiment({
    eventId,
    guestId,
    feedback: text,
    sentiment: sentimentAnalysis.sentiment,
    sentimentScore: sentimentAnalysis.score,
    rating: rating || null,
    category,
    context: {
      ...context,
      timestamp: new Date()
    },
    keywords: sentimentAnalysis.keywords.map(k => k.word),
    themes,
    emotions: {
      happy: sentimentAnalysis.sentiment === 'positive' ? 1 : 0,
      excited: sentimentAnalysis.score > 0.5 ? 1 : 0,
      neutral: sentimentAnalysis.sentiment === 'neutral' ? 1 : 0,
      disappointed: sentimentAnalysis.sentiment === 'negative' ? 1 : 0,
      frustrated: sentimentAnalysis.score < -0.5 ? 1 : 0
    }
  });
  
  await sentimentEntry.save();
  
  // Update guest's emotional state based on feedback
  const guest = await Guest.findById(guestId);
  if (guest) {
    // Negative feedback affects emotional state
    if (sentimentAnalysis.sentiment === 'negative') {
      guest.emotionalState = 'stressed';
      guest.stressLevel = 'high';
    } else if (sentimentAnalysis.sentiment === 'positive') {
      if (guest.emotionalState === 'disengaged' || guest.emotionalState === 'stressed') {
        guest.emotionalState = 'happy';
      }
    }
    
    // Add to feedback history
    guest.appFeedbackHistory.push({
      feedback: text,
      rating,
      sentiment: sentimentAnalysis.sentiment,
      timestamp: new Date()
    });
    
    await guest.save();
  }
  
  return {
    sentimentEntry,
    analysis: sentimentAnalysis,
    themes
  };
};

/**
 * Get sentiment analytics for an event
 */
export const getSentimentAnalytics = async (eventId, timeWindowMinutes = 60) => {
  const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60000);
  
  // Get all sentiment data for event
  const sentiments = await AISentiment.find({
    eventId,
    createdAt: { $gte: cutoffTime }
  }).sort({ createdAt: -1 });
  
  // Aggregate counts
  const counts = {
    positive: sentiments.filter(s => s.sentiment === 'positive').length,
    neutral: sentiments.filter(s => s.sentiment === 'neutral').length,
    negative: sentiments.filter(s => s.sentiment === 'negative').length
  };
  
  const total = counts.positive + counts.neutral + counts.negative;
  
  // Calculate trend
  let trend = 'stable';
  if (total > 0) {
    const positiveRatio = counts.positive / total;
    const negativeRatio = counts.negative / total;
    
    if (positiveRatio > 0.6) trend = 'improving';
    else if (negativeRatio > 0.3) trend = 'declining';
    else if (positiveRatio > negativeRatio) trend = 'positive';
    else if (negativeRatio > positiveRatio) trend = 'negative';
  }
  
  // Extract common themes
  const allThemes = sentiments.flatMap(s => s.themes || []);
  const themeCounts = {};
  allThemes.forEach(theme => {
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
  });
  
  // Top issues (from negative feedback)
  const negativeFeedback = sentiments.filter(s => s.sentiment === 'negative');
  const issueThemes = negativeFeedback.flatMap(s => s.themes || []);
  const issueCounts = {};
  issueThemes.forEach(theme => {
    issueCounts[theme] = (issueCounts[theme] || 0) + 1;
  });
  
  // Recent feedback (last 10)
  const recentFeedback = sentiments.slice(0, 10).map(s => ({
    guestId: s.guestId,
    feedback: s.feedback,
    sentiment: s.sentiment,
    score: s.sentimentScore,
    timestamp: s.createdAt,
    themes: s.themes
  }));
  
  // Alert if negative sentiment high
  const alert = total > 5 && (counts.negative / total) > 0.3;
  
  return {
    timeWindow: `Last ${timeWindowMinutes} minutes`,
    totalFeedback: total,
    counts,
    trend,
    percentages: total > 0 ? {
      positive: Math.round((counts.positive / total) * 100),
      neutral: Math.round((counts.neutral / total) * 100),
      negative: Math.round((counts.negative / total) * 100)
    } : { positive: 0, neutral: 0, negative: 0 },
    topThemes: Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme, count]) => ({ theme, count })),
    issues: Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([theme, count]) => ({ theme, count })),
    recentFeedback,
    alert,
    recommendation: alert 
      ? 'Negative sentiment rising. Consider checking in with guests or adjusting activities.'
      : null
  };
};

/**
 * Get sentiment trend over time
 */
export const getSentimentTrend = async (eventId, intervals = 6, intervalMinutes = 10) => {
  const now = new Date();
  const data = [];
  
  for (let i = intervals - 1; i >= 0; i--) {
    const endTime = new Date(now.getTime() - i * intervalMinutes * 60000);
    const startTime = new Date(endTime.getTime() - intervalMinutes * 60000);
    
    const sentiments = await AISentiment.find({
      eventId,
      createdAt: { $gte: startTime, $lt: endTime }
    });
    
    const positive = sentiments.filter(s => s.sentiment === 'positive').length;
    const negative = sentiments.filter(s => s.sentiment === 'negative').length;
    const total = sentiments.length;
    
    data.push({
      time: endTime.toISOString(),
      label: `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')}`,
      positive,
      negative,
      neutral: total - positive - negative,
      total
    });
  }
  
  return data;
};

export default {
  analyzeTextSentiment,
  extractThemes,
  recordFeedback,
  getSentimentAnalytics,
  getSentimentTrend
};
