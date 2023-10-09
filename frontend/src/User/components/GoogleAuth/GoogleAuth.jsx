import {GoogleLogin} from "@react-oauth/google"
import { useGoogleLoginMutation } from "../../slices/api_slices/usersApiSlice";
import {toast} from "react-toastify"
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";




function GoogleAuth(){

  const [googleLogin] = useGoogleLoginMutation()
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const googleLoginHandler = async (values)=>{
    try {
      const res = await googleLogin({token:values}).unwrap();
      const data = {
        userName:res.username,
        email:res.email,
        phoneNumber:res.phoneNumber,
        isGooleLogin:true,
        avatarId:res?.avatarId,
        referralCode:res?.referralCode
      }
      dispatch(setCredentials({ ...data }));
      navigate('/home')

    } catch (error) {
      console.log(error);
      toast.error("error in google login")
      
    }
  }
    return (
        <div className='mb-5 '>
          <div className="flex justify-center">
          <GoogleLogin
            width="352px"
            size='large'
            // theme="filled_blue"
            logo_alignment="center"
            shape="pill"
            auto_select={false}
            type="standard"
            ux_mode="popup"
              onSuccess={(response) => {
                googleLoginHandler(response.credential)
              }}
            />
          </div>
        </div>
      );
}

export default GoogleAuth;

