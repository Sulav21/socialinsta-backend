import express from "express";
import { hashPassword } from "../helpers/bycrypt.js";
import { getUserById, insertUser } from "../models/user/User.Model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("User router got hit");
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = hashPassword(req.body.password)
    req.body.password = hashedPassword
    const result = await insertUser(req.body);
    if (result?._id) {
      res.json({
        status: "success",
        message: "User inserted successfully",
        result,
      });
    } else {
      res.json({
        status: "error",
        message: "Couldnot insert user",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:_id", async (req, res, next) => {
  try {
    const result = await getUserById(req.params);
    if (result?._id) {
      res.json({
        status: "success",
        result,
      });
    } else {
      res.json({
        status: "error",
        message: "User not found, try again later",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
