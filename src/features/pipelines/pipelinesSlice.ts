import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PipelineOptionState = {
  _id: string;
  name: string;
};

type PipelinesState = {
  options: PipelineOptionState[];
};

const initialState: PipelinesState = {
  options: [],
};

const pipelinesSlice = createSlice({
  name: 'pipelines',
  initialState,
  reducers: {
    setPipelineOptions: (state, action: PayloadAction<PipelineOptionState[]>) => {
      state.options = action.payload;
    },
    addPipelineOption: (state, action: PayloadAction<PipelineOptionState>) => {
      const exists = state.options.some((pipeline) => pipeline._id === action.payload._id);
      if (!exists) {
        state.options.push(action.payload);
      }
    },
    clearPipelineOptions: (state) => {
      state.options = [];
    },
  },
});

export const { setPipelineOptions, addPipelineOption, clearPipelineOptions } = pipelinesSlice.actions;
export default pipelinesSlice.reducer;
