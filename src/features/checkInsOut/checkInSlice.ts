import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const createCheckIn = createAsyncThunk(
    'checkIns/createCheckIn',
    async ({ data, userId }: any) => {
      
        const response = await fetch(`${API_URL}/check_ins/create_check_in/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    },
  );



  export const CheckOut = createAsyncThunk(
    'checkIns/CheckOut',
    async ({ data, checkInId }: any) => {
      
        const response = await fetch(`${API_URL}/check_ins/check_out/${checkInId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    },
  );

  export const getUserCheckIns = createAsyncThunk(
    'checkIns/getUserCheckIns',
    async ({requestType,userId }: any) => {
  
       console.log('userTypeee',requestType)
       console.log('userididididd',userId)
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/check_ins/checks_ins_outs_by_user/${requestType}/${userId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  export const getCompanyCheckIns = createAsyncThunk(
    'checkIns/getCompanyCheckIns',
    async ({companyId }: any) => {
  
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/check_ins/company_checkIns/${companyId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  function updateStatus(state: any, status: any) {
    if (status === '' || status === null) {
        state.status = '';
        return;
    }
  
    if (status.error) {
        state.status = status.error;
        return;
    }
  
    state.status = 'Request failed. Please try again.';
    return;
  }

  const CheckInSlice = createSlice({
    name: 'checkIns',
    initialState: {
      checkIns: [],
      checkOuts:[],
      checkIn:{},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => { 

      builder.addCase(getUserCheckIns.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getUserCheckIns.fulfilled, (state, action) => {
        console.log('Fulfilled case',action.payload);
        if (action.payload.status) {
          state.checkIns = action.payload.data.checks;
        }
        state.loading = false;
      });
      builder.addCase(getUserCheckIns.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
      });


      builder.addCase(getCompanyCheckIns.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getCompanyCheckIns.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        if (action.payload.status) {
          state.checkIns = action.payload.data.checks;
        }
        state.loading = false;
      });
      builder.addCase(getCompanyCheckIns.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
      });

      //create checkIn
      builder.addCase(createCheckIn.pending, state => {
        console.log('Pending12234545');
        state.loading = true;
        updateStatus(state, '');
    });
    builder.addCase(createCheckIn.fulfilled, (state, action) => {
        
      
        state.loading = false;
        updateStatus(state, '');

        if (action.payload.status) {
            state.checkIn = { ...action.payload.data.checkIn };
            updateStatus(state, '');
        } else {
            updateStatus(state, action.payload.status);
        }

        state.checkIns.push(state.checkIn);

    });
    builder.addCase(createCheckIn.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
        updateStatus(state, '');
    });


    ///checkout 

    builder.addCase(CheckOut.pending, (state) => {
      console.log('Update sTATUS Pending');
      state.loading = true;
      updateStatus(state, '');
    });


    builder.addCase(CheckOut.fulfilled, (state, action) => {
      console.log('Update Task Fulfilled');
      console.log('request', action.payload);

      const updatedCheckIn = action.payload.data.checkIn;
      const status = updatedCheckIn.status;

     

   
      const checkInIndex = state.checkIns.findIndex(
        (checkIn) => checkIn.id === updatedCheckIn.id
      );

      console.log('statttses', checkInIndex);
      if (checkInIndex !== -1) {
        // if (['Rescheduled'].includes(status)) {
        //   // Update the request in activeRequests
        //   //'In Progress', 'Completed', 'Rescheduled', 'Canceled'
        //   state.checkIns = [
        //     ...state.checkIns.slice(0, checkInIndex),
        //     updatedCheckIn,
        //     ...state.checkIns.slice(checkInIndex + 1),
        //   ];
        // } else 
        
        if (['Completed', 'Rescheduled', 'Canceled'].includes(status)) {
          // Remove the request from activeRequests
          state.checkIns = [
            ...state.checkIns.slice(0, checkInIndex),
            ...state.checkIns.slice(checkInIndex + 1),
          ];

        
          state.checkOuts = [...state.checkOuts, updatedCheckIn];
        }
      }

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(CheckOut.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });

     },
});


export const { clearMessage } = CheckInSlice.actions;

export default CheckInSlice.reducer;