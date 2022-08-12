import { Tabs } from 'antd'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice'; 

function Notifications() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deleteAll = async() => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/delete-all-notifications',
             {userId: user._id},
             {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
             );
            dispatch(hideLoading());
            if(response.data.success){
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
                window.location.reload();
              }else {
              toast.error(response.data.message);
            }
          } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
          }
    }
    const markAllAsRead = async() => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/mark-all-notifications-as-read',
             {userId: user._id},
             {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
             );
            dispatch(hideLoading());
            if(response.data.success){
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
                window.location.reload();
              }else {
              toast.error(response.data.message);
            }
          } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
          }
    }



  return (
    <Layout>
        <div className='page-title'>Notifications</div>
        <Tabs>
            <Tabs.TabPane tab='Unread' key='1'>
                <div className="d-flex justify-content-end">
                    <h1 className="anchor" onClick={markAllAsRead}>
                        Mark all as read
                    </h1>
                </div>
                {user?.unseenNotifications.map((notification,index) => (
                    <div className='card p-2 mt-2' onClick={()=>navigate(notification.onClickPath)}>
                        <div className="d-flex align-items-center">
                        <div className="card-number">{index+1}</div>
                        <div className="card-text">
                            {notification.message}
                        </div>
                        </div>
                    </div>
                ))}
            </Tabs.TabPane>
            <Tabs.TabPane tab='Read' key='2'>
            <div className="d-flex justify-content-end">
                    <h1 className="anchor" onClick={deleteAll}>
                        Delete all
                    </h1>
                </div>
                {user?.seenNotifications.map((notification,index) => (
                    <div className='card p-2 mt-2' onClick={()=>navigate(notification.onClickPath)}>
                        <div className="d-flex align-items-center">
                        <div className="card-number">{index+1}</div>
                        <div className="card-text">
                            {notification.message}
                        </div>
                        </div>
                    </div>
                ))}
            </Tabs.TabPane>
        </Tabs>
    </Layout>
  )
}

export default Notifications