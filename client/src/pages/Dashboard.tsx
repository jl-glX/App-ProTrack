import { useBudgets } from "../hooks/useBudgets";
import { BudgetCard } from "../Components/BudgetCard";
import { LanguageSelector } from "../Components/LanguageSelector";
import { FeedbackForms } from "../Components/FeedbackForms";
import { Button } from "../Components/ui/button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Layout, Heart } from "lucide-react";

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { budgets, loading, deleteBudget } = useBudgets();
  const [budgetCategories, setBudgetCategories] = useState<
    Record<string, any[]>
  >({});

  useEffect(() => {
    if (budgets.length > 0) {
      fetchCategoriesForBudgets();
    }
  }, [budgets]);

  const fetchCategoriesForBudgets = async () => {
    const categoriesMap: Record<string, any[]> = {};
    for (const budget of budgets) {
      try {
        const response = await fetch(`/api/categories/budget/${budget.id}`);
        if (response.ok) {
          categoriesMap[budget.id] = await response.json();
        }
      } catch (error) {
        console.error(
          `Failed to fetch categories for budget ${budget.id}:`,
          error,
        );
      }
    }
    setBudgetCategories(categoriesMap);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 tablet-padding">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="responsive-heading gradient-text animate-fade-in">
                {t("dashboard.title")}
              </h1>
              <p className="responsive-text text-gray-600 mt-1">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <LanguageSelector />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate("/create-budget")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("dialog.newBudget")}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/templates")}
              className="gap-2"
            >
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("dashboard.templates")}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/downloads")}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("dashboard.download")}
              </span>
            </Button>
            <FeedbackForms />
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-8 md:p-12 text-center">
            <p className="text-gray-600 mb-4">{t("dashboard.noBudgets")}</p>
            <p className="text-gray-500 text-sm">
              {t("dashboard.noBudgetsDesc")}
            </p>
            <Button
              className="mt-4 w-full sm:w-auto gap-2"
              onClick={() => navigate("/create-budget")}
            >
              <Plus className="w-4 h-4" />
              {t("dashboard.createBudget")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tablet-grid-2">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                categories={budgetCategories[budget.id] || []}
                onDelete={deleteBudget}
              />
            ))}
          </div>
        )}

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="mb-6 px-4">
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
              {t("footer.pioneerMessage")}
            </p>
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-600 text-xs">
                {t("footer.supportMessage")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://paypal.me/yourpaypallink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Heart className="w-4 h-4" />
                  PayPal
                </a>
                <a
                  href="https://ko-fi.com/yourkofilink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Heart className="w-4 h-4" />
                  Ko-fi
                </a>
                <a
                  href="https://github.com/sponsors/yourgithubusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Heart className="w-4 h-4" />
                  GitHub Sponsors
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <button
              onClick={() => navigate("/legal/privacy")}
              className="hover:text-primary transition-colors"
            >
              {t("legal.privacy.title")}
            </button>
            <button
              onClick={() => navigate("/legal/terms")}
              className="hover:text-primary transition-colors"
            >
              {t("legal.terms.title")}
            </button>
            <button
              onClick={() => navigate("/legal/cookies")}
              className="hover:text-primary transition-colors"
            >
              {t("legal.cookies.title")}
            </button>
          </div>
          <p>
            © {new Date().getFullYear()} {t("common.appName")}. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
