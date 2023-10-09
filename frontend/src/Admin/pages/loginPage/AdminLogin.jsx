import './AdminLogin.css'
import { Input,Button} from "@nextui-org/react";
import { Container } from '@mui/material';
import { useState } from 'react';
import { emailValidation,passwordValidation } from '../../../utils/validation/useFormValidation';
import { useAdminLoginMutation } from '../../slices/apiSlice/adminApiSlice';
import {toast} from "react-toastify"
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/adminAuthSlice";
import {Navigate, useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"




export default function AdminLogin() {
  const [admin,setAdmin] = useState({
    email:'',
    password:''
  })
  const [error,setError] = useState({
    emailError:'',
    passwordError:''
  })

  const [login,{isLoading}] = useAdminLoginMutation()
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const adminInfo = useSelector((state)=>state.admin.adminInfo);

  async function authAdmin(){
    try {
      if(!admin.email || !admin.password) return toast.error('please fill all fields')
      if(admin.emailError || admin.passwordError) return toast.error('please clear all errors')
       await login(admin).unwrap()
      const data = {
        name:"REAN admin",
        email:"rean@gmail.com"
      }
      dispatch(setCredentials({ ...data }));
        navigate('home')     
        toast.success('admin logged in successfully')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }  
  }
  return (
    <>
    {adminInfo 
      ?  <Navigate to={'home'}/> 
      :
    <div className="full-page-container ">
       <div className='container mx-auto'>
        <Container maxWidth="sm">
        <h2 className='text-2xl font-bold text-center m-2 text-cyan-600'>Admin Login</h2>
         <div className='m-5'>
         <Input
                  autoFocus
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  color={error.emailError ? "danger" : "success"}
                  errorMessage={error.emailError}
                  validationState={error.emailError ? "inavlid" : "valid"}
                  value={admin.email}
                  onChange={(e)=>{
                    setAdmin({
                      ...admin,
                      email:e.target.value
                    })
                   }}
                   onKeyUp={(e)=>{
                    setError({
                      ...error,
                      emailError:emailValidation(e.target.value)
                    })
                  }}
                 
          />
          </div>
          <div className='m-5'>
            <Input
                 
                 label="Password"
                 placeholder="Enter your password"
                 type="password"
                 variant="bordered"
                 color={error.passwordError ? "danger" : "success"}
                 errorMessage={error.passwordError}
                 validationState={error.passwordError ? "inavlid" : "valid"}
                 value={admin.password}
                 onChange={(e)=>{
                  setAdmin({
                    ...admin,
                    password:e.target.value
                  })
                 }}
                 onKeyUp={(e)=>{
                  setError({
                    ...error,
                    passwordError:passwordValidation(e.target.value)
                  })
                }}
                 
                 
               />
            </div>
                
            <div className="flex py-2 px-1 justify-center">
                <Button color="primary"  variant="flat" onPress={authAdmin} isLoading={isLoading}>
                  Sign in
                </Button>
             </div>
             </Container>
       </div>
  </div>
              }
  </>
  );
}

