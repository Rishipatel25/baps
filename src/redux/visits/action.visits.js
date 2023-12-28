/* eslint-disable no-console */
import { createAction } from '@reduxjs/toolkit';
import {
  FilterVisitApiCall,
  SearchVisitApiCall,
  addDocumentsApiCall,
  createVisitApiCall,
  deleteDocumentsApiCall,
  getAllDocumentsApiCall,
  getAllVisitListApiCall,
  getVisitFormApiCall,
  getVisitStatusApiCall,
  getVisitPersonnelApiCall,
  sortVisitApiCall,
  updateVisitFormApiCall,
  updateVisitStatusApiCall,
  searchServiceApiCall,
  searchVisitorApiCall,
  getAllServiceTemplateApiCall,
  createServiceTemplateApiCall,
  updateServiceTemplateApiCall,
  getServiceTemplateApiCall,
  deleteServiceTemplateCall,
  GetScheduleDataApiCall,
  searchMeetingTemplateApiCall,
  getAllMeetingTemplateApiCall,
  createMeetingTemplateApiCall,
  updateMeetingTemplateApiCall,
  getMeetingTemplateApiCall,
  deleteMeetingTemplateCall,
  GetTeamsApiCall,
  UpdateTeamsApiCall,
  externalFeedbackApiCall,
  getAudioVideoApiCall,
  deleteAudioVideoApiCall,
  saveAudioVideoApiCall,
} from './http.visits';
import { toast } from 'react-toastify';
import {
  getVisitObjectById,
  sendVisitObjectData,
  setLocalStorageData,
} from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { TOAST_ERROR } from '@/utils/constants/default.constants';

// Actions
export const setLoading = createAction('visits/setLoding');
export const setVisitsList = createAction('visits/setVisitsList');
export const setPreBookedVisitsList = createAction(
  'visits/setPreBookedVisitsList',
);

export const setServicesList = createAction('visits/setServicesList');
export const setServicesFormData = createAction('visits/setServicesFormData');

export const setMeetingsList = createAction('visits/setMeetingsList');
export const setMeetingFormData = createAction('visits/setMeetingFormData');

export const setScheduleList = createAction('visits/setScheduleList');
export const setFeedbackData = createAction('visits/setFeedbackData');
export const saveCreateVisitFormData = createAction(
  'visits/saveCreateVisitFormData',
);
export const savePrimaryGuestFormData = createAction(
  'visits/savePrimaryGuestFormData',
);
export const saveSecondaryGuestFormData = createAction(
  'visits/saveSecondaryGuestFormData',
);
export const setCurrentVisitResponse = createAction(
  'visits/setCurrentVisitResponse',
);
export const resetCreateVisitForm = createAction('visits/resetCreateVisitForm');
export const updateVisit = createAction('visits/updateVisit');
export const setDocumentList = createAction('visits/setDocumentList');
export const setServiceTabList = createAction('visits/setServiceTabList');
export const setTabStatus = createAction('visits/setTabStatus');
export const setVisitPersonnel = createAction('visits/setVisitPersonnel');

/**
 * This function is same as createAsyncThunk to make an api call
 * @param {Object} visitsParams | params to get visits lists
 * @returns Async action function of the redux
 */
export const getVisitsListAction = (visitsParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isLoading', value: true }));
    try {
      const res = await getAllVisitListApiCall(visitsParams);
      dispatch(setVisitsList(res));
      cb && cb();
    } catch (error) {
      dispatch(setLoading({ key: 'isLoading', value: false }));
      cb && cb();
    }
    dispatch(setLoading({ key: 'isLoading', value: false }));
    cb && cb();
  };
};

