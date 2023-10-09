import {useEffect, useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { emailValidation,passwordValidation,otpValidation ,cPasswordValidation} from "../../../utils/validation/useFormValidation";
import { useLoginMutation ,   
     useForgotPasswordGetOtpMutation,
     useForgotPasswordValidateOtpMutation,
     useForgotPasswordChangePasswordMutation
    } from "../../slices/api_slices/usersApiSlice";
import { useResendOtp } from "../../../utils/helperFunctions/useResendOtp";
import {toast} from "react-toastify"
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";



export default function LoginModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [show ,setShow] = useState(true)
  const [showOtp,setShowOtp] = useState(false)
  const [showPassword,setShowPassword] = useState(false)

  const [user,setUser] = useState({
    email:'',
    password:'',
  })
  const [error,setError] = useState({
    emailError:"",
    passwordError:""
  })

  const [fuser,setFUser] = useState({
    email:'',
    otp:'',
    password:'',
    cPassword:''
  })
  const [fError,setFError] = useState({
    emailError:"",
    otpError:'',
    passwordError:"",
    cPasswordError:''
  })
  const dispatch = useDispatch()
  const [login,{isLoading}] = useLoginMutation();
  const [sendOtp,{isLoading:otpLoading}] = useForgotPasswordGetOtpMutation()
  const [validateOtp,{isLoading:validateLoading}] = useForgotPasswordValidateOtpMutation()
  const [changePassword,{isLoading:changePasswordLoading}]=useForgotPasswordChangePasswordMutation()

  const [startTimer,seconds,timerActive] = useResendOtp()

  const navigate = useNavigate();

  async function authUser(){
    if(!user.email || !user.password) return toast.error("please fill all fields")
    if(error.emailError || error.passwordError) return toast.error("please clear all errors")
    else{
      try {
        const res = await login(user).unwrap()
        const data = {
          userName:res.username,
          email:res.email,
          phoneNumber:res.phoneNumber,
          avatarId:res?.avatarId,
          referralCode:res?.referralCode
        }
        dispatch(setCredentials({ ...data }));
        navigate('/home')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
 }

 const sendOtpHandler = async ()=>{
  try {
    if(!fuser.email) throw new Error('please enter your registered email')
    if(fError.emailError) throw new Error('please clear all error')
    const res = await sendOtp({phoneNumber:fuser.email}).unwrap();
    console.log(res);
    toast.success('otp send to your email')
    setShowOtp(true)
  } catch (error) {
    console.log(error);
    toast.error(error?.data?.message || error?.message)
    
  }
 }

 const validateOtpHandler = async  ()=>{
  try {
    if(!fuser.email || !fuser.otp) throw new Error('please enter all fields')
    if(fError.emailError || fError.otpError) throw new Error('please clear all error')
    const data = {
      phoneNumber:fuser.email,
      otp:fuser.otp
  }
    const res = await validateOtp(data).unwrap()
    console.log(res);
    setShowPassword(true)
    
  } catch (error) {
    console.log(error);
    toast.error(error?.data?.message || error?.message)
  }
 }

 const changePasswordHandler = async ()=>{
  try {
    if(!fuser.password || !fuser.cPassword) throw new Error('please enter all fileds')
    if(fError.passwordError || fError.cPasswordError) throw new Error('please enter all fileds')
    const data = {
      phoneNumber:fuser.email,
      password:fuser.password
    }
    const res = await changePassword(data).unwrap();
    console.log(res);
    toast.success(res.message)
    setShow(true)
    // setShowOtp(false)
    // setShowPassword(false)
  } catch (error) {
    console.log(error);
    toast.error(error?.data?.message || error?.message)
  }
 }

 const cancelForgotPassword = ()=>{
    setShow(true)
    // setShowOtp(false)
    // setShowPassword(false)
 }

  return (
    <>
     <Button onPress={onOpen} isLoading={isLoading} color="#01c8ef"  variant="flat" style={{ color: "#01c8ef" }}>
            Sign in
      </Button>
      
      <Modal 
        
        backdrop="opaque"
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        classNames={{
          base: `border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#e6e9f0] sm:my-16 `, 
        }}

      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              {show 
              ?
              (
              <>
              <ModalBody>
                <Input
                  autoFocus
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  color={error.emailError ? "danger" : "success"}
                  errorMessage={error.emailError}
                  validationState={error.emailError ? "inavlid" : "valid"}
                  value={user.email}
                  onChange={(e)=>{ 
                    setUser({
                    ...user,
                    email:e.target.value
                  })}}
                  onKeyUp={(e)=>{
                    setError({
                      ...error,
                      emailError:emailValidation(e.target.value)
                    })
                  }}
                />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  color={error.passwordError ? "danger" : "success"}
                  errorMessage={error.passwordError}
                  validationState={error.passwordError ? "inavlid" : "valid"}
                  value={user.password}
                  onChange={(e)=>{                   
                    setUser({
                    ...user,
                    password:e.target.value
                  })}}
                  onKeyUp={(e)=>{
                    setError({
                      ...error,
                      passwordError:passwordValidation(e.target.value)
                    })
                  }}
                />
                <div className="flex py-2 px-1 justify-between">
                  <Link color="primary" style={{cursor:'pointer'}} onClick={()=>{
                        setShow(false)
                        setUser({
                          user:'',
                          password:''
                        })
                  }} size="sm">
                    Forgot password?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button color="primary" onPress={authUser} isLoading={isLoading} variant="flat">
                  Sign in
                </Button>
              </ModalFooter>
              <GoogleAuth/> 
              </>
              )
              :
              (
                <>
                <ModalBody>
                  {!showPassword 
                  ? 
                <>
                <Input
                  autoFocus
                  label="Email"
                  type="email"
                  isDisabled={showOtp}
                  placeholder="Enter your registered email"
                  variant="bordered"
                  color={fError.emailError ? "danger" : "success"}
                  errorMessage={fError.emailError}
                  validationState={fError.emailError ? "inavlid" : "valid"}
                  value={fuser.email}
                  onChange={(e)=>{ 
                    setFUser({
                    ...fuser,
                    email:e.target.value
                  })}}
                  onKeyUp={(e)=>{
                    setFError({
                      ...fError,
                      emailError:emailValidation(e.target.value)
                    })
                  }}
                />
                <Button color="primary" variant="flat" isLoading={otpLoading} className={showOtp ? 'hidden':'block'} onClick={()=>{
                  sendOtpHandler()
                  startTimer()
                }}>
                  Request OTP
                </Button>
             
                {showOtp 
                 &&
                  <>
                   <Button color="primary" isDisabled={timerActive} onClick={()=>{
                sendOtpHandler()
                startTimer()
                  }} isLoading={otpLoading}>
                        {timerActive ? `Resend OTP in ${seconds} seconds` : 'Resend OTP'}
                      </Button>
                <Input
                  autoFocus
                  label="Otp"
                  type="text"
                  placeholder="Enter otp send to your email"
                  variant="bordered"
                  color={fError.otpError ? "danger" : "success"}
                  errorMessage={fError.otpError }
                  validationState={fError.otpError  ? "inavlid" : "valid"}
                  value={fuser.otp}
                  onChange={(e)=>{ 
                    setFUser({
                    ...fuser,
                    otp:e.target.value
                  })}}
                  onKeyUp={(e)=>{
                   setFError({
                      ...fError,
                      otpError:otpValidation(e.target.value)
                    })
                  }}
                />
                <Button color="primary"  isLoading={validateLoading} variant="flat"  onClick={()=>{
                  validateOtpHandler()
                }}>
                  continue
                </Button>
                </>
              
                }
               </>
                 :
              <>
               <Input
                  label="Password"
                  placeholder="Enter a new password"
                  type="password"
                  variant="bordered"
                  color={fError.passwordError ? "danger" : "success"}
                  errorMessage={fError.passwordError}
                  validationState={fError.passwordError ? "inavlid" : "valid"}
                  value={fuser.password}
                  onChange={(e)=>{                   
                    setFUser({
                    ...fuser,
                    password:e.target.value
                  })}}
                  onKeyUp={(e)=>{
                    setFError({
                      ...fError,
                      passwordError:passwordValidation(e.target.value)
                    })
                  }}
                />
                 <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  variant="bordered"
                  color={fError.cPasswordError ? "danger" : "success"}
                  errorMessage={fError.cPasswordError}
                  validationState={fError.cPasswordError ? "inavlid" : "valid"}
                  value={fuser.cPassword}
                  onChange={(e)=>{                   
                    setFUser({
                    ...fuser,
                    cPassword:e.target.value
                  })}}
                  onKeyUp={(e)=>{
                    setFError({
                      ...fError,
                      cPasswordError:cPasswordValidation(fuser.password,e.target.value)
                    })
                  }}
                />
                <div className="flex justify-center ">

                
                 <Button  className='m-2' color="danger"  variant="flat"  onClick={()=>{
                   cancelForgotPassword()
                }}>
                  cancel
                </Button>
                 <Button   className='m-2' color="primary"  isLoading={changePasswordLoading} variant="flat"  onClick={()=>{
                  changePasswordHandler()
                }}>
                  change
                </Button>
                </div>
                </>
                
                }
                </ModalBody>
                </>
              )
              }
            
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
