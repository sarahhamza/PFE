// src/components/Login.jsx
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";
import { useHandleLogin } from "../../Hooks/AuthHook"; // Import the custom hook
import "./log.scss";
import hospital from "../../images/hospital.jpg";

function Login() {
    const { data, error, handleChange, handleLogin } = useHandleLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await handleLogin(e);
            if (userData.role === "admin") {
                navigate('/newhome');
            } else if (userData.role === "femme de menage") {
                navigate('/roomstable');
            } else if (userData.role === "controlleur") {
                navigate('/newhomeC');
            } else {
                console.log("Unknown user role:", userData.role);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <MDBContainer fluid className='my-3'>
            <MDBRow className='g-0 align-items-center'>
                <MDBCol className='image-background'>
                    <img src={hospital} alt="Background Image" style={{ marginTop: '-80px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', height: '600px', width: '600px' }} />
                </MDBCol>
                <MDBCol col='5' className='form-container'>
                    <MDBCard className='my-7 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)', width: '580px', height: '520px' }}>
                        <MDBCardBody className='p-7 shadow-5 text-center'>
                            <h2 className="fw-bold mb-5">Sign in now</h2>
                            <p className="mb-5">Enter your email and password to sign in</p>
                            <form onSubmit={handleSubmit}>
                                <input className='mb-4 custom-input' placeholder='   Email' type='email'
                                    onChange={handleChange}
                                    value={data.email}
                                    name="email"
                                    required />
                                <input className='mb-4 custom-input' placeholder='   Password' type='password'
                                    onChange={handleChange}
                                    name='password'
                                    value={data.password}
                                    required />
                                {error && <div className='error_msg'>{error}</div>}
                                <div className='d-flex justify-content-center mb-4'></div>
                                <MDBBtn className='w-100 mb-4 custom-button' size='md'>Sign In</MDBBtn>
                            </form>
                            <div className="text-center">
                                <p style={{ marginBottom: "10px" }}>or sign up here:</p>
                                <Link to="/signup" style={{ textDecoration: "none", color: "grey", marginBottom: "10px" }}>
                                    <p style={{ textDecoration: "none", marginBottom: "10px" }}>Sign Up</p>
                                </Link>
                            </div>
                            <div style={{ marginBottom: "10px", marginRight: "270px" }}>
                            <Link to="/resetPassword"   style={{ textDecoration: "none", color: "black", marginBottom: "10px" }} >
                Forgotten Password?
                </Link></div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Login;
