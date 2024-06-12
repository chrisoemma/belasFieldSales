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


  export const addOpportunity = createAsyncThunk(
    'opportunities/addOpportunity',
    async ({ data }: any) => {
      const response = await fetch(`${API_URL}/opportunities`, {
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



  export const deleteOpportunity = createAsyncThunk(
    'opportunities/deleteOpportunity',
    async ({ opportunityId,data }: any) => {
   
      try {
        const header: any = await authHeader();
        const response = await fetch(`${API_URL}/opportunities/${opportunityId}`, {
          method: 'DELETE',
          headers: header,
          body: JSON.stringify(data),
        });
  
        if (!response.status) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete opportunity');
        }
  
        return (await response.json());
      } catch (error) {
        throw error;
      }
    }
  );
  
  
  
  export const updateOpportunity = createAsyncThunk(
    'opportunities/updateOpportunity',
    async ({ data, opportunityId }: any) => {
 
      const response = await fetch(`${API_URL}/opportunities/${opportunityId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return (await response.json());
    }
  );


  export const updateOpportunityStage = createAsyncThunk(
    'opportunities/updateOpportunityStage',
    async ({ data, opportunityId }: any) => {
 
      const response = await fetch(`${API_URL}/opportunities/change_opportunity_stage/${opportunityId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return (await response.json());
    }
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



              //create opportunity
    builder.addCase(addOpportunity.pending, state => {
      console.log('Pending');
      state.loading = true;
      //updateStatus(state, '');
    });
    builder.addCase(addOpportunity.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.Opportunity = { ...action.payload.data.opportunity };
        state.Opportunities = [...state.Opportunities, { ...action.payload.data.opportunity }]
  
      } else {
        updateStatus(state, action.payload.status);
      }
      state.loading = false;
      updateStatus(state, '');

    });
    builder.addCase(addOpportunity.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });


    //
    
    builder.addCase(deleteOpportunity.pending, (state) => {
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(deleteOpportunity.fulfilled, (state, action) => {
      console.log('Delete Employee Fulfilled');
      const deletedOpportunityId = action.payload.data.opportunity.id;

      state.Opportunities = state.Opportunities.filter((opportunity) => opportunity.id !== deletedOpportunityId);

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(deleteOpportunity.rejected, (state, action) => {
      console.log('Delete opportunity Rejected');
      state.loading = false;
      updateStatus(state, '');
    });
    //update opportunity
    builder.addCase(updateOpportunity.pending, (state) => {
      console.log('Update opportunity Pending');
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateOpportunity.fulfilled, (state, action) => {
      const updatedopportunity = action.payload.data.opportunity;

      const opportunityIndex = state.Opportunities.findIndex((opportunity) => opportunity.id === updatedopportunity.id);
  
      if (opportunityIndex !== -1) {
        state.Opportunities = [
          ...state.Opportunities.slice(0, opportunityIndex),
          updatedopportunity,
          ...state.Opportunities.slice(opportunityIndex + 1),
        ];
      }

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(updateOpportunity.rejected, (state, action) => {
      console.log('Update opportunity Rejected');
      state.loading = false;
      updateStatus(state, '');
    });


    //change opportunity status

    builder.addCase(updateOpportunityStage.pending, (state) => {
      console.log('Update opportunity Pending');
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateOpportunityStage.fulfilled, (state, action) => {
      const updatedopportunity = action.payload.data.opportunity;

      const opportunityIndex = state.Opportunities.findIndex((opportunity) => opportunity.id === updatedopportunity.id);
  
      if (opportunityIndex !== -1) {
        state.Opportunities = [
          ...state.Opportunities.slice(0, opportunityIndex),
          updatedopportunity,
          ...state.Opportunities.slice(opportunityIndex + 1),
        ];
      }

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(updateOpportunityStage.rejected, (state, action) => {
      console.log('Update opportunity Rejected');
      state.loading = false;
      updateStatus(state, '');
    });

    },
});

export const { clearMessage } = OpportunitySlice.actions;

export default OpportunitySlice.reducer;