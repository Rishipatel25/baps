import { createAction } from '@reduxjs/toolkit';
import {
  getAllPreBookedListApiCall,
  getPreBookedApiCall,
  updatePreBookedApiCall,
} from './http.pre-book';
import { TOAST_ERROR } from '@/utils/constants/default.constants';
import { toast } from 'react-toastify';
import axios from 'axios';

export const setLoading = createAction('pre-book/setLoading');
export const setPreBookList = createAction('pre-book/setPreBookList');
export const setPreBookMetaData = createAction('pre-book/setPreBookMetaData');

export const getAllPreBookedListAction = (
  visitsParams,
  successCb = () => {},
  errorCb = () => {},
) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isPreBookGetAllLoading', value: true }));
    try {
      const res = await getAllPreBookedListApiCall(visitsParams);
      if (res) {
        const { response, ...rest } = res;
        dispatch(setPreBookList(response || []));
        dispatch(setPreBookMetaData(...rest));
        successCb && successCb(response || []);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        errorCb && errorCb(error);
        dispatch(setLoading({ key: 'isPreBookGetAllLoading', value: false }));
      }
    }
    dispatch(setLoading({ key: 'isPreBookGetAllLoading', value: false }));
  };
};

export const getPreBookedAction = (visitId, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isGetByIdLoader', value: true }));
    try {
      const res = await getPreBookedApiCall(visitId);
      cb(res);
    } catch (error) {
      dispatch(setLoading({ key: 'isGetByIdLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isGetByIdLoader', value: false }));
  };
};

export const updatePreBookedAction = (tourObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isPreBookUpdateLoading', value: true }));
    try {
      const res = await updatePreBookedApiCall(tourObj);
      if (res) {
        cb();
      }
    } catch (error) {
      let errorMsg = TOAST_ERROR.UPDATE_PRE_BOOK_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, { toastId: TOAST_ERROR.UPDATE_PRE_BOOK_ACTION.ID });
      dispatch(setLoading({ key: 'isPreBookUpdateLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isPreBookUpdateLoading', value: false }));
  };
};
