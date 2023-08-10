'use client'

import { configureStore } from '@reduxjs/toolkit';
import { CartReducer } from '@/utils/CartDataSlice';
import { UserReducer } from '@/utils/UserDataSlice';
import { FavoriteReducer } from '@/utils/FavoriteDataSlice';
import { AdminDataReducer } from '@/utils/AdminDataSlice';

export const store = configureStore({
  reducer: {
    Cart: CartReducer,
    Favorite: FavoriteReducer,
    User: UserReducer,
    AdminData: AdminDataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
