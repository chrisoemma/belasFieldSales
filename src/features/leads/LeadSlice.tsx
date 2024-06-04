import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getLeadStatus = createAsyncThunk(
    'leads/getLeadStatus',
    async ({ companyId }: any) => {
  
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/leads/company_lead_statuses/${companyId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  export const getLeads = createAsyncThunk(
    'leads/getLeads',
    async ({ companyId }: any) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/leads/company_leads/${companyId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

const LeadSlice = createSlice({
    name: 'leads',
    initialState: {
      leads: [],
      leadStatuses:[],
      lead: {},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
        builder.addCase(getLeadStatus.pending, state => {
             state.loading = true;
           });
           builder.addCase(getLeadStatus.fulfilled, (state, action) => {
             if (action.payload.status) {
               state.leadStatuses = action.payload.data.lead_statuses;
             }
             state.loading = false;
           });
           builder.addCase(getLeadStatus.rejected, (state, action) => {
             state.loading = false;
           });


           builder.addCase(getLeads.pending, state => {
            state.loading = true;
          });
          builder.addCase(getLeads.fulfilled, (state, action) => {
            if (action.payload.status) {
              state.leads = action.payload.data.leads;
            }
            state.loading = false;
          });
          builder.addCase(getLeads.rejected, (state, action) => {
            state.loading = false;
          });
    },
});

export const { clearMessage } = LeadSlice.actions;

export default LeadSlice.reducer;