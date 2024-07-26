const express = require("express");
const router = express.Router();
const { formidable } = require("formidable");
const Measurement = require("../../controller/Measurement/Measurement");
const { uploadFile } = require("../../config/addimage");

router.route("/getbodypartsinmeasure/:id/:shopid").get(Measurement.getBodyPartInMeasure)
router.route("/getallmeasurementdata/:id/:shopid").get(Measurement.getAllMeasurementData)
router.route("/getviewmeasurementdata/:id").get(Measurement.getViewMeasurementData)
router.route("/geteditwmeasurementdata/:id").get(Measurement.getEditwMeasurementData)
router.route("/addmeasureparts").post(Measurement.addMeasureParts)
router.route("/editmeasureparts/:id").put(Measurement.editMeasureParts)
router
  .route("/getmeasurementdatawithdressId/:id/:cusId/:shopId")
  .get(Measurement.getMeasurementDataWithDress);
router.route("/deletemeasurement/:id").delete(Measurement.deleteMeasurement)

module.exports = router;
