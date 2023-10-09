import UsersChart from "../Chart/UsersChart"
import PageTitle from "../PageTitle/PageTitle";
import BasicDetails from "../BasicDetails/BasicDetails";
import CommunityChart from "../Chart/CommunityChart";

const Dashboard = ()=>{
    return (
        <div className="w-full">
        <div className="items-center rounded-lg dark:border-gray-700 mt-14">
        <PageTitle title={'Admin Dashboard'}/>
        <BasicDetails/>
        <div className="flex items-center justify-center">
           <div className="flex-col w-full md:w-1/4">    
              <div className="flex justify-center mb-2">
                <h1 className="font-bold text-xl">Users</h1>
              </div>
              <UsersChart />
              
            </div>
            <div className="flex-col w-full md:w-1/4">    
              <div className="flex justify-center mb-2">
                <h1 className="font-bold text-xl">Communities</h1>
              </div>
              <CommunityChart />
              
            </div>
        </div>
        
        </div>
        </div>
       
    )
}

export default Dashboard;