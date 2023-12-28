import { createReducer } from '@reduxjs/toolkit';
import {
  setLoading,
  setPreBookList,
  setPreBookMetaData,
} from './action.pre-book';

const initialState = {
  isPreBookGetAllLoading: true,
  isPreBookUpdateLoading: false,
  isGetByIdLoader: true,
  preBookedGuestList: [],
  preBookedGuestMetaData: {},
};

export const preBookReducer = createReducer({ ...initialState }, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setPreBookList, (state, { payload }) => {
      state.preBookedGuestList = payload;
    })
    .addCase(setPreBookMetaData, (state, { payload }) => {
      state.preBookedGuestMetaData = payload;
    });
});

export const preBookedState = (state) => state.preBooked;
