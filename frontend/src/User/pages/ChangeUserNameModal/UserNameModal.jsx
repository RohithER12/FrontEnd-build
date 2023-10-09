import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input,} from "@nextui-org/react";
import { useValidUserNameMutation,useChangeUserNameMutation } from "../../slices/api_slices/usersApiSlice";
import {toast} from 'react-toastify'
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";



export default function UserNameModal() {
  const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();

  const [userName,setUserName] = useState('')
  const [success,setSuccess] = useState('')
  const [error,setError] = useState('')

  const [validateName] = useValidUserNameMutation();
  const [changeUserName,{isLoading}] = useChangeUserNameMutation()
  const dispatch = useDispatch();



  async function checkUserName(){
    setSuccess("")
    setError("")
    try {
        if(userName === "") throw new Error("user name required")
        if(userName.length < 5) throw new Error("user name must be more than 4 charactors")
        if(userName.includes(' ')) throw new Error("Username cannot contain spaces")
        const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
        if (specialCharacterRegex.test(userName)) {
          throw new Error("Username cannot contain special characters");
        }
        
        const res = await validateName({userName:userName}).unwrap()
        setSuccess(res.message)   
    } catch (err) { 
       setError(err?.data?.message ||  err.message )
    }
}

async function changeUserNameHandler(){
  if(!userName) return toast.error('please enter a user name');
  if(error) return toast.error('please clear all errors')
  try {
   const res = await changeUserName({userName:userName}).unwrap();
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
    toast.error(error?.data?.message || error.message)
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
            <ModalHeader className="flex flex-col gap-1">Change user name</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="User Name"
                placeholder="Enter a new user name"
                variant="bordered"
                value={userName}
                color={error === "" ? "success" : "danger"}
                errorMessage={error }
                validationState={error === "" ? "valid" : "invalid"}
                onChange={(e)=>{
                  setUserName(e.target.value)
                }}
                onKeyUp={()=>{
                  checkUserName()
                }}
              />
               {error === "" && success !== "" && (
                    <p className="text-xs text-green-500">{success}</p>
                    )}
            </ModalBody>
            <ModalFooter className="justify-center">
              <Button color="danger" variant="flat" onPress={onClose} >
                Close
              </Button>
              <Button color="primary" variant="flat" isLoading={isLoading} onPress={changeUserNameHandler} >
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
