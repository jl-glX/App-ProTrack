import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus } from "lucide-react";
import { Category } from "../hooks/useBudgets";
import { useTranslation } from "react-i18next";

interface CreateCategoryDialogProps {
  budgetId: string;
  onCreate: (
    category: Omit<Category, "id" | "createdAt" | "spent">,
  ) => Promise<void>;
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];
const ICONS = ["wallet", "shopping", "fork", "home", "heart", "book"];

export function CreateCategoryDialog({
  budgetId,
  onCreate,
}: CreateCategoryDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    limit: "",
    color: COLORS[0],
    icon: ICONS[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({
        budgetId,
        name: formData.name,
        limit: parseFloat(formData.limit),
        color: formData.color,
        icon: formData.icon,
      });
      setFormData({ name: "", limit: "", color: COLORS[0], icon: ICONS[0] });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          {t("budget.addCategory")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.createCategory")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cat-name">{t("budget.categoryName")}</Label>
            <Input
              id="cat-name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Groceries"
              required
            />
          </div>
          <div>
            <Label htmlFor="cat-limit">{t("budget.monthlyLimit")}</Label>
            <Input
              id="cat-limit"
              type="number"
              step="0.01"
              value={formData.limit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, limit: e.target.value })
              }
              placeholder="0.00"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("forms.color")}</Label>
              <div className="flex gap-2 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>{t("forms.icon")}</Label>
              <Input
                value={formData.icon}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="e.g., wallet"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("forms.creating") : t("dialog.createCategory")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
