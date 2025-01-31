import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../features/userLogin/userLoginSlice';
import loginStatusReducer from '../features/userLogin/loginStatus';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    loginStatus: loginStatusReducer,
    // Add other reducers here as needed
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
