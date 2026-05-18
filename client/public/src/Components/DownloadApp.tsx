import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Monitor, Smartphone, Globe } from "lucide-react";

export function DownloadApp() {
  const [platform, setPlatform] = useState<string>("unknown");
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("win") !== -1) setPlatform("windows");
    else if (userAgent.indexOf("mac") !== -1) setPlatform("macos");
    else if (userAgent.indexOf("linux") !== -1) setPlatform("linux");
    else if (userAgent.indexOf("android") !== -1) setPlatform("android");
    else if (userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("ipad") !== -1) setPlatform("ios");

    // Listen for PWA install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener("beforeinstallprompt", handler);
    
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const downloads = {
    windows: {
      title: "Windows",
      icon: <Monitor className="w-6 h-6" />,
      options: [
        { name: "Installer (.exe)", url: "#", recommended: true },
        { name: "Portable (.exe)", url: "#" }
      ]
    },
    macos: {
      title: "macOS",
      icon: <Monitor className="w-6 h-6" />,
      options: [
        { name: "DMG", url: "#", recommended: true },
        { name: "ZIP", url: "#" }
      ]
    },
    linux: {
      title: "Linux",
      icon: <Monitor className="w-6 h-6" />,
      options: [
        { name: "AppImage", url: "#", recommended: true },
        { name: "DEB (Debian/Ubuntu)", url: "#" },
        { name: "RPM (Fedora/RHEL)", url: "#" },
        { name: "Snap", url: "#" }
      ]
    },
    android: {
      title: "Android",
      icon: <Smartphone className="w-6 h-6" />,
      options: [
        { name: "Google Play Store", url: "#", recommended: true },
        { name: "APK Download", url: "#" },
        { name: "F-Droid", url: "#" }
      ]
    },
    ios: {
      title: "iOS/iPadOS",
      icon: <Smartphone className="w-6 h-6" />,
      options: [
        { name: "App Store", url: "#", recommended: true },
        { name: "Install as PWA", url: "#", isPWA: true }
      ]
    }
  };

  const currentPlatformDownloads = platform !== "unknown" && platform in downloads 
    ? downloads[platform as keyof typeof downloads]
    : null;

  return (
    <div className="space-y-6">
      {showInstallPrompt && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">Install as App</h3>
                <p className="text-sm text-gray-600">Install this app on your device for quick access</p>
              </div>
            </div>
            <Button onClick={handleInstallPWA} className="gap-2">
              <Download className="w-4 h-4" />
              Install
            </Button>
          </div>
        </Card>
      )}

      {currentPlatformDownloads && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {currentPlatformDownloads.icon}
            <h3 className="text-xl font-bold">Download for {currentPlatformDownloads.title}</h3>
          </div>
          <div className="space-y-3">
            {currentPlatformDownloads.options.map((option) => (
              <div key={option.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{option.name}</p>
                  {option.recommended && (
                    <span className="text-xs text-blue-600 font-semibold">Recommended</span>
                  )}
                </div>
                <Button 
                  variant={option.recommended ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    if ("isPWA" in option && option.isPWA && platform === "ios") {
                      alert("To install on iOS: Tap the Share button and select 'Add to Home Screen'");
                    } else {
                      window.open(option.url, "_blank");
                    }
                  }}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(downloads).map(([key, platform]) => (
          <Card key={key} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              {platform.icon}
              <h4 className="font-semibold">{platform.title}</h4>
            </div>
            <div className="space-y-2">
              {platform.options.slice(0, 2).map((option) => (
                <p key={option.name} className="text-sm text-gray-600">
                  • {option.name}
                </p>
              ))}
              {platform.options.length > 2 && (
                <p className="text-sm text-gray-500">
                  +{platform.options.length - 2} more
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="font-semibold text-lg mb-2">Progressive Web App (PWA)</h3>
        <p className="text-gray-600 mb-4">
          Install this app directly from your browser on any device. No app store required!
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ Works offline</li>
          <li>✅ Automatic updates</li>
          <li>✅ Native app experience</li>
          <li>✅ Cross-platform compatibility</li>
        </ul>
      </Card>
    </div>
  );
}
