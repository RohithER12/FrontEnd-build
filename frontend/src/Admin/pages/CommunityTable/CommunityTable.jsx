import  { useEffect, useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useGetAllCommunitiesMutation ,useManageCommunityMutation} from "../../slices/apiSlice/adminApiSlice";
import { Chip,Button } from "@nextui-org/react";

const CommunityTable = ()=>{
    
    const [community,setCommunity] = useState([])
    const [getCommunity] = useGetAllCommunitiesMutation();
    const [mangeCommunity,{isLoading}] = useManageCommunityMutation()
    const [status,setStatus] = useState(false)


    useEffect(()=>{
       getCommunityHandler()
       console.log(community);
    },[status])


    const getCommunityHandler = async ()=>{
        try {
            const res = await getCommunity().unwrap();
            console.log(res);
            if(res.communities){
              setCommunity(res.communities)
            }
           
            
        } catch (error) {
             console.log(error);
        }
    }

    const manageCommunityHandler = async (id)=>{
        try {
            const res = await mangeCommunity({communityId:id}).unwrap()
            console.log(res);
            setStatus(!status)
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
     <div className=" w-full">
      <div className=" rounded-lg dark:border-gray-700 mt-14">
       
      <PageTitle title={'Community Management'}/>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        {community.length > 0 ?
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700  uppercase  dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 ">
                SL.NO
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Admin
              </th>
              <th scope="col" className="px-6 py-3">
                Members
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {community
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
                      {x.communityName}
                    </td>
                    <td className="px-6 py-4">{x.communityAdmin}</td>
                    <td className="px-6 py-4">{x.memberCount}</td>
                    <td className="px-6 py-4">
                        <Chip className="capitalize"  color={x.isActive ? "success" : "danger"} size="sm" variant="flat">
                        {x.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Chip>
                    </td>
                    <td className="px-6 py-4">
                      <Tooltip
                        content={
                          x.status ? "Unblock community" : "Block community"
                        }
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 25 },
                        }}
                      >
                        <Button
                          isLoading={isLoading}
                          className={
                            !x.isBlocked
                              ? "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
                              : "text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2"
                          }
                          onClick={()=>{
                            manageCommunityHandler(x.id)
                          }}
                        >
                          {!x.isBlocked ? "Block" : "Unblock"}
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        :
        <h2 className="text-center text-gray-900 dark:text-white text-xl md:text-4xl font-extrabold mb-2">
        No Communities to show
     </h2>
        }
      </div>
      </div>
    </div>
    </>
  );
};

export default CommunityTable;
