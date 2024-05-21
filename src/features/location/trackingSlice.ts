// trackingSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create an async thunk for updating the location in Firestore
export const updateLocation = createAsyncThunk('tracking/updateLocation', async (locationData, { dispatch }) => {
  // You can send location data to Firestore here
  // Use the `locationData` parameter to access latitude and longitude
  // Update the trackingSlice state here as needed
  // Example:
  // const { latitude, longitude } = locationData;
  // dispatch(trackingSlice.actions.updateCurrentLocation({ latitude, longitude }));
});

const trackingSlice = createSlice({
  name: 'tracking',
  initialState: {
    currentLocation: {}, // The current user location
    previousLocation: {}, // The previous user location
    isTracking: false, // Whether tracking is enabled
  },
  reducers: {
    toggleTrackingLocation: (state) => {
      state.isTracking = !state.isTracking;
    },
    updateCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    updatePreviousLocation: (state, action) => {
      state.previousLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle the updateLocation async thunk success case if needed
    builder.addCase(updateLocation.fulfilled, (state, action) => {
      // Handle success if necessary
    });
  },
});

export const { toggleTrackingLocation, updateCurrentLocation, updatePreviousLocation } = trackingSlice.actions;

export default trackingSlice.reducer;
