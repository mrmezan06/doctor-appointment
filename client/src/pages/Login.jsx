import React from 'react';
import { Button, Form, Input } from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async(values) => {
    // console.log('Received values of form: ', values);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/login', values);
      dispatch(hideLoading());
      if(response.data.success){
          toast.success(response.data.message);
          toast("Redirecting to Home page");
          localStorage.setItem('token', response.data.data);
          navigate('/');
        }else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error('Something went wrong');
    }
  }

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className='card-title'>Welcome Back</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label="Email" name='email'>
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item label="Password" name='password'>
            <Input placeholder='Password' type="password" />
          </Form.Item>
          <Button className='primary-button my-2' htmlType='submit'>Login</Button>
          <Link to='/register' className='anchor mt-2'>CLICK HERE TO REGISTER</Link>
        </Form>
      </div>
    </div>
  )
}

export default Login;