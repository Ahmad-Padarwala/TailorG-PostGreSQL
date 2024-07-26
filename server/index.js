const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const Auth_Route = require("./routes/auth/RegisterRoute");

const customerRoute = require("./routes/customers/customerRoute");
const bodyParts_route = require("./routes/BodyParts/BodyPartsRoute");
const shop_route = require("./routes/shops/shopRoute");

const payment_route = require("./routes/payments/PaymentRoute");

const dresses_route = require("./routes/dresses/dressesRoute");
const dresses_body_parts_route = require("./routes/dresses/dressesBodyPartsRoute");
const Measurement_route = require("./routes/Measurement/MeasurementRoute");
const Order_route = require("./routes/order/OrderRoute");
const Bank_route = require("./routes/bank-details/BankDetailRoute")

const app = express();
const port = 8000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/", Auth_Route);

app.use("/", customerRoute);
app.use("/", bodyParts_route);
app.use("/", Order_route);
app.use("/", shop_route);

app.use("/", payment_route);
app.use("/", dresses_route);
app.use("/", dresses_body_parts_route);
app.use("/", Measurement_route);
app.use("/", Bank_route);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
