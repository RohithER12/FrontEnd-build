
import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input,} from "@nextui-org/react";
import { passwordValidation,cPasswordValidation} from "../../../utils/validation/useFormValidation";
import { useChangePasswordMutation } from "../../slices/api_slices/usersApiSlice";
import {toast} from 'react-toastify'



export default function UserPasswordModal() {
  const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();

  const [changePassword,{isLoading}] = useChangePasswordMutation() 

  const [user,setUser] = useState({
    password:'',
    cPassword:''
  })
  const [error,setError] = useState({
    passwordError:'',
    cPassword:''
  })

  const changePasswordHandler = async ()=>{
    try {
      if(!user.password || !user.cPassword) return toast.error('please enter a number')
      if(error.passwordError || error.cPasswordError) return toast.error('please clear all errors');
      const res = await changePassword({password:user.password}).unwrap();
      console.log(res);
      toast.success(res.message)
      onClose()
    } catch (error) {
      toast.error(error?.data?.message || error?.message)
    }
    
  }

  return (
    <>
    <Button onPress={onOpen} color="#01c8ef"  variant="flat" style={{ color: "#01c8ef" }}>Change Password</Button>
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
            <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Password"
                placeholder="Enter a new password"
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
                label="Confirm Password"
                placeholder="Please confirm your password"
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
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button color="danger" variant="flat" onPress={onClose} >
                Close
              </Button>
              <Button color="primary" onPress={changePasswordHandler} variant="flat">
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </>
     
  );
}
