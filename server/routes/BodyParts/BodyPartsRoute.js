const express = require("express");
const router = express.Router();

const BodyPart = require("../../controller/BodyParts/BodyPart");

router.route("/addbodypartsdata").post(BodyPart.addBodyPartData);
router.route("/getbodypartdata/:id").get(BodyPart.getBodyPartData);
router.route("/geteditbodypartdata/:id").get(BodyPart.getEditBodyPartData);
router.route("/changestatusbodypart/:id/:num").put(BodyPart.changeStatusBodypart);
router.route("/updatebodypartdata/:id").put(BodyPart.updateBodyPartData);
router.route("/deletebodypart/:id").delete(BodyPart.deleteBodyPart);



router.route("/getbodypartsforname/:shopid").get(BodyPart.getBodyPartName);


module.exports = router;