import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const professionalBudgetsRouter = express.Router();

// Create professional budget
professionalBudgetsRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    try {
      const {
        name,
        description,
        currency = "USD",
        country = "US",
        totalAmount,
        taxPercentage = 0,
        items,
        subtotal,
        taxAmount,
      } = req.body;

      if (!name || !totalAmount || !items || items.length === 0) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const id = uuidv4().toString();
      const now = new Date().toISOString();

      // Create budget
      await db
        .insertInto("budgets")
        .values({
          id,
          name,
          description: description || "",
          totalAmount,
          currency,
          country,
          templateId: null,
          taxPercentage,
          isProfessional: 1,
          subtotal,
          taxAmount,
          createdAt: now,
          updatedAt: now,
        })
        .execute();

      // Create budget items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await db
          .insertInto("professional_budget_items")
          .values({
            id: uuidv4().toString(),
            budgetId: id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            itemOrder: i,
            createdAt: now,
          })
          .execute();
      }

      const budget = await db
        .selectFrom("budgets")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

      res.status(201).json(budget);
    } catch (error) {
      console.error("Error creating professional budget:", error);
      res.status(500).json({ error: "Failed to create professional budget" });
    }
  },
);

// Get professional budget items
professionalBudgetsRouter.get(
  "/:id/items",
  async (req: express.Request, res: express.Response) => {
    try {
      const items = await db
        .selectFrom("professional_budget_items")
        .selectAll()
        .where("budgetId", "=", req.params.id)
        .orderBy("itemOrder", "asc")
        .execute();

      res.json(items);
    } catch (error) {
      console.error("Error fetching professional budget items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  },
);

// Update professional budget
professionalBudgetsRouter.put(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const {
        name,
        description,
        currency,
        country,
        totalAmount,
        taxPercentage,
        items,
        subtotal,
        taxAmount,
      } = req.body;

      const now = new Date().toISOString();

      // Update budget
      await db
        .updateTable("budgets")
        .set({
          name,
          description,
          currency,
          country,
          totalAmount,
          taxPercentage,
          subtotal,
          taxAmount,
          updatedAt: now,
        })
        .where("id", "=", req.params.id)
        .execute();

      // Delete old items
      await db
        .deleteFrom("professional_budget_items")
        .where("budgetId", "=", req.params.id)
        .execute();

      // Create new items
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          await db
            .insertInto("professional_budget_items")
            .values({
              id: uuidv4().toString(),
              budgetId: req.params.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
              itemOrder: i,
              createdAt: now,
            })
            .execute();
        }
      }

      const budget = await db
        .selectFrom("budgets")
        .selectAll()
        .where("id", "=", req.params.id)
        .executeTakeFirst();

      res.json(budget);
    } catch (error) {
      console.error("Error updating professional budget:", error);
      res.status(500).json({ error: "Failed to update professional budget" });
    }
  },
);
