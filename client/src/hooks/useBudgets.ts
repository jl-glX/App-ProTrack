import { useState, useEffect } from "react";

export interface Budget {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  currency: string;
  country: string;
  templateId: string | null;
  taxPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  templateType: string;
  categories: TemplateCategory[];
  isEditable: boolean;
  createdAt: string;
}

export interface TemplateCategory {
  name: string;
  icon: string;
  color: string;
  percentage: number;
}

export interface TaxRate {
  id: string;
  country: string;
  taxType: string;
  percentage: number;
  description: string;
}

export interface Category {
  id: string;
  budgetId: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  budgetId: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");
      const data = await response.json();
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (
    budget: Omit<Budget, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error("Failed to create budget");
      const newBudget = await response.json();
      setBudgets([...budgets, newBudget]);
      return newBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error("Failed to update budget");
      const updated = await response.json();
      setBudgets(budgets.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete budget");
      setBudgets(budgets.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}

export function useBudgetDetail(budgetId: string) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgetDetail();
  }, [budgetId]);

  const fetchBudgetDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budgets/${budgetId}`);
      if (!response.ok) throw new Error("Failed to fetch budget");
      const data = await response.json();
      setBudget(data.budget);
      setCategories(data.categories);
      setTransactions(data.transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (
    category: Omit<Category, "id" | "createdAt" | "spent">,
  ) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error("Failed to create category");
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error("Failed to update category");
      const updated = await response.json();
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      setCategories(categories.filter((c) => c.id !== id));
      setTransactions(transactions.filter((t) => t.categoryId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const createTransaction = async (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      const newTransaction = await response.json();
      setTransactions([newTransaction, ...transactions]);
      await fetchBudgetDetail();
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      setTransactions(transactions.filter((t) => t.id !== id));
      await fetchBudgetDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return {
    budget,
    categories,
    transactions,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createTransaction,
    deleteTransaction,
    refetch: fetchBudgetDetail,
  };
}
