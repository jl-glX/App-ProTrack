import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, Settings, Cookie } from "lucide-react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function CookieConsent() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = Cookies.get("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  function acceptAll() {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    Cookies.set("cookie-consent", JSON.stringify(allAccepted), {
      expires: 365,
    });
    setPreferences(allAccepted);
    setShowBanner(false);
  }

  function acceptNecessary() {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    Cookies.set("cookie-consent", JSON.stringify(necessaryOnly), {
      expires: 365,
    });
    setPreferences(necessaryOnly);
    setShowBanner(false);
  }

  function savePreferences() {
    Cookies.set("cookie-consent", JSON.stringify(preferences), {
      expires: 365,
    });
    setShowBanner(false);
    setShowSettings(false);
  }

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50 animate-slide-in">
        <Card className="p-6 shadow-2xl border-2 card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{t("cookies.title")}</h3>
            </div>
            <button
              onClick={acceptNecessary}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {t("cookies.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={acceptAll} className="flex-1 btn-ripple">
              {t("cookies.acceptAll")}
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t("cookies.customize")}
            </Button>
          </div>

          <button
            onClick={acceptNecessary}
            className="w-full text-xs text-gray-500 hover:text-gray-700 mt-2 underline"
          >
            {t("cookies.onlyNecessary")}
          </button>
        </Card>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("cookies.settings")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="necessary" className="font-semibold">
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
                  <Label htmlFor="functional" className="font-semibold">
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
                  <Label htmlFor="analytics" className="font-semibold">
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

            <div className="flex gap-2">
              <Button onClick={savePreferences} className="flex-1 btn-ripple">
                {t("cookies.save")}
              </Button>
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
