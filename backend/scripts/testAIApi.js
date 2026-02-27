/**
 * API Test Script for AI Insights
 * Run this to verify all AI endpoints are working
 */

import fetch from 'fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_URL || 'http://localhost:5001/api/ai';

// Test event ID (from seed)
const EVENT_ID = '69a13e361eaa6d440b2ec72f';

console.log('🧪 Testing AI Insights API Endpoints\n');
console.log(`📡 Base URL: ${BASE_URL}`);
console.log(`📋 Event ID: ${EVENT_ID}\n`);

// Test 1: Get Guests Data
async function testGetGuestsData() {
  console.log('1️⃣ Testing GET /api/ai/guests-data/:eventId');
  try {
    const response = await fetch(`${BASE_URL}/guests-data/${EVENT_ID}`);
    const data = await response.json();
    console.log('   ✅ Success:', data.success);
    console.log('   👥 Guests count:', data.data?.guests?.length || 0);
    return data.success;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 2: Get Predictions
async function testGetPredictions() {
  console.log('\n2️⃣ Testing GET /api/ai/predictions/:eventId');
  try {
    const response = await fetch(`${BASE_URL}/predictions/${EVENT_ID}`);
    const data = await response.json();
    console.log('   ✅ Success:', data.success);
    console.log('   📊 Interactions:', data.data?.interactions?.length || 0);
    console.log('   🤝 Networking:', data.data?.networking?.length || 0);
    console.log('   💑 Pairings:', data.data?.pairings?.length || 0);
    console.log('   😊 Emotional States:', data.data?.emotionalStates?.length || 0);
    console.log('   💬 Sentiment Feedback:', data.data?.sentimentTrends?.totalFeedback || 0);
    return data.success;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 3: Get Engagement Stats
async function testGetEngagementStats() {
  console.log('\n3️⃣ Testing GET /api/ai/engagement-stats/:eventId');
  try {
    const response = await fetch(`${BASE_URL}/engagement-stats/${EVENT_ID}`);
    const data = await response.json();
    console.log('   ✅ Success:', data.success);
    console.log('   📈 Stats:', JSON.stringify(data.data, null, 2));
    return data.success;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 4: Get Sentiment Analytics
async function testGetSentimentAnalytics() {
  console.log('\n4️⃣ Testing GET /api/ai/sentiment-analytics/:eventId');
  try {
    const response = await fetch(`${BASE_URL}/sentiment-analytics/${EVENT_ID}`);
    const data = await response.json();
    console.log('   ✅ Success:', data.success);
    console.log('   💬 Sentiments:', JSON.stringify(data.data?.sentiments, null, 2));
    return data.success;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Test 5: Track Sentiment (POST)
async function testTrackSentiment() {
  console.log('\n5️⃣ Testing POST /api/ai/track-sentiment');
  try {
    const response = await fetch(`${BASE_URL}/track-sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: EVENT_ID,
        guestId: '507f1f77bcf86cd799439011', // Sample ID
        feedback: 'This is an amazing event! I love the activities!',
        rating: 5,
        category: 'overall'
      })
    });
    const data = await response.json();
    console.log('   ✅ Success:', data.success);
    return data.success;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('='.repeat(50));
  console.log('🚀 Starting AI Insights API Tests');
  console.log('='.repeat(50) + '\n');

  const results = [];

  results.push(await testGetGuestsData());
  results.push(await testGetPredictions());
  results.push(await testGetEngagementStats());
  results.push(await testGetSentimentAnalytics());
  // Skip track sentiment test without auth
  // results.push(await testTrackSentiment());

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`   ✅ Passed: ${results.filter(r => r).length}`);
  console.log(`   ❌ Failed: ${results.filter(r => !r).length}`);

  if (results.every(r => r)) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️ Some tests failed. Check your backend connection.');
  }
}

runTests();

