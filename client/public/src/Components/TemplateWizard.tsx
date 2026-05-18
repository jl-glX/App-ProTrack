import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { ChevronLeft, ChevronRight, Wand2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Category {
  name: string;
  icon: string;
  color: string;
  percentage: number;
}

interface TemplateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (template: any) => void;
}

const WIZARD_STEPS = ["basic", "categories", "design", "review"] as const;

const PRESET_CATEGORIES = [
  { name: "Housing", icon: "home", color: "#ef4444" },
  { name: "Food", icon: "utensils", color: "#f59e0b" },
  { name: "Transportation", icon: "car", color: "#8b5cf6" },
  { name: "Entertainment", icon: "music", color: "#ec4899" },
  { name: "Healthcare", icon: "heart", color: "#f472b6" },
  { name: "Education", icon: "book", color: "#3b82f6" },
  { name: "Utilities", icon: "zap", color: "#06b6d4" },
  { name: "Savings", icon: "piggy-bank", color: "#10b981" },
  { name: "Shopping", icon: "shopping-cart", color: "#a855f7" },
  { name: "Insurance", icon: "shield", color: "#14b8a6" },
];

const COLOR_PALETTE = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f472b6", "#a855f7", "#14b8a6"
];

export function TemplateWizard({ open, onOpenChange, onComplete }: TemplateWizardProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  function handleNext() {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handlePrevious() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleToggleCategory(preset: typeof PRESET_CATEGORIES[0]) {
    const exists = categories.find(c => c.name === preset.name);
    if (exists) {
      setCategories(categories.filter(c => c.name !== preset.name));
    } else {
      setCategories([...categories, { ...preset, percentage: 0 }]);
    }
  }

  function handleDistribute() {
    if (categories.length === 0) return;
    const equal = Math.floor(100 / categories.length);
    const remainder = 100 - (equal * categories.length);
    
    const distributed = categories.map((cat, i) => ({
      ...cat,
      percentage: i === 0 ? equal + remainder : equal
    }));
    
    setCategories(distributed);
  }

  function handlePercentageChange(index: number, value: number) {
    const updated = [...categories];
    updated[index].percentage = value;
    setCategories(updated);
  }

  function handleColorChange(index: number, color: string) {
    const updated = [...categories];
    updated[index].color = color;
    setCategories(updated);
  }

  function handleComplete() {
    const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
    
    if (totalPercentage !== 100) {
      alert(t("templates.editor.percentageError"));
      return;
    }

    onComplete({
      name,
      description,
      templateType: "custom",
      categories,
    });
    
    // Reset wizard
    setCurrentStep(0);
    setName("");
    setDescription("");
    setCategories([]);
    onOpenChange(false);
  }

  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-blue-500" />
            {t("templates.wizard.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? "bg-blue-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("templates.wizard.basicInfo")}</h3>
              <div>
                <Label htmlFor="wizard-name">{t("templates.editor.name")}</Label>
                  <Input
                    id="wizard-name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder={t("templates.editor.namePlaceholder")}
                    className="mt-1"
                  />
              </div>
              <div>
                <Label htmlFor="wizard-description">{t("templates.editor.description")}</Label>
                <textarea
                  id="wizard-description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder={t("templates.editor.descriptionPlaceholder")}
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary mt-1 bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Categories */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("templates.wizard.selectCategories")}</h3>
              <p className="text-sm text-gray-600">{t("templates.wizard.selectCategoriesDesc")}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_CATEGORIES.map((preset) => {
                  const isSelected = categories.some(c => c.name === preset.name);
                  return (
                    <Card
                      key={preset.name}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleToggleCategory(preset)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: preset.color }}
                        >
                          {isSelected && <Check className="w-5 h-5 text-white" />}
                        </div>
                        <span className="font-medium">{preset.name}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {t("templates.wizard.selectedCount")}: {categories.length}
              </p>
            </div>
          )}

          {/* Step 3: Design & Percentages */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("templates.wizard.customize")}</h3>
                <Button onClick={handleDistribute} variant="outline" size="sm">
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t("templates.wizard.autoDistribute")}
                </Button>
              </div>
              
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">{category.name}</Label>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">{t("templates.editor.percentage")}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={category.percentage || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePercentageChange(index, parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">{t("templates.editor.color")}</Label>
                        <div className="flex gap-2 mt-1">
                          {COLOR_PALETTE.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-8 h-8 rounded-full transition-transform ${
                                category.color === color ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(index, color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className={`text-sm font-medium ${totalPercentage === 100 ? "text-green-600" : "text-red-600"}`}>
                {t("templates.editor.total")}: {totalPercentage}%
                {totalPercentage !== 100 && ` (${t("templates.editor.mustBe100")})`}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("templates.wizard.review")}</h3>
              
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">{t("templates.editor.name")}:</span>
                    <p className="text-lg font-bold">{name}</p>
                  </div>
                  {description && (
                    <div>
                      <span className="text-sm font-semibold text-gray-600">{t("templates.editor.description")}:</span>
                      <p className="text-gray-700">{description}</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="space-y-2">
                <h4 className="font-semibold">{t("common.categories")} ({categories.length})</h4>
                {categories.map((category, index) => (
                  <Card key={index} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-700">{category.percentage}%</span>
                  </Card>
                ))}
              </div>

              <div className={`p-3 rounded-lg ${
                totalPercentage === 100 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {totalPercentage === 100 
                  ? t("templates.wizard.readyToCreate")
                  : t("templates.wizard.fixPercentages")}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t("common.previous")}
          </Button>
          
          {currentStep < WIZARD_STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !name) ||
                (currentStep === 1 && categories.length === 0)
              }
            >
              {t("common.next")}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={totalPercentage !== 100}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              {t("templates.wizard.createTemplate")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
