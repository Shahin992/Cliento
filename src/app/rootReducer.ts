import { combineReducers } from '@reduxjs/toolkit';
import authReducer, { clearAuth } from '../features/auth/authSlice';
import pipelinesReducer from '../features/pipelines/pipelinesSlice';

const appReducer = combineReducers({
  auth: authReducer,
  pipelines: pipelinesReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (
  state: RootState | undefined,
  action: {
    type: string;
  },
) => {
  if (action.type === clearAuth.type) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
