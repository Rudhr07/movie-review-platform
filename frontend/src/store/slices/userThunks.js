import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import { setWishlist } from './userSlice';

export const fetchWishlist = createAsyncThunk(
  'user/fetchWishlist',
  async (userId, thunkAPI) => {
    try {
      const response = await userService.getWatchlist(userId);
      thunkAPI.dispatch(setWishlist(response.data));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);
