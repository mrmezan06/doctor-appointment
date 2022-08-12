import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
// import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import { Table } from "antd";
import moment from "moment";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-appointments-by-user-id", {
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

  const columns = [
    {
        title: "Id",
        dataIndex: "_id"
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <div className="card-text">
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <div className="card-text">
          {record.doctorInfo.phoneNumber}
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <div className="card-text">
          {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    }
  ];

  return (
    <Layout>
      <div className="page-title">Appointments</div>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default Appointments;
