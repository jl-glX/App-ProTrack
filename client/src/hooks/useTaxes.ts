import { useState, useEffect } from "react";
import { TaxRate } from "./useBudgets";

export function useTaxes() {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/taxes/countries");
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getTaxesByCountry = async (country: string): Promise<TaxRate[]> => {
    if (!country || country.trim() === "") {
      console.log("getTaxesByCountry called with empty country, returning empty array");
      return [];
    }
    try {
      const response = await fetch(`/api/taxes/country/${encodeURIComponent(country)}`);
      if (!response.ok) throw new Error("Failed to fetch taxes");
      return await response.json();
    } catch (err) {
      console.error("Error fetching taxes by country:", err);
      return [];
    }
  };

  const createTaxRate = async (tax: Omit<TaxRate, "id">) => {
    try {
      const response = await fetch("/api/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tax),
      });
      if (!response.ok) throw new Error("Failed to create tax rate");
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return { countries, loading, error, getTaxesByCountry, createTaxRate };
}
