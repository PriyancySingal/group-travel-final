import express from "express";
import { param, validationResult } from "express-validator";
import {
  createGuest,
  getGuests,
  updateGuest,
  deleteGuest
} from "../controllers/guestController.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/", createGuest);
router.get("/", getGuests);
router.put(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid guest ID")],
  validate,
  updateGuest
);
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid guest ID")],
  validate,
  deleteGuest
);

export default router;
