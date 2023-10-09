import React,{useState,useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import {  numberValidation, emailValidation, passwordValidation, otpValidation,cPasswordValidation} from "../../../utils/validation/useFormValidation";
import {toast} from 'react-toastify'
import { useRegisterMutation , useRequestOtpMutation ,useValidUserNameMutation,useResendOtpMutation} from "../../slices/api_slices/usersApiSlice";
import { useCreateWalletMutation,useUpdateWalletMutation } from "../../slices/api_slices/userMonetizationApiSlice";
import { useResendOtp } from "../../../utils/helperFunctions/useResendOtp";

export default function SignupModal() {
  const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
  const [show,setShow] = useState(false)
  const [disabled,setDisabled] = useState(false)
  const[signup,setSignup] = useState(false)

  const [startTimer,seconds,timerActive] = useResendOtp()

  const [user,setUser] = useState({
    userName:'',
    email:'',
    number:'',
    password:'',
    cPassword:'',
    otp:'',
    referral:''
  })
  const [error,setError] = useState({
    nameError:'',
    emailError:'',
    numberError:'',
    passwordError:'',
    cPasswordError:'',
    otpError:''
  })

  const [success,setSuccess] = useState({
    nameSuccess:'',
  })

 

  const [validUserName] = useValidUserNameMutation()
  const [requestOtp,{isLoading:otpLoading}] = useRequestOtpMutation();
  const [register,{isLoading:registerLoading}] = useRegisterMutation();
  const [resendOtp,{isLoading:resendOtpLoading}] = useResendOtpMutation()
  const [createWallet] = useCreateWalletMutation();
  const [updateWallet] = useUpdateWalletMutation()

async function checkUserName(){

      setSuccess({
        ...success,
        nameSuccess:""
      })
    setError({
      ...error,
      nameError:""
    })
  try {
    if(user.userName === "") throw new Error("user name required")
    if(user.userName.length < 5) throw new Error("user name must be more than 4 charactors")
    if(user.userName.includes(' ')) throw new Error("Username cannot contain spaces")
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
    if (specialCharacterRegex.test(user.userName)) {
      throw new Error("Username cannot contain special characters");
    }
    
    const res = await validUserName(user).unwrap()
    setSuccess({
      ...success,
      nameSuccess:res.message
    })   
  } catch (err) { 
    
    setError({
      ...error,
      nameError:err?.data?.message ||  err.message 

     })
    
  }
}

function continueSignUp(){
  if(error.nameError) toast.error("please clear all error")
  else if(!user.userName) toast.error("Please enter user name")
  else{
     setSuccess({
      ...success,
      nameSuccess:""
     })
     setDisabled(true)
     setShow(true)

   }
}

async function otpRequest(){
  if(!user.email || !user.email || !user.number || !user.password || !user.cPassword ) return toast.error('please fill all fields')
  if(error.emailError || error.numberError || error.passwordError || error.cPasswordError ) return  toast.error('Please clear all errors');
  else{
    try {
      const data = {
        phoneNumber:user.number,
        userName:user.userName,
        email:user.email,
        password:user.password
      }
      const res = await requestOtp(data).unwrap()
      toast.success("otp sent succcessfully")
      setSignup(true)
    } catch (err) {
      toast.error(err?.data?.message || err.Error)
    }
  }
}

async function resendOtpHandler(){
  try{
    const data = {
      phoneNumber:user.number
    }
    const res = await resendOtp(data)
    console.log(res);

  }catch(err){
    toast.error(err?.data?.message || err?.message)

  }
}

async function signupHandler(){
  if(!user.email || !user.email || !user.number || !user.password || !user.cPassword || !user.otp) return toast.error('please fill all fields')
  if(error.emailError || error.numberError || error.passwordError || error.cPasswordError || error.otpError )  return  toast.error('Please clear all errors');
  else{
    try {      
      const data={
        email:user.email,
        password:user.password,   
        cPassword:user.cPassword, 
        phoneNumber:user.number,
        userName:user.userName,    
        referral:user.referral,  
        otp :user.otp  
      }
      const res = await register(data).unwrap()
      console.log(res,"res for signup");
        await createWallet({userID:res.userId}).unwrap()
  
        if(res.reward){
          const wallet = {
            reason:"referral",
            type:"credit",
            userID:res.recipientId,
            userName:res.recipientName
          }
          await updateWallet(wallet).unwrap()
        }
      toast.success("account created successfully")
      toast.success("please login to continue")

      onClose()
      setUser({
        userName:'',
        email:'',
        number:'',
        password:'',
        cPassword:'',
        otp:'',
        referral:''
      })
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }
}


  return (
    <>
     <Button onPress={onOpen}  color="#01c8ef"  variant="flat" style={{ color: "#01c8ef" }}>
            Sign up
      </Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        classNames={{
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#e6e9f0]", 
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="justify-center">Sign up</ModalHeader>
            
                  <ModalBody>
                
                    <Input
                      autoFocus
                      isDisabled={disabled}
                      size="sm"
                      label="Username"
                      placeholder="Enter your username"
                      variant="bordered"
                      color={error.nameError === "" ? "success" : "danger"}
                      errorMessage={error.nameError }
                      validationState={error.nameError === "" ? "valid" : "invalid"}
                      value={user.userName}
                      onChange={(e)=>{                    
                      setUser({
                        ...user,
                        userName:e.target.value
                      })                  
                    }}
                    onKeyUp={(e)=>{
                      checkUserName(e.target.value)
                    }}
                    />
                    {error.nameError === "" && success.nameSuccess !== "" && (
                    <p className="text-xs text-green-500">{success.nameSuccess}</p>
                    )}
                     

                    <Button color="primary" className={show ? "hidden" : "block"}  onClick={continueSignUp}  variant="flat">
                      continue
                    </Button>
                    {show && 
                <>
                    <Input
                      size="sm"
                      isDisabled={signup ? true : false}
                      label="Contact Number"
                      placeholder="Enter your contact number"
                      variant="bordered"
                      color={error.numberError ? "danger" : "success"}
                      errorMessage={error.numberError}
                      validationState={error.numberError? "inavlid" : "valid"}
                      value={user.number}
                      onChange={(e)=>{setUser({
                        ...user,
                        number:e.target.value
                      })}}
                      onKeyUp={(e)=>{
                        setError({
                          ...error,
                          numberError:numberValidation(e.target.value)
                        })
                      }}
                    />
                    <Input
                      size="sm"
                      isDisabled={signup ? true : false}
                      label="Email"
                      placeholder="Enter your email"
                      variant="bordered"
                      color={error.emailError ? "danger" : "success"}
                      errorMessage={error.emailError}
                      validationState={error.emailError? "inavlid" : "valid"}
                      value={user.email}
                      onChange={(e)=>{ 
                        setUser({
                        ...user,
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
                    <Input
                      size="sm"
                      isDisabled={signup ? true : false}
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      variant="bordered"
                      color={error.passwordError ? "danger" : "success"}
                      errorMessage={error.passwordError}
                      validationState={error.passwordError? "inavlid" : "valid"}
                      value={user.password}
                      onChange={(e)=>{setUser({
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
                    <Input
                      size="sm"
                      isDisabled={signup ? true : false}
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      type="password"
                      variant="bordered"
                      color={error.cPasswordError ? "danger" : "success"}
                      errorMessage={error.cPasswordError}
                      validationState={error.cPasswordErrorr? "inavlid" : "valid"}
                      value={user.cPassword}
                      onChange={(e)=>{setUser({
                        ...user,
                        cPassword:e.target.value
                      })}}
                      onKeyUp={(e)=>{
                        setError({
                          ...error,
                          cPasswordError:cPasswordValidation(user.password,e.target.value)
                        })
                      }}
                    />
                    <Button color="primary" onClick={()=>{
                      otpRequest(),
                      startTimer()
                      }} isLoading={otpLoading} variant="flat" className={signup ? "hidden" : "block"}>
                      Request OTP
                    </Button>
                  {signup &&
                  <>
                   
                    <Input
                      size="sm"
                      label="OTP" 
                      placeholder="Enter your otp"
                      type="text"
                      variant="bordered"
                      color={error.otpError ? "danger" : "success"}
                      errorMessage={error.otpError}
                      validationState={error.otpError? "inavlid" : "valid"}
                      value={user.otp}
                      onChange={(e)=>{setUser({
                        ...user,
                        otp:e.target.value
                      })}}
                      onKeyUp={(e)=>{
                        setError({
                          ...error,
                          otpError:otpValidation(e.target.value)
                        })
                      }}
                    />
                  <Button color="primary" isDisabled={timerActive} onClick={()=>{
                resendOtpHandler(),
                startTimer()
                  }} isLoading={resendOtpLoading}>
                        {timerActive ? `Resend OTP in ${seconds} seconds` : 'Resend OTP'}
                      </Button>
                    <Input
                      size="sm"
                      label="Referral code"
                      placeholder="Enter your referral code"
                      type="text"
                      variant="bordered"
                      value={user.referral}
                      onChange={(e)=>{setUser({
                        ...user,
                        referral:e.target.value
                      })}}
                    />
                    
                    <Button  type='submit' color="primary" isLoading={registerLoading} onPress={signupHandler} >
                      Sign up
                    </Button>
                  </>
                  }
                 
                </>
                
                   }
                </ModalBody>
                          
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
