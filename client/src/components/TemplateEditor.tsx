import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Category {
  name: string;
  icon: string;
  color: string;
  percentage: number;
}

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: {
    id?: string;
    name: string;
    description: string;
    categories: Category[];
  } | null;
  onSave: (template: any) => void;
}

export function TemplateEditor({
  open,
  onOpenChange,
  template,
  onSave,
}: TemplateEditorProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [categories, setCategories] = useState<Category[]>(
    template?.categories || [],
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    icon: "shopping-cart",
    color: "#3b82f6",
    percentage: 0,
  });

  function handleAddCategory() {
    if (newCategory.name && newCategory.percentage > 0) {
      if (editingIndex !== null) {
        const updated = [...categories];
        updated[editingIndex] = newCategory;
        setCategories(updated);
        setEditingIndex(null);
      } else {
        setCategories([...categories, newCategory]);
      }
      setNewCategory({
        name: "",
        icon: "shopping-cart",
        color: "#3b82f6",
        percentage: 0,
      });
    }
  }

  function handleDeleteCategory(index: number) {
    setCategories(categories.filter((_, i) => i !== index));
  }

  function handleEditCategory(index: number) {
    setNewCategory(categories[index]);
    setEditingIndex(index);
  }

  function handleSave() {
    const totalPercentage = categories.reduce(
      (sum, cat) => sum + cat.percentage,
      0,
    );

    if (totalPercentage !== 100) {
      alert(t("templates.editor.percentageError"));
      return;
    }

    onSave({
      id: template?.id,
      name,
      description,
      templateType: "custom",
      categories,
    });
    onOpenChange(false);
  }

  const totalPercentage = categories.reduce(
    (sum, cat) => sum + cat.percentage,
    0,
  );
  const icons = [
    "shopping-cart",
    "home",
    "car",
    "utensils",
    "music",
    "book",
    "heart",
    "zap",
    "briefcase",
    "piggy-bank",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            {template?.id
              ? t("templates.editor.editTitle")
              : t("templates.editor.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">
                {t("templates.editor.name")}
              </Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder={t("templates.editor.namePlaceholder")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="template-description">
                {t("templates.editor.description")}
              </Label>
              <textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("templates.editor.descriptionPlaceholder")}
                className="w-full min-h-[80px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary mt-1"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("templates.editor.categories")}
            </h3>

            <Card className="p-4 mb-4 bg-gray-50 card-hover-gradient">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("templates.editor.categoryName")}</Label>
                  <Input
                    value={newCategory.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder={t("templates.editor.categoryNamePlaceholder")}
                  />
                </div>

                <div>
                  <Label>{t("templates.editor.percentage")}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newCategory.percentage || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCategory({
                        ...newCategory,
                        percentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>{t("templates.editor.icon")}</Label>
                  <select
                    value={newCategory.icon}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {icons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>{t("templates.editor.color")}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newCategory.color}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={newCategory.color}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddCategory}
                className="w-full mt-4 btn-ripple"
              >
                {editingIndex !== null ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t("templates.editor.updateCategory")}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("templates.editor.addCategory")}
                  </>
                )}
              </Button>
            </Card>

            <div className="space-y-2 mb-4">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="p-3 flex items-center justify-between hover-lift"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {category.icon} • {category.percentage}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div
              className={`text-sm font-medium ${totalPercentage === 100 ? "text-green-600" : "text-red-600"}`}
            >
              {t("templates.editor.total")}: {totalPercentage}%
              {totalPercentage !== 100 &&
                ` (${t("templates.editor.mustBe100")})`}
            </div>
          </div>

          <div className="flex gap-2 border-t pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 btn-ripple"
              disabled={!name || totalPercentage !== 100}
            >
              <Save className="w-4 h-4 mr-2" />
              {t("templates.editor.save")}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
