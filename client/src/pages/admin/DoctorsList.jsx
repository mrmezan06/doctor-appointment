import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
// import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
import { Table } from "antd";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {

      const did = record._id;

      const data = {doctorId: did, status: status};

      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
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

  useEffect(() => {
    getDoctorsData();
    // eslint-disable-next-line
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="card-text">
          {record.firstName} {record.lastName}
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
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
            <h1
              className="anchor mx-3"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Approve
            </h1>
          )}
          {record.status === "pending" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "rejected")}
            >
              Reject
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "rejected")}
            >
              Reject
            </h1>
          )}
          {record.status === "rejected" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "approved")}
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
      <div className="page-title">Doctor List</div>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
}

export default DoctorsList;
