import { useState } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import logo from '../assets/colab_logo.jpeg'
import axios, {AxiosResponse} from 'axios';
import noprofile from '../assets/noProfile.png'
import { setProfile, clearProfile } from '../../features/userLogin/userLoginSlice'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

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

    return <nav className="bg-white border-gray-200 dark:bg-gray-900">
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
            <img className="block md:hidden h-10 rounded-full" src={profile.picture || noprofile} alt="user pic" />
        </button>
        <div
          className={` transition-all ease-in-out duration-200 ${
            expand ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
          } w-full md:block md:w-auto`}
          id="navbar-default" >
          <ul className="pointer-events-auto font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:justify-center md:items-center md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                onClick={goHome}
                href="#"
                className="w-full block py-2 px-3 text-gray-900 rounded focus:bg-blue-700 focus:hover:bg-blue-700 focus:hover:text-white md:border-0 text-white md:hover:text-blue-500 md:p-1"
              >
                Home
              </a>
            </li>
            <li>
              <a onClick={goToChat} href="#"
                className="w-full block py-2 px-3 text-gray-900 rounded focus:bg-blue-700 focus:hover:bg-blue-700 focus:hover:text-white md:border-0 text-white md:hover:text-blue-500 md:p-1" >
                Chat
              </a>
            </li>
            <li className="relative">
              <button
                onClick={() => setProfileExpand((prev) => !prev)}
                className={`hidden md:block flex items-center w-full py-0 px-0 text-gray-900 bg-transparent rounded border-0 bg-transparent text-white`}
              >
                {profile?.name ? <span className='inline-block'>{profile.name}<svg
                  className="inline-block w-2.5 h-2.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg></span>:<button 
                                onClick={() => {login()}}
                                className='w-full block py-2 px-3 text-gray-900 rounded bg-transparent md:border-0 text-white md:hover:border-0 md:hover:text-blue-500 md:p-1'>Sign in</button>}
              </button>
             {/*logout drop down only for bigger screens */}
              <div
                className={`absolute left-0 z-50 mt-2 w-44 rounded-lg shadow bg-white dark:bg-gray-700 transition-all ease-in-out duration-200 ${
                  (ProfileExpand && profile?.name) ? 'block' : 'hidden' } `}>
                <button onClick={() => {logOut()}} className="block px-4 py-2 w-full bg-gray-700 rounded-md hover:bg-gray-600 text-white">
                  Log out
                </button>
              </div>
            </li>
            <li>
              <img className="hidden md:block h-8 rounded-full" src={profile.picture || noprofile} alt="user pic" />
            </li>
            {/* below element for small screens only */}
            <li>
                { profile?.name ? <button onClick={() => {logOut()}}
                className="block w-full md:hidden py-2 px-3 text-gray-900 hover:bg-gray-100 bg-transparent bg-blue-700 focus:hover:bg-blue-700 rounded-lg focus:bg-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white " >
                    Log out
                </button>:<button onClick={() => {login()}}
                className="block w-full md:hidden py-2 px-3 text-gray-900 hover:bg-gray-100 bg-transparent bg-blue-700 focus:hover:bg-blue-700 rounded-lg focus:bg-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white " >
                    Sign in
                </button>}
            </li>
          </ul>
        </div>
      </div>
    </nav>

}

export default Navbar
