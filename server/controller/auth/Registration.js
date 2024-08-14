const client = require("../../config/dbconnection");
const smsAPI = require("./SmsApi"); // Assuming SmsApi module for sending SMS
const bcrypt = require("bcrypt");
const saltRounds = 10;
// Initialize Redis client
const otpStore = new Map();

//verify otp for forgot password;
const verifyOTP = (contact_number, otp) => {
  const otpData = otpStore.get(contact_number);
  if (!otpData) {
    return false;
  }
  const { otp: storedOtp, expiryTime } = otpData;
  if (Date.now() > expiryTime) {
    otpStore.delete(contact_number); // Remove expired OTP
    return false;
  }
  return storedOtp === otp;
};
// Function to add new shop registration
const addRegisterShopData = async (req, res) => {
  const { fname, lname, shop_name, contact, email, password, otp } = req.body;

  try {
    // Check if email or contact number already exists
    const checkQuery = `
    SELECT * FROM public.shops
    WHERE email = $1
    `;
    const checkValues = [email];
    const result = await client.query(checkQuery, checkValues);

    if (result.rows.length > 0) {
      const existingData = result.rows[0];
      if (existingData.email === email) {
        return res.json({ exists: true, msg: "Email already exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into database
    const insertQuery = `
      INSERT INTO public.shops (
        first_name,
        last_name,
        shop_name,
        contact_number,
        email,
        password,
        otp,
        created_date,
        updated_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `;
    const insertValues = [
      fname,
      lname,
      shop_name,
      contact,
      email,
      hashedPassword,
      otp,
    ];
    await client.query(insertQuery, insertValues);
    res.status(200).json({ contact: contact, msg: "Registration successful" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Registration Error" });
  }
};

// Function to login shop master
const loginShopMaster = async (req, res) => {
  const { identifier, password } = req.body;
  console.log(identifier);

  try {
    // Check if identifier is a contact number or email
    const isContactNumber = /^\d+$/.test(identifier);
    const query = isContactNumber
      ? "SELECT * FROM public.shops WHERE contact_number = $1"
      : "SELECT * FROM public.shops WHERE email = $1";
    const values = [identifier];

    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.json({
        success: false,
        msg: isContactNumber ? "Incorrect contact number" : "Incorrect email",
      });
    }

    const user = result.rows[0];
    // Compare hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, msg: "Incorrect password" });
    }

    res.json({ success: true, msg: "Login successful", user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login Error" });
  }
};

// Function to request OTP for shop registration
var varotp;
const requestOtp = async (req, res) => {
  const { contact } = req.body;
  const checkQuery = `
      SELECT * FROM public.shops
      WHERE contact_number = $1;
    `;
  const checkValues = [contact];
  const result = await client.query(checkQuery, checkValues);

  if (result.rows.length > 0) {
    const existingData = result.rows[0];
    if (existingData.contact_number === contact) {
      return res.json({ exists: true, msg: "Contact Number already exists" });
    }
  }
  try {
    const isContactNumber = /^\d+$/.test(contact);
    if (!isContactNumber) {
      return res.json({ success: false, msg: "Invalid contact number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    varotp = otp;
    const response = await smsAPI.sendOTP(contact, otp);

    // Check if the OTP was successfully sent
    if (!response.startsWith('100')) {
      console.error("Failed to send OTP:", response);
      return res.status(500).json({ success: false, msg: "Failed to send OTP" });
    }

    res.json({ success: true, msg: "OTP sent" });
  } catch (err) {
    console.error("OTP Request Error:", err);
    res.status(500).json({ msg: "OTP Request Error" });
  }
};

// Function to verify OTP for shop registration
const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    if (otp != varotp) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }


    res.json({ success: true, msg: "OTP verified" });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ msg: "OTP Verification Error" });
  }
};


const requestOTPForgotPass = async (req, res) => {
  const { contact_number } = req.body;
  const checkQuery = `
      SELECT * FROM public.shops
      WHERE contact_number = $1;
    `;
  const checkValues = [contact_number];
  const result = await client.query(checkQuery, checkValues);

  if (result.rows.length > 0) {
    const existingData = result.rows[0];
    if (existingData.contact_number !== contact_number) {
      return res.json({ exists: true, msg: "This contact number is not registered" });
    }
  }
  try {
    const isContactNumber = /^\d+$/.test(contact_number);
    if (!isContactNumber) {
      return res.json({ success: false, msg: "Invalid contact number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const response = await smsAPI.sendOTP(contact_number, otp);

    // Check if the OTP was successfully sent
    if (!response.startsWith('100')) {
      console.error("Failed to send OTP:", response);
      return res.status(500).json({ success: false, msg: "Failed to send OTP" });
    }


    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(contact_number, { otp, expiryTime });

    res.json({ success: true, msg: "OTP sent" });
  } catch (err) {
    console.error("OTP Request Error:", err);
    res.status(500).json({ msg: "OTP Request Error" });
  }
};

const verifyOTPForgotPass = async (req, res) => {
  const { contact_number, otp } = req.body;
  const isValid = verifyOTP(contact_number, otp);
  if (isValid) {
    res.json({ success: true, msg: "OTP verified" });
  } else {
    res.json({ success: false, msg: "Invalid or expired OTP" });
  }
};

const updatePassword = async (req, res) => {

  const { contact_number, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  if (!password) {
    return res.status(400).json({ msg: "Password is required" });
  }
  let sql = `UPDATE public.shops SET password=$1 WHERE contact_number=$2`;
  const data = [
    hashedPassword,
    contact_number
  ];
  client.query(sql, data, (error) => {
    if (error) {
      console.error("Error updating shop data:", error);
      return res.status(500).json({ error: "Error updating shop data" });
    }
    return res.sendStatus(200);
  });

}

// Function to get current registered shop data by contact number
const getCurrectRegisteredShopData = async (req, res) => {
  const contact = req.query.contact;

  if (!contact) {
    return res.status(400).json({ msg: "Contact number is required" });
  }

  // Use parameterized query to prevent SQL injection
  const q = "SELECT * FROM public.shops WHERE contact_number = $1";

  try {
    const result = await client.query(q, [contact]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Data Error:", err);
    res.status(500).json({ msg: "Data Error" });
  }
};

module.exports = {
  addRegisterShopData,
  loginShopMaster,
  getCurrectRegisteredShopData,
  requestOtp,
  verifyOtp,
  requestOTPForgotPass,
  verifyOTPForgotPass,
  updatePassword,
};