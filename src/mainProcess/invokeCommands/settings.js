const { storageManager } = require("../helpers/storageManager");
const { dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const readSettings = async () => {
  return await storageManager.then(manager =>
    manager.read({ filename: "settings.json" })
  );
};

const writeSettings = async (event, dataObject) => {
  return await storageManager.then(manager => {
    manager.write({
      filename: "settings.json",
      data: JSON.stringify(dataObject),
    });
  });
};

const selectFolderOfGame = async () => {
  const dialogResponse = await dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow(),
    {
      properties: ["openDirectory"],
    }
  );

  if (dialogResponse.canceled) {
    return { gamePath: "", isClientExists: undefined };
  }

  const gamePath = dialogResponse.filePaths[0] ?? "";
  const isClientExists = await fs.promises
    .access(path.join(gamePath, "elementclient.exe"))
    .then(
      () => true,
      () => false
    );

  return Promise.resolve({ gamePath, isClientExists });
};

module.exports = [
  {
    name: "readSettings",
    callback: readSettings,
  },
  {
    name: "writeSettings",
    callback: writeSettings,
  },
  {
    name: "selectFolderOfGame",
    callback: selectFolderOfGame,
  },
];
