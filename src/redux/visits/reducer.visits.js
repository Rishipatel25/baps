import { createReducer } from '@reduxjs/toolkit';
import {
  resetCreateVisitForm,
  saveCreateVisitFormData,
  savePrimaryGuestFormData,
  saveSecondaryGuestFormData,
  setDocumentList,
  setLoading,
  setVisitsList,
  setPreBookedVisitsList,
  setServicesList,
  setServicesFormData,
  setMeetingsList,
  setMeetingFormData,
  setScheduleList,
  setTabStatus,
  setVisitPersonnel,
  setFeedbackData,
  setCurrentVisitResponse,
} from './action.visits';

const initialState = {
  isLoading: true,
  isFormLoader: false,
  isGetByIdLoader: false,
  isDocumentLoader: false,
  isServicesLoader: false,
  isDocumentDeleteLoader: false,
  isAudioVideoListLoader: true,
  isAudioVideoLoader: false,
  isScheduleLoader: false,
  isTeamsLoader: false,
  isFeedbackLoader: false,
  visitsList: [],
  preBookedVisitsList: [],
  documentList: [],
  servicesList: [],
  meetingsList: [],
  scheduleList: [],
  feedBackData: [],
  metadata: {},
  visitFormData: {},
  currentVisitRes: {},
  tabStatus: {},
  visitPersonnel: [],
  setServicesFormData: {},
  setMeetingFormData: {},
  primaryGuestFormData: {},
  secondaryGuestFormData: {},
};

export const visitsReducer = createReducer({ ...initialState }, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setVisitsList, (state, { payload }) => {
      const { pageNo, pageSize, totalCount, totalPages, response } = payload;
      state.metadata = { pageNo, pageSize, totalCount, totalPages };
      state.visitsList = response;
    })
    .addCase(setPreBookedVisitsList, (state, { payload }) => {
      const { pageNo, pageSize, totalCount, totalPages, response } = payload;
      state.metadata = { pageNo, pageSize, totalCount, totalPages };
      state.preBookedVisitsList = response;
    })
    .addCase(saveCreateVisitFormData, (state, { payload }) => {
      state.visitFormData = payload;
    })
    .addCase(savePrimaryGuestFormData, (state, { payload }) => {
      state.primaryGuestFormData = payload;
    })
    .addCase(saveSecondaryGuestFormData, (state, { payload }) => {
      state.secondaryGuestFormData = payload;
    })
    .addCase(setCurrentVisitResponse, (state, { payload }) => {
      state.currentVisitRes = payload;
    })
    .addCase(setDocumentList, (state, { payload }) => {
      state.documentList = payload;
    })
    .addCase(setServicesList, (state, { payload }) => {
      state.servicesList = payload;
    })
    .addCase(setServicesFormData, (state, { payload }) => {
      state.setServicesFormData = payload;
    })
    .addCase(setMeetingsList, (state, { payload }) => {
      state.meetingsList = payload;
    })
    .addCase(setMeetingFormData, (state, { payload }) => {
      state.setMeetingFormData = payload;
    })
    .addCase(setScheduleList, (state, { payload }) => {
      state.scheduleList = payload;
    })
    .addCase(setFeedbackData, (state, { payload }) => {
      state.feedBackData = payload;
    })
    .addCase(setTabStatus, (state, { payload }) => {
      state.tabStatus = payload;
    })
    .addCase(setVisitPersonnel, (state, { payload }) => {
      state.visitPersonnel = payload;
    })
    .addCase(resetCreateVisitForm, (state) => {
      state.visitFormData = {};
      state.primaryGuestFormData = {};
      state.secondaryGuestFormData = {};
      state.documentList = [];
    });
});

export const visitState = (state) => state.visit;
