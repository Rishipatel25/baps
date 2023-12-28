import { createReducer } from '@reduxjs/toolkit';
import { setLoading, setVisitTourFormData } from './action.tour';

const initialState = {
  isTourLoader: true,
  isTourFormLoader: false,
  tourFormData: {},
  visitTourData: {},
};

export const tourReducer = createReducer({ ...initialState }, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setVisitTourFormData, (state, { payload }) => {
      state.tourFormData = payload;
    });
});

export const tourState = (state) => state.tour;
