const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});
router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      return res.status(200).send({
        success: true,
        data: {
          ...user._doc,
          password: "",
        },
      });
    }
  } catch (error) {
    console.log("UserRoute GetUSer", error);
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});
router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    // Need to check whetther the User has already any pending or inprogress or approved doctor account
    // if yes then return error message
    //console.log('User', req.body.userId)
    const doctor = await Doctor.find({ userId: req.body.userId });
    // Test if doctor exists
    //console.log("Doctor", doctor.length);
    if (doctor.length != 0) {
      const status = doctor[0].status;
      // Because it is an Array
      // console.log("Doctor", doctor);
      return res
        .status(200)
        .send({
          message: `You already have ${
            status == "approved" ? "an" : "a"
          } ${status} doctor account`,
          success: false,
        });
    }
    // if no then save the doctor account
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res
      .status(200)
      .send({ message: "Doctor account applied successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error applying doctor", success: false, error });
  }
});
router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const seenNotifications = [];
    await User.findByIdAndUpdate(user._id, {
      seenNotifications,
    });
    res.status(200).send({
      message: "All notification is deleted",
      success: true,
      data: user,
    });
    // Need an Refresh for Showing Updated Notifications
    
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error deleting notifications", success: false, error });
  }
});
router.post(
  "/mark-all-notifications-as-read",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      var unseenNotifications = user.unseenNotifications;
      var seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      unseenNotifications = [];
      // user.seenNotifications = seenNotifications;
      // const updatedUser = await user.save();
      // updatedUser.password = "";
      res.status(200).send({
        message: "Notifications marked as read",
        success: true,
        data: user,
      });
      await User.findByIdAndUpdate(user._id, {
        unseenNotifications,
        seenNotifications,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({
          message: "Error marking the notifications",
          success: false,
          error,
        });
    }
  }
);
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({status: "approved"});
    res.status(200).send({
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
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    // Pushing the notification to the Doctors User Unseen Notifications 
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await User.findByIdAndUpdate(req.body.doctorInfo.userId, { unseenNotifications });
      res.status(200).send({
        message: "Appointment booked successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      data: error
    });
  }
});
router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
      const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
      const fromTime = moment(req.body.time, "HH:mm").subtract(59, 'minutes').toISOString();
      const toTime = moment(req.body.time, "HH:mm").add(59, 'minutes').toISOString();
      const doctorId = req.body.doctorId;
      const appointments = await Appointment.find({
        doctorId,
        date,
        time: { $gte: fromTime, $lte: toTime },
      });
      if (appointments.length > 0) {
        return res.status(200).send({
          message: "Appointments are not available",
          success: false,
        });
      }else {
        return res.status(200).send({
          message: "Appointments are available",
          success: true,
        });
      }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      data: error
    });
  }
});

module.exports = router;
