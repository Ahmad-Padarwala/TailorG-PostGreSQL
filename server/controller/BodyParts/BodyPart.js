const client = require("../../config/dbconnection");

const addBodyPartData = (req, res) => {
  const { part_name, gender, shop_id } = req.body;
  const values = [part_name, gender, 1, shop_id];
  const q = `
        INSERT INTO public.body_parts (
        part_name,
        gender,
        status,
        shop_id
        ) VALUES ($1, $2, $3,$4)
    `;

  client.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Body Part Cannot Added" });
    } else {
      res.sendStatus(200);
    }
  });
};

const getBodyPartData = (req, res) => {
  const id = req.params.id;
  const gender = req.query.gender;
  const genderData = gender.toLowerCase();
  if (gender == "All") {
    const q = `SELECT * FROM public.body_parts WHERE shop_id=${id} ORDER BY id DESC`;
    client.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  } else if (gender == "Active") {
    const q = `SELECT * FROM public.body_parts WHERE status= 1 AND shop_id=${id} ORDER BY id DESC`;
    client.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  } else if (gender == "Disable") {
    const q = `SELECT * FROM public.body_parts WHERE status= 0 AND shop_id=${id} ORDER BY id DESC`;
    client.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  } else {
    const q = `SELECT * FROM public.body_parts WHERE gender = $1 AND shop_id=${id} ORDER BY id DESC`;
    client.query(q, [genderData], (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  }
};

const getEditBodyPartData = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM public.body_parts WHERE id=${id}`;
  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};

const changeStatusBodypart = (req, res) => {
  let { id, num } = req.params;
  if (num == 1) {
    let sql = `UPDATE public.body_parts SET status=0 WHERE id=${id}`;
    client.query(sql, (error) => {
      if (error) {
        console.error("Error updating customer  data:", error);
        return res.status(500).json({ error: "Error updating customer data" });
      }
      return res.sendStatus(200);
    });
  }
  if (num == 0) {
    let sql = `UPDATE public.body_parts SET status=1 WHERE id=${id}`;
    client.query(sql, (error) => {
      if (error) {
        console.error("Error updating customer  data:", error);
        return res.status(500).json({ error: "Error updating customer data" });
      }
      return res.sendStatus(200);
    });
  }
};

const updateBodyPartData = (req, res) => {
  let id = req.params.id;
  const { part_name, gender } = req.body;
  let sql = `UPDATE public.body_parts SET part_name=$1, gender=$2 WHERE id=$3`;
  const data = [part_name, gender, id];
  client.query(sql, data, (error) => {
    if (error) {
      console.error("Error updating body part data:", error);
      return res.status(500).json({ error: "Error updating body part data" });
    }
    return res.sendStatus(200);
  });
};

const deleteBodyPart = (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM public.body_parts WHERE id=${id}`;

  client.query(q, (err, data) => {
    if (err) {
      if (err.code === '23503') { // Foreign key violation error code for PostgreSQL
        res.status(400).json({ msg: "You cannot delete this body part because it is used in a dress." });
      } else {
        res.status(500).json({ msg: "Data Error" });
      }
    } else {
      res.sendStatus(200);
    }
  });
};

// const deleteBodyPart = (req, res) => {
//   const id = req.params.id;
//   const q = `DELETE FROM public.body_parts WHERE id=${id}`;

//   client.query(q, (err, data) => {
//     if (err) {
//       res.status(500).json({ msg: "Data Error" });
//     } else {
//       res.sendStatus(200);
//     }
//   });
// };

const getBodyPartName = (req, res) => {
  const shopid = req.params.shopid;


  const q = `SELECT * FROM public.body_parts WHERE shop_id=${shopid}`;
  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};

module.exports = {
  addBodyPartData,
  getBodyPartData,
  getEditBodyPartData,
  changeStatusBodypart,
  updateBodyPartData,
  deleteBodyPart,
  getBodyPartName,
};
