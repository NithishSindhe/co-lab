import { createSlice } from '@reduxjs/toolkit';
export const loginStatus = createSlice({
    name: 'loginStatus',
    initialState: false,
    reducers: {
        setLoginStatus:() => {
            console.log(`setting user login status to true`)
            return true
        },
        userLogout: () => {
            console.log(`setting userLogout `)
            return false
        }
    },
})
export default loginStatus.reducer;
