const client = require("../../config/dbconnection");
const formidable = require("formidable");

const GetDressBodyParts = async (req, res) => {
  const id = req.params.id;
  const gender = req.params.gender
  try {
    const q =
      "SELECT * FROM public.body_parts WHERE shop_id = $1 AND status = 1 AND gender =$2 ORDER by id DESC";

    const values = [id, gender];
    client.query(q, values, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AddDressBodyParts = async (req, res) => {
  const id = req.params.id;
  const { dress_unique_number, selectedParts } = req.body;
  try {
    await client.query("BEGIN");

    const response = await client.query(
      "SELECT id FROM dresses WHERE dress_unique_number = $1 ORDER BY id DESC LIMIT 1", [dress_unique_number]
    );
    const lastDressId = response.rows[0].id;

    // Insert each part into dresses_body_part table
    for (const part of selectedParts) {
      const queryText =
        "INSERT INTO dresses_part (body_part_id, dresses_id, shop_id, dress_unique_number) VALUES ($1, $2, $3, $4)";
      const values = [part.id, lastDressId, id, dress_unique_number];
      await client.query(queryText, values);
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Dress Added Successfully" });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: error });
  }
};


const GetPerDressBodyParts = async (req, res) => {
  const uniquenumber = req.params.uniquenumber;
  const shopid = req.params.shopid;
  const dressid = req.params.dressid;

  try {
    const q =
      "SELECT * FROM public.dresses_part WHERE shop_id = $1 AND dress_unique_number = $2 AND dresses_id = $3";

    const values = [shopid, uniquenumber, dressid];
    client.query(q, values, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        console.log(data);
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const GetCurrDressBodyParts = async (req, res) => {
  const uniquenumber = req.params.uniquenumber;
  const shopid = req.params.shopid;
  const dressid = req.params.dressid;
  const gender = req.params.gender;

  try {
    console.log(gender);
    const q =
    "SELECT dp.*, b.gender FROM public.dresses_part dp JOIN public.body_parts b ON dp.body_part_id = b.id WHERE b.gender =$4 AND dp.shop_id = $1 AND dp.dress_unique_number = $2 AND dp.dresses_id = $3";
    const values = [shopid, uniquenumber, dressid, gender];
    client.query(q, values, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const EditDressBodyParts = async (req, res) => {
  const shopid = req.params.shopid;
  const dressid = req.params.dressid;

  const { dress_unique_number, selectedParts } = req.body;
  try {
    await client.query("BEGIN");

    const response = await client.query(
      "DELETE FROM dresses_part WHERE dresses_id = $1", [dressid]
    );

    

    // Insert each part into dresses_body_part table
    for (const part of selectedParts) {
      const queryText =
        "INSERT INTO dresses_part (body_part_id, dresses_id, shop_id, dress_unique_number) VALUES ($1, $2, $3, $4)";
      const values = [part.id, dressid, shopid, dress_unique_number];
      await client.query(queryText, values);
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Dress Added Successfully" });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: error });
  }
};
module.exports = {
  GetDressBodyParts,
  AddDressBodyParts,
  GetPerDressBodyParts,
  GetCurrDressBodyParts,
  EditDressBodyParts
};