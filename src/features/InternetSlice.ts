import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: true,
};

const InternetSlice = createSlice({
  name: 'internet',
  initialState,
  reducers: {
    updateInternetConnectivity: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { updateInternetConnectivity } = InternetSlice.actions;

export default InternetSlice.reducer;
