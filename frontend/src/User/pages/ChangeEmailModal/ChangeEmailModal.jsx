import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input, avatar,} from "@nextui-org/react";
import {toast} from 'react-toastify'
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";
import { useState } from "react";
import { emailValidation ,otpValidation} from "../../../utils/validation/useFormValidation";
import { useChangeEmailRequestOtpMutation ,useChangeEmailMutation} from "../../slices/api_slices/usersApiSlice";



export default function UserEmailModal() {
  const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
  const [user,setUser] = useState({
    email:'',
    otp:''
  })
  const [error,setError] = useState({
    emailError:'',
    otpError:''
  })

  const [show,setShow] = useState(false);

  const [otpRequest,{isLoading}] = useChangeEmailRequestOtpMutation();
  const [changeEmail,{isLoading:emailLoading}] = useChangeEmailMutation()

  const dispatch = useDispatch();

  const requestOtp = async ()=>{
    try {
        if(!user.email) return toast.error('please enter an email');
        if(error.emailError) return toast.error('please clear all errors');
        const res = await otpRequest({email:user.email}).unwrap();
        if(res.message === "no change in email"){
            toast.success(res.message)
            onClose()
            return
        }
        setShow(true)
        toast.success(`otp send to ${user.email}`)
    } catch (error) {
        toast.error(error?.data?.message || error?.message)
        
    }

  }

  const changeEmailHandler = async () =>{
    try {
        if(!user.otp) return toast.error('please enter your otp')
        if(error.otpError) return toast.error('please enter a valid otp')
        const res = await changeEmail(user).unwrap();
      console.log(res);
      const data = {
        userName:res.username,
        email:res.email,
        phoneNumber:res.phoneNumber,
        avatarId:res?.avatarId
      }
      dispatch(setCredentials({ ...data }));
      toast.success(res.message)
      onClose()        
    } catch (error) {
      toast.error(error?.data?.message || error?.message)
        
    }
  }


  return (
    <>
    <Button onPress={onOpen} color="#01c8ef"  variant="flat" style={{ color: "#01c8ef" }}>Change</Button>
    <Modal 
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
            <ModalHeader className="flex flex-col gap-1">Change email</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Email"
                placeholder="Enter a new email"
                variant="bordered"
                isDisabled={show ? true : false}
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
              <Button color="primary" variant="flat" onPress={requestOtp} isLoading={isLoading}>
                      continue
              </Button>
              {show &&
              <>
              <Input
                autoFocus
                label="Otp"
                placeholder="Enter a your otp"
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
              <div className="flex justify-center">
               <Button className="m-2" color="danger" variant="flat" onPress={onClose} >
                Close
              </Button>
              <Button className="m-2" color="primary" onPress={changeEmailHandler} variant="flat" isLoading={emailLoading} >
                Save
              </Button>
              </div>
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
