import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Bot, Calendar, TrendingUp, Bell, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AutomationRule {
  id: string;
  name: string;
  type: "recurring" | "category-limit" | "budget-alert" | "smart-categorize";
  enabled: boolean;
  config: any;
}

interface TemplateAutomationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
}

export function TemplateAutomation({
  open,
  onOpenChange,
}: TemplateAutomationProps) {
  const { t } = useTranslation();
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Auto-categorize transactions",
      type: "smart-categorize",
      enabled: true,
      config: { confidence: 0.8 },
    },
    {
      id: "2",
      name: "Budget limit alerts",
      type: "budget-alert",
      enabled: true,
      config: { threshold: 90 },
    },
    {
      id: "3",
      name: "Recurring transaction detection",
      type: "recurring",
      enabled: false,
      config: { minOccurrences: 3 },
    },
  ]);

  function toggleRule(id: string) {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  }

  function getIcon(type: AutomationRule["type"]) {
    switch (type) {
      case "smart-categorize":
        return <Bot className="w-5 h-5" />;
      case "budget-alert":
        return <Bell className="w-5 h-5" />;
      case "recurring":
        return <Calendar className="w-5 h-5" />;
      case "category-limit":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            {t("templates.automation.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">
            {t("templates.automation.description")}
          </p>

          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        rule.enabled
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {getIcon(rule.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {rule.type === "smart-categorize" &&
                          t("templates.automation.smartCategorizeDesc")}
                        {rule.type === "budget-alert" &&
                          t("templates.automation.budgetAlertDesc")}
                        {rule.type === "recurring" &&
                          t("templates.automation.recurringDesc")}
                      </p>

                      {/* Configuration */}
                      {rule.enabled && (
                        <div className="mt-3 space-y-2">
                          {rule.type === "budget-alert" && (
                            <div>
                              <Label className="text-xs">
                                {t("templates.automation.threshold")}
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  type="number"
                                  min="50"
                                  max="100"
                                  value={rule.config.threshold}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) => {
                                    const updated = rules.map((r) =>
                                      r.id === rule.id
                                        ? {
                                            ...r,
                                            config: {
                                              ...r.config,
                                              threshold: parseInt(
                                                e.target.value,
                                              ),
                                            },
                                          }
                                        : r,
                                    );
                                    setRules(updated);
                                  }}
                                  className="w-20"
                                />
                                <span className="text-sm text-gray-600">%</span>
                              </div>
                            </div>
                          )}
                          {rule.type === "smart-categorize" && (
                            <div>
                              <Label className="text-xs">
                                {t("templates.automation.confidence")}
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  type="number"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={rule.config.confidence}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) => {
                                    const updated = rules.map((r) =>
                                      r.id === rule.id
                                        ? {
                                            ...r,
                                            config: {
                                              ...r.config,
                                              confidence: parseFloat(
                                                e.target.value,
                                              ),
                                            },
                                          }
                                        : r,
                                    );
                                    setRules(updated);
                                  }}
                                  className="w-20"
                                />
                                <span className="text-sm text-gray-600">
                                  (0-1)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => onOpenChange(false)} className="w-full">
              {t("common.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
