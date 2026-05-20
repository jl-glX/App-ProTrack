import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTemplates } from "../hooks/useTemplates";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { TemplateEditor } from "../components/TemplateEditor";
import { TemplateWizard } from "../components/TemplateWizard";
import { TemplateAutomation } from "../components/TemplateAutomation";
import { ArrowLeft, Plus, Edit, Trash2, Wand2, Zap, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TemplatesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } =
    useTemplates();
  const [editorOpen, setEditorOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [automationOpen, setAutomationOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [automationTemplateId, setAutomationTemplateId] = useState<string>("");

  function handleCreate() {
    setEditingTemplate(null);
    setEditorOpen(true);
  }

  function handleWizard() {
    setWizardOpen(true);
  }

  function handleEdit(template: any) {
    setEditingTemplate(template);
    setEditorOpen(true);
  }

  function handleAutomation(templateId: string) {
    setAutomationTemplateId(templateId);
    setAutomationOpen(true);
  }

  async function handleDuplicate(template: any) {
    const duplicated = {
      name: `${template.name} (Copy)`,
      description: template.description,
      templateType: "custom",
      categories: template.categories,
      isEditable: true,
    };
    await createTemplate(duplicated);
  }

  async function handleSave(template: any) {
    if (template.id) {
      await updateTemplate(template.id, template);
    } else {
      await createTemplate(template);
    }
    setEditorOpen(false);
  }

  async function handleWizardComplete(template: any) {
    await createTemplate(template);
  }

  async function handleDelete(id: string) {
    if (confirm(t("common.confirmDelete"))) {
      await deleteTemplate(id);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 particle-bg">
      <div className="max-w-6xl mx-auto px-4 tablet-padding">
        <div className="mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mb-6 gap-2 hover:bg-gray-100 border-2"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("common.back")}
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-animate responsive-heading">
                {t("templates.page.title")}
              </h1>
              <p className="text-gray-600 mt-1 responsive-text">
                {t("template.description")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleWizard}
                className="gap-2 btn-ripple btn-glow bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Wand2 className="w-4 h-4" />
                {t("templates.wizard.title")}
              </Button>
              <Button
                onClick={handleCreate}
                variant="outline"
                className="gap-2 btn-ripple"
              >
                <Plus className="w-4 h-4" />
                {t("templates.advanced.title")}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="loading-wave mx-auto">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-gray-500 mt-4">{t("common.loading")}</p>
          </div>
        ) : (
          <>
            {templates.length === 0 ? (
              <Card className="p-12 text-center">
                <Wand2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("templates.page.noTemplates")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("templates.page.noTemplatesDesc")}
                </p>
                <Button onClick={handleWizard} className="gap-2">
                  <Wand2 className="w-4 h-4" />
                  {t("templates.wizard.title")}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tablet-grid-2">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="p-6 hover-lift card-hover-gradient neon-border card-interactive tablet-touch-target group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {template.name}
                          </h3>
                          {!template.isEditable && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {t("templates.preset")}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-semibold text-gray-700 uppercase">
                        {t("common.categories")}
                      </p>
                      {template.categories
                        .slice(0, 4)
                        .map((category: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                            <span className="text-gray-500 font-medium">
                              {category.percentage}%
                            </span>
                          </div>
                        ))}
                      {template.categories.length > 4 && (
                        <p className="text-xs text-gray-500">
                          +{template.categories.length - 4}{" "}
                          {t("templates.more")}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                      {template.isEditable ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(template)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            {t("common.edit")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAutomation(template.id)}
                            className="flex-1"
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            {t("templates.automate")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicate(template)}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {t("templates.duplicate")}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        <TemplateEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          template={editingTemplate}
          onSave={handleSave}
        />

        <TemplateWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          onComplete={handleWizardComplete}
        />

        <TemplateAutomation
          open={automationOpen}
          onOpenChange={setAutomationOpen}
          templateId={automationTemplateId}
        />
      </div>
    </div>
  );
}