export const createVisitFormAction = (visitData, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const { visitVisitorModel, primaryVisitorModel, secondaryVisitorModel } =
        sendVisitObjectData(visitData);
      const fullData = {};
      if (visitVisitorModel) {
        fullData.visitVisitorModel = visitVisitorModel;
      }
      if (primaryVisitorModel) {
        fullData.primaryVisitorModel = primaryVisitorModel;
      }
      if (secondaryVisitorModel) {
        fullData.secondaryVisitorModel = secondaryVisitorModel;
      }
      const res = await createVisitApiCall({
        ...fullData.visitVisitorModel,
        primaryVisitorModel: fullData.primaryVisitorModel,
        secondaryVisitorModel: fullData.secondaryVisitorModel,
      });
      if (res) {
        cb();
      }
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.CREATE_VISIT_FROM_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.CREATE_VISIT_FROM_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const getVisitFormByIdAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isGetByIdLoader', value: true }));
    try {
      const res = await getVisitFormApiCall(visitId);
      if (res) {
        const {
          visitVisitorModel,
          primaryVisitorModel,
          secondaryVisitorModel,
        } = getVisitObjectById(res);

        const visitorObject = {};

        if (visitVisitorModel) {
          dispatch(saveCreateVisitFormData(visitVisitorModel));
          visitorObject.visitVisitorModel = visitVisitorModel;
        }
        if (primaryVisitorModel) {
          dispatch(savePrimaryGuestFormData(primaryVisitorModel));
          visitorObject.primaryVisitorModel = primaryVisitorModel;
        }
        if (secondaryVisitorModel) {
          dispatch(saveSecondaryGuestFormData(secondaryVisitorModel));
          visitorObject.secondaryVisitorModel = secondaryVisitorModel;
        }

        dispatch(
          setCurrentVisitResponse({
            visitRes: visitorObject?.visitVisitorModel,
            primaryRes: visitorObject?.primaryVisitorModel,
            secondaryRes: visitorObject?.secondaryVisitorModel,
          }),
        );
        dispatch(setTabStatus(res?.visitTabModel || {}));
        setLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA, visitorObject);
        cb(res);
      }
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.CREATE_VISIT_FROM_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.VISIT_FROM_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isGetByIdLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isGetByIdLoader', value: false }));
  };
};

export const getVisitPersonnelByIdAction = (visitId) => {
  return async (dispatch) => {
    try {
      const res = await getVisitPersonnelApiCall(visitId);
      if (res) {
        dispatch(setVisitPersonnel(res));
      }
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.CREATE_VISIT_FROM_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.VISIT_FROM_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isGetByIdLoader', value: false }));
    }
  };
};

export const SearchVisitorAction = (searchString, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await searchVisitorApiCall(searchString);
      cb(res);
    } catch (error) {
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

//for searching in visit table
export const SearchVisitAction = (serachParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await SearchVisitApiCall(serachParams);
      dispatch(setVisitsList(res));
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.CREATE_VISIT_FROM_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.GET_VISIT_SEARCH_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

//filtering api call in visit table
export const FilterVisitAction = (serachParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await FilterVisitApiCall(serachParams);
      dispatch(setVisitsList(res));
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.CREATE_VISIT_FROM_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.GET_VISIT_SEARCH_ACTION.ID,
        },
      );
    }
  };
};

//sorting api call in visit table
export const SortingVisitAction = (serachParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await sortVisitApiCall(serachParams);
      dispatch(setVisitsList(res));
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.GET_VISIT_SEARCH_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.GET_VISIT_SEARCH_ACTION.ID,
        },
      );
    }
  };
};

