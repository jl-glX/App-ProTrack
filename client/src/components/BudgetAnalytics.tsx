import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";
import { Category } from "../hooks/useBudgets";
import { TrendingUp, AlertCircle } from "lucide-react";

interface BudgetAnalyticsProps {
  categories: Category[];
  totalBudget: number;
}

export function BudgetAnalytics({
  categories,
  totalBudget,
}: BudgetAnalyticsProps) {
  const { t } = useTranslation();

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const overBudgetCategories = categories.filter(
    (cat) => cat.spent > cat.limit,
  );
  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const avgCategorySpend =
    categories.length > 0 ? totalSpent / categories.length : 0;
  const highestSpentCategory =
    categories.length > 0
      ? categories.reduce((prev, current) =>
          current.spent > prev.spent ? current : prev,
        )
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">
              {t("budget.totalBudget")}
            </p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              of ${totalBudget.toFixed(2)} ({spentPercentage.toFixed(1)}%)
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">
              {t("budget.avgCategory")}
            </p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              ${avgCategorySpend.toFixed(2)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {categories.length} {t("common.categories")}
            </p>
          </div>
          <div className="w-5 h-5 text-purple-600">📊</div>
        </div>
      </Card>

      {highestSpentCategory && (
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                {t("budget.topCategory")}
              </p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {highestSpentCategory.name}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                ${highestSpentCategory.spent.toFixed(2)} {t("budget.spent")}
              </p>
            </div>
            <div className="w-5 h-5 text-orange-600">💰</div>
          </div>
        </Card>
      )}

      {overBudgetCategories.length > 0 && (
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">
                {t("budget.overBudget")}
              </p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {overBudgetCategories.length}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {overBudgetCategories.map((c) => c.name).join(", ")}
              </p>
            </div>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
        </Card>
      )}
    </div>
  );
}
