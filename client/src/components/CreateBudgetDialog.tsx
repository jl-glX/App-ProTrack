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
import { Budget } from "../hooks/useBudgets";
import { useTranslation } from "react-i18next";
import { CurrencySelector } from "./CurrencySelector";

interface CreateBudgetDialogProps {
  onCreate: (
    budget: Omit<Budget, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
}

export function CreateBudgetDialog({ onCreate }: CreateBudgetDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalAmount: "",
    currency: "USD",
    country: "US",
    templateId: null as string | null,
    taxPercentage: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({
        name: formData.name,
        description: formData.description,
        totalAmount: parseFloat(formData.totalAmount),
        currency: formData.currency,
        country: formData.country,
        templateId: formData.templateId,
        taxPercentage: formData.taxPercentage,
      });
      setFormData({
        name: "",
        description: "",
        totalAmount: "",
        currency: "USD",
        country: "US",
        templateId: null,
        taxPercentage: 0,
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
          {t("dialog.newBudget")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.createBudget")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t("forms.budgetName")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Monthly Budget"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">{t("forms.budgetDescription")}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("forms.optional")}
            />
          </div>
          <div>
            <Label htmlFor="amount">{t("forms.totalAmount")}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, totalAmount: e.target.value })
              }
              placeholder="0.00"
              required
            />
          </div>
          <CurrencySelector
            value={formData.currency}
            onChange={(value) => setFormData({ ...formData, currency: value })}
            label={t("forms.currency")}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("forms.creating") : t("dialog.createBudget")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
