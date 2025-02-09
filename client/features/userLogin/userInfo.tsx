import { createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserInfo {
    accessToken: string;
    userInfo: {email: string; profilPic: string; userName: string;}
}

const noUserInfo:null = null

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: noUserInfo,
    reducers: {
        setUserInfo: (state:UserInfo|null, action:PayloadAction<UserInfo>) => {
            return action.payload;
        },
        clearUserInfo: (state) => {
            return noUserInfo; // Reset to initial state (null)
        }
    }
});
export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
