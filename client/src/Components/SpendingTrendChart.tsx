import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "./ui/card";
import { Transaction } from "../hooks/useBudgets";

interface SpendingTrendChartProps {
  transactions: Transaction[];
}

export function SpendingTrendChart({ transactions }: SpendingTrendChartProps) {
  const { t } = useTranslation();

  const dataByDate: Record<string, number> = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    dataByDate[date] = (dataByDate[date] || 0) + transaction.amount;
  });

  const data = Object.entries(dataByDate)
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime(),
    )
    .map(([date, amount]) => ({
      date,
      [t("charts.amount")]: amount,
    }));

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("charts.spendingTrend")}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {t("budget.noTransactions")}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t("charts.spendingTrend")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {/* @ts-ignore */}
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={t("charts.amount")}
            stroke="#3b82f6"
            dot={{ fill: "#3b82f6" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
