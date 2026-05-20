import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CurrencySelector } from "../components/CurrencySelector";
import { useTemplates } from "../hooks/useTemplates";
import { useTaxes } from "../hooks/useTaxes";
import { useBudgets } from "../hooks/useBudgets";
import { TemplateSelector } from "../components/TemplateSelector";
import { TaxSelector } from "../components/TaxSelector";
import { ProfessionalBudgetEditor } from "../components/ProfessionalBudgetEditor";
import { TaxRate } from "../hooks/useBudgets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CreateBudgetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createBudget } = useBudgets();
  const { templates } = useTemplates();
  const { countries, getTaxesByCountry } = useTaxes();
  const [step, setStep] = useState(1);
  const [taxes, setTaxes] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxRate | null>(null);
  const [budgetType, setBudgetType] = useState<"personal" | "professional">("personal");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalAmount: "",
    currency: "USD",
    country: "US",
    templateId: null as string | null,
    taxPercentage: 0,
  });

  useEffect(() => {
    if (formData.country) {
      loadTaxesForCountry(formData.country);
    }
  }, [formData.country]);

  const loadTaxesForCountry = async (country: string) => {
    const taxData = await getTaxesByCountry(country);
    setTaxes(taxData);
    setSelectedTax(null);
  };

  const handleTaxSelect = (tax: TaxRate) => {
    setSelectedTax(tax);
    setFormData({ ...formData, taxPercentage: tax.percentage });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetType === "personal") {
      setLoading(true);
      try {
        const newBudget = await createBudget({
          name: formData.name,
          description: formData.description,
          totalAmount: parseFloat(formData.totalAmount),
          currency: formData.currency,
          country: formData.country,
          templateId: formData.templateId,
          taxPercentage: formData.taxPercentage,
        });
        if (newBudget) {
          navigate(`/budgets/${newBudget.id}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProfessionalBudgetSave = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/budgets/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          currency: formData.currency,
          country: data.country,
          totalAmount: data.total,
          taxPercentage: data.taxPercentage,
          items: data.items,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
        }),
      });

      if (response.ok) {
        const newBudget = await response.json();
        navigate(`/budgets/${newBudget.id}`);
      } else {
        console.error("Failed to create professional budget");
      }
    } catch (error) {
      console.error("Error creating professional budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.name && (budgetType === "professional" || formData.totalAmount);
    }
    if (step === 2) {
      return true;
    }
    if (step === 3) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 tablet-padding">
        <Button
          variant="ghost"
          className="mb-6 hover-lift"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>

        <Card className="p-4 sm:p-8 glass-modern">
          {budgetType === "personal" && (
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`h-1 w-16 mx-2 ${s < step ? "bg-blue-500" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">{t("budget.basicInfo")}</h2>
                <div>
                  <Label htmlFor="budgetType">{t("budget.budgetType")}</Label>
                  <Select value={budgetType} onValueChange={(value: "personal" | "professional") => setBudgetType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">{t("budget.personal")}</SelectItem>
                      <SelectItem value="professional">{t("budget.professional")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">{t("forms.budgetName")} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={budgetType === "professional" ? t("professional.namePlaceholder") : "e.g., Monthly Budget"}
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
                {budgetType === "personal" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">{t("forms.totalAmount")} *</Label>
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
                  </div>
                ) : (
                  <CurrencySelector
                    value={formData.currency}
                    onChange={(value) => setFormData({ ...formData, currency: value })}
                    label={t("forms.currency")}
                  />
                )}
              </div>
            )}

            {step === 2 && budgetType === "personal" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">{t("budget.chooseTemplate")}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {t("template.description")}
                </p>
                <TemplateSelector
                  templates={templates}
                  selectedId={formData.templateId}
                  onSelect={(templateId) =>
                    setFormData({ ...formData, templateId })
                  }
                />
              </div>
            )}

            {step === 3 && budgetType === "personal" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">{t("budget.taxConfig")}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {t("tax.description")}
                </p>
                <TaxSelector
                  countries={countries}
                  selectedCountry={formData.country}
                  taxes={taxes}
                  selectedTax={selectedTax}
                  onCountryChange={(country) =>
                    setFormData({ ...formData, country })
                  }
                  onTaxChange={handleTaxSelect}
                  loading={false}
                />
              </div>
            )}

            {budgetType === "personal" ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t("common.previous")}
                  </Button>
                )}
                {step < 3 && (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={!isStepValid()}
                    className="w-full sm:w-auto sm:ml-auto"
                  >
                    {t("common.next")}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    type="submit"
                    disabled={loading || !isStepValid()}
                    className="w-full sm:w-auto sm:ml-auto"
                  >
                    {loading ? t("forms.creating") : t("dialog.createBudget")}
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStepValid()}
                  className="w-full sm:w-auto"
                >
                  {t("common.next")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </form>

          {step === 2 && budgetType === "professional" && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-6">{t("professional.budgetItems")}</h2>
              <ProfessionalBudgetEditor 
                onSave={handleProfessionalBudgetSave}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
