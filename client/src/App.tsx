import './App.css'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useState,useEffect } from 'react'
import axios from 'axios';
import type { RootState, AppDispatch } from './store';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


//components 
//import TreeExample from './components/folderTree'
import Navbar from './components/navbar'

//actions 
import { setProfile, clearProfile } from '../features/userLogin/userLoginSlice'

//types and interfaces 
import { Profile } from '../features/userLogin/userLoginSlice'
interface CredentialResponse {
  credential?: string; // The ID token (JWT)
  clientId?: string;
  select_by?: string;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

function App() {
    const [ user, setUser ] = useState<CredentialResponse | null>();
    const profile: Profile = useSelector((state: RootState) => state.profile);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
            if (user?.access_token) {
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        dispatch(setProfile(res.data));
                    })
                    .catch((err) => console.log(err));
            }else{
                console.log('user does not exist')
                console.log(user)
        }
        }, [ user ]);
    //const responseMessage = (response) => {
    //    console.log(response);
    //    return <TreeExample data={data}/>
    //};
    //@ts-ignore
    const errorMessage = (error:unknown) => {
        console.log(error);
    };
    //@ts-ignore
    const data = {
        name: 'root',
        toggled: true,
        children: [
            {
                name: 'parent',
                children: [
                    { name: 'child1' },
                    { name: 'child2' }
                ]
            },
            {
                name: 'loading parent',
                loading: true,
                children: []
            },
            {
                name: 'parent',
                children: [
                    {
                        name: 'nested parent',
                        children: [
                            { name: 'nested child 1' },
                            { name: 'nested child 2' }
                        ]
                    }
                ]
            }
        ]
    };
    const login = useGoogleLogin({
        onSuccess: (codeResponse:CredentialResponse) => {
            setUser(codeResponse)
        },
        onError: (error) => console.log('Login Failed:', error)
    });
    const logOut = () => {
        googleLogout();
        dispatch(clearProfile());
    };
    const Main_page = () => {
        return <>
            <h1 className='text-slate-950 bold'>Welcome to CoLab</h1>
            <div>
                <br />
                {(Object.keys(profile).length) ? (
                    <div className="text-left" >
                        <img src={profile.picture} alt="user image" />
                        <h3>User Logged in</h3>
                        <p>Name: {profile.name}</p>
                        <p>Email Address: {profile.email}</p>
                        <br />
                        <br />
                        <div className="text-center">
                            <button  onClick={logOut}>Log out</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => login()}>Sign in with Google 🚀 </button>
                )}
        </div>
        </>
    }
    return (
    <div className='h-full w-full bg-white'>
        <Navbar/>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main_page/>} />
          </Routes>
        </BrowserRouter>
    </div>
      )
}
//{main_page()}
export default App
