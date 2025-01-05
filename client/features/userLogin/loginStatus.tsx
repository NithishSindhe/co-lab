import { createSlice } from '@reduxjs/toolkit';
export const loginStatus = createSlice({
    name: 'loginStatus',
    initialState: false,
    reducers: {
        setLoginStatus:() => {
            console.log(`loginStatu: setting user login status to true`)
            return true
        },
        userLogout: () => {
            console.log(`loginStatu: setting userLogout `)
            return false
        }
    },
})

export const { setLoginStatus, userLogout } = loginStatus.actions;
export default loginStatus.reducer;
