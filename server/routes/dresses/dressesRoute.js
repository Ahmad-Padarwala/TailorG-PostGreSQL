const express = require("express");
const router = express.Router();
const path = require("path");
const { formidable } = require("formidable");
const Dress = require("../../controller/Dresses/dresses");
const { uploadFile } = require("../../config/addimage");
const { updateImage } = require("../../config/updateimage");
const client = require("../../config/dbconnection");

router.route("/adddresses/:id").post((req, res) => {
  const id = req.params.id;
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {

    let imagepath = 'NoImage.jpg'
    if (files && Object.keys(files).length > 0) {
      const { image } = files;
      imagepath = await uploadFile(image, "dresses");
    }

    const dressName = fields.dressName[0];
    const price = fields.price[0];
    const gender = fields.gender[0];
    const dress_unique_number = fields.dress_unique_number[0];

    const fieldsWithImage = {
      dressName,
      price,
      gender,
      imagepath,
      dress_unique_number,
      id,
    };

    Dress.addDress(req, res, fieldsWithImage);
  });
});

router.route("/editdresses/:shopid/:dressid").patch((req, res) => {
  const shopid = req.params.shopid;
  const dressid = req.params.dressid;

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    const { image } = files;
    let imagePath = "";

    if (image && image.length > 0 && image[0].filepath) {
      const q = `SELECT dress_image, dress_unique_number FROM public.dresses WHERE shop_id=${shopid} and id=${dressid}`;

      const response = await client.query(q);
      let oldpath = "";

      // Delete Image
      if (response.length !== 0) {
        oldpath = response.rows[0].dress_image;

        const projectDirectory = path.resolve(
          __dirname,
          "../../uploads/dresses"
        );

        const folderName = "dresses";
        const oldImageDetails = {
          fileArray: response.rows,
          projectDirectory: projectDirectory,
          fileColumnNames: ["dress_image"],
          oldimagepath: oldpath,
        };

        imagePath = await updateImage(image, folderName, oldImageDetails);
      }
    } else if (fields.image && fields.image.length > 0) {
      imagePath = fields.image[0];
    }

    const dressName = fields.dressName[0];
    const price = fields.price[0];
    const gender = fields.gender[0];
    const dress_unique_number = fields.dress_unique_number[0];

    const fieldsWithImage = {
      dressName,
      price,
      gender,
      image: imagePath,
      dress_unique_number,
      shopid,
      dressid,
    };
    Dress.EditDress(req, res, fieldsWithImage);
  });
});

router.route("/getalldresses/:id").get(Dress.getAllDress);
router.route("/getdressdetail/:shopid/:dressid").get(Dress.getDressDetail);

router.route("/deletedress/:shopid/:dressid").delete(Dress.DeleteDress);
router.route("/getalldresseslength/:id").get(Dress.getalldresseslength);

module.exports = router;
