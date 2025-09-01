import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService } from '../../services/movieService';

const initialState = {
  movies: [],
  currentMovie: null,
  isLoading: false,
  isError: false,
  message: ''
};

// Get all movies
export const getMovies = createAsyncThunk(
  'movies/getAll',
  async (params, thunkAPI) => {
    try {
      return await movieService.getMovies(params);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single movie
export const getMovie = createAsyncThunk(
  'movies/getOne',
  async (id, thunkAPI) => {
    try {
      return await movieService.getMovie(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.movies = action.payload.data.movies;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.movies = [];
      })
      .addCase(getMovie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentMovie = action.payload.data.movie;
      })
      .addCase(getMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.currentMovie = null;
      });
  }
});

export const { reset, clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer;