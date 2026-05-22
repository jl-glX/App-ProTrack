import { Kysely, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface BudgetTable {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  currency: string;
  country: string;
  templateId: string | null;
  taxPercentage: number;
  isProfessional: number;
  subtotal: number | null;
  taxAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTemplateTable {
  id: string;
  name: string;
  description: string;
  templateType: string;
  categories: string;
  isEditable: number;
  createdAt: string;
}

export interface TaxRateTable {
  id: string;
  country: string;
  taxType: string;
  percentage: number;
  description: string;
}

export interface FeedbackTable {
  id: string;
  name: string;
  email: string;
  message: string;
  rating: number | null;
  createdAt: string;
}

export interface DownloadTable {
  id: string;
  platform: string;
  version: string;
  ipAddress: string | null;
  userAgent: string | null;
  downloadedAt: string;
}

export interface CategoryTable {
  id: string;
  budgetId: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  createdAt: string;
}

export interface TransactionTable {
  id: string;
  categoryId: string;
  budgetId: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface ProfessionalBudgetItemTable {
  id: string;
  budgetId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  itemOrder: number;
  createdAt: string;
}

export interface DatabaseSchema {
  budgets: BudgetTable;
  categories: CategoryTable;
  transactions: TransactionTable;
  budget_templates: BudgetTemplateTable;
  tax_rates: TaxRateTable;
  feedback: FeedbackTable;
  downloads: DownloadTable;
  professional_budget_items: ProfessionalBudgetItemTable;
}

export function initializeDatabase() {
  const dataDirectory = process.env.DATA_DIRECTORY ?? "/home/app/data";

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  const databasePath = path.join(dataDirectory, "database.sqlite");
  const sqliteDb = new Database(databasePath);

  const db = new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({ database: sqliteDb }),
    log: ["query"],
  });

  return db;
}

export let db: Kysely<DatabaseSchema>;

export async function setupDatabase() {
  db = initializeDatabase();

  console.log("Creating database tables...");

  try {
    await db.schema
      .createTable("budgets")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("description", "text")
      .addColumn("totalAmount", "real", (col) => col.notNull())
      .addColumn("currency", "text", (col) => col.notNull().defaultTo("USD"))
      .addColumn("country", "text", (col) => col.defaultTo("US"))
      .addColumn("templateId", "text")
      .addColumn("taxPercentage", "real", (col) => col.defaultTo(0))
      .addColumn("isProfessional", "integer", (col) => col.notNull().defaultTo(0))
      .addColumn("subtotal", "real")
      .addColumn("taxAmount", "real")
      .addColumn("createdAt", "text", (col) => col.notNull())
      .addColumn("updatedAt", "text", (col) => col.notNull())
      .execute();

    await db.schema
      .createTable("categories")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("budgetId", "text", (col) =>
        col.notNull().references("budgets.id").onDelete("cascade"),
      )
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("limit", "real", (col) => col.notNull())
      .addColumn("spent", "real", (col) => col.notNull().defaultTo(0))
      .addColumn("color", "text", (col) => col.notNull())
      .addColumn("icon", "text", (col) => col.notNull())
      .addColumn("createdAt", "text", (col) => col.notNull())
      .execute();

    await db.schema
      .createTable("transactions")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("categoryId", "text", (col) =>
        col.notNull().references("categories.id").onDelete("cascade"),
      )
      .addColumn("budgetId", "text", (col) =>
        col.notNull().references("budgets.id").onDelete("cascade"),
      )
      .addColumn("amount", "real", (col) => col.notNull())
      .addColumn("description", "text")
      .addColumn("date", "text", (col) => col.notNull())
      .addColumn("createdAt", "text", (col) => col.notNull())
      .execute();

    await db.schema
      .createTable("budget_templates")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("description", "text")
      .addColumn("templateType", "text", (col) => col.notNull())
      .addColumn("categories", "text", (col) => col.notNull())
      .addColumn("isEditable", "integer", (col) => col.defaultTo(1))
      .addColumn("createdAt", "text", (col) => col.notNull())
      .execute();

    await db.schema
      .createTable("tax_rates")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("country", "text", (col) => col.notNull())
      .addColumn("taxType", "text", (col) => col.notNull())
      .addColumn("percentage", "real", (col) => col.notNull())
      .addColumn("description", "text")
      .execute();

    await db.schema
      .createTable("feedback")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("email", "text", (col) => col.notNull())
      .addColumn("message", "text", (col) => col.notNull())
      .addColumn("rating", "integer")
      .addColumn("createdAt", "text", (col) => col.notNull())
      .execute();

    try {
      await db.schema
        .createIndex("idx_feedback_created")
        .on("feedback")
        .column("createdAt")
        .execute();
    } catch (err: any) {
      // Silently ignore if index already exists
    }

    await db.schema
      .createTable("downloads")
      .ifNotExists()
      .addColumn("id", "text", (col) => col.primaryKey())
      .addColumn("platform", "text", (col) => col.notNull())
      .addColumn("version", "text", (col) => col.notNull())
      .addColumn("ipAddress", "text")
      .addColumn("userAgent", "text")
      .addColumn("downloadedAt", "text", (col) => col.notNull())
      .execute();

    try {
      await db.schema
        .createIndex("idx_downloads_date")
        .on("downloads")
        .column("downloadedAt")
        .execute();
    } catch (err: any) {
      // Silently ignore if index already exists
    }

    try {
      await db.schema
        .createIndex("idx_downloads_platform")
        .on("downloads")
        .column("platform")
        .execute();
    } catch (err: any) {
      // Silently ignore if index already exists
    }

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
    throw error;
  }
}
