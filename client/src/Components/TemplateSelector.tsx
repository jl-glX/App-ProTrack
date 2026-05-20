import { BudgetTemplate } from "../hooks/useBudgets";
import { Card } from "./ui/card";
import { useState, useEffect } from "react";

interface TemplateSelectorProps {
  templates: BudgetTemplate[];
  selectedId: string | null;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ templates, selectedId, onSelect }: TemplateSelectorProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`p-4 cursor-pointer transition-all ${
            selectedId === template.id
              ? "ring-2 ring-blue-500 bg-blue-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onSelect(template.id)}
        >
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {template.categories.slice(0, 3).map((category) => (
              <span
                key={category.name}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {category.name}
              </span>
            ))}
            {template.categories.length > 3 && (
              <span className="text-xs text-gray-500">+{template.categories.length - 3} more</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
