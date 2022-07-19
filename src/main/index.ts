import { join } from "path";
import { BrowserWindow, app } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

import { initIpc } from "./ipc-handler";
import { initMenu } from "./menu";

app.on("ready", async () => {
  initMenu();
  initIpc();

  const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;

  await prepareNext(
    {
      development: join(__dirname, "../../src/renderer"),
      production: join(__dirname, "../renderer"),
    },
    port
  );

  // const size = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: 250,
    height: 250,
    webPreferences: { preload: join(__dirname, "preload.js") },
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    // resizable: false,
  });
  // mainWindow.setIgnoreMouseEvents(true);
  // mainWindow.maximize();

  const url = isDev ? `http://localhost:${port}/` : `file://${join(__dirname, "../renderer/out/index.html")}`;

  mainWindow.loadURL(url);
});

app.on("window-all-closed", app.quit);
