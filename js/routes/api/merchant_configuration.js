import express from "express";
import {
  LoanApplicationRepo,
  ManualOverrideRepo,
  MerchantRepo,
  TermsRepo,
} from "../../repo/index.js";

const router = express.Router();

const validateMerchantRange = (merchantConfig) => {
  const { data } = merchantConfig;
  const { minimum_loan_amount, maximum_loan_amount } = merchantConfig;

  if (minimum_loan_amount >= maximum_loan_amount) return false;

  return true;
};

/* GET Merchant Config */
router.get("/:merchantId", async (req, res, next) => {
  const { merchantId } = req.params;
  const merchantConfig = await MerchantRepo.get_merchant_configuration(
    merchantId
  );

  if (!merchantConfig) {
    res.status(400).send({
      field: "merchant_id",
      message: "No Merchant Found",
    });
  } else {
    res.status(200).send(merchantConfig);
  }
});

/* POST Merchant Config */
router.post("/set_merchant_config", async (req, res, next) => {
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
  } else if (!validateMerchantRange(data)) {
    res.status(400).send({
      field: "maximum_loan_amount",
      message: "Invalid Range",
    });
  } else {
    //if merchant config does not exit, create a new entry
    let newMerchant = await MerchantRepo.set_merchant_configuration(data);
    res.status(200).send(newMerchant)
  }
});

router.put("/set_merchant_config/", async (req, res, next) => {
  const { data } = req.body;

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
    //Validate Merchant data range
  } else if (!validateMerchantRange(data)) {
    res.status(400).send({
      field: "maximum_loan_amount",
      message: "Invalid Range",
    });
  } else {
    //if merchant config does not exit, create a new entry
    await MerchantRepo.update_merchant_configuration(data);
    res.status(200).send(data);
  }
});

export default router;
