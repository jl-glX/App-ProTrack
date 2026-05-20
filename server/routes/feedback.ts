import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";
import {
  feedbackLimiter,
  validateFeedbackInput,
  handleValidationErrors,
  verifyCaptcha,
} from "../middleware/security.js";

export const feedbackRouter = express.Router();

// Get all feedback (admin only - add authentication in production)
feedbackRouter.get("/", async (_req, res) => {
  try {
    const feedback = await db
      .selectFrom("feedback")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();

    res.json(feedback);
    return;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
    return;
  }
});

// Submit feedback
feedbackRouter.post(
  "/",
  feedbackLimiter,
  validateFeedbackInput,
  handleValidationErrors,
  async (req: any, res: any) => {
    try {
      const { name, email, message, rating, captchaToken } = req.body;

      // Verify CAPTCHA
      if (captchaToken) {
        const isValid = await verifyCaptcha(captchaToken);
        if (!isValid) {
          res.status(400).json({ error: "CAPTCHA verification failed" });
          return;
        }
      }

      const feedback = {
        id: uuidv4(),
        name,
        email,
        message,
        rating: rating || null,
        createdAt: new Date().toISOString(),
      };

      await db.insertInto("feedback").values(feedback).execute();

      res
        .status(201)
        .json({ success: true, message: "Feedback submitted successfully" });
      return;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
      return;
    }
  },
);

// Get feedback statistics
feedbackRouter.get("/stats", async (_req, res) => {
  try {
    const total = await db
      .selectFrom("feedback")
      .select((eb) => eb.fn.count("id").as("count"))
      .executeTakeFirst();

    const avgRating = await db
      .selectFrom("feedback")
      .select((eb) => eb.fn.avg("rating").as("average"))
      .where("rating", "is not", null)
      .executeTakeFirst();

    res.json({
      total: total?.count || 0,
      averageRating: avgRating?.average || 0,
    });
    return;
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    res.status(500).json({ error: "Failed to fetch feedback statistics" });
    return;
  }
});
