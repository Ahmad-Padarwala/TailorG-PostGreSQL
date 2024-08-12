const client = require("../../config/dbconnection");

const addPaymentData = (req, res) => {
    const {
        amount, rounded, payment_mode, remark, payment_date, recieved_by, customer_id, shop_id
    } = req.body;
    const values = [
        amount, rounded, payment_mode, remark, payment_date, recieved_by, customer_id, shop_id
    ];
    const q = `
        INSERT INTO public.payment (
        amount,
        rounded,
         payment_mode,
         remark,
         payment_date, 
        recieved_by,
         customer_id,
         shop_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
    `;

    client.query(q, values, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: "payment Cannot Added" });
        } else {
            res.sendStatus(200);
        }
    });
};

const getAllPaymentData = (req, res) => {
    const { customId, shopId } = req.params;
    const q = `SELECT id, 
                      amount, 
                      rounded, 
                      payment_mode,
                      payment_date::TEXT AS payment_date, 
                      remark, 
                      recieved_by, 
                      updated_by, 
                      customer_id, 
                      shop_id 
               FROM public.payment 
               WHERE customer_id=${customId} AND shop_id=${shopId} 
               ORDER BY id DESC`;
    client.query(q, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            console.log(data.rows)
            res.status(200).json(data);
        }
    });
}
const getallpaymentdataForShop = (req, res) => {
    const { shopId } = req.params;
    const q = `SELECT amount FROM public.payment WHERE shop_id=${shopId}`;

    client.query(q, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            res.status(200).json(data);
        }
    });
}

const getPaymentDataWithId = (req, res) => {
    const id = req.params.id;
    // Treat the payment_date as in your local time zone (e.g., 'Asia/Kolkata')
    const q = `SELECT id, amount, rounded, payment_mode, remark, 
                     (payment_date AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'UTC' AS payment_date, 
                     recieved_by, updated_by, customer_id, shop_id 
              FROM public.payment 
              WHERE id=${id}`;

    client.query(q, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            res.status(200).json(data);
        }
    });
}


const getDataForTotalDue = (req, res) => {
    const id = req.params.id;
    const q = `SELECT price,qty FROM public.customer_order WHERE customer_id=${id}`;

    client.query(q, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            res.status(200).json(data);
        }
    });
}
const getdatafortotaldueShop = (req, res) => {
    const id = req.params.id;
    const q = `SELECT price,qty,status,urgent FROM public.customer_order WHERE shop_id=${id}`;

    client.query(q, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            res.status(200).json(data);
        }
    });
}

const deletePayment = (req, res) => {
    const id = req.params.id;
    const q = `DELETE FROM public.payment WHERE id=${id}`;

    client.query(q, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            res.sendStatus(200);
        }
    });
};


const updatePayment = (req, res) => {
    let id = req.params.id;
    const {
        amount, rounded, payment_mode, remark, payment_date, updated_by } = req.body;
    let sql = `UPDATE public.payment SET amount=$1, rounded=$2, payment_mode=$3 , remark=$4 , payment_date=$5 , updated_by=$6  WHERE id=$7`;
    const data = [amount, rounded, payment_mode, remark, payment_date, updated_by, id];
    client.query(sql, data, (error) => {
        if (error) {
            console.error("Error updating poayment data:", error);
            return res.status(500).json({ error: "Error updating poayment data" });
        }
        return res.sendStatus(200);
    });
};


module.exports = { addPaymentData, getAllPaymentData, getallpaymentdataForShop, getdatafortotaldueShop, getPaymentDataWithId, deletePayment, updatePayment, getDataForTotalDue }