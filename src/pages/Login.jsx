import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';

const loginSchema = Joi.object().keys({
  email: Joi.string().required('Enter your Email'),
  password: Joi.string().required('Enter your Password'),
});

const Login = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    try {
      const { error } = loginSchema.validate({ email, password });
      if (error) {
        setError(error.details[0].message);
        return;
      }
      const response = await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/auth', {
        email,
        password,
      });
      localStorage.setItem('token', response.data);
      navigate('/products')
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <Form>
      <Form.Item label="Username">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>
      <Form.Item label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Button onClick={handleSubmit} type="primary" htmlType="submit">
        Login
      </Button>
    </Form>
  );
};

export default Login;