const express = require("express");
const router = express.Router();
const path = require("path");
const { formidable } = require("formidable");
const { uploadFile } = require("../../config/addimage");
const { updateImage } = require("../../config/updateimage");

const shop = require("../../controller/shops/shop");

router.route("/getshopdata/:id").get(shop.getShopData);
router.route("/getpathesdata").get(shop.getPathesData);
// router.route("/editshopdata/:id").put(shop.editshopData);

router.route("/editshopdata/:id").patch((req, res) => {
  console.log("Received request to update shop data"); // Log incoming request
  const id = req.params.id;
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }
    const { image } = files;
    let imagePath = "";
    if (image && image.length > 0 && image[0].filepath) {
      const q = `SELECT profile_img FROM public.shops WHERE id=${id}`;
      const response = await client.query(q);
      let oldpath = "";
      if (response.length !== 0) {
        oldpath = response.rows[0].image;
        const projectDirectory = path.resolve(
          __dirname,
          "../../uploads/shop"
        );
        const folderName = "shop";
        const oldImageDetails = {
          fileArray: response.rows,
          projectDirectory: projectDirectory,
          fileColumnNames: ["image"],
          oldimagepath: oldpath,
        };
        imagePath = await updateImage(image, folderName, oldImageDetails);
      }
    } else if (fields.image && fields.image.length > 0) {
      imagePath = fields.image[0];
    }

    const first_name = fields.first_name[0];
    const last_name = fields.last_name[0];
    const shop_name = fields.shop_name[0];
    const contact_number = fields.contact_number[0];
    const email = fields.email[0];
    const fieldsWithImage = {
      first_name,
      last_name,
      shop_name,
      contact_number,
      email,
      id,
      image: imagePath,
    };
    shop.editshopData(req, res, fieldsWithImage);
  });
});



module.exports = router;