export const updateVisitAction = (visitData, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const { visitVisitorModel, primaryVisitorModel, secondaryVisitorModel } =
        sendVisitObjectData(visitData);
      let fullData = {};
      if (visitVisitorModel) {
        fullData = visitVisitorModel;
      }
      if (primaryVisitorModel) {
        fullData.primaryVisitorModel = primaryVisitorModel;
      }
      if (secondaryVisitorModel) {
        fullData.secondaryVisitorModel = secondaryVisitorModel;
      }

      const res = await updateVisitFormApiCall(fullData);
      if (res) {
        const data = getVisitObjectById(res);
        cb(data);
      }
    } catch (error) {
      toast.error(error?.message || TOAST_ERROR.VISIT_FROM_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.VISIT_FROM_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const changeVisitStatusAction = (visitStatusInfo, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await updateVisitStatusApiCall(visitStatusInfo);
      cb(res);
    } catch (error) {
      let errorMsg = TOAST_ERROR.CHANGE_VISIT_STATUS_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.CHANGE_VISIT_STATUS_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const getVisitStatusAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await getVisitStatusApiCall(visitId);
      cb(res);
    } catch (error) {
      toast.error(TOAST_ERROR.GET_VISIT_STATUS_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_VISIT_STATUS_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const GET_DOCUMENT_LIST_ACTION = (visitId) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isDocumentLoader', value: true }));
    try {
      const res = await getAllDocumentsApiCall(visitId);
      if (res) {
        dispatch(setDocumentList(res));
      }
    } catch (error) {
      toast.error(TOAST_ERROR.GET_DOCUMENT_LIST_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_DOCUMENT_LIST_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isDocumentLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isDocumentLoader', value: false }));
  };
};

export const addDocumentAction = (documentObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isDocumentLoader', value: true }));
    try {
      const res = await addDocumentsApiCall(documentObj);
      if (res) {
        cb();
      }
    } catch (error) {
      toast.error(TOAST_ERROR.GET_DOCUMENT_LIST_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_DOCUMENT_LIST_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isDocumentLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isDocumentLoader', value: false }));
  };
};

export const DELETE_DOCUMENT_ACTION = (documentObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: true }));
    try {
      await deleteDocumentsApiCall(documentObj);
      cb();
    } catch (error) {
      toast.error(TOAST_ERROR.DELETE_DOCUMENT_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.DELETE_DOCUMENT_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: false }));
  };
};

export const getScheduleAction = (scheduleParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isScheduleLoader', value: true }));
    try {
      const res = await GetScheduleDataApiCall(scheduleParams);
      res && res.length > 0 && dispatch(setScheduleList(res));
    } catch (error) {
      toast.error(TOAST_ERROR.GET_SCHEDULE_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_SCHEDULE_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isScheduleLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isScheduleLoader', value: false }));
  };
};

export const updateTeamsAction = (teamsObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTeamsUpdateLoader', value: true }));
    try {
      const res = await UpdateTeamsApiCall(teamsObj);
      res?.length && cb(res);
    } catch (error) {
      let errorMsg = TOAST_ERROR.UPDATE_TEAMS_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.UPDATE_TEAMS_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isTeamsUpdateLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTeamsUpdateLoader', value: false }));
  };
};

export const getTeamsAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTeamsLoader', value: true }));
    try {
      const res = await GetTeamsApiCall(visitId);
      if (res?.length) {
        const teams = [];
        res.forEach((team) => {
          if (
            team.personnelName &&
            team.personnelId &&
            team.roleName &&
            team.roleId &&
            team.roleUucode
          ) {
            teams.push({
              personnel: { label: team.personnelName, value: team.personnelId },
              role: {
                label: team.roleName,
                value: team.roleId,
                visitPersonnelId: team.visitPersonnelId,
                uucode: team.roleUucode,
              },
            });
          }
        });

        cb({ response: res, teams });
      }
    } catch (error) {
      toast.error(TOAST_ERROR.GET_TEAMS_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_TEAMS_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isTeamsLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTeamsLoader', value: false }));
  };
};

export const searchServiceAction = (searchString) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await searchServiceApiCall(searchString);
      res && res.length > 0 && dispatch(setServicesList(res));
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.GET_VISIT_SEARCH_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.GET_VISIT_SEARCH_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const createServiceTemplateAction = (templateObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await createServiceTemplateApiCall(templateObj);
      if (res) {
        cb();
      }
    } catch (error) {
      let errorMsg = 'Failed to add service';
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.GET_DOCUMENT_LIST_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const updateServiceTemplateAction = (templateObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await updateServiceTemplateApiCall(templateObj);
      if (res) {
        cb();
      }
    } catch (error) {
      let errorMsg = 'Failed to add service';
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.GET_DOCUMENT_LIST_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const getServiceTemplateAction = (visitId, visitServiceId) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await getServiceTemplateApiCall(visitId, visitServiceId);
      res && dispatch(setServicesFormData(res));
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.GET_VISIT_SEARCH_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.GET_VISIT_SEARCH_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const removeServiceTemplateAction = (visitId, visitServiceId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: true }));
    try {
      await deleteServiceTemplateCall(visitId, visitServiceId);
      cb();
    } catch (error) {
      toast.error(TOAST_ERROR.DELETE_VISIT_SERVICE_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.DELETE_VISIT_SERVICE_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: false }));
  };
};

