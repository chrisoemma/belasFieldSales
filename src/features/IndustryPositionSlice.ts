import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../utils/config';
import { authHeader } from '../utils/auth-header';

export const getPositions = createAsyncThunk(
    'industriesPositions/getPositions',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/positions`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getIndustries = createAsyncThunk(
    'industriesPositions/getIndustries',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/industries`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  const IndustryPositionSlice = createSlice({
    name: 'industriesPositions',
    initialState: {
      positions: [],
      industries: null as any,
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
 
      builder.addCase(getPositions.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getPositions.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        console.log(action.payload);
  
        if (action.payload.status) {
          state.positions = action.payload.data.positions;
        }
  
        state.loading = false;
      });
      builder.addCase(getPositions.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
       // updateStatus(state, 'Something went wrong, please try again later');
        state.loading = false;
      });
  
     
      builder.addCase(getIndustries.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getIndustries.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        console.log(action.payload);
  
        if (action.payload.status) {
          state.industries = action.payload.data.industries;
        }
  
        state.loading = false;
      });
      builder.addCase(getIndustries.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        //   updateStatus(state, 'Something went wrong, please try again later');
        state.loading = false;
      });
    },
  });
  
  export const { clearMessage } = IndustryPositionSlice.actions;
  
  export default IndustryPositionSlice.reducer;