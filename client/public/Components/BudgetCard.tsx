import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Budget, Category } from "../hooks/useBudgets";
import { useTranslation } from "react-i18next";

interface BudgetCardProps {
  budget: Budget;
  categories: Category[];
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, categories, onDelete }: BudgetCardProps) {
  const { t } = useTranslation();
  const spent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const percentage = budget.totalAmount > 0 ? (spent / budget.totalAmount) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{budget.name}</h3>
          <p className="text-sm text-gray-600">{budget.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(budget.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{budget.currency}</span>
            <span className="text-sm font-medium">
              ${spent.toFixed(2)} / ${budget.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2">
            {categories.length} {t("common.categories")}
          </p>
          <Link to={`/budgets/${budget.id}`}>
            <Button className="w-full">{t("common.viewDetails")}</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
