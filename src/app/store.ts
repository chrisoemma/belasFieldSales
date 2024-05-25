import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from '../features/auth/userSlice';
import IndustryPositionSlice from '../features/IndustryPositionSlice';
import TaskSlice from '../features/tasks/TaskSlice';
import SalesPeopleSlice from '../features/SalesPeopleSlice';
import ClientSlice from '../features/clients/ClientSlice';
import trackingSlice from '../features/location/trackingSlice';
import ThemeSlice from '../features/settings/ThemeSlice';
import languageSlice from '../costants/languageSlice';
import OnboardingSlice from '../features/onboarding/OnboardingSlice';
import checkInSlice from '../features/checkInsOut/checkInSlice';
import InternetSlice from '../features/InternetSlice';
import PunchRecordSlice from '../features/punchInOut/PunchRecordSlice';
import ContactPeopleSlice from '../features/contacts/ContactPeopleSlice';


const reducers = combineReducers({
  user: userReducer,
  language:languageSlice,
  industriesPositions:IndustryPositionSlice,
  tasks:TaskSlice,
  salesPeople:SalesPeopleSlice,
  clients:ClientSlice,
  theme:ThemeSlice,
  tracking: trackingSlice,
  onboarding:OnboardingSlice,
  checkIns:checkInSlice,
  internet:InternetSlice,
  PunchRecords:PunchRecordSlice,
  contactPeople:ContactPeopleSlice

});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({

  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
