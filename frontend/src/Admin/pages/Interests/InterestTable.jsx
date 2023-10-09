import React, { useEffect, useState } from "react";
import { Tooltip, Button } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useGetInterestsMutation ,useManageInterestMutation,useAddInterestMutation} from "../../slices/apiSlice/adminApiSlice";



const InterestTable = () => {
  const [interests,setInterests] = useState([])
  const [reStatus,setReStatus] = useState(false)
  const [interest,setInterest] = useState('')
  const [interestError,setInterestError] = useState('')


  const [getInterests] = useGetInterestsMutation();
  const [manageInterest]= useManageInterestMutation();
  const [addInterest,{isLoading}] = useAddInterestMutation();

  useEffect(()=>{
    getAllInterests()
  },[reStatus])

  async function getAllInterests(){
    try {
     const res = await getInterests().unwrap();
     setInterests(res.interests)
        
    } catch (error) {
        toast.error("error in fetching interests")
    }
    
  }


  const changeStatus = async (interestId,status) => {
    try {
        const res = await manageInterest({id:interestId}).unwrap();
        setReStatus(!reStatus)
        toast.success(status ? 'interest listed successfully' : 'interest unlisted successfully')
       
    } catch (error) {
        toast.error("error in managing interest")
    }
  };

  const addInterestHandler = async (interest)=>{
    try {
      if(interest === '') return toast.error('please enter an interest')
      if(interestError) return toast.error('please clear all errors')
      const res = await addInterest({interest:interest}).unwrap()
      setReStatus(!reStatus)
      toast.success(res.message)
      setInterest('')
    } catch (error) {
      toast.error(error?.data?.message)
      
    }
  }



  return (
    <>
     <div className=" w-full">

     <PageTitle title={'Interest Management'}/>
      <div className=" flex rounded-lg dark:border-gray-700 mt-14">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-2/4">
        <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700  uppercase  dark:text-gray-400">
            <tr>
              <th scope="col" align="center" className="px-6 py-3 ">
                SL.NO
              </th>
              <th scope="col" align="center" className="px-6 py-3 justify-center">
                Interests
              </th>
              <th scope="col" align="center" className="px-6 py-3 justify-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {interests
              .map((x,index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <th
                      align="center"
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {index + 1}
                    </th>
                    <td align="center" className="px-6 py-4">
                      {x.interest}
                    </td>
                    <td align="center" className="px-6 py-4">
                        <Button
                          onClick={() => {
                            changeStatus(x?.id,x?.status);
                          }}
                          className={
                            !x.status
                              ? "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
                              : "text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
                          }
                        >
                          {!x.status ? "Unlist" : "List"}
                        </Button>
                        {/* <Button className="text-gray-900 bg-gray-400 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2">Edit</Button> */}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="w-2/4 p-4 m-4 ">
  <div className="bg-white rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700">
    <h2 className="text-xl font-medium mb-4 text-center">Add Interest</h2>
    <form className="flex flex-col items-center"> {/* Use flex and items-center */}
      <div className="m-4">
        <label className="text-gray-600 dark:text-gray-400" htmlFor="interestName">
          Interest Name:
        </label>
        <input
          type="text"
          id="interestName"
          name="interestName"
          className="border rounded-md p-2 w-full focus:ring focus:ring-gray-300 dark:focus:ring-gray-800"
          placeholder="enter interest here"
          value={interest}
          onChange={(e)=>{
            setInterest(e.target.value)
          }}
          onKeyUp={(e)=>{
            setInterestError('')
            if(e.target.value === '') setInterestError('please enter a valid interest')
          }}
        />
        <div className="text-red-600">{interestError}</div>
      </div>
      <div className="m-4">
        <Button
         
          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center"
           onClick={()=>{
            addInterestHandler(interest)
           }}
          
        >
          Add Interest
        </Button>
      </div>
    </form>
  </div>
</div>
 </div>
    </div>
    </>
  );
};

export default InterestTable;
