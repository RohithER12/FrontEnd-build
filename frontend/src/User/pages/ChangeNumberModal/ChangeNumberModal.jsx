import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input,} from "@nextui-org/react";
import {toast} from 'react-toastify'
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";
import { useState } from "react";
import { numberValidation ,otpValidation} from "../../../utils/validation/useFormValidation";
import { useChangeNumberRequestOtpMutation ,useChangeNumberMutation} from "../../slices/api_slices/usersApiSlice";

export default function UserNumberModal() {
  const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
  const [user,setUser] = useState({
    number:'',
    otp:''
  })
  const [error,setError] = useState({
    numberError:'',
    otpError:''
  })
  const [show,setShow] = useState(false);


  const [numberRequestOtp,{isLoading}] = useChangeNumberRequestOtpMutation();
  const [changeNumber,{isLoading:numberLoading}] = useChangeNumberMutation();

  const dispatch = useDispatch();


  const requestOtp = async()=>{
    try {
      if(!user.number) return toast.error('please enter a number')
      if(error.numberError) return toast.error('please clear all errors');
      const res = await numberRequestOtp({phoneNumber:user.number}).unwrap();
      if(res.message === "No change in phone number"){
        toast.success(res.message)
            onClose()
            return
      }
      setShow(true)
      toast.success(`otp send to ${user.number}`)
    } catch (error) {
      toast.error(error?.data?.message || error?.message)
    }
  }

  const changeNumberHandler = async ()=>{
    try {
      if(!user.otp) return toast.error('please enter your otp')
      if(error.otpError) return toast.error('please enter a valid otp')
      const res = await changeNumber({phoneNumber:user.number,otp:user.otp}).unwrap();
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
            <ModalHeader className="flex flex-col gap-1">Change Phone number</ModalHeader>
            <ModalBody>
              <Input
               isDisabled={show ? true : false}
                autoFocus
                label="Phone Number"
                placeholder="Enter a new phone number"
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
              <Button className="m-2" color="primary"  variant="flat"  isLoading={numberLoading} onPress={changeNumberHandler}>
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
