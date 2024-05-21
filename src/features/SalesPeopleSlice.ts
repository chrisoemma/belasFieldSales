import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../utils/config';
import { authHeader } from '../utils/auth-header';

export const getSalesPeople = createAsyncThunk(
    'sales/getSalesPeople',
    async ({companyId,userId}:any) => {
        
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/users/sales_people/${companyId}/${userId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

 

  const SalesPeopleSlice = createSlice({
    name: 'salesPeople',
    initialState: {
      salesPeople: [],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
 
      builder.addCase(getSalesPeople.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getSalesPeople.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        console.log(action.payload);
  
        if (action.payload.status) {
          state.salesPeople = action.payload.data;
        }

        state.loading = false;
      });
      builder.addCase(getSalesPeople.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
       // updateStatus(state, 'Something went wrong, please try again later');
        state.loading = false;
      });

    },
  });
  
  export const { clearMessage } = SalesPeopleSlice.actions;
  
  export default SalesPeopleSlice.reducer;