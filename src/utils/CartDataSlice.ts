import { createSlice } from '@reduxjs/toolkit'

interface CartState  {
  cartData: {
    counts: number,
    total: number,
  }
}

const initialState : CartState = {
  cartData: {
    counts: 0,
    total: 0,
  }
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload
    }
  },
})

export const { setCartData } = cartSlice.actions
export const CartReducer = cartSlice.reducer
