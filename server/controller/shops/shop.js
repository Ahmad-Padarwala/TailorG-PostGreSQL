const client = require("../../config/dbconnection");

const getShopData = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM public.shops WHERE id=${id}`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};

const editshopData = (req, res) => {
  const { first_name, last_name, shop_name, contact_number, email, image } = req.body;
  const id = req.params.id;

  console.log("Updating shop data for ID:", id); // Log updating data
  console.log("Received data:", { first_name, last_name, shop_name, contact_number, email, image });

  const sql = `UPDATE public.shops SET first_name=$1, last_name=$2, shop_name=$3, contact_number=$4, email=$5, profile_img=$6, updated_by=$7, updated_date=NOW() WHERE id=$8`;
  const data = [first_name, last_name, shop_name, contact_number, email, image, id, id];

  client.query(sql, data, (error) => {
    if (error) {
      console.error("Error updating shop data:", error);
      return res.status(500).json({ error: "Error updating shop data" });
    }
    console.log("Shop data updated successfully");
    return res.sendStatus(200);
  });
};


module.exports = { getShopData, editshopData };
