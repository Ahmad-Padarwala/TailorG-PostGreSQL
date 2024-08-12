const client = require("../../config/dbconnection");
const getBodyPartsData = (req, res) => {
  const id = req.params.id;
  const q = ` SELECT 
                meval.id as meval_id,
                meval.mea_value as meval_value,
                dp.body_part_id as dp_body_part_id,
                bp.part_name as bp_part_name
            FROM 
                
             customer_measurement_value AS meval
            INNER JOIN 
                dresses_part AS dp ON dp.id = meval.dresses_part_id
            INNER JOIN 
                body_parts AS bp ON bp.id = dp.body_part_id
            WHERE 
                meval.customer_measurement_id = ${id}`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};
const addCustomerOrder = (req, res) => {
  try {
    const {
      price,
      qty,
      order_date,
      delivery_date,
      special_note,
      urgent,
      customer_measurement_id,
      customer_id,
      shop_id,
      dress_id,
    } = req.body;

    const q = `
      INSERT INTO public.customer_order (
        price, qty, order_date, delivery_date, special_note, urgent, customer_measurement_id, customer_id, shop_id, dress_id,status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
    `;

    const values = [
      price,
      qty,
      order_date,
      delivery_date,
      special_note,
      urgent,
      customer_measurement_id,
      customer_id,
      shop_id,
      dress_id,
      "active",
    ];

    client.query(q, values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Order cannot be added" });
      } else {
        const insertedId = result.rows[0].id;
        res
          .status(200)
          .json({ message: "Order added successfully", orderId: insertedId });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCustomerOrder = (req, res) => {
  const id = req.params.id;
  const q = `SELECT 
  co.id,
  co.price AS order_price,
  co.qty,
  (co.order_date AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'UTC' AS order_date, 
  (co.delivery_date AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'UTC' AS delivery_date, 
  co.special_note, 
  co.urgent, 
  co.customer_measurement_id, 
  co.customer_id, 
  co.shop_id, 
  co.dress_id, 
  co.status,
  d.dress_name,
  d.dress_image
FROM 
  customer_order co
JOIN 
  dresses d
ON 
  co.dress_id = d.id
WHERE 
  co.customer_id = ${id};
`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};
const getAllCustomerOrder = (req, res) => {
  const shopid = req.params.shopid;
  const q = `SELECT 
  co.id,
  co.price AS order_price,
  co.qty, 
  co.order_date, 
  co.delivery_date, 
  co.special_note, 
  co.urgent, 
  co.customer_measurement_id, 
  co.customer_id, 
  co.shop_id, 
  co.dress_id, 
  co.status,
  d.dress_name,
  d.dress_image
FROM 
  customer_order co
JOIN 
  dresses d
ON 
  co.dress_id = d.id
WHERE 
  co.shop_id=${shopid}
`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};
const getAllUrgentOrder = (req, res) => {
  const shopid = req.params.shopid;
  const q = `SELECT 
  co.id,
  co.price AS order_price,
  co.qty, 
  co.order_date, 
  co.delivery_date, 
  co.special_note, 
  co.urgent, 
  co.customer_measurement_id, 
  co.customer_id, 
  co.shop_id, 
  co.dress_id, 
  co.status,
  d.dress_name,
  d.dress_image
FROM 
  customer_order co
JOIN 
  dresses d
ON 
  co.dress_id = d.id
WHERE 
  co.shop_id=${shopid} and co.urgent='yes'
`;

  client.query(q, (err, data) => {
    if (err) {
      res.status(500).json({ msg: "Data Error" });
    } else {
      res.status(200).json(data);
    }
  });
};
const getViewCustomerOrder = (req, res) => {
  const id = req.params.id;
  console.log(id);

  const q = `SELECT 
    co.id,
    co.price,
    co.qty,
    co.order_date::TEXT AS order_date,
    co.delivery_date::TEXT AS delivery_date,
    co.special_note,
    co.urgent,
    co.customer_measurement_id,
    co.customer_id,
    co.shop_id,
    co.dress_id,
    co.status,
    d.dress_name,
    d.dress_image,
    d.gender,
    c.customer_name,
    cm.id AS cm_id,
    cm.name,
    cmv.dresses_part_id,
    cmv.mea_value,
    dp.body_part_id,
    bp.part_name
  FROM 
    customer_order co
  JOIN 
    dresses d ON co.dress_id = d.id
  JOIN 
    customer c ON co.customer_id = c.id
  JOIN 
    customer_measurement cm ON co.customer_measurement_id = cm.id
  JOIN 
    customer_measurement_value cmv ON cm.id = cmv.customer_measurement_id
  JOIN 
    dresses_part dp ON dp.id = cmv.dresses_part_id
  JOIN 
    body_parts bp ON bp.id = dp.body_part_id
  WHERE 
    co.id = ${id};`;

  client.query(q, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ msg: "Data Error" });
    } else {
      console.log("object");
      console.log(data.rows);
      res.status(200).json(data);
    }
  });
};


const DeleteOrder = async (req, res) => {
  const orderid = req.params.id;

  try {
    // Get Data For Delete Dress
    const q = `DELETE FROM public.customer_order WHERE id=${orderid}`;

    client.query(q, (err, data) => {
      if (err) {
        res.status(500).json({ msg: "Data Error" });
      } else {
        res.status(200).json({ message: "order deleted" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const OrderStatusChange = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  let sql = `UPDATE public.customer_order SET status=$1 WHERE id=$2`;
  const data = [status, orderId];
  client.query(sql, data, (error) => {
    if (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ error: "Error updating order status" });
    }
    return res.sendStatus(200);
  });
};
const UpdateCustomerOrderData = async (req, res) => {
  const { delivery_date, order_date, price, qty, special_note, urgent } =
    req.body;
  const id = req.params.id;
  let sql = `UPDATE public.customer_order SET price=$1, qty=$2, order_date=$3, delivery_date=$4, special_note=$5, urgent=$6 WHERE id=$7`;
  const values = [
    price,
    qty,
    order_date,
    delivery_date,
    special_note,
    urgent,
    id,
  ];
  client.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "order Cannot update" });
    } else {
      res.status(200).json({ message: "order updated" });
    }
  });
};

module.exports = {
  getBodyPartsData,
  getCustomerOrder,
  addCustomerOrder,
  getViewCustomerOrder,
  DeleteOrder,
  OrderStatusChange,
  UpdateCustomerOrderData,
  getAllCustomerOrder,
  getAllUrgentOrder,
};
