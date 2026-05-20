import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const templatesRouter = express.Router();

interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  templateType: string;
  categories: any[];
  isEditable: boolean;
  createdAt: string;
}

// Default budget templates
const DEFAULT_TEMPLATES: BudgetTemplate[] = [
  {
    id: "student",
    name: "Student Budget",
    description: "Budget template for students",
    templateType: "student",
    categories: [
      { name: "Tuition & Books", icon: "book", color: "#3b82f6", percentage: 40 },
      { name: "Housing", icon: "home", color: "#ef4444", percentage: 25 },
      { name: "Food & Dining", icon: "utensils", color: "#f59e0b", percentage: 15 },
      { name: "Transportation", icon: "car", color: "#8b5cf6", percentage: 10 },
      { name: "Entertainment", icon: "music", color: "#ec4899", percentage: 7 },
      { name: "Utilities", icon: "zap", color: "#06b6d4", percentage: 3 },
    ],
    isEditable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "family",
    name: "Family Budget",
    description: "Comprehensive budget for families",
    templateType: "family",
    categories: [
      { name: "Housing", icon: "home", color: "#ef4444", percentage: 30 },
      { name: "Groceries", icon: "shopping-cart", color: "#10b981", percentage: 15 },
      { name: "Utilities", icon: "zap", color: "#06b6d4", percentage: 8 },
      { name: "Transportation", icon: "car", color: "#8b5cf6", percentage: 12 },
      { name: "Healthcare", icon: "heart", color: "#f472b6", percentage: 8 },
      { name: "Education", icon: "book", color: "#3b82f6", percentage: 10 },
      { name: "Entertainment", icon: "music", color: "#fbbf24", percentage: 8 },
      { name: "Savings", icon: "piggy-bank", color: "#059669", percentage: 9 },
    ],
    isEditable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "freelancer",
    name: "Freelancer Budget",
    description: "Budget for freelancers and self-employed",
    templateType: "freelancer",
    categories: [
      { name: "Equipment & Software", icon: "monitor", color: "#3b82f6", percentage: 15 },
      { name: "Office Supplies", icon: "briefcase", color: "#06b6d4", percentage: 5 },
      { name: "Living Expenses", icon: "home", color: "#ef4444", percentage: 35 },
      { name: "Healthcare & Insurance", icon: "heart", color: "#f472b6", percentage: 12 },
      { name: "Marketing & Advertising", icon: "megaphone", color: "#f59e0b", percentage: 8 },
      { name: "Professional Development", icon: "book", color: "#8b5cf6", percentage: 7 },
      { name: "Tax Reserve", icon: "briefcase", color: "#dc2626", percentage: 10 },
      { name: "Savings & Investments", icon: "piggy-bank", color: "#10b981", percentage: 8 },
    ],
    isEditable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "minimalist",
    name: "Minimalist Budget",
    description: "Simple and minimal budget",
    templateType: "minimalist",
    categories: [
      { name: "Essential Expenses", icon: "home", color: "#ef4444", percentage: 60 },
      { name: "Discretionary", icon: "music", color: "#f59e0b", percentage: 20 },
      { name: "Savings", icon: "piggy-bank", color: "#10b981", percentage: 20 },
    ],
    isEditable: true,
    createdAt: new Date().toISOString(),
  },
];

// Get all templates
templatesRouter.get("/", async (_req: express.Request, res: express.Response) => {
  try {
    const customTemplates = await db
      .selectFrom("budget_templates")
      .selectAll()
      .execute();

    const templates = [
      ...DEFAULT_TEMPLATES,
      ...customTemplates.map((t) => ({
        ...t,
        categories: JSON.parse(t.categories),
        isEditable: Boolean(t.isEditable),
      })),
    ];

    res.json(templates);
    return;
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
    return;
  }
});

// Get single template
templatesRouter.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const defaultTemplate = DEFAULT_TEMPLATES.find((t) => t.id === req.params.id);
    if (defaultTemplate) {
      res.json(defaultTemplate);
      return;
    }

    const customTemplate = await db
      .selectFrom("budget_templates")
      .selectAll()
      .where("id", "=", req.params.id)
      .executeTakeFirst();

    if (!customTemplate) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    res.json({
      ...customTemplate,
      categories: JSON.parse(customTemplate.categories),
      isEditable: Boolean(customTemplate.isEditable),
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

// Create custom template
templatesRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { name, description, templateType, categories } = req.body;

    if (!name || !templateType || !categories) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = uuidv4().toString();
    const now = new Date().toISOString();

    await db
      .insertInto("budget_templates")
      .values({
        id,
        name,
        description: description || "",
        templateType,
        categories: JSON.stringify(categories),
        isEditable: 1,
        createdAt: now,
      })
      .execute();

    res.status(201).json({
      id,
      name,
      description,
      templateType,
      categories,
      isEditable: true,
      createdAt: now,
    });
    return;
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ error: "Failed to create template" });
    return;
  }
});

// Update custom template
templatesRouter.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { name, description, categories } = req.body;

    await db
      .updateTable("budget_templates")
      .set({
        name,
        description,
        categories: JSON.stringify(categories),
      })
      .where("id", "=", req.params.id)
      .execute();

    const updated = await db
      .selectFrom("budget_templates")
      .selectAll()
      .where("id", "=", req.params.id)
      .executeTakeFirst();

    if (!updated) {
      res.status(404).json({ error: "Template not found" });
      return;
    }

    res.json({
      ...updated,
      categories: JSON.parse(updated.categories),
      isEditable: Boolean(updated.isEditable),
    });
    return;
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ error: "Failed to update template" });
    return;
  }
});

// Delete custom template
templatesRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    await db
      .deleteFrom("budget_templates")
      .where("id", "=", req.params.id)
      .execute();

    res.json({ success: true });
    return;
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ error: "Failed to delete template" });
    return;
  }
});
