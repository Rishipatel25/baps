import { createReducer } from '@reduxjs/toolkit';
import { setLoading, setSiteInfo } from './action.site';

const initialState = {
  isSiteCodeLoader: false,
  siteInfo: {},
};

export const siteReducer = createReducer({ ...initialState }, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setSiteInfo, (state, { payload }) => {
      state.siteInfo = payload;
    });
});

export const siteState = (state) => state.site;
