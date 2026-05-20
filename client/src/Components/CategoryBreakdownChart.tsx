import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "./ui/card";
import { Category } from "../hooks/useBudgets";

interface CategoryBreakdownChartProps {
  categories: Category[];
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#84cc16",
];

export function CategoryBreakdownChart({
  categories,
}: CategoryBreakdownChartProps) {
  const { t } = useTranslation();

  const data = categories
    .map((cat) => ({
      name: cat.name,
      value: cat.spent,
      limit: cat.limit,
    }))
    .filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("charts.categoryBreakdown")}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {t("common.loading")}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t("charts.categoryBreakdown")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* @ts-ignore */}
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <div key={cat.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{cat.name}</p>
              <p className="text-xs text-gray-500">
                ${cat.spent.toFixed(2)} / ${cat.limit.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
