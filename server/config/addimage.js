const fs = require("fs");
const path = require("path");

const uploadMultiFiles = async ({ files, folderPath }) => {
  try {
    const fileNames = await Promise.all(
      files.map(async (file, idx) => {
        const newFileName = `${Date.now()}_${file[idx].originalFilename.replace(/\s/g, "")}`;
        const newPath = folderPath + "/" + newFileName;
        await fs.promises.copyFile(file.filepath, newPath);

        return newFileName;
      })
    );

    return fileNames;
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

const uploadFile = async (file, folderName) => {
  try {
    const newFileName = `${Date.now()}_${file[0].originalFilename.replace(/\s/g, "")}`;
    const folderPath = path.resolve(
      __dirname,
      `../uploads/${folderName}`
    );
    const newPath = folderPath + "/" + newFileName;
    await fs.promises.copyFile(file[0].filepath, newPath);

    return newFileName;
  } catch (error) {
    console.log(error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

module.exports = {
  uploadMultiFiles,
  uploadFile,
};




// si ngle
// onst { category_image } =files;
//         const folderPath = path.resolve(__dirname, "../../../public/assets/upload/blogcategory");

//         const uploadedImageNames = await uploadFile({
//           files: category_image,
//           folderPath,
//         });



// multi
//         const { category_image } =files;
//         const folderPath = path.resolve(__dirname, "../../../public/assets/upload/blogcategory");

//         const uploadedImageNames = await uploadFile({
//           files: [category_image],
//           folderPath,
//         });