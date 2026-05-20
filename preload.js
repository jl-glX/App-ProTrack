// Preload script for Electron
// This runs in the renderer process before web content loads

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // Add any APIs you want to expose to the renderer
  navigate: (path) => ipcRenderer.send("navigate", path),
});
