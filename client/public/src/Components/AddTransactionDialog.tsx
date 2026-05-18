import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus } from "lucide-react";
import { Category, Transaction } from "../hooks/useBudgets";
import { useTranslation } from "react-i18next";

interface AddTransactionDialogProps {
  budgetId: string;
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, "id" | "createdAt">) => Promise<void>;
}

export function AddTransactionDialog({
  budgetId,
  categories,
  onAdd,
}: AddTransactionDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({
        categoryId: formData.categoryId,
        budgetId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
      });
      setFormData({
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t("dialog.addTransaction")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.addTransaction")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">{t("budget.categories")}</Label>
            <Select value={formData.categoryId} onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }>
              <SelectTrigger id="category">
                <SelectValue placeholder={t("forms.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">{t("forms.transactionAmount")}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">{t("forms.transactionDescription")}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("forms.optional")}
            />
          </div>
          <div>
            <Label htmlFor="date">{t("forms.transactionDate")}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !formData.categoryId}>
            {loading ? t("forms.adding") : t("dialog.addTransaction")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
