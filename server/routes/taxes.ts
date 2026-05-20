import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const taxesRouter = express.Router();

interface TaxRate {
  id: string;
  country: string;
  taxType: string;
  percentage: number;
  description: string;
}

// Default tax rates by country
const DEFAULT_TAX_RATES: TaxRate[] = [
  // US
  { id: "us-sales-ca", country: "US", taxType: "Sales Tax (CA)", percentage: 8.25, description: "California sales tax" },
  { id: "us-sales-ny", country: "US", taxType: "Sales Tax (NY)", percentage: 8.875, description: "New York sales tax" },
  { id: "us-sales-tx", country: "US", taxType: "Sales Tax (TX)", percentage: 8.25, description: "Texas sales tax" },
  { id: "us-sales-wa", country: "US", taxType: "Sales Tax (WA)", percentage: 10.25, description: "Washington sales tax" },
  { id: "us-income-fed", country: "US", taxType: "Federal Income Tax", percentage: 22, description: "Average federal income tax" },
  { id: "us-income-state", country: "US", taxType: "State Income Tax", percentage: 5, description: "Average state income tax" },

  // Canada
  { id: "ca-gst", country: "Canada", taxType: "GST (Federal)", percentage: 5, description: "Canada Goods and Services Tax" },
  { id: "ca-pst-bc", country: "Canada", taxType: "PST (BC)", percentage: 7, description: "British Columbia Provincial Sales Tax" },
  { id: "ca-hst-on", country: "Canada", taxType: "HST (ON)", percentage: 13, description: "Ontario Harmonized Sales Tax" },
  { id: "ca-income-fed", country: "Canada", taxType: "Federal Income Tax", percentage: 20, description: "Average federal income tax" },
  { id: "ca-income-prov", country: "Canada", taxType: "Provincial Income Tax", percentage: 10, description: "Average provincial income tax" },

  // UK
  { id: "uk-vat-standard", country: "UK", taxType: "VAT (Standard)", percentage: 20, description: "Standard VAT rate" },
  { id: "uk-vat-reduced", country: "UK", taxType: "VAT (Reduced)", percentage: 5, description: "Reduced VAT rate" },
  { id: "uk-income", country: "UK", taxType: "Income Tax", percentage: 20, description: "Standard income tax" },
  { id: "uk-ni", country: "UK", taxType: "National Insurance", percentage: 8, description: "National Insurance contribution" },

  // Spain
  { id: "es-iva-standard", country: "Spain", taxType: "IVA (Standard)", percentage: 21, description: "Spanish standard VAT" },
  { id: "es-iva-reduced", country: "Spain", taxType: "IVA (Reduced)", percentage: 10, description: "Spanish reduced VAT" },
  { id: "es-income", country: "Spain", taxType: "Income Tax", percentage: 25, description: "Average income tax" },

  // France
  { id: "fr-vat-standard", country: "France", taxType: "TVA (Standard)", percentage: 20, description: "French standard VAT" },
  { id: "fr-vat-reduced", country: "France", taxType: "TVA (Reduced)", percentage: 10, description: "French reduced VAT" },
  { id: "fr-income", country: "France", taxType: "Income Tax", percentage: 25, description: "Average income tax" },

  // Germany
  { id: "de-mwst-standard", country: "Germany", taxType: "MwSt (Standard)", percentage: 19, description: "German standard VAT" },
  { id: "de-mwst-reduced", country: "Germany", taxType: "MwSt (Reduced)", percentage: 7, description: "German reduced VAT" },
  { id: "de-income", country: "Germany", taxType: "Income Tax", percentage: 22, description: "Average income tax" },

  // Mexico
  { id: "mx-iva", country: "Mexico", taxType: "IVA", percentage: 16, description: "Mexican VAT" },
  { id: "mx-income", country: "Mexico", taxType: "Income Tax", percentage: 20, description: "Average income tax" },

  // Japan
  { id: "jp-consumption", country: "Japan", taxType: "Consumption Tax", percentage: 10, description: "Japanese consumption tax" },
  { id: "jp-income", country: "Japan", taxType: "Income Tax", percentage: 20, description: "Average income tax" },

  // Australia
  { id: "au-gst", country: "Australia", taxType: "GST", percentage: 10, description: "Australian Goods and Services Tax" },
  { id: "au-income", country: "Australia", taxType: "Income Tax", percentage: 32.5, description: "Average income tax" },
];

// Get taxes by country
taxesRouter.get("/country/:country", async (req: express.Request, res: express.Response) => {
  try {
    const country = req.params.country;
    const defaultTaxes = DEFAULT_TAX_RATES.filter((t) => t.country === country);
    const customTaxes = await db
      .selectFrom("tax_rates")
      .selectAll()
      .where("country", "=", country)
      .execute();

    const taxes = [...defaultTaxes, ...customTaxes];
    res.json(taxes);
  } catch (error) {
    console.error("Error fetching taxes:", error);
    res.status(500).json({ error: "Failed to fetch taxes" });
  }
});

// Get all unique countries
taxesRouter.get("/countries", async (_req: express.Request, res: express.Response) => {
  try {
    const countries = Array.from(new Set(DEFAULT_TAX_RATES.map((t) => t.country))).sort();
    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// Create custom tax rate
taxesRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { country, taxType, percentage, description } = req.body;

    if (!country || !taxType || percentage === undefined) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = uuidv4().toString();

    await db
      .insertInto("tax_rates")
      .values({
        id,
        country,
        taxType,
        percentage,
        description: description || "",
      })
      .execute();

    res.status(201).json({
      id,
      country,
      taxType,
      percentage,
      description,
    });
  } catch (error) {
    console.error("Error creating tax rate:", error);
    res.status(500).json({ error: "Failed to create tax rate" });
  }
});

// Update custom tax rate
taxesRouter.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { taxType, percentage, description } = req.body;

    await db
      .updateTable("tax_rates")
      .set({
        taxType,
        percentage,
        description,
      })
      .where("id", "=", req.params.id)
      .execute();

    const updated = await db
      .selectFrom("tax_rates")
      .selectAll()
      .where("id", "=", req.params.id)
      .executeTakeFirst();

    if (!updated) {
      res.status(404).json({ error: "Tax rate not found" });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating tax rate:", error);
    res.status(500).json({ error: "Failed to update tax rate" });
  }
});

// Delete custom tax rate
taxesRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    await db.deleteFrom("tax_rates").where("id", "=", req.params.id).execute();
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting tax rate:", error);
    res.status(500).json({ error: "Failed to delete tax rate" });
  }
});
