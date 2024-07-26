const express = require("express");
const router = express.Router();
const DressBodyParts = require("../../controller/Dresses/dressesBodyParts");


router.route("/getallbodyparts/:id/:gender").get(DressBodyParts.GetDressBodyParts)
router.route("/getdressbodyparts/:shopid/:dressid/:uniquenumber").get(DressBodyParts.GetPerDressBodyParts)
router.route("/getcurrdressbodyparts/:shopid/:uniquenumber/:dressid/:gender").get(DressBodyParts.GetCurrDressBodyParts)
router.route("/adddressesbodyparts/:id").post(DressBodyParts.AddDressBodyParts)
router.route("/editdressesbodyparts/:shopid/:dressid").patch(DressBodyParts.EditDressBodyParts)


module.exports = router;