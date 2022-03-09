import { afterAll, beforeAll, describe, expect, it, test } from "@jest/globals";
import request from "supertest";

import app from "../app";
import { closeDb, syncDb } from "./_db";

describe("Test Merchant Config Routes", () => {
  beforeAll(syncDb);

  test("POST /api/merchant_config/set_merchant_config", async () => {
    let res = await request(app)
      .post("/api/merchant_config/set_merchant_config")
      .set("Content-Type", "application/json")
      .send({
        "data": {
          "name": "William's Electronics",
          "minimum_loan_amount": 1000,
          "maximum_loan_amount": 5000,
          "prequal_enabled": "false",
        },
      });
    expect(res.body).toEqual(
        expect.objectContaining({
      merchant_id: 2,
      name: "William's Electronics",
      minimum_loan_amount: 1000,
      maximum_loan_amount: 5000,
      prequal_enabled: false,
    }));
  });

  test("Will not allow a merchant to create and invalid range when updating", async () => {
    let res = await request(app)
      .put("/api/merchant_config/set_merchant_config")
      .set("Content-Type", "application/json")
      .send({
        data: {
          merchant_id: 1,
          name: "Zelda's Stationary",
          minimum_loan_amount: 3000,
          maximum_loan_amount: 100,
          prequal_enabled: "false",
        },
      });
    expect(res.body).toEqual({
      field: "maximum_loan_amount",
      message: "Invalid Range",
    });
  });

  test("Will not allow a merchant to create and invalid range upon creation", async () => {
    //Action
    let res = await request(app)
      .post("/api/merchant_config/set_merchant_config")
      .set("Content-Type", "application/json")
      .send({
        data: {
          name: "Bob's Plumbing",
          minimum_loan_amount: 3000,
          maximum_loan_amount: 100,
          prequal_enabled: "true",
        },
      });
    //Assertion
    expect(res.body).toEqual({
      field: "maximum_loan_amount",
      message: "Invalid Range",
    });
  });

  test("Will not allow duplicate merchant configs", async () => {
    let res = await request(app)
      .post("/api/merchant_config/set_merchant_config")
      .set("Content-Type", "application/json")
      .send({
        data: {
          merchant_id: 1,
          name: "Zelda's Stationary",
          minimum_loan_amount: 100,
          maximum_loan_amount: 3000,
          prequal_enabled: "true",
        },
      });
    //Assertion
    expect(res.body).toStrictEqual({
      field: "merchant_id",
      message: "Merchant Already Exists",
    });
  });
});

test("Gets a current exisiting merchant", async () => {
  let res = await request(app).get("/api/merchant_config/1");
  //Assertion
  expect(res.body).toEqual(
    expect.objectContaining({
      merchant_id: 1,
      name: "Zelda's Stationary",
      minimum_loan_amount: 100,
      maximum_loan_amount: 3000,
      prequal_enabled: false,
    })
  );
  afterAll(closeDb);
});
