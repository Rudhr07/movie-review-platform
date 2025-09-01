import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  wishlist: [],
  isLoading: false,
  isError: false,
  message: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.wishlist = payload;
      } else if (payload && Array.isArray(payload.watchlist)) {
        // API returns { watchlist: [...], meta }
        state.wishlist = payload.watchlist;
      } else {
        state.wishlist = [];
      }
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  }
});

export const { reset, setWishlist } = userSlice.actions;
export default userSlice.reducer;
