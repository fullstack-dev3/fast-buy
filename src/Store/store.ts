'use client'

import { configureStore } from '@reduxjs/toolkit';
import { CartReducer } from '@/utils/CartDataSlice';
import { UserReducer } from '@/utils/UserDataSlice';

export const store = configureStore({
  reducer: {
    Cart: CartReducer,
    User : UserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
