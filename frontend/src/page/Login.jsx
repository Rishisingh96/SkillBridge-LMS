
import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo1.png";
import { FaRegEye } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const hangleLogin = async () =>{
    setLoading(true)
    try {
        const result = await axios.post(serverUrl + "/api/auth/login", {email, password}, {withCredentials:true}) 
        console.log(result.data)
        setLoading(false)
        toast.success("Login Successfully")
        navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      toast.error(errorMessage)
    }
  }

   const googleLogin = async () =>{
      setLoading(true)
      try{
        const response = await signInWithPopup(auth, provider)
        console.log(response)
        let user = response.user
        let name = user.displayName
        let email = user.email
        let photoUrl = user.photoURL
        let role = "student" // Default role for Google login
  
        const result = await axios.post(serverUrl + "/api/auth/googleauth", {name, email, photoUrl, role}, {withCredentials:true})
        console.log(result.data)
        dispatch(setUserData(result.data.user || result.data))
  
        setLoading(false)
        navigate("/")
        toast.success("Login Successfully")
      }catch(error){
        console.log(error)
        setLoading(false)
        toast.error(error.response?.data?.message || "Something went wrong")
      }
    }

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form className="w-[90%] md:w-[500px] lg:w-[600px] h-auto md:h-[500px] lg:h-[550px] bg-[white] shadow-xl rounded-2xl flex flex-col md:flex-row" onSubmit={(e)=>e.preventDefault()}>

        {/* left div */}
        <div className="w-[100%] md:w-[50%] h-[100%] flex flex-col items-center justify-center gap-3 p-4 md:p-0">
          <div>
            <h1 className="font-semibold text-[black] text-2xl">
              Welcome Back
            </h1>
            <h2>logic your account </h2>
          </div>


          {/* For email */}
          <div className="flex flex-col gap-1 w-[90%] md:w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border w-[100%] h-[35px] md:h-[40px] border-[#e7e6e6] text-[14px] md:text-[15px] px-[15px] md:px-[20px] rounded"
              placeholder="Your email"
              onChange={(e)=>setEmail(e.target.value)} value={email}
            />
          </div>

          {/* For Password */}
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              type={show ? "text" : "password"}
              className="border w-[100%] h-[35px] md:h-[40px] border-[#e7e6e6] text-[14px] md:text-[15px] px-[15px] md:px-[20px] rounded"
              placeholder="Your password"
              onChange={(e)=>setPassword(e.target.value)} value={password}
            />
            {!show ? (
              <FaRegEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <IoEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>

          {/* Login */}
          <button className="w-[90%] md:w-[80%] h-[40px] md:h-[45px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]" disabled = {loading} onClick={hangleLogin}>
            {loading ? <ClipLoader size={30} color='white'/>:"Login"}
          </button>

          <span className="text-[12px] md:text-[13px] cursor-pointer text-[#585757] " onClick={()=>navigate("/forget-password")}>Forget Your Password</span>

          <div className="w-[90%] md:w-[80%] flex items-center gap-2">
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>

            <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">
              Or continue
            </div>

            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
          </div>

          <div className="flex items-center justify-center mt-2" onClick={googleLogin}>
            <img
              src="https://developers.google.com/static/identity/images/branding_guideline_sample_lt_rd_lg.svg"
              alt="Google Sign In"
              className="h-10 cursor-pointer"
            />
          </div>

          <div className='text-[#6f6f6f] text-sm md:text-base'> Create new account
            <span className="underline underline-offset-1 text-[black] cursor-pointer" onClick={() => navigate("/signup")}>SignUp</span>
          </div>

        </div>

        {/* right div */}
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden">
          <img src={logo} alt="log" className="w-65 shadow-2xl" />
          <span className="text-2xl text-white">SKILLBRIDGE</span>
        </div>

      </form>
    </div>
  )
}

export default Login
