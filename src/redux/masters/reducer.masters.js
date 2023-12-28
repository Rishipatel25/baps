import { createReducer } from '@reduxjs/toolkit';
import {
  setCountries,
  setLoading,
  setState,
  setLocation,
} from './action.masters';

const initialState = {
  isLoading: true,
  masters: [],
  countries: [],
  state: [],
  locationOption: [],
};

export const mastersReducer = createReducer({ ...initialState }, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setCountries, (state, { payload }) => {
      state.countries = payload;
    })
    .addCase(setState, (state, { payload }) => {
      state.state = payload;
    })
    .addCase(setLocation, (state, { payload }) => {
      state.locationOption = payload;
    });
});

export const masterState = (state) => state.masters;
