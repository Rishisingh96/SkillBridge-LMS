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
import Dashboard from './page/Educator/Dashboard'
import Courses from './page/Educator/Courses'
import CreateCourse from './page/Educator/CreateCourse'
import EditCourse from './page/Educator/EditCourse'
import getCreatorCourse from './customHooks/getCreatorCourse'
import getPublishedCourse from './customHooks/getPublishedCourse'
import AllCourses from './page/AllCourses'
import CreateLecture from './page/Educator/CreateLecture'
import EditLecture from './page/Educator/EditLecture'

function App() {

    getCurrentUser()
    getCreatorCourse()
    getPublishedCourse()
    const {userData} = useSelector(state => state.user)
    console.log("App.jsx userData:", userData)
  return (
    <>
    <ToastContainer />
      <Routes>

        {/* this is for Authentication */}
        <Route path='/' element = {<Home/>}/>
        <Route path='/signup' element = {!userData? <SignUp/> : <Navigate to='/' />}/>
        <Route path='/login' element = {<Login/>}/>

        <Route path='/profile' element = {userData ? <Profile/> : <Navigate to='/signup' />}/>

        <Route path='/forget-password' element = {userData ? <ForgetPassword/> : <Navigate to='/signup' />}/>

         <Route path='/editprofile' element = {userData ? <EditProfile/> : <Navigate to='/signup' />}/>

        {/* For Educators */}
         <Route path='/dashboard' element = {userData ?.role === 'educator' ? <Dashboard/> : <Navigate to='/signup' />}/>

        <Route path='/courses' element = {userData ?.role === 'educator' ? <Courses/> : <Navigate to='/signup' />}/>

        <Route path='/allcourses' element = {userData ? <AllCourses/> : <Navigate to='/signup' />}/>

        <Route path='/create-course' element = {userData ?.role === 'educator' ? <CreateCourse/> : <Navigate to='/signup' />}/>

        <Route path='/edit-course/:courseId' element = {userData ?.role === 'educator' ? <EditCourse/> : <Navigate to='/signup' />}/>

        {/* Lectures */}
        <Route path='/createlecture/:courseId' element = {userData ?.role === 'educator' ? <CreateLecture/> : <Navigate to='/signup' />}/>

         <Route path='/editlecture/:courseId/:lectureId' element = {userData ?.role === 'educator' ? <EditLecture/> : <Navigate to='/signup' />}/>

      </Routes>
    </>
  )
}

export default App
