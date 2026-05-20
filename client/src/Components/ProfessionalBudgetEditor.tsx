import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TaxSelector } from "./TaxSelector";
import { useTaxes } from "../hooks/useTaxes";
import { TaxRate } from "../hooks/useBudgets";

interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ProfessionalBudgetEditorProps {
  onSave: (data: {
    items: BudgetItem[];
    subtotal: number;
    taxPercentage: number;
    taxAmount: number;
    total: number;
    country: string;
  }) => void;
  initialData?: {
    items: BudgetItem[];
    country: string;
    taxPercentage: number;
  };
}

export function ProfessionalBudgetEditor({
  onSave,
  initialData,
}: ProfessionalBudgetEditorProps) {
  const { t } = useTranslation();
  const { countries, getTaxesByCountry } = useTaxes();
  const [items, setItems] = useState<BudgetItem[]>(
    initialData?.items || [
      { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 },
    ],
  );
  const [country, setCountry] = useState(initialData?.country || "US");
  const [taxes, setTaxes] = useState<TaxRate[]>([]);
  const [selectedTax, setSelectedTax] = useState<TaxRate | null>(null);
  const [taxPercentage, setTaxPercentage] = useState(
    initialData?.taxPercentage || 0,
  );

  const loadTaxesForCountry = async (countryCode: string) => {
    const taxData = await getTaxesByCountry(countryCode);
    setTaxes(taxData);
    setSelectedTax(null);
    setTaxPercentage(0);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    loadTaxesForCountry(newCountry);
  };

  const handleTaxSelect = (tax: TaxRate) => {
    setSelectedTax(tax);
    setTaxPercentage(tax.percentage);
  };

  const addItem = () => {
    const newId = (
      Math.max(...items.map((item) => parseInt(item.id)), 0) + 1
    ).toString();
    setItems([
      ...items,
      { id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof BudgetItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      }),
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxPercentage / 100);
  const total = subtotal + taxAmount;

  const handleSave = () => {
    onSave({
      items,
      subtotal,
      taxPercentage,
      taxAmount,
      total,
      country,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("professional.budgetItems")}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">
                  {t("professional.description")}
                </th>
                <th className="text-right py-2 px-2 w-24">
                  {t("professional.quantity")}
                </th>
                <th className="text-right py-2 px-2 w-32">
                  {t("professional.unitPrice")}
                </th>
                <th className="text-right py-2 px-2 w-32">
                  {t("professional.total")}
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-2">
                    <Input
                      value={item.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder={t("professional.itemPlaceholder")}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full text-right"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateItem(
                          item.id,
                          "unitPrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full text-right"
                    />
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    {item.total.toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button variant="outline" onClick={addItem} className="mt-4">
          <Plus className="w-4 h-4 mr-2" />
          {t("professional.addItem")}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("budget.taxConfig")}</h3>
        <TaxSelector
          countries={countries}
          selectedCountry={country}
          taxes={taxes}
          selectedTax={selectedTax}
          onCountryChange={handleCountryChange}
          onTaxChange={handleTaxSelect}
          loading={false}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("professional.summary")}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span>{t("professional.subtotal")}:</span>
            <span className="font-medium">{subtotal.toFixed(2)}</span>
          </div>

          {taxPercentage > 0 && (
            <div className="flex justify-between text-base">
              <span>
                {selectedTax?.taxType || t("tax.taxType")} ({taxPercentage}%):
              </span>
              <span className="font-medium">{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>{t("professional.total")}:</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button onClick={handleSave} size="lg">
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
