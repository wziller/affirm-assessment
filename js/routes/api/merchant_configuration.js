import express from "express";
import {
  LoanApplicationRepo,
  ManualOverrideRepo,
  MerchantRepo,
  TermsRepo,
} from "../../repo/index.js";

const router = express.Router();

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
router.post("/", async (req, res, next) => {
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
    //if merchant config does not exit, create a new entry
    MerchantRepo.create_merchant_configuration(data);
  }
});

router.put("/", async (req, res, next) => {
  const { data } = req.body;
  console.log("===================> DATA", data);
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
    MerchantRepo.create_merchant_configuration(data);
  }
});

export default router;
