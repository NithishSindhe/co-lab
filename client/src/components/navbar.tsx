import { useState } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import logo from '../assets/colab_logo.jpeg'
import axios, {AxiosResponse} from 'axios';
import noprofile from '../assets/noProfile.png'
import { setProfile, clearProfile } from '../../features/userLogin/userLoginSlice'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { FaChevronDown } from "react-icons/fa6"
import { motion } from "framer-motion";

//interfaces 
import { Profile } from '../../features/userLogin/userLoginSlice'
import type { RootState, AppDispatch } from '../store';
interface CredentialResponse {
  credential?: string; // The ID token (JWT)
  clientId?: string;
  select_by?: string;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

function Navbar() {
    const navigate = useNavigate();
    const [expand, setExpand] = useState<boolean>(false)
    const profile: Profile = useSelector((state: RootState) => state.profile);
    const loginStatus: boolean = useSelector((state: RootState) => state.loginStatus);
    const dispatch: AppDispatch = useDispatch();
    const [ProfileExpand, setProfileExpand] = useState<boolean>(false)
    const login = useGoogleLogin({
        onSuccess: (codeResponse:CredentialResponse) => {
            console.log(codeResponse)
            const options = {
              url: 'http://localhost:3000/userlogin',
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
              },
              data: {
                    'access_token' : codeResponse.access_token
              }
            };
            axios(options)
              .then(response => {
                dispatch(setProfile({name:response.data.name, picture: response.data.picture}));
                dispatch(setLoginStatus())
              });
        },
        onError: (error) => console.log('Login Failed:', error)
    });
    const logOut = () => {
        googleLogout();
        dispatch(clearProfile());
    };
    const goToChat = () => {
        navigate('/chat'); 
    };
    const goHome = () => {
        navigate('/'); 
    };
    const goKanban = () => {
        navigate('/kanban');
    }
    const li_link_syle = "w-full block py-2 px-3 hover:text-primary-light text-gray-900 rounded focus:bg-primary focus:hover:bg-primary focus:hover:text-white md:border-0 text-white md:hover:text-primary-light md:p-1" 
    return <nav className="bg-white border-gray-200 dark:bg-primary-dark">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} className="h-8" alt="Co-Lab logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CoLab</span>
        </a>
        <button
          onClick={() => setExpand((prev) => !prev)}
          type="button"
          className="inline-flex items-center p-0 w-10 h-10 justify-center text-sm text-gray-500 rounded-full md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
            <img className="block md:hidden h-10 rounded-full text-white" src={profile.picture || noprofile} alt="Avatar" />
        </button>
        <div
          className={` transition-all ease-in-out duration-200 ${
            expand ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
          } w-full md:block md:w-auto`}
          id="navbar-default" >
          <ul className="pointer-events-auto font-medium flex flex-col p-4 md:p-0 mt-4 border border-border-color rounded-lg bg-primary md:flex-row md:justify-center md:items-center md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-primary-dark md:dark:bg-primary-dark dark:border-border-color">
            <motion.li whileTap={{ scale: 0.8 }} >
              <a
                onClick={goHome}
                href="#"
                className={li_link_syle}>
                Home
              </a>
            </motion.li>
            <motion.li whileTap={{ scale: 0.8 }} >
              <a
                onClick={goKanban}
                href="#"
                className={li_link_syle}>
                Kanban
              </a>
            </motion.li>
            <motion.li whileTap={{ scale: 0.8 }} >
              <a onClick={goToChat} href=""
                className={li_link_syle}>
                Chat
              </a>
            </motion.li>
            <li className="relative">
              <span
                onClick={() => setProfileExpand((prev) => !prev)}
                className='hidden md:block flex items-center w-full py-0 px-0 text-gray-900 bg-transparent rounded border-0 bg-transparent text-white cursor-pointer'
              >
                {profile?.name ? <span className='inline-block'>{profile.name}<FaChevronDown/></span>:<span 
                                onClick={() => {login()}}
                                className='w-full block py-2 px-3 text-gray-900 rounded bg-transparent md:border-0 text-white md:hover:border-0 md:hover:text-primary-light md:p-1'>Sign in</span>}
              </span>
             {/*logout drop down only for bigger screens */}
              <div
                className={`absolute left-0 z-50 mt-2 w-44 rounded-lg shadow bg-white dark:bg-gray-700 transition-all ease-in-out duration-200 ${
                  (ProfileExpand && profile?.name) ? 'block' : 'hidden' } `}>
                <span onClick={() => {logOut()}} className='block px-4 py-2 w-full bg-primary rounded-md hover:border-1 text-white cursor-pointer'>
                  Log out
                </span>
              </div>
            </li>
            <li>
                <div className='hidden md:flex items-center h-8'> 
                  <img className='hidden md:block h-8 rounded-full text-white' src={profile.picture || noprofile} alt='Avatar' />
                </div>
            </li>
            {/* below element for small screens only */}
            <li>
                { profile?.name ? <span onClick={() => {logOut()}}
                className="block w-full md:hidden py-2 px-3 text-gray-900 bg-transparent focus:bg-primary rounded-lg  dark:text-white dark:hover:text-primary-light cursor-pointer " >
                    Log out
                </span>:<span onClick={() => {login()}}
                className="block w-full md:hidden py-2 px-3 text-gray-900 bg-transparent focus:bg-primary rounded-lg  dark:text-white dark:hover:text-primary-light cursor-pointer " >
                    Sign in
                </span>}
            </li>
          </ul>
        </div>
      </div>
    </nav>

}

export default Navbar
