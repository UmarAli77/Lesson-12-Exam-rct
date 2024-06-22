import { Button, Input } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    name: '',
    email: '',
    password: ''
}

function Register() {
  const navigate = useNavigate()
    const [form, setForm] = useState(initialState);
    const handleChange = (event) => {
        const {name, value} = event.target;
        setForm((prevForm) => ({...prevForm, [name]: value}))
    }
    const handleSubmit = async () => {
      try {
        const {name, email, password} = form;
        if(!name || !email || !password) {
          toast('Iltimos maydonlarni toldiring !')
        } else {
          const response = await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/register', form);
          navigate('/login')
          console.log(response.data);
        }
      } catch(error) {
        console.log(error);
      }
    }
    const handleReset = () => {
      setForm(initialState);
    }
    return (
    <div className='bg-slate-700 flex items-center justify-center w-screen h-screen'>
      <div className='bg-white p-4 rounded-xl shadow-2xl items-center w-[300px]'>
        <div>
            <Input className='cursor-pointer' placeholder='Enter Name' value={form.name} name='name' onChange={handleChange} />
        </div>
        <div className='my-3'>
            <Input className='cursor-pointer' placeholder='Enter Email' value={form.email} name='email' onChange={handleChange} />
        </div>
        <div>
            <Input className='cursor-pointer' placeholder='Enter Password' type='password' value={form.password} name='password' onChange={handleChange} />
        </div>
        <div className='my-3 flex items-center justify-between'>
          <Button className='cursor-pointer' onClick={handleSubmit} type='primary'>Register</Button>
          <Button className='cursor-pointer' onClick={handleReset} type='primary'>Reset</Button>
        </div>
        <ToastContainer />
      </div>
    </div>
  )
}

export default Register
