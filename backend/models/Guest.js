import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: Number,
    city: String,
    interests: [String],
    budget: Number,
    isFirstTime: Boolean,
    preferredInteraction: String,
    availability: String,
    energyLevel: String,
    feedback: String,
    status: {
      type: String,
      enum: ["invited", "confirmed", "declined", "attended"],
      default: "invited"
    },
    professionalInterests: [String],
    personalityTraits: [String],
    socialBehavior: String,
    socialMediaActivity: {
      type: Number,
      default: 0
    },
    eventAttendanceCount: {
      type: Number,
      default: 0
    },
    personalityType: {
      type: String,
      enum: ["introvert", "extravert", "ambivert"],
      default: "ambivert"
    },
    openToNetworking: {
      type: Boolean,
      default: true
    },
    groupActivityPreference: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate"
    },
    communicationStyle: {
      type: String,
      enum: ["formal", "casual", "balanced"],
      default: "balanced"
    },
    professionalIndustry: String,
    hobbyInterests: [String],
    stressLevel: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal"
    },
    engagementScore: {
      type: Number,
      default: 50
    },
    recentSocialActivity: String,
    socialPosts: [String],
    notes: String,
    appFeedbackHistory: [
      {
        text: String,
        rating: Number,
        topic: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Guest", GuestSchema);
