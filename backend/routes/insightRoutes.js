import express from "express";
import Guest from "../models/Guest.js";
import { generateInsights } from "../services/insightEngine.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const guests = await Guest.find().sort("-updatedAt");
    const insights = generateInsights(guests);
    res.json(insights);
  } catch (error) {
    next(error);
  }
});

export default router;
