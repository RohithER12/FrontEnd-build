import ReactApexChart from "react-apexcharts"
import {RingLoader} from "react-spinners"
import { useState,useEffect } from "react"
import { useGetUsersMutation } from "../../slices/apiSlice/adminApiSlice";


const UsersChart = ()=>{
    const [getUsers,{isLoading}] = useGetUsersMutation()
    const [series, setSeries] = useState([0,0]);

    useEffect(() => {
        const getAllUsers = async () => {
          const data = await getUsers().unwrap()
          if(data){
            const userData = data?.users
            let Active = 0
            let Block = 0
            userData.forEach(element => {
                if(element?.status){
                    Block++
                }else{
                    Active++
                }
            });
            setSeries([Active,Block])
          } 
        };
        getAllUsers();
      }, []);

      const [option, setOption] = useState({
        chart: {
          width: 200,
          type: "pie",
        },
        labels: ["Active", "Blocked"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        colors: ["#39a32e", "#e01017"],
      });
   
    return isLoading ? <div className=" w-full flex justify-center  h-full ">
    <div className="py-52">
      <RingLoader color="#1bacbf"/>
    </div>
  </div> : (
      <div id="chart w-full h-auto">
        <ReactApexChart options={option} series={series} type="pie"/>

      </div>
    );
}

export default UsersChart;