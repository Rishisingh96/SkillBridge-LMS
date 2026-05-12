import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './page/Home'
import SignUp from './page/SignUp'
import Login from './page/Login'

export const serverUrl = "http://localhost:8000"
import { ToastContainer } from 'react-toastify';
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './page/Profile'
import ForgetPassword from './page/ForgetPassword'
import EditProfile from './page/EditProfile'



function App() {
    getCurrentUser()
    const {userData} = useSelector(state => state.user)
    console.log("App.jsx userData:", userData)
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/signup' element = {!userData? <SignUp/> : <Navigate to='/' />}/>
        <Route path='/login' element = {<Login/>}/>

        <Route path='/profile' element = {userData ? <Profile/> : <Navigate to='/signup' />}/>

        <Route path='/forget-password' element = {userData ? <ForgetPassword/> : <Navigate to='/signup' />}/>

         <Route path='/editprofile' element = {userData ? <EditProfile/> : <Navigate to='/signup' />}/>

      </Routes>
    </>
  )
}

export default App
