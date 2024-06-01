/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,

}
from 'mdb-react-ui-kit';
import "./log.scss"
import hospital from "../../images/hospital.jpg";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";



function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
	const [ setUser] = useState(null);

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
  
            // Fetch user data and set it in the state
            const userData = await axios.get("http://localhost:8080/api/auth/user", {
                headers: {
                    Authorization: `Bearer ${res.data}`
                }
            });
              // Redirect based on user role
            if (userData.data.role === "admin") {
              navigate('/newhome');
          } else if (userData.data.role === "femme de menage") {
              navigate('/roomstable');
          }  else if (userData.data.role === "controlleur") {
            navigate('/newhomeC');
          }  else {
              // Handle other roles or scenarios
              console.log("Unknown user role:", userData.data.role);
          }
                  setUser(userData.data); // You can set user data in state if needed
        // Log before redirection
                  console.log("Redirecting to /home...");
                    // Redirect to home page
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                console.error(error.response.data);
            }
        }
    };
    return (
        <MDBContainer fluid className='my-3'>
    
          <MDBRow className='g-0 align-items-center'>
            <MDBCol  className='image-background'>
              <img src={hospital} alt="Background Image"   style={{marginTop: '-80px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' , height: '600px', width:'600px' } } />
            </MDBCol>
    
            <MDBCol col='6' className='form-container' >
              <MDBCard className='my-7 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)',  backdropFilter: 'blur(30px)' , width:'580px', height:'480px' }}>
                <MDBCardBody className='p-7 shadow-5 text-center'>
    
                  <h2 className="fw-bold mb-5">Sign in now</h2>
                  <p className="mb-5">Enter your email and password to sign in</p>

                 <form onSubmit={handleLogin}> 
                  <input className='mb-4 custom-input' placeholder='   Email'  type='email' 
                            onChange={handleChange}
                            value={data.email}
                            name="email"
                            required/>
                  <input className='mb-4 custom-input' placeholder='   Password'  type='password' 
                            onChange={handleChange}
                            name='password'
                            value={data.password}
                            required/>
                             {error && <div className='error_msg'>{error}</div>}

                  <div className='d-flex justify-content-center mb-4'>
                  </div>

    
                  <MDBBtn className='w-100 mb-4 custom-button' size='md' >Sign In</MDBBtn>
                  </form>
                  <div className="text-center">
    
                    <p  style={{ marginBottom:"10px" }}>or sign up here:</p>
                    <Link to="/signup" style={{ textDecoration: "none", color:"grey" , marginBottom:"10px" }}>
                       <p style={{ textDecoration: "none" , marginBottom:"10px" }} >Sign Up</p>
                    </Link>
                  </div>
    
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
    
          </MDBRow>
        </MDBContainer>
      );
    }

export default Login;