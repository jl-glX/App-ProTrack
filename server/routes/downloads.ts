import express from "express";
import { db } from "../database.js";
import { v4 as uuidv4 } from "uuid";
import { downloadLimiter } from "../middleware/security.js";
import path from "path";
import fs from "fs";

export const downloadsRouter = express.Router();

// Track download
downloadsRouter.post("/track", downloadLimiter, async (req, res) => {
  try {
    const { platform, version } = req.body;
    const ipAddress = req.ip || "unknown";

    const download = {
      id: uuidv4(),
      platform,
      version: version || "1.0.0",
      ipAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      downloadedAt: new Date().toISOString(),
    };

    await db.insertInto("downloads").values(download).execute();

    res.json({ success: true, downloadId: download.id });
    return;
  } catch (error) {
    console.error("Error tracking download:", error);
    res.status(500).json({ error: "Failed to track download" });
    return;
  }
});

// Get download statistics
downloadsRouter.get("/stats", async (_req, res) => {
  try {
    const stats = await db
      .selectFrom("downloads")
      .select(["platform"])
      .select((eb) => eb.fn.count("id").as("count"))
      .groupBy("platform")
      .execute();

    const total = await db
      .selectFrom("downloads")
      .select((eb) => eb.fn.count("id").as("total"))
      .executeTakeFirst();

    res.json({
      byPlatform: stats,
      total: total?.total || 0,
    });
    return;
  } catch (error) {
    console.error("Error fetching download stats:", error);
    res.status(500).json({ error: "Failed to fetch download statistics" });
    return;
  }
});

// Serve download files (with error handling and retry support)
downloadsRouter.get("/file/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const distPath = path.join(process.cwd(), "dist-electron");

    let filename: string;
    switch (platform) {
      case "windows":
        filename = "budget-tracker-setup.exe";
        break;
      case "mac":
        filename = "budget-tracker.dmg";
        break;
      case "linux":
        filename = "budget-tracker.AppImage";
        break;
      case "android":
        // Try multiple APK filenames
        const apkFiles = [
          "BudgetTracker.apk",
          "app-release.apk",
          "app-release-unsigned.apk",
        ];
        const foundApk = apkFiles.find((f) =>
          fs.existsSync(path.join(distPath, f)),
        );
        filename = foundApk || "BudgetTracker.apk";
        break;
      default:
        res.status(400).json({ error: "Invalid platform" });
        return;
    }

    const filePath = path.join(distPath, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Download file not found" });
      return;
    }

    // Support range requests for resumable downloads
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Error serving download file:", error);
    res.status(500).json({ error: "Failed to serve download file" });
    return;
  }
});
