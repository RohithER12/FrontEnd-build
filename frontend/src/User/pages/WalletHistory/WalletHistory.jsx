import { RingLoader } from "react-spinners"
import { useGetWalletHistoryMutation } from "../../slices/api_slices/userMonetizationApiSlice"
import { useEffect,useState } from "react"
import {BsCoin} from "react-icons/bs"
import { useSelector } from "react-redux"
import moment from "moment"

const WalletHistory = ()=>{
    
    const [wallet,setWallet] = useState('')
    const [walletData,setWalletData]=useState([])
    const [walletHistory,{isLoading}] = useGetWalletHistoryMutation()
    const userInfo = useSelector((state)=>state.auth.userInfo)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    // const [isLoading] = useState(true)


    const goToPreviousPage = () => {
      setCurrentPage((prevPage) => prevPage - 1);
    };
  
    const goToNextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };


    useEffect(()=>{
        async function getWalletHistory(){
            try {
                const res = await walletHistory({sort:""}).unwrap()
                if(res.Coins){
                  setWallet(res.Coins)
                }
                if(res.Result){
                  setWalletData(res.Result)
                }
                console.log(res.Result);
                
            } catch (error) {
                console.log(error);
                
            }
        }
        getWalletHistory()
    },[])
    return (
      <section className="h-screen">
        {isLoading ? <div className="w-full flex justify-center h-screen">
        <div className="py-52">
          <RingLoader color="#1bacbf"/>
        </div>
      </div>:
      
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
             <div className=" flex flex-col justify-evenly p-10 md:p-12 mb-8">
                <div className="w-full h-16 rounded-lg bg-slate-900 flex items-center content-center justify-center">
                     <div className="w-1/2 items-center text-center">
                        <div className="flex text-center items-center justify-center">
                         <h1 className="font-bold text-xl p-1">Gold :</h1>
                          <h1 className="font-bold text-xl p-1">{wallet}</h1>
                          <BsCoin color="#e27b05"/>
                        </div>  
                     </div>
                     <div className="w-px h-8 bg-white">
                     </div>
                     <div className="w-1/2 items-center text-center">
                        <div className="flex text-center items-center justify-center">
                           <h1 className="font-bold text-xl p-1">ReferCode :</h1>
                           <h1 className="font-bold text-l p-1">{userInfo?.referralCode}</h1>
                        </div>
                     </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
            {walletData?.slice(
                (currentPage -1 )* itemsPerPage,
                  currentPage * itemsPerPage
              )
              .map((x,idx)=>
            <div className="w-3/5 h-12 rounded-lg bg-slate-900 flex items-center content-center justify-center m-1" key={idx}>
              
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 pb-4" >
              <tbody>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
                   <th
                     scope="row"
                     className="px-6 py-4 font-bold text-m text-gray-900 whitespace-nowrap dark:text-white"
                   >
                   
                   </th>
                    <td className="px-6 py-4">
                     {moment(x?.time?.seconds).format('MMM Do YYYY')}
                   </td>
                   <td className="px-6 py-4">{x.TransactionType}</td>
                   <td className="px-6 py-4">{x.CoinCount}coins</td>
                 </tr>
              </tbody>
         </table>
              
                   
                </div>
                )}
            </div>
            <div className="flex justify-center mt-10">
              {currentPage !== 1 && 
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 mr-3 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={goToPreviousPage}
        >
          Previous
          {/* Previous button content */}
        </button>
}       {currentPage !== Math.ceil(walletData?.length / itemsPerPage) && 
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={goToNextPage}
          disabled={
            currentPage === Math.ceil(walletData?.length ?? 0 / itemsPerPage)
          }
        >
          Next
          {/* Next button content */}
        </button>
}
      </div>
         </div>
}
       </section>
    )
}

export default WalletHistory