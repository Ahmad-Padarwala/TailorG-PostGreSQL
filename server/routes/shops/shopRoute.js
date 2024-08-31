const express = require("express");
const router = express.Router();
const path = require("path");
const { formidable } = require("formidable");
const { uploadFile } = require("../../config/addimage");
const { updateImage } = require("../../config/updateimage");

const shop = require("../../controller/shops/shop");

router.route("/getshopdata/:id").get(shop.getShopData);
router.route("/getpathesdata").get(shop.getPathesData);
router.route("/editshopdata/:id").put(shop.editshopData);



module.exports = router;
