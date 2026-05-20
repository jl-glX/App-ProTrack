import { Category } from "../hooks/useBudgets";
import { Progress } from "./ui/progress";
import { useTranslation } from "react-i18next";

interface CategoryProgressProps {
  category: Category;
}

export function CategoryProgress({ category }: CategoryProgressProps) {
  const { t } = useTranslation();
  const percentage =
    category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
  const isOverBudget = category.spent > category.limit;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-sm">{category.name}</p>
          <p className="text-xs text-gray-500">
            ${category.spent.toFixed(2)} / ${category.limit.toFixed(2)}
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
          style={{ backgroundColor: category.color }}
        >
          {category.icon.charAt(0).toUpperCase()}
        </div>
      </div>
      {/* @ts-ignore */}
      <Progress value={Math.min(percentage, 100)} className="h-2" />
      {isOverBudget && (
        <p className="text-xs text-red-600">
          {t("budget.overBudgetBy")} $
          {(category.spent - category.limit).toFixed(2)}
        </p>
      )}
    </div>
  );
}
