const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res
      .status(200)
      .send({
        message: "Doctors fetched successfully",
        success: true,
        data: doctors,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting doctors",
      success: false,
      error,
    });
  }
});
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting users",
      success: false,
      error,
    });
  }
});

module.exports = router;
