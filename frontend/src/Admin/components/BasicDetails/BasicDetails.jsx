import { useGetUsersMutation,useGetInterestsMutation,useGetAllCommunitiesMutation } from "../../slices/apiSlice/adminApiSlice"
import { useEffect,useState } from "react";

const BasicDetails = ()=>{

    const [count,setCount] = useState({
        usersCount:'',
        interestCount:'',
        communitiesCount:''
    })
   
    const [getAllUsers] = useGetUsersMutation();
    const [getAllInterest] = useGetInterestsMutation()
    const [getAllCommunities] = useGetAllCommunitiesMutation()


    useEffect(()=>{
        const getCount = async ()=>{
            const users = await getAllUsers().unwrap();
            const interest = await getAllInterest().unwrap()
            const communities = await getAllCommunities().unwrap()
            setCount({
                usersCount:users?.users?.length,
                interestCount:interest?.interests?.length,
                communitiesCount:communities?.communities?.length
            })
            

        }
        getCount()
    },[])
    return(
        <div className="flex flex-wrap justify-center mb-4">
     
        <div className="md:w-1/2 lg:w-1/4 w-full p-2">
          <div className="shadow-md flex  items-center justify-evenly h-16 rounded bg-gray-100 dark:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-2xl text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>


            <p className="text-xl text-black  dark:text-gray-500">
              Total Users:{count?.usersCount}
            </p>
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/4 w-full p-2">
          <div className="shadow-md flex  items-center justify-evenly h-16 rounded bg-gray-100 dark:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-2xl text-green-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
            <p className="text-xl text-black  dark:text-gray-500">
              Total Interests:{count?.interestCount}
            </p>
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/4 w-full p-2">
          <div className="shadow-md flex  items-center justify-evenly h-16 rounded bg-gray-100 dark:bg-gray-800">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-2xl text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <p className="text-xl text-black  dark:text-gray-500">
              Total Communities:{count?.communitiesCount}
            </p>
          </div>
        </div>
        </div>
    )
}

export default BasicDetails;