export const getAllServiceAction = (servicesParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isServicesLoader', value: true }));
    try {
      const res = await getAllServiceTemplateApiCall(servicesParams);
      cb(res);
    } catch (error) {
      toast.error(TOAST_ERROR.GET_ALL_SERVICES_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_ALL_SERVICES_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isServicesLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isServicesLoader', value: false }));
  };
};

//Metting Action
export const searchMeetingAction = (searchString) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await searchMeetingTemplateApiCall(searchString);
      res && res.length > 0 && dispatch(setMeetingsList(res));
    } catch (error) {
      toast.error(TOAST_ERROR.SEARCH_MEETING_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.SEARCH_MEETING_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const createMeetingAction = (templateObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await createMeetingTemplateApiCall(templateObj);
      if (res) {
        cb();
      }
    } catch (error) {
      let errorMsg = TOAST_ERROR.ADD_MEETING_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, { toastId: TOAST_ERROR.ADD_MEETING_ACTION.ID });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const updateMeetingAction = (templateObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await updateMeetingTemplateApiCall(templateObj);
      if (res) {
        cb();
      }
    } catch (error) {
      let errorMsg = TOAST_ERROR.UPDATE_MEETING_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, { toastId: TOAST_ERROR.UPDATE_MEETING_ACTION.ID });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const getMeetingAction = (visitId, visitServiceId) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFormLoader', value: true }));
    try {
      const res = await getMeetingTemplateApiCall(visitId, visitServiceId);
      res && dispatch(setMeetingFormData(res));
    } catch (error) {
      toast.error(TOAST_ERROR.GET_MEETING_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_MEETING_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFormLoader', value: false }));
  };
};

export const removeMeetingAction = (visitId, visitServiceId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: true }));
    try {
      await deleteMeetingTemplateCall(visitId, visitServiceId);
      cb();
    } catch (error) {
      toast.error(TOAST_ERROR.DELETE_MEETING_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.DELETE_MEETING_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isDocumentDeleteLoader', value: false }));
  };
};

export const getAllMeetingAction = (servicesParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isServicesLoader', value: true }));
    try {
      const res = await getAllMeetingTemplateApiCall(servicesParams);
      cb(res);
    } catch (error) {
      toast.error(TOAST_ERROR.GET_ALL_MEETING_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_ALL_MEETING_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isServicesLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isServicesLoader', value: false }));
  };
};

export const getExternalFeedback = (feedbackParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFeedbackLoader', value: true }));
    try {
      const res = await externalFeedbackApiCall(feedbackParams);
      res && dispatch(setFeedbackData(res));
    } catch (error) {
      return error;
    }
    dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
  };
};

export const getAudioVideoAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isAudioVideoListLoader', value: true }));
    try {
      const res = await getAudioVideoApiCall(visitId);
      cb(res);
    } catch (error) {
      toast.error(TOAST_ERROR.GET_AUDIO_VIDEO_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_AUDIO_VIDEO_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isAudioVideoListLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isAudioVideoListLoader', value: false }));
  };
};

export const deleteAudioVideoAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isAudioVideoDeleteLoader', value: true }));
    try {
      await deleteAudioVideoApiCall(visitId);
      cb();
    } catch (error) {
      toast.error(TOAST_ERROR.DELETE_AUDIO_VIDEO_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.DELETE_AUDIO_VIDEO_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isAudioVideoDeleteLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isAudioVideoDeleteLoader', value: false }));
  };
};

export const saveAudioVideoAction = (audioVideoObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isAudioVideoLoader', value: true }));
    try {
      const res = await saveAudioVideoApiCall(audioVideoObj);
      if (res) {
        cb();
      }
    } catch (error) {
      let errorMsg = TOAST_ERROR.SAVE_AUDIO_VIDEO_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.SAVE_AUDIO_VIDEO_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isAudioVideoLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isAudioVideoLoader', value: false }));
  };
};
