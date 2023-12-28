import { createReducer } from '@reduxjs/toolkit';
import {
  setLoading,
  setTourPageSLotList,
  setTourPageSLotMetaData,
} from './action.tour-page';

const initialState = {
  isTourPageSlotLoader: true,
  tourPageSlotList: [],
  tourPageSlotMetaData: {},
};

export const tourPageSlotsReducer = createReducer(
  { ...initialState },
  (builder) => {
    builder
      .addCase(setLoading, (state, { payload }) => {
        const { key, value } = payload;
        state[key] = value;
      })
      .addCase(setTourPageSLotList, (state, { payload }) => {
        state.tourPageSlotList = payload;
      })
      .addCase(setTourPageSLotMetaData, (state, { payload }) => {
        state.tourPageSlotMetaData = payload;
      });
  },
);

export const tourPageSlotState = (state) => state.tourPageSlots;
