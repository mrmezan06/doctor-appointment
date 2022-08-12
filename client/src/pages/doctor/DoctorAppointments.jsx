import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
// import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
import { Table } from "antd";
import moment from "moment";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/doctor/get-appointments-by-doctor-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getAppointmentsData();
    // eslint-disable-next-line
  }, []);

  const changeAppointmentStatus = async (record, status) => {
    try {

      const appointmentId = record._id;

      const data = {appointmentId: appointmentId, status: status};

      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.message);
    }
  };

  const columns = [
    {
        title: "Id",
        dataIndex: "_id"
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => (
        <div className="normal-text">
          {record.userInfo.name}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <div className="normal-text">
          {record.userInfo.email}
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <div className="normal-text">
          {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex">
            {record.status === "pending" && (
              <div>
                <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </h1>
            </div>
            )}
            {record.status === "approved" && (
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </h1>
            )}
            {record.status === "rejected" && (
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
            )}
          </div>
        ),
      },
  ];

  return (
    <Layout>
      <div className="page-title">Appointments</div>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default DoctorAppointments;
