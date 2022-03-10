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

export default router;
