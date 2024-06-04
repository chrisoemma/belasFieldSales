import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getOpportunityStages = createAsyncThunk(
    'opportunities/getOpportunityStages',
    async ({ companyId }: any) => {
  
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/opportunities/company_opportunities_stages/${companyId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  export const getOpportunities = createAsyncThunk(
    'opportunities/getOpportunities',
    async ({ companyId }: any) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/opportunities/company_opportunities/${companyId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

const OpportunitySlice = createSlice({
    name: 'Opportunities',
    initialState: {
      Opportunities: [],
      OpportunityStages:[],
      Opportunity: {},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
        builder.addCase(getOpportunityStages.pending, state => {
             state.loading = true;
           });
           builder.addCase(getOpportunityStages.fulfilled, (state, action) => {
             if (action.payload.status) {
               state.OpportunityStages = action.payload.data.opportunity_stages;
             }
             state.loading = false;
           });
           builder.addCase(getOpportunityStages.rejected, (state, action) => {
             state.loading = false;
           });

           builder.addCase(getOpportunities.pending, state => {
            state.loading = true;
          });
          builder.addCase(getOpportunities.fulfilled, (state, action) => {
            if (action.payload.status) {
              state.Opportunities = action.payload.data.opportunities;
            }
            state.loading = false;
          });
          builder.addCase(getOpportunities.rejected, (state, action) => {
            state.loading = false;
          });
    },
});

export const { clearMessage } = OpportunitySlice.actions;

export default OpportunitySlice.reducer;