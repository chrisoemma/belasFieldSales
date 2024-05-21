import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const punchIn = createAsyncThunk(
    'punchRecords/punchIn',
    async ({ data, userId }: any) => {
      
        const response = await fetch(`${API_URL}/punch_records/punch_in/${userId}`, {
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


  export const punchOut = createAsyncThunk(
    'punchRecords/punchOut',
    async ({ data, userId }: any) => {
      
        const response = await fetch(`${API_URL}/punch_records/punch_out/${userId}`, {
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


  export const getPunchRecordsByDateRange = createAsyncThunk(
    'punchRecords/getPunchRecordsByDateRange',
    async ({ data, userId }: any) => {
          console.log('dataaa',data)
          console.log('userId',userId)
        const response = await fetch(`${API_URL}/punch_records/get_user_punch_records_by_date_range/${userId}`, {
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

  export const getTodayPunchRecords = createAsyncThunk(
    'punchRecords/getTodayPunchRecords',
    async (userId) => {
  
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/punch_records/today_punch_records/${userId}`, {
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

  const PunchRecordsSlice = createSlice({
    name: 'PunchRecords',
    initialState: {
      PunchRecords: [],
      todayPunchRecords:[],
      punchRecordsByDateRange:[],
      isPunchedIn:false,
      PunchRecord:{},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
      setIsPunchedIn: (state, action) => {
        state.isPunchedIn = action.payload;
      },
      setPunchInTimer: (state, action) => {
        state.punchInTimer = action.payload;
      },
    },
    extraReducers: builder => {
        

        //PunchIn
      builder.addCase(punchIn.pending, state => {
        console.log('Pending');
        state.loading = true;
        updateStatus(state, '');
    });
    builder.addCase(punchIn.fulfilled, (state, action) => {
        
        updateStatus(state, '');
        if (action.payload.status) {
            state.PunchRecord = { ...action.payload.data.punch_record };
            state.PunchRecords=[...state.PunchRecords,{...action.payload.data.PunchRecord}]
            state.isPunchedIn=true
            updateStatus(state, '');
        } else {
            updateStatus(state, action.payload.status);
        }
        state.loading = false;
    });
    builder.addCase(punchIn.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
        updateStatus(state, '');
    });


    //PunchOut
    builder.addCase(punchOut.pending, state => {
        console.log('Pending');
        state.loading = true;
        updateStatus(state, '');
    });
    builder.addCase(punchOut.fulfilled, (state, action) => {
        
      

        if (action.payload.status) { 
          state.isPunchedIn=false
            const updatedPunchRecord = action.payload.data.punch_record;
            const  punchRecordIndex = state.PunchRecords.findIndex((punchRecord) => punchRecord.id === updatedPunchRecord.id);
              
            if (punchRecordIndex !== -1) {      
                state.PunchRecords = [
                    ...state.PunchRecords.slice(0, punchRecordIndex),
                    updatedPunchRecord,
                    ...state.PunchRecords.slice(punchRecordIndex + 1),
                ];
            }
          }
          updateStatus(state, '');
    
        state.loading = false;
    });
    builder.addCase(punchOut.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
        updateStatus(state, '');
    });


    //Punch records by date Range
    builder.addCase(getPunchRecordsByDateRange.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
  });
  builder.addCase(getPunchRecordsByDateRange.fulfilled, (state, action) => {
      
      updateStatus(state, '');
      if (action.payload.status) {
          state.punchRecordsByDateRange=action.payload.data.punchRecords;
        
          updateStatus(state, '');
      } else {
          updateStatus(state, action.payload.status);
      }
      state.loading = false;
  });
  builder.addCase(getPunchRecordsByDateRange.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
  });


    
    builder.addCase(getTodayPunchRecords.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getTodayPunchRecords.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        if (action.payload.status) {
          state.todayPunchRecords = action.payload.data.todayPunchRecords;
        }
        state.loading = false;
      });
      builder.addCase(getTodayPunchRecords.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
      });

    },
});

export const { clearMessage,setIsPunchedIn,setPunchInTimer } = PunchRecordsSlice.actions;

export default PunchRecordsSlice.reducer;