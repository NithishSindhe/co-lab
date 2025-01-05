import { createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Profile {
    name?: string;
    picture?: string;
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


export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
