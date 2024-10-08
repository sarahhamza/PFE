import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import "./signup.css";
import { useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { BASE_URL }  from '../../config';
import { useSignup } from '../../Hooks/AuthHook';

function SignUp() {
    const {
        data,
        image,
        error,
        successMessage,
        handleChange,
        handleFileChange,
        handleSignUp,
    } = useSignup();

    return (
        <MDBContainer fluid className={styles.MDBContainer} >
            <div className="p-5 bg-image" style={{ backgroundImage: 'url(https://mdbootstrap.com/img/new/textures/full/171.jpg)', height: '300px', marginTop:'-20px'}}></div>
            <MDBCard className={`mx-5 mb-5 p-5 shadow-5 ${styles.card}`} >
                <MDBCardBody className='p-5 text-center'>
                    <h2 className="fw-bold mb-5">Sign up now</h2>
                    <img
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '20px' }}
                    />
                    <form onSubmit={handleSignUp} className='form-container2'>
                        <label htmlFor="file" className="custom-file-upload">
                            <DriveFolderUploadOutlinedIcon className="icon" /> Upload Image
                        </label>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        <div className="form-row">
                            <MDBInput className='mb-4 custom-input' type="text"
                                placeholder="    First Name"
                                name="firstName"
                                onChange={handleChange}
                                value={data.firstName}
                                required
                            />
                            <MDBInput className='mb-4 custom-input' type="text"
                                placeholder="    Last Name"
                                name="lastName"
                                onChange={handleChange}
                                value={data.lastName}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <MDBInput className='mb-4 custom-input' type="text"
                                placeholder="   Address"
                                name="address"
                                onChange={handleChange}
                                value={data.address}
                            />
                            <MDBInput className='mb-4 custom-input' type="text"
                                placeholder="   Country"
                                name="country"
                                onChange={handleChange}
                                value={data.country}
                            />
                             <MDBInput className='mb-4 custom-input' type="text"
                                placeholder="   Phone number"
                                name="phone"
                                onChange={handleChange}
                                value={data.phone}
                            />
                        </div>
                        <div className="form-row">
                            <MDBInput className='mb-4 custom-input' type="email"
                                placeholder="   Email"
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                required
                            />
                            <MDBInput className='mb-4 custom-input' type="password"
                                placeholder="   Password"
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                required
                            />
                        </div>
                        <MDBRow className="justify-content-center">
                            <MDBCol col='12'>
                                <select
                                    name="role"
                                    onChange={handleChange}
                                    value={data.role}
                                    required
                                    className={`${styles.input} custom-select`}
                                >
                                    <option value="">Select Role</option>
                                    <option value="controlleur">Controlleur</option>
                                    <option value="femme de menage">Femme de menage</option>
                                </select>
                            </MDBCol>
                            {error && <div className='error_msgE '>{error}</div>}
                            {successMessage && <div className='success_msg'>{successMessage}</div>}

                        </MDBRow>

                        <div className='d-flex justify-content-center mb-4'>
                        </div>
                     
                        <MDBBtn className='w-100 mb-4 custom-button' size='md'>Sign Up</MDBBtn>
                    </form>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default SignUp;
