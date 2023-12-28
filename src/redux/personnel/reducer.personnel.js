import { createReducer } from '@reduxjs/toolkit';
import {
  resetCoordinatorOptions,
  setCoordinatorOptions,
  setCurrentLoggedInUser,
  setCurrentUserRoles,
  setLoading,
  setPersonnelOptions,
  setSelectedRole,
} from './action.personnel';

const initialState = {
  isPersonnelLoader: false,
  isAvailableLoader: false,
  isPersonnelTokenLoader: false,
  personnelOptions: [],
  coordinatorOptions: [],
  teamsAvailablePersonnels: [],
  currentUser: {},
  currentUserRoles: [],
  selectedRole: {}
};

export const personnelReducer = createReducer(
  { ...initialState },
  (builder) => {
    builder
      .addCase(setLoading, (state, { payload }) => {
        const { key, value } = payload;
        state[key] = value;
      })
      .addCase(setPersonnelOptions, (state, { payload }) => {
        state.personnelOptions = payload;
      })
      .addCase(setCoordinatorOptions, (state, { payload }) => {
        state.coordinatorOptions = payload;
      })
      .addCase(setCurrentLoggedInUser, (state, { payload }) => {
        state.currentUser = payload;
      })
      .addCase(setCurrentUserRoles, (state, { payload }) => {
        state.currentUserRoles = payload;
      })
      .addCase(setSelectedRole, (state, { payload }) => {
        state.selectedRole = payload;
      })
      .addCase(resetCoordinatorOptions, (state) => {
        state.coordinatorOptions = [];
      });
  },
);

export const personnelState = (state) => state.personnel;
