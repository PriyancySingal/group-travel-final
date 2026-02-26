// import mongoose from 'mongoose';

// const eventSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, required: true },
//   description: { type: String },
//   location: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   status: { type: String, default: 'planning' },
//   organizer: { type: String, required: true },
//   logo: { type: String, default: '🎫' },
//   hotel: { type: String },
//   guestCount: { type: Number, required: true },
//   budget: { type: String, required: true },
//   createdBy: { type: String }  // ✅ NOT ObjectId
// }, { timestamps: true });

// export const Event = mongoose.model('Event', eventSchema);
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: "planning" },
    organizer: { type: String, required: true },
    logo: String,
    hotel: String,
    guestCount: { type: Number, required: true },
    budget: { type: String, required: true },

    // 🔥 THIS IS THE IMPORTANT FIX
    createdBy: {
      userId: { type: String, required: true },
      role: { type: String, required: true }
    }
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite/caching issues
export const Event =
  mongoose.models.Event || mongoose.model("Event", EventSchema);
