const express = require("express");
const router = express.Router();

const customer = require("../../controller/customers/customer");

router.route("/addCuatomerData").post(customer.addcustomerdata);
router.route("/getallcustomerdata/:id").get(customer.getAllCustomerData);
router.route("/getcustomerdatawithid/:id").get(customer.getCustomerDataWithId);
router.route("/editcustomerdata/:id").put(customer.editCustomerData);
router.route("/deleteCustomerData/:id").delete(customer.deleteCustomerData);

module.exports = router;
