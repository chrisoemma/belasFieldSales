import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';


export const createContactPerson = createAsyncThunk(
    'contactPeople/createContactPerson',
    async ({ data, clientId }: any) => {

      const response = await fetch(`${API_URL}/clients/add_contact_person/${clientId}`, {
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

  //delete contact person 
export const deleteContactPerson = createAsyncThunk(
    'contactPeople/deleteContactPerson',
    async ({ clientId, contactPersonId }: any) => {
      try {
        const header: any = await authHeader();
        const response = await fetch(`${API_URL}/clients/delete_contact_person/${clientId}/${contactPersonId}`, {
          method: 'DELETE',
          headers: header,
        });
  
        if (!response.status) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete contact person');
        }
  
        return (await response.json());
      } catch (error) {
        throw error;
      }
    }
  );

  export const updateContactPerson = createAsyncThunk(
    'contactPeople/updateContactPerson',
    async ({ data, contactPersonId, clientId }: any) => {
      console.log('clientId', clientId);
      const response = await fetch(`${API_URL}/clients/update_contact_person/${clientId}/${contactPersonId}`, {
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


  
export const getContactPeople = createAsyncThunk(
    'contactPeople/getContactPeople',
    async ({ clientId }: any) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/clients/contact_people/${clientId}`, {
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

  const ContactPeopleSlice = createSlice({
    name: 'contactPeople',
    initialState: {
        contactPerson: {},
        contactPeople: [],
        loading: false,
      },
      reducers: {
        clearMessage(state: any) {
          state.status = null;
        },
      },
      extraReducers: builder => {
      
            //get client contact people 
    builder.addCase(getContactPeople.pending, state => {
      state.loading = true;
    });
    builder.addCase(getContactPeople.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.contactPeople = action.payload.data.contact_people;
      }
      state.loading = false;
    });
    builder.addCase(getContactPeople.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
    });


   // Add contact person 
    builder.addCase(createContactPerson.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(createContactPerson.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.contactPerson = { ...action.payload.data.contact_person };
        state.contactPeople = [...state.contactPeople, { ...action.payload.data.contact_person }]
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload.status);
      }
      state.loading = false;
      updateStatus(state, '');

    });
    builder.addCase(createContactPerson.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });



    //update contact person
    builder.addCase(updateContactPerson.pending, (state) => {
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateContactPerson.fulfilled, (state, action) => {
      const updatedContactPerson = action.payload.data.contact_person;

      const contactPersonIndex = state.contactPeople.findIndex((person) => person.id === updatedContactPerson.id);
      console.log('contactPersonIndex', contactPersonIndex);
      if (contactPersonIndex !== -1) {
        state.contactPeople = [
          ...state.contactPeople.slice(0, contactPersonIndex),
          updatedContactPerson,
          ...state.contactPeople.slice(contactPersonIndex + 1),
        ];
      }

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(updateContactPerson.rejected, (state, action) => {
      console.log('Update client Rejected');
      state.loading = false;
      updateStatus(state, '');
    });


   // deleteContact person

    builder.addCase(deleteContactPerson.pending, (state) => {
      console.log('Delete Employee Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(deleteContactPerson.fulfilled, (state, action) => {
      console.log('Delete Employee Fulfilled');
      const deletedContactPersonId = action.payload.data.contact_person.id;

      state.contactPeople = state.contactPeople.filter((person) => person.id !== deletedContactPersonId);
      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(deleteContactPerson.rejected, (state, action) => {

      state.loading = false;
      updateStatus(state, '');
    });

      },
    });
    
    
    export const { clearMessage } = ContactPeopleSlice.actions;
    
    export default ContactPeopleSlice.reducer;

