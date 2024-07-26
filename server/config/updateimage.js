const fs = require("fs");
const path = require("path");
const { uploadFile } = require("./addimage");
const { deleteFilesFromFolder } = require("./deleteimage");
const { unlink } = require("fs").promises;

const updateImage = async (file, folderName, oldImageDetails) => {
    const { fileArray, projectDirectory, fileColumnNames, oldimagepath } = oldImageDetails;
    
    if (file && file.length > 0 && file[0].filepath) {
      // Delete the old image
      await deleteFilesFromFolder(fileArray, projectDirectory, fileColumnNames);
  
      // Upload the new image
      const newImageName = await uploadFile(file, folderName);
      return newImageName;
    } else {
      return oldimagepath; // Return the old image path if no new image is provided
    }
  };

module.exports = {
  updateImage,
};
