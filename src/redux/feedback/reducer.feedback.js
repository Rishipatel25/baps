import { createReducer } from '@reduxjs/toolkit';
import { setLoading } from './action.feedback';

const initialState = {
  isFeedbackLoader: false,
  isFeedbackFormLoader: false,
  isGetPublicFeedbackLoading: true,
  isPublicFeedbackFormLoader: false,
};

export const feedbackReducer = createReducer({ ...initialState }, (builder) => {
  builder.addCase(setLoading, (state, { payload }) => {
    const { key, value } = payload;
    state[key] = value;
  });
});

export const feedbackState = (state) => state.feedback;
