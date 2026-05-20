import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Pause,
  Play,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface DownloadManagerProps {
  platform: string;
  filename: string;
  onComplete?: () => void;
}

export function DownloadManager({
  platform,
  filename,
  onComplete,
}: DownloadManagerProps) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const abortController = useRef<AbortController | null>(null);

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    setProgress(0);
    setCompleted(false);
    setPaused(false);
    abortController.current = new AbortController();

    try {
      // Track download
      await fetch("/api/downloads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, version: "1.0.0" }),
      });

      // Start download with progress tracking and retry logic
      const response = await fetch(`/api/downloads/file/${platform}`, {
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(t("downloads.error"));
      }

      const contentLength = response.headers.get("content-length");
      const total = parseInt(contentLength || "0", 10);

      if (!response.body) {
        throw new Error(t("downloads.error"));
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (total) {
          const progressValue = (receivedLength / total) * 100;
          setProgress(progressValue);
        }
      }

      // Create blob and download
      const blob = new Blob(chunks as BlobPart[]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setCompleted(true);
      setProgress(100);
      setRetryCount(0);

      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Download paused");
        return;
      }

      console.error("Download error:", err);

      // Retry logic with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          handleDownload();
        }, delay);
        return;
      }

      setError(t("downloads.error"));
    } finally {
      setDownloading(false);
    }
  }

  function handlePause() {
    if (abortController.current) {
      abortController.current.abort();
      setPaused(true);
      setDownloading(false);
    }
  }

  function handleResume() {
    setPaused(false);
    handleDownload();
  }

  function handleRetry() {
    setRetryCount(0);
    handleDownload();
  }

  return (
    <Card className="p-6 space-y-4 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{filename}</h3>
          <p className="text-sm text-gray-500">{platform}</p>
        </div>
        <div>
          {completed ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : error ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : (
            <Download className="w-8 h-8 text-primary" />
          )}
        </div>
      </div>

      {downloading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-600">
            {Math.round(progress)}% {t("downloads.complete")}
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {completed && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700">{t("downloads.success")}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!downloading && !completed && !paused && (
          <Button onClick={handleDownload} className="flex-1 btn-ripple btn-3d">
            <Download className="w-4 h-4 mr-2" />
            {t("downloads.start")}
          </Button>
        )}

        {downloading && (
          <Button onClick={handlePause} variant="outline" className="flex-1">
            <Pause className="w-4 h-4 mr-2" />
            {t("downloads.pause")}
          </Button>
        )}

        {paused && (
          <Button onClick={handleResume} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            {t("downloads.resume")}
          </Button>
        )}

        {error && (
          <Button onClick={handleRetry} variant="outline" className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("downloads.retry")} {retryCount > 0 && `(${retryCount}/3)`}
          </Button>
        )}
      </div>
    </Card>
  );
}
