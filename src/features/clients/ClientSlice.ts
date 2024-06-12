import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';


export const getClients = createAsyncThunk(
  'clients/getClients',
  async ({ companyId }: any) => {

    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/companies/clients/${companyId}`, {
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

export const createClient = createAsyncThunk(
  'clients/createClient',
  async ({ data }: any) => {
    const response = await fetch(`${API_URL}/clients`, {
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


export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async ({ clientId }: any) => {
    console.log('clienttt',clientId);
    try {
      const header: any = await authHeader();
      const response = await fetch(`${API_URL}/clients/${clientId}`, {
        method: 'DELETE',
        headers: header,
      });

      if (!response.status) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete client');
      }

      return (await response.json());
    } catch (error) {
      throw error;
    }
  }
);



export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ data, clientId }: any) => {
    console.log('clientId', clientId);
    const response = await fetch(`${API_URL}/clients/${clientId}`, {
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



const ClientSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    client: {},
    loading: false,
  },
  reducers: {
    clearMessage(state: any) {
      state.status = null;
    },
  },
  extraReducers: builder => {

    builder.addCase(getClients.pending, state => {
      console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getClients.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      if (action.payload.status) {
        state.clients = action.payload.data.clients;
      }
      state.loading = false;
    });
    builder.addCase(getClients.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
    });




    //create client
    builder.addCase(createClient.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(createClient.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.client = { ...action.payload.data.client };
        state.clients = [...state.clients, { ...action.payload.data.client }]
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload.status);
      }
      state.loading = false;
      updateStatus(state, '');

    });
    builder.addCase(createClient.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });





    builder.addCase(deleteClient.pending, (state) => {
      console.log('Delete Employee Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(deleteClient.fulfilled, (state, action) => {
      console.log('Delete Employee Fulfilled');
      const deletedClientId = action.payload.data.client.id;

      state.clients = state.clients.filter((client) => client.id !== deletedClientId);

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(deleteClient.rejected, (state, action) => {
      console.log('Delete Client Rejected');
      state.loading = false;
      updateStatus(state, '');
    });
    //update Client
    builder.addCase(updateClient.pending, (state) => {
      console.log('Update Client Pending');
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateClient.fulfilled, (state, action) => {
      console.log('Update Client Fulfilled');
      const updatedClient = action.payload.data.client;

      const clientIndex = state.clients.findIndex((client) => client.id === updatedClient.id);
      console.log('clientindex', clientIndex);
      if (clientIndex !== -1) {
        // Update the task in the array immutably
        state.clients = [
          ...state.clients.slice(0, clientIndex),
          updatedClient,
          ...state.clients.slice(clientIndex + 1),
        ];
      }

      state.loading = false;
      updateStatus(state, '');
    });


    builder.addCase(updateClient.rejected, (state, action) => {
      console.log('Update client Rejected');
      state.loading = false;
      updateStatus(state, '');
    });



  },
});


export const { clearMessage } = ClientSlice.actions;

export default ClientSlice.reducer;