import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const budgetsRouter = express.Router();

// Get all budgets
budgetsRouter.get("/", async (_req: express.Request, res: express.Response) => {
  try {
    const budgets = await db.selectFrom("budgets").selectAll().execute();
    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// Get single budget with categories and transactions
budgetsRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const budget = await db
        .selectFrom("budgets")
        .selectAll()
        .where("id", "=", req.params.id)
        .executeTakeFirst();

      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }

      const categories = await db
        .selectFrom("categories")
        .selectAll()
        .where("budgetId", "=", req.params.id)
        .execute();

      const transactions = await db
        .selectFrom("transactions")
        .selectAll()
        .where("budgetId", "=", req.params.id)
        .execute();

      res.json({ budget, categories, transactions });
    } catch (error) {
      console.error("Error fetching budget:", error);
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  },
);

// Create budget
budgetsRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const {
      name,
      description,
      totalAmount,
      currency = "USD",
      country = "US",
      templateId,
      taxPercentage = 0,
    } = req.body;

    if (!name || !totalAmount) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = uuidv4().toString();
    const now = new Date().toISOString();

    await db
      .insertInto("budgets")
      .values({
        id,
        name,
        description: description || "",
        totalAmount,
        currency,
        country,
        templateId: templateId || null,
        taxPercentage,
        isProfessional: 0,
        subtotal: null,
        taxAmount: null,
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    const budget = await db
      .selectFrom("budgets")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    res.status(201).json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ error: "Failed to create budget" });
  }
});

// Update budget
budgetsRouter.put(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const { name, description, totalAmount, currency } = req.body;
      const now = new Date().toISOString();

      await db
        .updateTable("budgets")
        .set({
          name,
          description,
          totalAmount,
          currency,
          updatedAt: now,
        })
        .where("id", "=", req.params.id)
        .execute();

      const budget = await db
        .selectFrom("budgets")
        .selectAll()
        .where("id", "=", req.params.id)
        .executeTakeFirst();

      res.json(budget);
    } catch (error) {
      console.error("Error updating budget:", error);
      res.status(500).json({ error: "Failed to update budget" });
    }
  },
);

// Delete budget
budgetsRouter.delete(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      await db.deleteFrom("budgets").where("id", "=", req.params.id).execute();
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({ error: "Failed to delete budget" });
    }
  },
);
