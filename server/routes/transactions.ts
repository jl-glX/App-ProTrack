import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const transactionsRouter = express.Router();

// Get transactions for a category
transactionsRouter.get(
  "/category/:categoryId",
  async (req: express.Request, res: express.Response) => {
    try {
      const transactions = await db
        .selectFrom("transactions")
        .selectAll()
        .where("categoryId", "=", req.params.categoryId)
        .orderBy("date", "desc")
        .execute();

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }
);

// Get transactions for a budget
transactionsRouter.get(
  "/budget/:budgetId",
  async (req: express.Request, res: express.Response) => {
    try {
      const transactions = await db
        .selectFrom("transactions")
        .selectAll()
        .where("budgetId", "=", req.params.budgetId)
        .orderBy("date", "desc")
        .execute();

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }
);

// Create transaction
transactionsRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    try {
      const { categoryId, budgetId, amount, description, date } = req.body;

      if (!categoryId || !budgetId || amount === undefined || !date) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const id = uuidv4().toString();
      const now = new Date().toISOString();

      await db
        .insertInto("transactions")
        .values({
          id,
          categoryId,
          budgetId,
          amount,
          description: description || "",
          date,
          createdAt: now,
        })
        .execute();

      // Update category spent amount
      const category = await db
        .selectFrom("categories")
        .selectAll()
        .where("id", "=", categoryId)
        .executeTakeFirst();

      if (category) {
        await db
          .updateTable("categories")
          .set({
            spent: category.spent + amount,
          })
          .where("id", "=", categoryId)
          .execute();
      }

      const transaction = await db
        .selectFrom("transactions")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  }
);

// Delete transaction
transactionsRouter.delete(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const transaction = await db
        .selectFrom("transactions")
        .selectAll()
        .where("id", "=", req.params.id)
        .executeTakeFirst();

      if (!transaction) {
        res.status(404).json({ error: "Transaction not found" });
        return;
      }

      // Update category spent amount
      const category = await db
        .selectFrom("categories")
        .selectAll()
        .where("id", "=", transaction.categoryId)
        .executeTakeFirst();

      if (category) {
        await db
          .updateTable("categories")
          .set({
            spent: Math.max(0, category.spent - transaction.amount),
          })
          .where("id", "=", transaction.categoryId)
          .execute();
      }

      await db.deleteFrom("transactions").where("id", "=", req.params.id).execute();
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  }
);
