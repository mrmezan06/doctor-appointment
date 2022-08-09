import React from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
        dispatch(showLoading());
        const res = await axios.post(
            "/api/user/get-user-info-by-id",
            { token: localStorage.getItem("token") },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          dispatch(hideLoading());
          if (res.data.success) {
            dispatch(setUser(res.data.data));
          }else {
              navigate("/login");
          }
    } catch (error) {
        dispatch(hideLoading());
        navigate("/login");
        console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, );

  if (localStorage.getItem("token")) {
    // For full protection you need to check if the token is expired / valid
    // But, for this example, we will just render the component
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
