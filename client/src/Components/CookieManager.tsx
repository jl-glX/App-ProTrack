import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Cookie, Settings, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";

export function CookieManager() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = Cookies.get("cookie-consent");
    if (consent) {
      try {
        setPreferences(JSON.parse(consent));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [open]);

  function handleSave() {
    Cookies.set("cookie-consent", JSON.stringify(preferences), {
      expires: 365,
    });
    setOpen(false);
  }

  function handleClearAll() {
    if (confirm(t("cookies.manager.confirmClear"))) {
      const allCookies = Cookies.get();
      Object.keys(allCookies).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      setPreferences({
        necessary: true,
        functional: false,
        analytics: false,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hover-lift">
          <Cookie className="w-4 h-4" />
          {t("cookies.manager.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-modern">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient-animate">
            <Settings className="w-5 h-5" />
            {t("cookies.manager.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-gray-700">
              {t("cookies.manager.description")}
            </p>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="necessary-cookies" className="font-semibold">
                  {t("cookies.necessary")}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {t("cookies.necessaryDesc")}
                </p>
              </div>
              <Switch
                checked={preferences.necessary}
                onCheckedChange={() => {}}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="functional-cookies" className="font-semibold">
                  {t("cookies.functional")}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {t("cookies.functionalDesc")}
                </p>
              </div>
              <Switch
                checked={preferences.functional}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, functional: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="analytics-cookies" className="font-semibold">
                  {t("cookies.analytics")}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {t("cookies.analyticsDesc")}
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1 btn-ripple">
                {t("cookies.save")}
              </Button>
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("cookies.manager.clearAll")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
