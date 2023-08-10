import { createSlice } from '@reduxjs/toolkit'

interface AdminDataState  {
  adminData: {
    users: number,
    products: number,
    categories: number,
    pendingOrders: number,
    completedOrders: number,
    monthOrders: number,
  }
}

const initialState : AdminDataState = {
  adminData: {
    users: 0,
    products: 0,
    categories: 0,
    pendingOrders: 0,
    completedOrders: 0,
    monthOrders: 0,
  }
}

export const adminDataSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    setAdminData: (state, action) => {
      state.adminData = action.payload
    }
  },
})

export const { setAdminData } = adminDataSlice.actions
export const AdminDataReducer = adminDataSlice.reducer
