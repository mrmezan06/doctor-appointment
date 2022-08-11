import React, {useEffect, useState} from 'react'
import DoctorForm from '../../components/DoctorForm'
import Layout from '../../components/Layout'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    
    const [doctor, setDoctor] = useState(null);
    const params = useParams();


    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/update-doctor-profile", {
              ...values,
              userId: user._id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            });
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
    }
    const getDoctorData = async () => {
        
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/doctor/get-doctor-info-by-user-id",
                { userId: params.userId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
              );
              dispatch(hideLoading());
              if (res.data.success) {
                setDoctor(res.data.data);
                //  return res.data.data;
              }
        } catch (error) {
            dispatch(hideLoading());
        }
      };
    
      useEffect( async () => {
        await getDoctorData();
        // Eslint-disable-next-line
      }, []);
      
  return (
    
    <Layout>
        <div className='page-title'>Doctor Profile</div>
        <hr />
        {/* {doctor && <DoctorForm onFinish={onFinish} initval={doctor}/>} */}
        {doctor!== null ? console.log(doctor) : console.log('no doctor')}
    </Layout>
  )
}

export default Profile