import express from "express";
import app from "../../app.js";
import {
  LoanApplicationRepo,
  ManualOverrideRepo,
  MerchantRepo,
  TermsRepo,
} from "../../repo/index.js";

const router = express.Router();

//validates incoming data

function validateData(req, res, next) {
  const { data } = req.body;
  
  const { minimum_loan_amount, maximum_loan_amount } = data;

  if (minimum_loan_amount < maximum_loan_amount) {
    next();
    return;
  }
  res.status(400).send({
    field: "maximum_loan_amount",
    message: "Invalid Range",
  });
}

/* POST Merchant Config */
router.post("/", validateData, async (req, res, next) => {
  //Validate Merchant data range

  const { data } = req.body;
  const merchant_conf = await MerchantRepo.get_merchant_configuration(
    data.merchant_id
  );
  //Check is there is an exisiting merchant configuration
  if (merchant_conf) {
    //If merchant config already exists modify the exisiting entry
    res.status(400).send({
      field: "merchant_id",
      message: "Merchant Already Exists",
    });
  } else {
    //if merchant config does not exist, create a new entry
    let newMerchant = await MerchantRepo.set_merchant_configuration(data);
    res.status(200).send(newMerchant);
  }
});

router.put("/", validateData, async (req, res, next) => {
  //Validate Merchant data
  const { data } = req.body;
  if (req.valid === false) {
    res.status(400).send({
      field: "maximum_loan_amount",
      message: "Invalid Range",
    });
    return;
  }

  const merchant_conf = await MerchantRepo.get_merchant_configuration(
    data.merchant_id
  );

  //Check is there is an exisiting merchant configuration
  if (!merchant_conf) {
    //If merchant config already exists modify the exisiting entry
    res.status(400).send({
      field: "merchant_id",
      message: "Merchant Id Does Not Exist",
    });
  } else {
    //if merchant config does not exit, create a new entry
    await MerchantRepo.update_merchant_configuration(data);
    res.status(200).send(data);
  }
});

export default router;
