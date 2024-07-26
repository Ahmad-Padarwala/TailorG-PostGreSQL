const client = require("../../config/dbconnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const addRegisterShopData = async (req, res) => {
  const { fname, lname, shop_name, contact, email, password } = req.body;

  try {
    let checkQuery;
    let checkValues;

    // Check if email is provided
    if (email.trim() === "") {
      checkQuery = `
        SELECT * FROM public.shops
        WHERE contact_number = $1
      `;
      checkValues = [contact];
    } else {
      checkQuery = `
        SELECT * FROM public.shops
        WHERE email = $1 OR contact_number = $2
      `;
      checkValues = [email, contact];
    }

    const result = await client.query(checkQuery, checkValues);
    if (result.rows.length > 0) {
      return res.json({
        exists: true,
        msg:
          email.trim() === ""
            ? "Contact number already exists"
            : "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // If not exists, proceed to insert the new registration data
    const insertQuery = `
      INSERT INTO public.shops (
          first_name,
          last_name,
          shop_name,
          contact_number,
          email,
          password,
          created_date,
          updated_date
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `;
    const insertValues = [
      fname,
      lname,
      shop_name,
      contact,
      email,
      hashedPassword,
    ];

    await client.query(insertQuery, insertValues);
    return res
      .status(200)
      .json({ contact: contact, msg: "Registration successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Registration Error" });
  }
};

const loginShopMaster = async (req, res) => {
  const { identifier, password } = req.body;
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
    // Assuming passwords are hashed, you would use bcrypt to compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, msg: "Incorrect password" });
    }

    res.json({ success: true, msg: "Login successful", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login Error" });
  }
};

const getCurrectRegisteredShopData = async (req, res) => {
  const contact = req.query.contact;
  if (!contact) {
    return res.status(400).json({ msg: "Contact number is required" });
  }

  // Use parameterized query to prevent SQL injection
  const q = "SELECT * FROM public.shops WHERE contact_number = $1";

  client.query(q, [contact], (err, result) => {
    if (err) {
      console.log("err", err);
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(result.rows);
    }
  });
};

module.exports = {
  addRegisterShopData,
  loginShopMaster,
  getCurrectRegisteredShopData,
};
