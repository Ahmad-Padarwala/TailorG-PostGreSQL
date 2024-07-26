const client = require("../../config/dbconnection");
const formidable = require("formidable");
const path = require("path");
const { deleteFilesFromFolder } = require("../../config/deleteimage");

const addBankDetails = async (req, res, fields) => {
    try {
        const { bank_name, ac_no, ifsc_code, id, imagepath } = fields;


        const values = [bank_name, ac_no, ifsc_code, id, imagepath];
        const q = `
        INSERT INTO public.bank_details (
            bank_name, ac_no, ifsc_code,shop_id, image
            ) VALUES ($1, $2, $3, $4, $5)
            `;

        client.query(q, values, (err, data) => {
            if (err) {
                console.log(err)
                res.status(500).json({ msg: "Bank Details Cannot Added" });
            } else {
                console.log(data + "11");
                res.status(200).json({ message: "Bank Details added successfully" });
            }
        });
    } catch (error) {
        console.log("error in add bank details" + error)
        res.status(500).json({ message: error.message });
    }
};


const getAllbankData = (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM public.bank_details WHERE shop_id = $1";

    const values = [id];
    client.query(q, values, (err, data) => {
        if (err) {
            res.status(500).json({ msg: "Data Error" });
        } else {
            res.status(200).json(data);
        }
    });
};

const editBankDetails = async (req, res, fields) => {
    try {
        const { bank_name, ac_no, ifsc_code, shopid, image } = fields;
       
        let sql = `UPDATE public.bank_details SET bank_name=$1, ac_no=$2, ifsc_code=$3, image=$4 WHERE shop_id=$5`;

        const values = [bank_name, ac_no, ifsc_code, image, shopid];

        client.query(sql, values, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: "Bank Cannot Added" });
            } else {
                res.status(200).json({ message: "Bank added successfully" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
    addBankDetails,
    getAllbankData,
    editBankDetails,
};