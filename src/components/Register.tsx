import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
export default function Login() {
  const navigate = useNavigate();
  const[formData, setFormData] = useState({
    name:'',
    email: '',
    password: ''
  });

   const handleLogin = () => {
    navigate("/login");
  };

  const handleFormChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });

  }

  const handleFormSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
       const response=await axios.post("http://localhost:8082/auth/register",formData)
       if(response.status === 200) {
       toast.success("Registered successfully!");
        navigate("/login");
       }
      
    } catch (error:any) {
      console.error("Registration failed:", error);
      toast.error(error.response.data || "Registration failed. Please try again.");
    }
  }


  return (
     <div className="login-page">
      <div className="login-left">
        <div className="overlay">
          <h1 className="title-orange">Employee Management</h1>
          <p className="text-lightblue">Simplify your HR workflows</p>
          <p className="text-yellow">Track. Manage. Grow.</p>
        </div>
      </div>

      <div className="login-right">
        <h2>Register</h2>
        <form onSubmit={handleFormSubmit}>
         <div className="form-group">
            <label htmlFor='name'>Name</label>
            <input type="text" id='name' value={formData.name}onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor='email'>Email</label>
            <input type="email" id='email' value={formData.email} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor='password'>Password</label>
            <input type="password" id='password' value={formData.password} onChange={handleFormChange} required />
          </div>
          <button type="submit" className="login-btn">Register</button>
        </form>
        <p className="register-text">
          Already have an account? <button onClick={handleLogin}>Login here</button>
        </p>
      </div>
    </div>
  );
}
