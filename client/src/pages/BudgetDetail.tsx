import { useParams, useNavigate } from "react-router-dom";
import { useBudgetDetail } from "../hooks/useBudgets";
import { CreateCategoryDialog } from "../Components/CreateCategoryDialog";
import { AddTransactionDialog } from "../Components/AddTransactionDialog";
import { CategoryProgress } from "../Components/CategoryProgress";
import { CategoryBreakdownChart } from "../Components/CategoryBreakdownChart";
import { SpendingTrendChart } from "../Components/SpendingTrendChart";
import { CategoryPercentageChart } from "../Components/CategoryPercentageChart";
import { BudgetAnalytics } from "../Components/BudgetAnalytics";
import { Button } from "../Components/ui/button";
import { Card } from "../Components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BudgetDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    budget,
    categories,
    transactions,
    loading,
    createCategory,
    deleteCategory,
    createTransaction,
    deleteTransaction,
  } = useBudgetDetail(id || "");

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

  if (!budget) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">{t("budget.notFound")}</p>
          </div>
        </div>
      </div>
    );
  }

  const spent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = budget.totalAmount - spent;
  const percentage =
    budget.totalAmount > 0 ? (spent / budget.totalAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 tablet-padding">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2 hover-lift"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </Button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 glass-modern">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="responsive-heading text-gray-900">
                {budget.name}
              </h1>
              {budget.description && (
                <p className="responsive-text text-gray-600 mt-1">
                  {budget.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-600">{t("budget.totalBudget")}</p>
              <p className="text-2xl font-bold text-blue-600">
                ${budget.totalAmount.toFixed(2)}
              </p>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <p className="text-sm text-gray-600">{t("budget.spent")}</p>
              <p className="text-2xl font-bold text-orange-600">
                ${spent.toFixed(2)}
              </p>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-gray-600">{t("budget.remaining")}</p>
              <p className="text-2xl font-bold text-green-600">
                ${remaining.toFixed(2)}
              </p>
            </Card>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                {t("budget.overallProgress")}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  percentage > 90
                    ? "bg-red-500"
                    : percentage > 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mb-6 tablet-padding">
          <BudgetAnalytics
            categories={categories}
            totalBudget={budget.totalAmount}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 tablet-grid-2">
          <CategoryBreakdownChart categories={categories} />
          <CategoryPercentageChart categories={categories} />
        </div>

        <div className="mb-6 tablet-padding">
          <SpendingTrendChart transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 tablet-gap">
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 glass-modern">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">
                  {t("budget.categories")}
                </h2>
                <CreateCategoryDialog
                  budgetId={budget.id}
                  onCreate={createCategory}
                />
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("budget.noCategories")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover-lift"
                    >
                      <div className="flex-1">
                        <CategoryProgress category={category} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700 ml-4 tablet-touch-target"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-4 sm:p-6 sticky top-4 glass-modern">
              <h2 className="text-xl font-semibold mb-4">
                {t("budget.recentTransactions")}
              </h2>
              <AddTransactionDialog
                budgetId={budget.id}
                categories={categories}
                onAdd={createTransaction}
              />

              <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    {t("budget.noTransactions")}
                  </p>
                ) : (
                  transactions.slice(0, 10).map((transaction) => {
                    const category = categories.find(
                      (c) => c.id === transaction.categoryId,
                    );
                    return (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-start p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {category?.name || t("common.unknown")}
                          </p>
                          {transaction.description && (
                            <p className="text-xs text-gray-500">
                              {transaction.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
