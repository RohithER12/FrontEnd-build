export const userNameValidation = (value)=>{
    if(value === "") return "invalid"
}
export const emailValidation = (value)=>{
    if (value === "") return "please enter an email";
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i) ? "" : "please enter a valid email";
}

export const numberValidation = (value)=>{
    if(value === "") return "please enter a contact number"
    else if (value.length < 10 || value.length > 10) return "please provide a valid contact number"
}

export const passwordValidation = (value) =>{
    if(value === "") return "please enter a password"
    else if (value.length < 7) return "password must contain 7  charactors"
}

export const cPasswordValidation = (password,cPassword)=>{
    if(cPassword === "") return "please confirm your password"
    else if (password !== cPassword) return "password not matching"
}

export const otpValidation = (otp)=>{
    if(otp === "") return "please enter your otp"
}

