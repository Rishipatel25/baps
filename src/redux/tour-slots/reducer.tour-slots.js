import { createReducer } from '@reduxjs/toolkit';
import {
  setLoading,
  setTourSlotData,
  setTourTimingIntervals,
} from './action.tour-slots';

const initialState = {
  isTourSlotLoader: true,
  isTourSlotCardLoader: false,
  timeInterval: [],
  tourSlotData: [],
};

export const tourSlotsReducer = createReducer(
  { ...initialState },
  (builder) => {
    builder
      .addCase(setLoading, (state, { payload }) => {
        const { key, value } = payload;
        state[key] = value;
      })
      .addCase(setTourSlotData, (state, { payload }) => {
        state.tourSlotData = payload;
      })
      .addCase(setTourTimingIntervals, (state, { payload }) => {
        state.timeInterval = payload;
      });
  },
);

export const tourSlotState = (state) => state.tourSlots;
