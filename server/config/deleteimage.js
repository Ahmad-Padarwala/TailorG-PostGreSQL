const fs = require("fs");
const path = require("path");
const { unlink } = require("fs").promises;

const deleteFilesFromFolder = async (
  fileArray,
  projectDirectory,
  fileColumnNames
) => {
  if (fileArray.length !== 0) {
    await Promise.all(
      fileColumnNames.map(async (columnName) => {
        const fileName = fileArray[0][columnName];
        if (fileName) {
          const filePath = path.join(projectDirectory, fileName);
          if (fs.existsSync(filePath)) {
            await unlink(filePath);
          } else {
            console.log(`File does not exist: ${filePath}`);
          }
        }
      })
    );
  }
};

module.exports = {
  deleteFilesFromFolder,
};
 