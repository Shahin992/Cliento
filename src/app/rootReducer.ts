import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import pipelinesReducer from '../features/pipelines/pipelinesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  pipelines: pipelinesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
