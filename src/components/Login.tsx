import { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleRegister = () => {
    navigate("/register");
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });

  }

  const handleFormSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
      const response=await axios.post("http://localhost:8082/auth/login", formData);
      if(response.status === 200) {
        toast.success("Login successful!");
        navigate("/dashboard"); 
      }
      
    } catch (error:any) {
      console.error("Login failed:", error);
      toast.error(error.response.data || "Login failed. Invalid Credentials.");
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
        <h2>Login</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor='email'>Email</label>
            <input type="email" id='email' value={formData.email} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor='password'>Password</label>
            <input type="password" id='password' value={formData.password} onChange={handleFormChange} required />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-text">
          Don’t have an account? <button onClick={handleRegister}>Register here</button>
        </p>
      </div>
    </div>
  );
}
