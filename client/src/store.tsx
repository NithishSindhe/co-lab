import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from '../features/userLogin/userInfo';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    // Add other reducers here as needed
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
