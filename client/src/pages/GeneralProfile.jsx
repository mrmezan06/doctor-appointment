import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button, Col, Form, Input, Row } from "antd";
function GeneralProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [newUser, setNewUser] = useState({});

  const params = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/update-user-profile",
        {
          ...values,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };
  const getUserData = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/get-user-info-by-user-id",
        { userId: params.userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setNewUser(res.data.data);
        //window.location.reload();
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="page-title">General Profile</div>
      <hr />
      {newUser && (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Form layout="vertical" onFinish={onFinish} initialValues={newUser}>
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  required
                  label="Email"
                  name="email"
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Email" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  required
                  label="Password"
                  name="password"
                  rules={[{ required: true }]}
                >
                  <Input type="password" placeholder="Password" />
                </Form.Item>
              </Col>
            </Row>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Button className="profile-button" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Layout>
  );
}

export default GeneralProfile;
