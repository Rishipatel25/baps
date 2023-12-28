import { createReducer } from '@reduxjs/toolkit';
import {
  setLoading,
  setMeetingCoordinatorOptions,
  setServiceCoordinatorOptions,
  setTeamsRoles,
  setTourCoordinatorOptions,
  setTourGuideCoordinatorOptions,
  setInterviewCoordinatorOptions,
  setInterviewVolunteerOptions
} from './action.roles';

const initialState = {
  isRolesLoader: false,
  teamsRoles: [],
  tourCooridnatorsRoles: [],
  tourGuideCooridnatorsRoles: [],
  serviceCooridnatorsRoles: [],
  meetingCooridnatorsRoles: [],
  interviewCooridnatorsRoles: [],
  interviewVolunteerRoles: []
};

export const rolesReducer = createReducer({ ...initialState }, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setTeamsRoles, (state, { payload }) => {
      state.teamsRoles = payload;
    })
    .addCase(setTourGuideCoordinatorOptions, (state, { payload }) => {
      state.tourGuideCooridnatorsRoles = payload;
    })
    .addCase(setTourCoordinatorOptions, (state, { payload }) => {
      state.tourCooridnatorsRoles = payload;
    })
    .addCase(setServiceCoordinatorOptions, (state, { payload }) => {
      state.serviceCooridnatorsRoles = payload;
    })
    .addCase(setMeetingCoordinatorOptions, (state, { payload }) => {
      state.meetingCooridnatorsRoles = payload;
    })
    .addCase(setInterviewCoordinatorOptions, (state, { payload }) => {
      state.interviewCooridnatorsRoles = payload;
    })
    .addCase(setInterviewVolunteerOptions, (state, { payload }) => {
      state.interviewVolunteerRoles = payload;
    });
});

export const rolesState = (state) => state.roles;
