const express = require("express");
const router = express.Router();
const path = require("path");
const { formidable } = require("formidable");
const { uploadFile } = require("../../config/addimage");
const { updateImage } = require("../../config/updateimage");
const client = require("../../config/dbconnection");
const BankDetails = require("../../controller/bank-details/BankDetails");

router.route("/addbankdetails/:id").post((req, res) => {
    const id = req.params.id;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        const { image } = files;
        const imagepath = await uploadFile(image, "bank");
        const bank_name = fields.bank_name[0];
        const ac_no = fields.ac_no[0];
        const ifsc_code = fields.ifsc_code[0];

        const fieldsWithImage = {
            bank_name,
            ac_no,
            ifsc_code,
            id,
            imagepath,
        };
        console.log(fieldsWithImage + "1")
        BankDetails.addBankDetails(req, res, fieldsWithImage);
    });
});

router.route("/editbankdetails/:id").patch((req, res) => {
    const shopid = req.params.id;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        const { image } = files;
        // console.log(image)
        let imagePath = "";

        if (image && image.length > 0 && image[0].filepath) {
            const q = `SELECT image FROM public.bank_details WHERE shop_id=${shopid}`;

            const response = await client.query(q);
            let oldpath = "";

            // Delete Image
            if (response.length !== 0) {
                oldpath = response.rows[0].image;

                const projectDirectory = path.resolve(
                    __dirname,
                    "../../uploads/bank"
                );

                const folderName = "bank";
                const oldImageDetails = {
                    fileArray: response.rows,
                    projectDirectory: projectDirectory,
                    fileColumnNames: ["image"],
                    oldimagepath: oldpath,
                };

                imagePath = await updateImage(image, folderName, oldImageDetails);
            }
        } else if (fields.image && fields.image.length > 0) {
            imagePath = fields.image[0];
        }

        const bank_name = fields.bank_name[0];
        const ac_no = fields.ac_no[0];
        const ifsc_code = fields.ifsc_code[0];
        const fieldsWithImage = {
            bank_name,
            ac_no,
            ifsc_code,
            shopid,
            image: imagePath,
        };
        BankDetails.editBankDetails(req, res, fieldsWithImage);
    });
});

router.route("/getallbankdata/:id").get(BankDetails.getAllbankData)


module.exports = router;