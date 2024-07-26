const express = require("express");
const router = express.Router();

const Payment = require("../../controller/payments/Payment");

router.route("/addpaymentData").post(Payment.addPaymentData);
router.route("/getallpaymentdata/:customId/:shopId").get(Payment.getAllPaymentData);
router.route("/getallpaymentdataForShop/:shopId").get(Payment.getallpaymentdataForShop);
router.route("/getpaymentdatawithid/:id").get(Payment.getPaymentDataWithId);
router.route("/getdatafortotaldue/:id").get(Payment.getDataForTotalDue);
router.route("/getdatafortotaldueshop/:id").get(Payment.getdatafortotaldueShop);
router.route("/updatepaymentdata/:id").put(Payment.updatePayment);
router.route("/deletepayment/:id").delete(Payment.deletePayment);



module.exports = router;