import { useEffect, useState } from "react";
import {  Button } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import PageTitle from "../PageTitle/PageTitle";
import { useGetUsersMutation,useManageUserMutation } from "../../slices/apiSlice/adminApiSlice";
import Swal from "sweetalert2"



const UserTable = () => {
  const [userData, setUserData] = useState([{}]);
  const [reStatus,setReStatus] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [getUsers] = useGetUsersMutation();
  const [manageUser,{isLoading}] = useManageUserMutation()

useEffect(()=>{
    getAllUsers()
},[reStatus])

async function getAllUsers(){
    try {
    const res = await getUsers().unwrap();
    if(res.users){
      setUserData(res.users)  
    }
    
    } catch (error) {
        toast.error("error in fetching users")
    }
}


  const changeStatus = async (userId,status) => {
    try {
        const result = await Swal.fire({
            title: status ? "Unblock User?" : "Block User?",
            text: "Are you sure you want to change the user's status?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: status ? "Unblock" : "Block",
            cancelButtonText: "Cancel",
            reverseButtons: true,
          });
          if(result.isConfirmed){
            const data = {id:userId}
             await manageUser(data).unwrap();
            setReStatus(!reStatus)
            toast.success(status ? 'user unblocked successfully' : 'user blocked successfully')

          }       
    } catch (error) {
        toast.error("error in managing user")
        
    }
    
  };



  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>
     <div className=" w-full">
      <div className=" rounded-lg dark:border-gray-700 mt-14">
       
      <PageTitle title={'User Management'}/>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700  uppercase  dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 ">
                SL.NO
              </th>
              <th scope="col" className="px-6 py-3">
                user Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                mobile
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {userData
              ?.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((x,index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {x.userName}
                    </td>
                    <td className="px-6 py-4">{x.email}</td>
                    <td className="px-6 py-4">{x.phoneNumber}</td>
                    <td className="px-6 py-4">
                      {/* <Tooltip
                        content={
                          x.status ? "Unblock the user" : "Block the user"
                        }
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 25 },
                        }}
                      > */}
                        <Button
                          isLoading={isLoading}
                          onClick={() => {
                            changeStatus(x?.id,x?.status);
                          }}
                          className={
                            !x.status
                              ? "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
                              : "text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
                          }
                        >
                          {!x.status ? "Block" : "Unblock"}
                        </Button>
                      {/* </Tooltip> */}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* <!-- Previous Button --> */}
     
      </div>
    </div>
    </>
  );
};

export default UserTable;
