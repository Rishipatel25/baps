import { createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  AddExternalFeedbackApiCall,
  GetExternalFeedbackApiCall,
  AddInternalFeedbackApiCall,
  GetInternalFeedbackApiCall,
  DeleteInternalFeedbackApiCall,
  checkFeedbackExists,
  GetPublilcFeedbackApiCall,
  AddPublicFeedbackApiCall,
} from './http.feedback';
import {
  RESPONSE_STATUS,
  TOAST_ERROR,
} from '@/utils/constants/default.constants';

export const setLoading = createAction('feedback/setLoading');

export const getExternalFeedbackAction = (visitId, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFeedbackLoader', value: true }));
    try {
      const res = await GetExternalFeedbackApiCall(visitId);
      if (res) {
        cb(res);
      }
    } catch (error) {
      if (error?.response?.status !== RESPONSE_STATUS.NOT_FOUND) {
        const errorMessage =
          error?.response?.data?.error?.details?.length &&
          error.response.data.error.details[0].message;
        toast.error(
          errorMessage || TOAST_ERROR.GET_VISIT_EXTERNAL_FEEDBACK.MESSAGE,
          {
            toastId: TOAST_ERROR.GET_VISIT_EXTERNAL_FEEDBACK.ID,
          },
        );
      }
      dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
  };
};

export const addExternalFeedbackAction = (feedbackObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFeedbackFormLoader', value: true }));
    try {
      const res = await AddExternalFeedbackApiCall(feedbackObj);
      if (res) {
        cb(res);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.details?.length &&
        error.response.data.error.details[0].message;
      toast.error(
        errorMessage || TOAST_ERROR.ADD_VISIT_EXTERNAL_FEEDBACK.MESSAGE,
        {
          toastId: TOAST_ERROR.ADD_VISIT_EXTERNAL_FEEDBACK.ID,
        },
      );
      dispatch(setLoading({ key: 'isFeedbackFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFeedbackFormLoader', value: false }));
  };
};

export const getInternalFeedbackAction = (visitId, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFeedbackLoader', value: true }));
    try {
      const res = await GetInternalFeedbackApiCall(visitId);
      if (res) {
        cb(res);
      }
    } catch (error) {
      if (error?.response?.status !== RESPONSE_STATUS.NOT_FOUND) {
        const errorMessage =
          error?.response?.data?.error?.details?.length &&
          error.response.data.error.details[0].message;
        toast.error(
          errorMessage || TOAST_ERROR.GET_VISIT_INTERNAL_FEEDBACK.MESSAGE,
          {
            toastId: TOAST_ERROR.GET_VISIT_INTERNAL_FEEDBACK.ID,
          },
        );
      }
      dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
  };
};

export const addInternalFeedbackAction = (feedbackObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFeedbackFormLoader', value: true }));
    try {
      const res = await AddInternalFeedbackApiCall(feedbackObj);
      if (res) {
        cb(res);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.details?.length &&
        error.response.data.error.details[0].message;
      toast.error(
        errorMessage || TOAST_ERROR.ADD_VISIT_INTERNAL_FEEDBACK.MESSAGE,
        {
          toastId: TOAST_ERROR.ADD_VISIT_INTERNAL_FEEDBACK.ID,
        },
      );
      dispatch(setLoading({ key: 'isFeedbackFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFeedbackFormLoader', value: false }));
  };
};

export const deleteInternalFeedbackAction = (visitId, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isFeedbackLoader', value: true }));
    try {
      const res = await DeleteInternalFeedbackApiCall(visitId);
      cb(res);
    } catch (error) {
      if (error?.response?.status !== RESPONSE_STATUS.NOT_FOUND) {
        const errorMessage =
          error?.response?.data?.error?.details?.length &&
          error.response.data.error.details[0].message;
        toast.error(
          errorMessage || TOAST_ERROR.DELETE_VISIT_INTERNAL_FEEDBACK.MESSAGE,
          {
            toastId: TOAST_ERROR.DELETE_VISIT_INTERNAL_FEEDBACK.ID,
          },
        );
      }
      dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isFeedbackLoader', value: false }));
  };
};

export const checkFeedbackExistsAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isLoading', value: true }));
    try {
      const res = await checkFeedbackExists(visitId);
      cb(res);
    } catch (error) {
      toast.error(
        error?.message || TOAST_ERROR.CHECK_FEEDBACK_EXISTS_ACTION.MESSAGE,
        {
          toastId: TOAST_ERROR.CHECK_FEEDBACK_EXISTS_ACTION.ID,
        },
      );
      dispatch(setLoading({ key: 'isLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isLoading', value: false }));
  };
};

export const getPublicFeedbackAction = (feedbackId = '', cb = () => {}) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading({ key: 'isGetPublicFeedbackLoading', value: true }));
      const res = await GetPublilcFeedbackApiCall(feedbackId);
      if (res) {
        cb && cb(res);
      }
    } catch (error) {
      dispatch(setLoading({ key: 'isGetPublicFeedbackLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isGetPublicFeedbackLoading', value: false }));
  };
};

export const addPublicFeedbackAction = (feedbackObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isPublicFeedbackFormLoader', value: true }));
    try {
      const res = await AddPublicFeedbackApiCall(feedbackObj);
      if (res) {
        cb(res);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.details?.length &&
        error.response.data.error.details[0].message;
      toast.error(
        errorMessage || TOAST_ERROR.ADD_VISIT_EXTERNAL_FEEDBACK.MESSAGE,
        {
          toastId: TOAST_ERROR.ADD_VISIT_EXTERNAL_FEEDBACK.ID,
        },
      );
      dispatch(setLoading({ key: 'isPublicFeedbackFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isPublicFeedbackFormLoader', value: false }));
  };
};
