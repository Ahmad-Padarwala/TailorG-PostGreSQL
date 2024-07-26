const client = require("../../config/dbconnection");

const getBodyPartInMeasure = async (req, res) => {
  const id = req.params.id;
  const shopid = req.params.shopid;
  try {
    const q = `SELECT bop.*, dp.id AS dresses_part_id
        FROM body_parts AS bop
        INNER JOIN dresses_part AS dp ON dp.body_part_id = bop.id
        WHERE dp.dresses_id = $1 AND dp.shop_id = $2;`;
    client.query(q, [id, shopid], (err, data) => {
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

const getAllMeasurementData = async (req, res) => {
  const id = req.params.id;
  const shopid = req.params.shopid;
  try {
    const q = `SELECT drs.*, cm.id as cm_id, cm.name as cm_name, cm.created_date as cm_date
        FROM dresses AS drs
        INNER JOIN customer_measurement AS cm ON cm.dresses_id = drs.id
        WHERE cm.customer_id = $1 AND cm.shop_id = $2;`;
    client.query(q, [id, shopid], (err, data) => {
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

const getViewMeasurementData = async (req, res) => {
  const id = req.params.id;
  try {
    const q = `
            SELECT 
                drs.*, 
                cm.id as cm_id, 
                cm.name as cm_name, 
                cm.created_date as cm_date,
                meval.id as meval_id,
                meval.mea_value as meval_value,
                dp.body_part_id as dp_body_part_id,
                bp.part_name as bp_part_name
            FROM 
                dresses AS drs
            INNER JOIN 
                customer_measurement AS cm ON cm.dresses_id = drs.id
            INNER JOIN 
                customer_measurement_value AS meval ON meval.customer_measurement_id = cm.id
            INNER JOIN 
                dresses_part AS dp ON dp.id = meval.dresses_part_id
            INNER JOIN 
                body_parts AS bp ON bp.id = dp.body_part_id
            WHERE 
                cm.id = $1;
        `;
    client.query(q, [id], (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEditwMeasurementData = (req, res) => {
  const id = req.params.id;
  try {
    const q = `SELECT ms.*, msv.mea_value AS mea_value,msv.dresses_part_id as msv_dresses_part_id,bp.part_name as part_name,ds.dress_name as ds_name,ds.dress_image as ds_dress_image,ds.gender as ds_gender
        FROM customer_measurement AS ms
        INNER JOIN customer_measurement_value AS msv ON msv.customer_measurement_id = ms.id
        INNER JOIN dresses_part AS dp ON dp.id = msv.dresses_part_id
        INNER JOIN body_parts AS bp ON bp.id = dp.body_part_id
        INNER JOIN dresses AS ds ON ds.id = ms.dresses_id
        WHERE ms.id = $1`;
    client.query(q, [id], (err, data) => {
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


const addMeasureParts = async (req, res) => {
  const {
    name,
    dresses_id,
    customer_id,
    shop_id,
    created_date,
    mea_value,
  } = req.body;

  try {
    await client.query("BEGIN");

    const fquery = `
        INSERT INTO customer_measurement (name, dresses_id, customer_id, shop_id, created_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;
    const values = [name, dresses_id, customer_id, shop_id, created_date];
    const result = await client.query(fquery, values);
    const customer_measurement_id = result.rows[0].id;
    for (const part of mea_value) {
      const queryText = `
          INSERT INTO customer_measurement_value (dresses_part_id, mea_value, customer_measurement_id, customer_id, shop_id)
          VALUES ($1, $2, $3, $4, $5)
        `;
      const values = [part.pid, part.mea_value, customer_measurement_id, customer_id, shop_id];
      await client.query(queryText, values);
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Dress Added Successfully" });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  }
};

const deleteMeasurement = async (req, res) => {
  const meaId = req.params.id;
  try {
    await client.query("BEGIN");

    //Delete customer Measurement
    const DeleteMeasurementValueQuery = `DELETE FROM public.customer_measurement_value WHERE customer_measurement_id=${meaId}`;
    await client.query(DeleteMeasurementValueQuery);

    // Delete Dress
    const DeleteMeasurementQuery = `DELETE FROM public.customer_measurement WHERE id=${meaId}`;
    await client.query(DeleteMeasurementQuery);

    await client.query("COMMIT");
    res.status(200).json({ message: "Measurement Deleted Successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === '23503') { // Foreign key violation error code for PostgreSQL
      res.status(400).json({ msg: "You cannot delete this measurement because it is used in a order." });
    } else {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};


const editMeasureParts = async (req, res) => {
  const id = req.params.id;
  const { name, dresses_id, mea_value } = req.body;
  try {
    await client.query("BEGIN");
    let sql = `UPDATE public.customer_measurement SET name=$1, dresses_id=$2 WHERE id=$3`;
    const data = [name, dresses_id, id];

    await client.query(sql, data);

    for (const part of mea_value) {
      let ssql = `UPDATE public.customer_measurement_value SET mea_value=$1 WHERE customer_measurement_id=$2 AND dresses_part_id=$3`;
      const sdata = [part.mea_value, id, part.msv_dresses_part_id];
      await client.query(ssql, sdata);
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Dress updated Successfully" });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  }

}

const getMeasurementDataWithDress = async (req, res) => {
  const id = req.params.id;
  const cusId = req.params.cusId;
  const shopId = req.params.shopId;
  const q = `SELECT * FROM public.customer_measurement WHERE dresses_id=${id} AND customer_id=${cusId} AND shop_id=${shopId}`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};

module.exports = {
  getBodyPartInMeasure,
  addMeasureParts,
  getAllMeasurementData,
  getViewMeasurementData,
  deleteMeasurement,
  getEditwMeasurementData,
  editMeasureParts,
  getMeasurementDataWithDress
};