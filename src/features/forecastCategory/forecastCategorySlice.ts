import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authHeader } from '../../utils/auth-header';
import { API_URL } from '../../utils/config';

export const getForecastCategories = createAsyncThunk(
    'forecastCategories/getForecastCategories',
    async () => {
        let header: any = await authHeader();
        const response = await fetch(`${API_URL}/opportunity_forecasts`, {
            method: 'GET',
            headers: header,
        });
        return (await response.json()) as any;
    },
);

const ForecastCategorySlice = createSlice({
    name: 'forecastCategories',
    initialState: {
        forecastCategories: [],
        forecastCategory: {},
        loading: false,
    },
    reducers: {
        clearMessage(state: any) {
            state.status = null;
        },
    },
    extraReducers: builder => {

        builder.addCase(getForecastCategories.pending, state => {
            console.log('Pending');
            state.loading = true;
        });
        builder.addCase(getForecastCategories.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.forecastCategories = action.payload.data.forecasts;
            }

            state.loading = false;
        });
        builder.addCase(getForecastCategories.rejected, (state, action) => {
            console.log('Rejected');
            console.log(action.error);
            state.loading = false;
        });

    },
});


export const { clearMessage } = ForecastCategorySlice.actions;
export default ForecastCategorySlice.reducer;