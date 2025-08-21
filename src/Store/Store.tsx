import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Slices/AdminUser.Slice';
import ProductOptions from './Slices/ProductOptions.Slice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    options: ProductOptions
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
