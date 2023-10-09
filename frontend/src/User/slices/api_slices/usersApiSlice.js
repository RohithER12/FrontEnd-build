import { apiSlice } from "../../../utils/apiSlice/apiSlice";
const USERS_URL = '/api/user'


const createApiMutation = (builder,endpoint,url,method)=>{
  return builder.mutation({
    query:(data)=>({
      url:`${USERS_URL}/${url}`,
      method:method,
      body:data
    })
  })
}
export const userApliSlice = apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    login:createApiMutation(builder,'login','login','POST'),
    register:createApiMutation(builder,'register','signup','POST'),
    requestOtp:createApiMutation(builder,'requestOtp','otp','POST'),
    validUserName:createApiMutation(builder,'validUserName','valid-name','POST'),
    logout:createApiMutation(builder,'logout','logout','POST'),
    resendOtp:createApiMutation(builder,'resendOtp','resend-otp','POST'),
    googleLogin:createApiMutation(builder,'googleLogin','google-login','POST'),
    validateUserStatus:createApiMutation(builder,'validateUserStatus','validate-user','POST'),
    changeUserName:createApiMutation(builder,'changeUserName','change-user-name','PATCH'),
    changeEmailRequestOtp:createApiMutation(builder,'changeEmailRequestOtp','change-email','PATCH'),
    changeEmail:createApiMutation(builder,'changeEmail','change-email-verify-otp','POST'),
    changeNumberRequestOtp:createApiMutation(builder,'changeNumberRequestOtp','change-phno-request','POST'),
    changeNumber:createApiMutation(builder,'changeNumber','change-phno','PATCH'),
    changePassword:createApiMutation(builder,'changePassword','change-password','PATCH'),
    changeAvatar:createApiMutation(builder,'changeAvatar','change-avatar','PATCH'),
    deleteAvatar:createApiMutation(builder,'deleteAvatar','delete-avatar','PATCH'),
    forgotPasswordGetOtp:createApiMutation(builder,'forgotPasswordGetOtp','forgot-pass-otp','POST'),
    forgotPasswordValidateOtp:createApiMutation(builder,'forgotPasswordValidateOtp','forgot-pass-validate','POST'),
    forgotPasswordChangePassword:createApiMutation(builder,'forgotPasswordChangePassword','forgot-pass-reset','PATCH'),
    userGetInterests:createApiMutation(builder,'getInterests','get-interests','GET'),
    getUserDetails:createApiMutation(builder,'getUserDetails','get-user-details','GET'),
    
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useValidUserNameMutation,
  useLogoutMutation,
  useResendOtpMutation,
  useGoogleLoginMutation,
  useValidateUserStatusMutation,
  useChangeUserNameMutation,
  useChangeEmailRequestOtpMutation,
  useChangeEmailMutation,
  useChangeNumberRequestOtpMutation,
  useChangeNumberMutation,
  useChangePasswordMutation,
  useChangeAvatarMutation,
  useDeleteAvatarMutation,
  useForgotPasswordGetOtpMutation,
  useForgotPasswordValidateOtpMutation,
  useForgotPasswordChangePasswordMutation,
  useUserGetInterestsMutation,
  useGetUserDetailsMutation,
} = userApliSlice

