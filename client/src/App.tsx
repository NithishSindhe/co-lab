import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import { useDispatch, useSelector} from 'react-redux'
import { setUserInfo, clearUserInfo, UserInfo } from '../features/userLogin/userInfo'

//components 
import Navbar from './components/navbar'
import Chat from './components/chat'
import Canvas from './components/canvas'
import Kanban from './components/kanban'

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        axios({
            url: "http://localhost:3000/auth",
            method: "POST",
            withCredentials: true, 
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            }
        }).then(response => {
            const data:UserInfo = {    
                accessToken: response.data?.access_token,
                userInfo: {email: response.data?.user_info?.email, profilPic: response.data?.user_info?.profile_pic, userName: response.data?.user_info?.user_name}
            }
            dispatch(setUserInfo(data))
        });
    }, []);
    return (
    <BrowserRouter>
    <div className="h-screen flex flex-col bg-white text-black"> 
      <Navbar /> 
      <div className="flex-grow overflow-y-auto overflow-scroll"> 
          <Routes>
            <Route path="/" element={<Canvas />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/kanban" element={<Kanban />} />
          </Routes>
      </div>
    </div>
    </BrowserRouter>
      )
}
export default App
