const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      if (!doctor) {
        return res
          .status(200)
          .send({ message: "Doctor does not exist", success: false });
      } else {
        return res.status(200)
        .send({ message: "Doctor info fetched successfully",
         success: true, data: doctor
         });
      }
    } catch (error) {
    //   console.log("UserRoute GetUSer", error);
      res
        .status(500)
        .send({ message: "Error getting doctor info", success: false, error });
    }
  });

  router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, 
        req.body);
      if (!doctor) {
        return res
          .status(200)
          .send({ message: "Doctor does not exist", success: false });
      } else {
        return res.status(200)
        .send({ message: "Doctor info updated successfully",
         success: true, data: doctor
         });
      }
    } catch (error) {
    //   console.log("UserRoute GetUSer", error);
      res
        .status(500)
        .send({ message: "Error getting doctor info", success: false, error });
    }
  });

  router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ _id: req.body.doctorId });
      if (!doctor) {
        return res
          .status(200)
          .send({ message: "Doctor does not exist", success: false });
      } else {
        return res.status(200)
        .send({ message: "Doctor info fetched successfully",
         success: true, data: doctor
         });
      }
    } catch (error) {
    //   console.log("UserRoute GetUSer", error);
      res
        .status(500)
        .send({ message: "Error getting doctor info", success: false, error });
    }
  });

  module.exports = router;