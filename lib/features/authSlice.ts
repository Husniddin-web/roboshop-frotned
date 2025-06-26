import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Admin {
  id: string
  email: string
  fullName: string
  logo?: string
  is_creator: boolean
}

interface AuthState {
  admin: Admin | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    logout: (state) => {
      state.admin = null
      state.isAuthenticated = false
      state.loading = false
      
    },
  },
})

export const { setLoading, loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
