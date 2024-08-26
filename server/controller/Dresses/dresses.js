const client = require("../../config/dbconnection");
const formidable = require("formidable");
const path = require("path");
const { deleteFilesFromFolder } = require("../../config/deleteimage");

const addDress = async (req, res, fields) => {
  try {

    const { dressName, price, gender, imagepath, id, dress_unique_number } =
      fields;

    const values = [
      dressName,
      price,
      gender,
      imagepath,
      id,
      dress_unique_number,
    ];
    const q = `
          INSERT INTO public.dresses (
            dress_name, dress_price, gender, dress_image, shop_id, dress_unique_number
          ) VALUES ($1, $2, $3, $4, $5, $6)
      `;

    client.query(q, values, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Dress Cannot Added" });
      } else {
        res.status(200).json({ message: "Dress added successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDress = async (req, res) => {
  const id = req.params.id;
  const gender = req.query.gender;
  const genderData = gender.toLowerCase();
  if (gender == "All") {
    try {
      const q =
        "SELECT * FROM public.dresses WHERE shop_id = $1 ORDER by id DESC";

      const values = [id];
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
  } else {
    try {
      const q =
        "SELECT * FROM public.dresses WHERE shop_id = $1 AND gender=$2 ORDER by id DESC";

      const values = [id, genderData];
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
  }
};

const getDressDetail = async (req, res) => {
  const dressid = req.params.dressid;
  const shopid = req.params.shopid;

  try {
    const q = "SELECT * FROM public.dresses WHERE shop_id = $1 and id = $2";

    const values = [shopid, dressid];
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

const DeleteDress = async (req, res) => {
  const dressid = req.params.dressid;
  const shopid = req.params.shopid;

  try {
    await client.query("BEGIN");

    // Get Data For Delete Dress
    const q = `SELECT dress_image, dress_unique_number FROM public.dresses WHERE shop_id=${shopid} and id=${dressid}`;

    const response = await client.query(q);
    let dressDetails = "";

    // Delete Image
    if (response.length !== 0) {
      dressDetails = response.rows;

      const projectDirectory = path.resolve(__dirname, "../../uploads/dresses");
      const fileColumnNames = ["dress_image"];
      await deleteFilesFromFolder(
        dressDetails,
        projectDirectory,
        fileColumnNames
      );
    }

    //Delete Dresses Parts
    const DeleteDressPartQuery = `DELETE FROM public.dresses_part WHERE shop_id=${shopid} and dresses_id=${dressid}`;
    const DeleteResponse = await client.query(DeleteDressPartQuery);

    // Delete Dress
    const DeleteDressQuery = `DELETE FROM public.dresses WHERE shop_id=${shopid} and id=${dressid}`;
    const DeleteDressResponse = await client.query(DeleteDressQuery);

    await client.query("COMMIT");
    res.status(200).json({ message: "Dress Added Successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === '23503') { // Foreign key violation error code for PostgreSQL
      res.status(400).json({ msg: "You cannot delete this dress because it is used in a order or measurement." });
    } else {
      console.log(error);
      res.status(500).json({ message: error });
    }

  }
};

const EditDress = async (req, res, fields) => {
  try {
    const {
      dressName,
      price,
      gender,
      image,
      dress_unique_number,
      shopid,
      dressid,
    } = fields;

    let sql = `UPDATE public.dresses SET dress_name=$1, dress_price=$2, gender=$3, dress_image=$4, dress_unique_number=$5 WHERE id=$6 and shop_id=$7`;

    const values = [
      dressName,
      price,
      gender,
      image,
      dress_unique_number,
      dressid,
      shopid
    ];

    client.query(sql, values, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Dress Cannot Added" });
      } else {
        res.status(200).json({ message: "Dress added successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getalldresseslength = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM public.dresses WHERE shop_id = $1";

  const values = [id];
  client.query(q, values, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};

module.exports = {
  addDress,
  getAllDress,
  getDressDetail,
  DeleteDress,
  EditDress,
  getalldresseslength,
};
