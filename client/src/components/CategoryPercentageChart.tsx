import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "./ui/card";
import { Category } from "../hooks/useBudgets";

interface CategoryPercentageChartProps {
  categories: Category[];
}

export function CategoryPercentageChart({
  categories,
}: CategoryPercentageChartProps) {
  const { t } = useTranslation();

  const data = categories.map((cat) => ({
    name: cat.name.length > 12 ? cat.name.substring(0, 12) + "..." : cat.name,
    percentage: cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0,
    spent: cat.spent,
    limit: cat.limit,
  }));

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("budget.categories")}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {t("budget.noCategories")}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t("budget.categories")} {t("charts.percentage")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* @ts-ignore */}
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis label={{ value: "%", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, "Usage"]}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          />
          <Legend />
          <Bar
            dataKey="percentage"
            fill="#10b981"
            name={`${t("budget.categories")} ${t("charts.percentage")}`}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
