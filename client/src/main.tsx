import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Provider } from 'react-redux';
import store from './store'

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId='363397105223-8s8mjcmb56sncjsll8tuvchvcjgcik8u.apps.googleusercontent.com'>
        <StrictMode>
            <Provider store={store}>
                <App/>
            </Provider>
        </StrictMode>
    </GoogleOAuthProvider>
)
