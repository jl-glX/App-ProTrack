import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const categoriesRouter = express.Router();

// Get categories for a budget
categoriesRouter.get(
  "/budget/:budgetId",
  async (req: express.Request, res: express.Response) => {
    try {
      const categories = await db
        .selectFrom("categories")
        .selectAll()
        .where("budgetId", "=", req.params.budgetId)
        .execute();

      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },
);

// Create category
categoriesRouter.post(
  "/",
  async (req: express.Request, res: express.Response) => {
    try {
      const {
        budgetId,
        name,
        limit,
        color = "#3b82f6",
        icon = "folder",
      } = req.body;

      if (!budgetId || !name || limit === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const id = uuidv4().toString();
      const now = new Date().toISOString();

      await db
        .insertInto("categories")
        .values({
          id,
          budgetId,
          name,
          limit,
          spent: 0,
          color,
          icon,
          createdAt: now,
        })
        .execute();

      const category = await db
        .selectFrom("categories")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  },
);

// Update category
categoriesRouter.put(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const { name, limit, color, icon } = req.body;

      await db
        .updateTable("categories")
        .set({
          name,
          limit,
          color,
          icon,
        })
        .where("id", "=", req.params.id)
        .execute();

      const category = await db
        .selectFrom("categories")
        .selectAll()
        .where("id", "=", req.params.id)
        .executeTakeFirst();

      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  },
);

// Delete category
categoriesRouter.delete(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      await db
        .deleteFrom("categories")
        .where("id", "=", req.params.id)
        .execute();
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
);
