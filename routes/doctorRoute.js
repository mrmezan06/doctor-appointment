const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");


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
  router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
    try {
      // req.body.userId is coming from the authMiddleware
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({ 
        doctorId : doctor._id });
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error getting appointments",
        success: false,
        error,
      });
    }
  });
  router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
      const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status });
      
      const user = await User.findOne({ _id: appointment.userId });
      /* 
      NB: Direct userId is distorted when doctor is updated.
      Because of authMiddleware is override the userId
      so instead of userId, we use doctor.userId
      */
  
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "appointment-request-changed",
        message: `Your appointment request has been ${status}`,
        onClickPath: "/appointments",
      });
      await User.findByIdAndUpdate(user._id, { unseenNotifications });
      res
        .status(200)
        .send({
          message: "Appointment status updated successfully",
          success: true,
          data: appointment,
        }); 
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({
          message: "Error changing appointment status",
          success: false,
          error
        }); 
    }
  });

  module.exports = router;