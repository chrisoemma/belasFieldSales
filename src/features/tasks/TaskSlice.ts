import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

interface TaskDTO {
  title: string;
  description: string;
  duedate: string;
  assignedTo: string,
  assignedBy: string,
  priority: string
}

interface TaskData {
  status: boolean;
  task: object
}


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


export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: TaskDTO) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as TaskData;
  },
);

export const getMyCurrentAssignedTasks = createAsyncThunk(
  'tasks/getMyCurrentAssignedTasks',
  async ({ status, userId }: any) => {

    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/tasks/my_assigned_tasks/${status}/${userId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);

export const getMyPastAssignedTasks = createAsyncThunk(
  'tasks/getMyPastAssignTasks',
  async ({ status, userId }: any) => {
    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/tasks/get_my_assign_tasks/${status}/${userId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ data, taskId }: any) => {
    console.log('taskId', taskId);
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as TaskData;
  }
);


export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ data, taskId }: any) => {

    console.log('taskss', taskId);
    const response = await fetch(`${API_URL}/tasks/task_status_update/${taskId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as TaskData;
  }
);


export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ taskId }: any) => {
    try {

      const header: any = await authHeader();
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: header,
      });

      if (!response.status) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }

      return taskId;
    } catch (error) {
      throw error;
    }
  }
);




const TaskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    task: {},
    myAssignedCurrentTasks: [],
    myAssignedPastTasks: [],
    loading: false,
  },
  reducers: {
    clearMessage(state: any) {
      state.status = null;
    },
  },
  extraReducers: builder => {

    builder.addCase(getMyCurrentAssignedTasks.pending, state => {
      console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getMyCurrentAssignedTasks.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      if (action.payload.status) {
        state.myAssignedCurrentTasks = action.payload.data.tasks;
      }

      state.loading = false;
    });
    builder.addCase(getMyCurrentAssignedTasks.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);

      state.loading = false;
    });

    builder.addCase(getMyPastAssignedTasks.pending, state => {
      console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getMyPastAssignedTasks.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      if (action.payload.status) {
        state.myAssignedPastTasks = action.payload.data.tasks;
      }

      state.loading = false;
    });
    builder.addCase(getMyPastAssignedTasks.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      //   updateStatus(state, 'Something went wrong, please try again later');
      state.loading = false;
    });


    //ADD TASK

    builder.addCase(createTask.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(createTask.fulfilled, (state, action) => {

      state.loading = false;
      updateStatus(state, '');

      if (action.payload.status) {
        state.task = { ...action.payload.data.task };
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload.status);
      }

      state.tasks.push(state.task);
    });
    builder.addCase(createTask.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });

    //update task

    builder.addCase(updateTask.pending, (state) => {
      console.log('Update Task Pending');
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      console.log('Update Task Fulfilled');

      const updatedTask = action.payload.data.task;

      const taskIndex = state.tasks.findIndex((task) => task.id === updatedTask.id);
      console.log('employeeindex', taskIndex);
      if (taskIndex !== -1) {
        // Update the task in the array immutably
        state.tasks = [
          ...state.tasks.slice(0, taskIndex),
          updatedTask,
          ...state.tasks.slice(taskIndex + 1),
        ];
      }

      state.loading = false;
      updateStatus(state, '');
    });


    builder.addCase(updateTask.rejected, (state, action) => {
      console.log('Update Task Rejected');
      state.loading = false;
      updateStatus(state, '');
    });


    //delete tasks
    builder.addCase(deleteTask.pending, (state) => {
      console.log('Delete Task Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      console.log('Delete Task Fulfilled');
      const deletedTaskId = action.payload.data.task.id;

      state.tasks = state.tasks.filter((task) => task.id !== deletedTaskId);

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(deleteTask.rejected, (state, action) => {
      console.log('Delete Task Rejected');
      state.loading = false;
      updateStatus(state, '');
    });


    //Update Task status

    builder.addCase(updateTaskStatus.pending, (state) => {
      console.log('Update Task Pending');
      state.loading = true;
      updateStatus(state, '');
    });


    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      console.log('Update Task Fulfilled');
      console.log('request', action.payload);

      const updatedTask = action.payload.data.task;
      const status = updatedTask.status;

      // Find the index of the updated request in activeRequests
      const taskIndex = state.myAssignedCurrentTasks.findIndex(
        (task) => task.id === updatedTask.id
      );

      if (taskIndex !== -1) {
        if (['Pending', 'In Progress'].includes(status)) {
          // Update the request in activeRequests
          state.myAssignedCurrentTasks = [
            ...state.myAssignedCurrentTasks.slice(0, taskIndex),
            updatedTask,
            ...state.myAssignedCurrentTasks.slice(taskIndex + 1),
          ];
        } else if (['Completed'].includes(status)) {
          // Remove the request from activeRequests
          state.myAssignedCurrentTasks = [
            ...state.myAssignedCurrentTasks.slice(0, taskIndex),
            ...state.myAssignedCurrentTasks.slice(taskIndex + 1),
          ];

          // Add the request to pastRequests
          state.myAssignedPastTasks = [...state.myAssignedPastTasks, updatedTask];
        }
      }

      state.loading = false;
      updateStatus(state, '');
    });

    builder.addCase(updateTaskStatus.rejected, (state, action) => {
      console.log('Update Task Rejected');
      state.loading = false;
      updateStatus(state, '');
    });

  },
});


export const { clearMessage } = TaskSlice.actions;

export default TaskSlice.reducer;


