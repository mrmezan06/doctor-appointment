import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import { toast } from 'react-hot-toast'

function BookAppointment() {
  const dispatch = useDispatch();
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const { user } = useSelector((state) => state.user);

  const [isAvailable, setIsAvailable] = useState(false);
  const [isCheck, setIsCheck] = useState(true);
  const [date, setDate] = useState();
  const [selectedTime, setSelectedTime] = useState();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setDoctor(res.data.data);
        //window.location.reload();
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    try {
        dispatch(showLoading());
        const res = await axios.post(
          "/api/user/book-appointment",
          { 
            doctorId: params.doctorId,
            userId: user._id,
            doctorInfo: doctor,
            userInfo: user,
            date: date,
            time: selectedTime
         },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.message);
          setIsCheck(true);
          setIsAvailable(false);
        }else {
          setIsCheck(false);
          setIsAvailable(true);
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error('Error booking appointment');
        dispatch(hideLoading());
      }
  }

  const checkAvailability = async () => {
    try {
        dispatch(showLoading());
        const res = await axios.post(
          "/api/user/check-booking-availability",
          { 
            doctorId: params.doctorId,
            date: date,
            time: selectedTime
         },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.message)
          setIsAvailable(true);
          setIsCheck(false);
        }else {
          setIsAvailable(false);
          setIsCheck(true);
          toast.error(res.data.message)
        }
      } catch (error) {
        setIsAvailable(false);
        setIsCheck(true);
        toast.error('Error booking appointment');
        dispatch(hideLoading());
      }
  }

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line
  }, []);
  return (
    <Layout>
      {/* <div className="page-title">Book Appointment</div>
      <hr /> */}
      {doctor && (
        <div>
          <p className="page-title">
            {doctor.firstName} {doctor.lastName}
          </p>
          <hr />
          <Row>
            <Col span={8} xs={24} sm={24} lg={8}>
              <p className="card-text">Visiting Time</p>
              <p className="black"></p>

              <p className="card-data">
                {doctor.timings[0]} - {doctor.timings[1]}
              </p>
              <div className="d-flex flex-column pt-2">
                <div className="card-title">Select Your Slot</div>
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) =>
                    {
                      setDate(moment(value).format("DD-MM-YYYY"));
                      setIsCheck(true);
                      setIsAvailable(false);
                    }
                  }
                />
                <TimePicker format="HH:mm" className="mt-3"
                onChange={(values) =>
                    {
                      setSelectedTime(moment(values).format("HH:mm"));
                      setIsCheck(true);
                      setIsAvailable(false);
                    }
                    
                  }
                />
                <div className="button-flex flex-column">
                  {isCheck && <Button type="primary" className="primary-button mt-3" onClick={checkAvailability}>
                    Check Availability
                  </Button>}
                  {isAvailable && <Button type="primary" className="primary-button mt-3" onClick={bookNow}>
                    Book Now
                  </Button>}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
