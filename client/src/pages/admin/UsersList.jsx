import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
// import { useNavigate } from "react-router-dom";
import Layout from '../../components/Layout'
import { toast } from "react-hot-toast";
import { Table } from 'antd';

function UsersList() {

  const [ users,  setUsers ] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async() => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-users",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  }

  useEffect(() => {
    getUsersData();
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>

      )
    },
  ];
  

  return (
    <Layout>
        <div className='page-title'>User List</div>
        <Table columns={columns} dataSource={users} />
    </Layout>
  )
}

export default UsersList