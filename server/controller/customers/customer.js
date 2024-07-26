const client = require("../../config/dbconnection");

const addcustomerdata = (req, res) => {
  const {
    customer_name,
    mobile_number,
    email,
    gender,
    address,
    created_date,
    shop_id,
    bg_color,
  } = req.body;
  const pincode = req.body.pincode ? req.body.pincode : 1;
  const values = [
    customer_name,
    mobile_number,
    email,
    gender,
    address,
    pincode,
    created_date,
    shop_id,
    bg_color,
  ];
  const q = `
        INSERT INTO public.customer (
            customer_name, 
            mobile_number, 
            email, 
            gender, 
            address, 
            pincode, 
            created_date, 
            updated_date, 
            shop_id,
            bg_color
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8,$9)
    `;

  client.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Customer Cannot Added" });
    } else {
      res.sendStatus(200);
    }
  });
};

const getAllCustomerData = (req, res) => {
  const id = req.params.id;
  const q = `
    SELECT cs.id, cs.customer_name, cs.address, cs.mobile_number, cs.bg_color,
           COALESCE(py.total_amount, 0) AS total_amount,
           COALESCE(co.total_order_value, 0) AS total_order_value
    FROM customer AS cs
    LEFT JOIN (
        SELECT customer_id, SUM(CAST(amount AS NUMERIC)) AS total_amount
        FROM payment
        GROUP BY customer_id
    ) AS py ON py.customer_id = cs.id
    LEFT JOIN (
        SELECT customer_id, SUM(CAST(price AS NUMERIC) * CAST(qty AS NUMERIC)) AS total_order_value
        FROM customer_order
        GROUP BY customer_id
    ) AS co ON co.customer_id = cs.id
    WHERE cs.shop_id = $1
    GROUP BY cs.id, cs.customer_name, cs.address, cs.mobile_number, cs.bg_color, py.total_amount, co.total_order_value;
  `;

  client.query(q, [id], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data.rows);
    }
  });
};

const getCustomerDataWithId = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM public.customer WHERE id=${id}`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};

const editCustomerData = (req, res) => {
  let id = req.params.id;
  const {
    customer_name,
    mobile_number,
    email,
    gender,
    address,
    pincode,
    created_date,
    shop_id,
  } = req.body;
  let sql = `UPDATE public.customer SET customer_name=$1, mobile_number=$2, email=$3, gender=$4, address=$5,pincode=$6,created_date=$7,updated_date=NOW(),shop_id=$8 WHERE id=$9`;
  const data = [
    customer_name,
    mobile_number,
    email,
    gender,
    address,
    pincode,
    created_date,
    shop_id,
    id,
  ];
  client.query(sql, data, (error) => {
    if (error) {
      console.error("Error updating customer  data:", error);
      return res.status(500).json({ error: "Error updating customer data" });
    }
    return res.sendStatus(200);
  });
};

const deleteCustomerData = async (req, res) => {
  const id = req.params.id;
  try {
    await client.query("BEGIN");
    const orderq = `DELETE FROM public.customer_order WHERE customer_id=${id}`;
    await client.query(orderq);

    const measvalq = `DELETE FROM public.customer_measurement_value WHERE customer_id=${id}`;
    await client.query(measvalq);

    const measq = `DELETE FROM public.customer_measurement WHERE customer_id=${id}`;
    await client.query(measq);

    const payq = `DELETE FROM public.payment WHERE customer_id=${id}`;
    await client.query(payq);

    const cusq = `DELETE FROM public.customer WHERE id=${id}`;
    await client.query(cusq);
    await client.query("COMMIT");
    res.status(200).json({ message: "Customer Deleted Successfully" });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: error });
  }
};

module.exports = {
  addcustomerdata,
  getAllCustomerData,
  getCustomerDataWithId,
  editCustomerData,
  deleteCustomerData,
};
