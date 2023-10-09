import { Routes, Route} from 'react-router-dom'
import Layout from './User/pages/Layout'
import Landing from '../src/User/pages/Landing/Landing'
import UserPrivateRoute from './User/pages/UserPrivateRoute/UserPrivateRoute'
import Home from './User/pages/Home/Home'
import Profile from './User/pages/Profile/Profile'
import Schedule from './User/pages/Schedule/Schedule'
import Conference from './User/pages/Conference/Conference'
import Group from './User/pages/Group/Group'
import Chat  from './User/pages/Chat/Chat'
import MediaContainer from './User/components/MediaContainer/MediaContainer'
import LiveContainer from './User/components/LiveContainer/LiveContainer'
import StartStream from './User/pages/StartStream/StartStream'
import VideoUploadPage from './User/pages/VideoUploadPage/VideoUpload'
import FullScreenVideo from './User/pages/FullScreenVideo/FullScreenVideo'
import CommunityDetail from './User/components/CommunityDetail/CommunityDetail'
import WalletHistory from './User/pages/WalletHistory/WalletHistory'
import NotFound  from './User/pages/NotFound'

import AdminLayout from './Admin/pages/AdminLayout'
import AdminLogin from './Admin/pages/loginPage/AdminLogin'
import AdminHome from './Admin/pages/AdminPrivateRoute/AdminPrivateRoute'
import Dashboard from './Admin/components/DashBoard/DashBoard'
import UserTable from './Admin/components/UsersTable/Table'
import InterestTable from './Admin/pages/Interests/InterestTable'
import CommunityTable from './Admin/pages/CommunityTable/CommunityTable'
import ReportedVideoTable from './Admin/pages/ReportedVideoTable/ReportedVideo'
import ViewVideo from './Admin/pages/ViewVideo/ViewVideo'

function App() {
  return (
      <Routes>
        <Route path='/' element={<Layout/>} >
           <Route index={true} element={<Landing/>}/>
           <Route path='' element={<UserPrivateRoute/>}>
             <Route path='home' element={<Home/>}/>
             <Route path='profile' element={<Profile/>}/>
             <Route path='schedule' element={<Schedule/>}/>
             <Route path='conference' element={<Conference/>}/>
             <Route path='messages'element={<Chat/>} />
             <Route path='group'element={<Group/>}/>
             <Route path='media-container/:id'element={<MediaContainer/>}/>
             <Route path='stream' element={<StartStream/>}/>
             <Route path='live/:id' element={<LiveContainer/>}/>
             <Route path='upload' element={<VideoUploadPage/>}/>
             <Route path='video/:id'element={<FullScreenVideo/>} />
             <Route path='community/:id'element={<CommunityDetail/>} />
             <Route path='wallet'element={<WalletHistory/>} />
             <Route path='*'element={<NotFound/>} />

             
           </Route>
        </Route>
        <Route path='/admin' element={<AdminLayout/>}>
          <Route index={true} element={<AdminLogin/>}/>
          <Route path='' element={<AdminHome/>}>
            <Route path='home' element={<Dashboard/>}/>
            <Route path='users' element={<UserTable/>}/>
            <Route path='interests' element={<InterestTable/>}/>
            <Route path='community' element={<CommunityTable/>}/>
            <Route path='report' element={<ReportedVideoTable/>}/>
            <Route path='video/:id'element={<ViewVideo/>} />
            <Route path='/admin/*'element={<NotFound/>} />
            <Route/>
          </Route>
        </Route>
      </Routes>  
    
  )
}
export default App
