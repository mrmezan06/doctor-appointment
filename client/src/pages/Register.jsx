import React from 'react';
import { Button, Form, Input } from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

const Register = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async(values) => {
    console.log('Received values of form: ', values);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/register', values);
      dispatch(hideLoading());
      if(response.data.success){
          toast.success(response.data.message);
          // toast("Redirecting to Login page");
          navigate('/login');
        }else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  }

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className='card-title'>Nice To Meet You</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label="Full Name" name='fullName'>
            <Input placeholder='Full Name' />
          </Form.Item>
          <Form.Item label="Email" name='email'>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label="Password" name='password'>
            <Input placeholder='Password' type="password" />
          </Form.Item>
          <div className="button-flex">
          <Button className='primary-button mx-5' htmlType='submit'>Register</Button>
          </div>
          <div className="link">
          <Link to='/login' className='anchor mt-2'>CLICK HERE TO LOGIN</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register