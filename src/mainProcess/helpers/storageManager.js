const fs = require("fs");
const { app } = require("electron");
const path = require("path");

const storageManagerFactory = async () => {
  const currentWorkDir = app.getAppPath();
  const { name } = JSON.parse(
    await fs.promises.readFile(
      path.join(currentWorkDir, "package.json"),
      "utf-8"
    )
  );

  const storagePath = path.join(process.env.USERPROFILE, `.${name}`);
  const storageExists = await fs.promises.access(storagePath).then(
    () => true,
    () => false
  );

  storageExists || (await fs.promises.mkdir(storagePath));

  return {
    async read({ filename }) {
      const filePath = path.join(storagePath, filename);
      const exists = await fs.promises.access(filePath).then(
        () => true,
        () => false
      );

      return exists && (await fs.promises.readFile(filePath));
    },

    async write({ filename, data }) {
      return await fs.promises.writeFile(
        path.join(storagePath, filename),
        data
      );
    },
  };
};

module.exports.storageManager = storageManagerFactory();
