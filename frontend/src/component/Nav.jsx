import React from "react";
import logo from "../assets/logo1.png";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { serverUrl } from '../App'
import { setUserData } from "../redux/userSlice";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";


const Nav = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const dispath = useDispatch()
  const [show, setShow] = useState(false)
  const [showHam, setShowHam] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true })
        dispath(setUserData(result.data))
      } catch (error) {
        console.log(error);
        dispath(setUserData(null))
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      dispath(setUserData(null))
      console.log(result.data)
      toast.success("Logout Successfully")
      // toast.success(result.data)

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      <div className="w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-gray-100 z-10">

        <div className="lg:w-[20%] w-[40%] lg:pl-[50px]">
          <img
            src={logo}
            alt=""
            className="w-[60px] h-[70px] rounded-[5px] border-2 border-amber-100"
          />
        </div>

        {/* User Icon login/logout profile , use hidden class to hide it on mobile */}
        <div className="w-[30%] lg:flex items-center justify-center gap-4 hidden">

          {!userData && <IoPersonCircleSharp className="w-[50px] h-[50px] fill-black cursor-pointer" onClick={() => setShow(prev => !prev)} />}

          {/* show a Name or photo */}
          {userData && <div className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer" onClick={() => setShow(prev => !prev)}>
            {userData?.name.slice(0, 1).toUpperCase()}
          </div>
          }
          {userData?.role === "educator" && <div className="px-[20px] py-[10px] border-2 border-white text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer">
            Dashboard
          </div>}

          {/* Login / Logout */}
          {
            !userData ? (
              <span className="px-[20px] py-[10px] border-2 border-white text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer" onClick={() => navigate("/login")}>
                Login
              </span>
            ) : (
              <span className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer" onClick={handleLogout}>
                Logout
              </span>
            )
          }

          {show && <div className="absolute top-[110%] right-[15%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-[white] px-[15px] py-[10px] border-[2px] border-black hover:border-white hover:text-white cursor-pointer hover:bg-black">
            <span className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600" onClick={()=>navigate("/profile")}>My Profile</span>
            <span className="bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600">My Courses</span>
          </div>}
        </div>

        {/* For Mobile */}
        <GiHamburgerMenu className="w-[25px] h-[30px] lg:hidden fill-black cursor-pointer" onClick={() => setShowHam(prev => !prev)} />

        <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 lg:hidden transition-all duration-600 ${showHam ? 'translate-x-0' : '-translate-x-full'}`}>

          <GiCrossMark className="w-[30px] h-[30px] fill-white absolute top-5 right-[4%]" onClick={() => setShowHam(prev => !prev)} />

          {/* Mobile Menu Items */}
          {!userData && <span className="px-[20px] py-[10px] border-2 border-white text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span>}

          {userData && (
            <>
              {userData && <div className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer" onClick={() => setShow(prev => !prev)}>
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>
              }
              <span className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer" onClick={handleLogout}>
                Logout
              </span>

              {userData?.role === "educator" && <span className="px-[20px] py-[10px] border-2 border-white text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer">
                Dashboard
              </span>}

              <span className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer" onClick={()=>navigate("/profile")} >
                MyProfile
              </span>

              <span className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer" >
                MyCourses
              </span>
            </>
          )}
        </div>


      </div>
    </div>
  );
};

export default Nav;