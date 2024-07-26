const express = require("express");
const router = express.Router();
const Order = require("../../controller/Order/Order");

router.route("/getbodypartsdata/:id").get(Order.getBodyPartsData);
router.route("/getcustomerorder/:id").get(Order.getCustomerOrder);
router.route("/getviewcustomerorder/:id").get(Order.getViewCustomerOrder);
router.route("/getAllCustomerOrder/:shopid").get(Order.getAllCustomerOrder);
router.route("/getAllUrgentOrder/:shopid").get(Order.getAllUrgentOrder);
router.route("/addcustomerorder").post(Order.addCustomerOrder);
router.route("/deleteorder/:id").delete(Order.DeleteOrder);
router.route("/editcustomerorderstatus/:id").put(Order.OrderStatusChange);
router.route("/updatecustomerorderdata/:id").put(Order.UpdateCustomerOrderData);

module.exports = router;
