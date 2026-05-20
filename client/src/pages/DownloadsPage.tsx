import { useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Card } from "../Components/ui/card";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Apple,
  Download,
  Globe,
  CheckCircle2,
  Zap,
  Shield,
  Cloud,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function DownloadsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const platforms = [
    {
      id: "windows",
      name: "Windows",
      icon: <Monitor className="w-12 h-12" />,
      gradient: "from-blue-500 to-blue-700",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverShadow: "hover:shadow-blue-200",
      downloads: [
        {
          name: "Installer (.exe)",
          url: "/api/downloads/file/windows",
          recommended: true,
        },
        { name: "Portable (.exe)", url: "/api/downloads/file/windows" },
      ],
    },
    {
      id: "macos",
      name: "macOS",
      icon: <Apple className="w-12 h-12" />,
      gradient: "from-gray-700 to-gray-900",
      textColor: "text-gray-800",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      hoverShadow: "hover:shadow-gray-300",
      downloads: [
        { name: "DMG", url: "/api/downloads/file/mac", recommended: true },
        { name: "ZIP", url: "/api/downloads/file/mac" },
      ],
    },
    {
      id: "linux",
      name: "Linux",
      icon: <Monitor className="w-12 h-12" />,
      gradient: "from-orange-500 to-orange-700",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverShadow: "hover:shadow-orange-200",
      downloads: [
        {
          name: "AppImage",
          url: "/api/downloads/file/linux",
          recommended: true,
        },
        { name: "DEB (Debian/Ubuntu)", url: "/api/downloads/file/linux" },
        { name: "RPM (Fedora/RHEL)", url: "/api/downloads/file/linux" },
      ],
    },
    {
      id: "android",
      name: "Android",
      icon: <Smartphone className="w-12 h-12" />,
      gradient: "from-green-500 to-green-700",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverShadow: "hover:shadow-green-200",
      downloads: [
        {
          name: "Download APK",
          url: "/api/downloads/file/android",
          recommended: true,
        },
        {
          name: "Google Play Store",
          url: "https://play.google.com/store",
          external: true,
        },
      ],
    },
    {
      id: "ios",
      name: "iOS/iPadOS",
      icon: <Apple className="w-12 h-12" />,
      gradient: "from-purple-500 to-purple-700",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverShadow: "hover:shadow-purple-200",
      downloads: [
        {
          name: "Install PWA (Safari)",
          url: "#",
          isPWA: true,
          recommended: true,
        },
        { name: "App Store", url: "https://apps.apple.com", external: true },
      ],
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      text: "Lightning Fast Performance",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      text: "Secure & Private",
    },
    {
      icon: <Cloud className="w-6 h-6 text-indigo-600" />,
      text: "Works Offline",
    },
    {
      icon: <Globe className="w-6 h-6 text-green-600" />,
      text: "Cross-Platform",
    },
  ];

  const handleDownload = async (download: any) => {
    if (download.isPWA) {
      alert(
        "To install on iOS/iPadOS:\n1. Open this website in Safari\n2. Tap the Share button\n3. Select 'Add to Home Screen'\n4. Tap 'Add'",
      );
      return;
    }

    if (download.external) {
      window.open(download.url, "_blank");
      return;
    }

    try {
      // Track download
      const platform = download.url.includes(".apk")
        ? "android"
        : download.url.includes(".exe")
          ? "windows"
          : download.url.includes(".dmg")
            ? "macos"
            : download.url.includes(".AppImage")
              ? "linux"
              : "unknown";

      await fetch("/api/downloads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, version: "1.0.0" }),
      });

      // Initiate download
      const link = document.createElement("a");
      link.href = download.url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 tablet-padding">
        <Button
          variant="default"
          className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent responsive-heading">
            Download Budget Tracker
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto responsive-text px-4">
            Available on all your devices - Choose your platform and start
            managing your budget today
          </p>
        </div>

        {/* Features Banner */}
        <Card className="mb-12 p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-2 shadow-xl glass-modern">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-md">
                  {feature.icon}
                </div>
                <span className="font-medium text-gray-700 text-sm md:text-base">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 tablet-grid-2">
          {platforms.map((platform, idx) => (
            <Card
              key={platform.id}
              className={`p-4 sm:p-6 ${platform.bgColor} ${platform.borderColor} border-2 hover:scale-105 transition-all duration-300 ${platform.hoverShadow} hover:shadow-2xl animate-slide-up tablet-touch-target`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className={`flex items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r ${platform.gradient} text-white shadow-lg`}
              >
                {platform.icon}
                <h3 className="text-xl sm:text-2xl font-bold">
                  {platform.name}
                </h3>
              </div>

              <div className="space-y-3">
                {platform.downloads.map((download, downloadIdx) => (
                  <div key={downloadIdx} className="group">
                    <Button
                      onClick={() => handleDownload(download)}
                      variant={download.recommended ? "default" : "outline"}
                      className={`w-full justify-between group-hover:scale-105 transition-transform duration-200 ${
                        download.recommended
                          ? `bg-gradient-to-r ${platform.gradient} hover:opacity-90 text-white shadow-md`
                          : `${platform.borderColor} border-2 hover:${platform.bgColor}`
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {download.recommended && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {download.name}
                      </span>
                      <Download className="w-4 h-4" />
                    </Button>
                    {download.recommended && (
                      <p
                        className={`text-xs ${platform.textColor} font-semibold mt-1 ml-2`}
                      >
                        ⭐ Recommended
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Installation Instructions */}
        <Card className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm border-2 shadow-xl mb-8 glass-modern">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 responsive-heading">
            Installation Instructions
          </h2>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <div className="group hover:bg-blue-50 p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-xl mb-3 text-blue-700 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Desktop (Windows, Mac, Linux)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Download the installer for your OS</li>
                  <li>Run the installer and follow instructions</li>
                  <li>Launch from applications folder</li>
                </ol>
              </div>

              <div className="group hover:bg-green-50 p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-xl mb-3 text-green-700 flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Android
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Download the APK file</li>
                  <li>Enable "Unknown Sources" in settings</li>
                  <li>Open APK and tap "Install"</li>
                </ol>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group hover:bg-purple-50 p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-xl mb-3 text-purple-700 flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  iOS/iPadOS (PWA)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Open this site in Safari</li>
                  <li>Tap Share button</li>
                  <li>Select "Add to Home Screen"</li>
                  <li>Tap "Add"</li>
                </ol>
              </div>

              <div className="group hover:bg-indigo-50 p-4 rounded-lg transition-colors">
                <h3 className="font-bold text-xl mb-3 text-indigo-700 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Web Browser (PWA)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Look for install icon in address bar</li>
                  <li>Click "Install" when prompted</li>
                  <li>App installs on your device</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* PWA Advantages */}
        <Card className="p-4 sm:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-xl glass-modern">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="p-3 bg-white rounded-xl shadow-md">
              <Globe className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 responsive-heading">
              Progressive Web App Benefits
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            {[
              "Works offline - Access anytime",
              "Automatic updates - Always latest version",
              "Native app experience - Fast & smooth",
              "Cross-platform - One app, all devices",
              "No app store needed - Install directly",
              "Lightweight - Minimal storage required",
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
