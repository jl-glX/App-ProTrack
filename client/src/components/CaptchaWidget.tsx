import { useEffect, useRef } from "react";

interface CaptchaWidgetProps {
  sitekey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function CaptchaWidget({
  sitekey,
  onVerify,
  onError,
  onExpire,
}: CaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load hCaptcha script
    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (containerRef.current && window.hcaptcha) {
        widgetId.current = window.hcaptcha.render(containerRef.current, {
          sitekey,
          callback: onVerify,
          "error-callback": onError,
          "expired-callback": onExpire,
        });
      }
    };

    return () => {
      if (widgetId.current && window.hcaptcha) {
        window.hcaptcha.remove(widgetId.current);
      }
      document.head.removeChild(script);
    };
  }, [sitekey, onVerify, onError, onExpire]);

  return <div ref={containerRef} className="h-captcha"></div>;
}

declare global {
  interface Window {
    hcaptcha: any;
  }
}
