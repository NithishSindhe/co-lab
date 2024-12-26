import { createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Profile {
    email?: string;
    family_name?: string;
    given_name?: string;
    name?: string;
    id?: string;
    picture?: string;
    verified_email?: boolean;
}

const initialState:Profile = {}

export const profileSlice = createSlice({
    name: 'profileSlice',
    initialState: initialState,
    reducers: {
        //@ts-ignore
        setProfile: (state: Profile, action: PayloadAction<Profile>) => {
            console.log(action.payload)
            return action.payload; // update the state
        },
        clearProfile: () => {
          return {};
        }
    },
});

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

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
