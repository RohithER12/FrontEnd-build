import AdminHomeNavbar from "../../components/AdminHomeNavbar/AdminHomeNavbar";
import { useSelector } from 'react-redux';
import {useAdminLogoutMutation} from '../../slices/apiSlice/adminApiSlice'
import { useNavigate ,Navigate,Outlet} from "react-router-dom";
import { useDispatch } from "react-redux";
import {removeCredentials} from "../../slices/reducers/adminAuthSlice"
import { toast } from "react-toastify";
import { useState ,useEffect} from 'react';
import Sidebar from "../../components/SideBar/SideBar";
import './AdminPrivateRoute.scss';
import { Cookies } from "react-cookie";
import { setToken,removeToken } from "../../../utils/apiSlice/authReducer";


const AdminHome = ()=>{
    const adminInfo = useSelector((state)=> state.admin.adminInfo)
    const cookies = new Cookies()
    const adminAuth = cookies.get('admin-auth')
    const [logout] = useAdminLogoutMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [collapsed, setCollapsed] = useState(false);
  const [image] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };


  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  useEffect(()=>{
    if(!adminAuth){
      dispatch(removeCredentials())
      dispatch(removeToken())
      navigate('/admin')
    }else{
      dispatch(setToken(adminAuth))
    }
  },[])

    async function logoutHandler(){
        try {
            const res = await logout()
            console.log(res);
            dispatch(removeCredentials())
            dispatch(removeToken())
            navigate('/admin')            
        } catch (error) {
            toast.error(error?.data?.message)
        }
    }

    return (
        adminInfo && adminAuth ? (
            <>
            <AdminHomeNavbar adminInfo={adminInfo} logoutHandler={logoutHandler} />
            <div className={`app ${toggled ? 'toggled' : ''}`}>
            
           <Sidebar
             image={image}
             collapsed={collapsed}
             toggled={toggled}
             handleToggleSidebar={handleToggleSidebar}
             handleCollapsedChange={handleCollapsedChange}
     
           />
          <Outlet/>
         
     
         </div>
         </>

        )
       :(
        <Navigate to='/admin' replace />
       )
    )
}

export default AdminHome;