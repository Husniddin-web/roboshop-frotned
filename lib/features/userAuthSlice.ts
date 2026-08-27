import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CustomerUser {
  id: number | string;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  photoUrl?: string;
  language?: string;
}

interface UserAuthState {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: UserAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    customerLoginSuccess: (
      state,
      action: PayloadAction<{ user: CustomerUser; token?: string }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      state.isAuthenticated = true;
      state.loading = false;
    },
    updateCustomerProfile: (
      state,
      action: PayloadAction<Partial<CustomerUser>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    customerLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const {
  setUserLoading,
  customerLoginSuccess,
  updateCustomerProfile,
  customerLogout,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
