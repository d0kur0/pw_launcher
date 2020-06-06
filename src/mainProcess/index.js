const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
const invokeCommandsMap = require("./invokeCommandsMap");

invokeCommandsMap.forEach(command =>
  ipcMain.handle(command.name, command.callback)
);

const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment) {
  require("electron-reload")(path.join(__dirname, "../../"), {
    electron: path.join(__dirname, "../../node_modules", ".bin", "electron"),
    awaitWriteFinish: true,
  });
}

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const width = 650;
  const height = 700;

  const mainWindow = new BrowserWindow({
    width,
    height,
    icon: path.join(__dirname, "../../public/favicon.ico"),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, "../../public/index.html"));
  isDevelopment && mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
