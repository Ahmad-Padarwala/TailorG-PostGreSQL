const express = require("express");
const router = express.Router();
const auth = require("../../controller/auth/Registration");

router.route("/addregistration").post(auth.addRegisterShopData);
router.route("/shoplogin").post(auth.loginShopMaster);
router.route("/requestOTP").post(auth.requestOtp);
router.route("/verifyOTP").post(auth.verifyOtp);
router.route("/updatePassword").put(auth.updatePassword);
router.route("/requestOTPForgotPass").post(auth.requestOTPForgotPass);
router.route("/verifyOTPForgotPass").post(auth.verifyOTPForgotPass);
router
  .route("/getCurrectRegisteredShopData")
  .get(auth.getCurrectRegisteredShopData);

module.exports = router;
