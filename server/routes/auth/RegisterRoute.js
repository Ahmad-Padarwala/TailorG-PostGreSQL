const express = require("express");
const router = express.Router();
const auth = require("../../controller/auth/Registration");

router.route("/addregistration").post(auth.addRegisterShopData);
router.route("/shoplogin").post(auth.loginShopMaster);
router
  .route("/getCurrectRegisteredShopData")
  .get(auth.getCurrectRegisteredShopData);

module.exports = router;
