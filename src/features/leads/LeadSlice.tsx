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

  export const addLead = createAsyncThunk(
    'leads/addLead',
    async ({ data }: any) => {
      const response = await fetch(`${API_URL}/leads`, {
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


  export const deleteLead = createAsyncThunk(
    'leads/deleteLead',
    async ({ leadId }: any) => {
     
      try {
        const header: any = await authHeader();
        const response = await fetch(`${API_URL}/leads/${leadId}`, {
          method: 'DELETE',
          headers: header,
        });
  
        if (!response.status) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete lead');
        }
  
        return (await response.json());
      } catch (error) {
        throw error;
      }
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
  
  
  export const updateLead = createAsyncThunk(
    'leads/updateLead',
    async ({ data, leadId }: any) => {
 
      const response = await fetch(`${API_URL}/leads/${leadId}`, {
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



                        //create lead
    builder.addCase(addLead.pending, state => {
      console.log('Pending');
      state.loading = true;
      //updateStatus(state, '');
    });
    builder.addCase(addLead.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.lead = { ...action.payload.data.lead };
        state.leads = [...state.leads, { ...action.payload.data.lead }]
  
      } else {
        updateStatus(state, action.payload.status);
      }
      state.loading = false;
      updateStatus(state, '');

    });
    builder.addCase(addLead.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });

    //
    builder.addCase(deleteLead.pending, (state) => {
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(deleteLead.fulfilled, (state, action) => {
      console.log('Delete Employee Fulfilled');
      const deletedLeadId = action.payload.data.lead.id;

      state.leads = state.leads.filter((lead) => lead.id !== deletedLeadId);

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(deleteLead.rejected, (state, action) => {
      console.log('Delete lead Rejected');
      state.loading = false;
      updateStatus(state, '');
    });
    //update lead
    builder.addCase(updateLead.pending, (state) => {
      console.log('Update lead Pending');
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateLead.fulfilled, (state, action) => {
      console.log('Update lead Fulfilled');
      const updatedLead = action.payload.data.lead;

      const leadIndex = state.leads.findIndex((lead) => lead.id === updatedLead.id);
      console.log('leadIndex', leadIndex);
      if (leadIndex !== -1) {
      
        state.leads = [
          ...state.leads.slice(0, leadIndex),
          updatedLead,
          ...state.leads.slice(leadIndex + 1),
        ];
      }

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(updateLead.rejected, (state, action) => {
      console.log('Update lead Rejected');
      state.loading = false;
      updateStatus(state, '');
    });
    },
});

export const { clearMessage } = LeadSlice.actions;

export default LeadSlice.reducer;