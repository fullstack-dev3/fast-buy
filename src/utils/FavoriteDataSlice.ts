import { createSlice } from '@reduxjs/toolkit'

interface FavoriteState {
  favoriteData: string[]
}

const initialState : FavoriteState = {
  favoriteData: []
}

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavoriteData: (state, action) => {
      state.favoriteData = action.payload
    }
  },
});

export const { setFavoriteData } = favoriteSlice.actions
export const FavoriteReducer = favoriteSlice.reducer
