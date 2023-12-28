import { createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  AddVisitTourApiCall,
  GetVisitTourApiCall,
  UpdateVisitTourApiCall,
} from './http.tour';
import {
  RESPONSE_STATUS,
  TOAST_ERROR,
} from '@/utils/constants/default.constants';
import { getVisitTourTab } from '@/utils/helper.utils';

export const setLoading = createAction('tour/setLoading');
export const setVisitTourFormData = createAction('tour/setVisitTourFormData');

export const getTourAction = (visitId, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourLoader', value: true }));
    try {
      const res = await GetVisitTourApiCall(visitId);
      if (res) {
        const formData = getVisitTourTab(res);
        formData.isEditForm = true;
        dispatch(setVisitTourFormData(res));
        cb({ res, formData });
      }
    } catch (error) {
      if (error?.response?.status !== RESPONSE_STATUS.NOT_FOUND) {
        const errorMessage =
          error?.response?.data?.error?.details?.length &&
          error.response.data.error.details[0].message;
        toast.error(errorMessage || TOAST_ERROR.GET_VISIT_TOUR.MESSAGE, {
          toastId: TOAST_ERROR.GET_VISIT_TOUR.ID,
        });
      }
      dispatch(setLoading({ key: 'isTourLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourLoader', value: false }));
  };
};

export const addTourAction = (tourObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourFormLoader', value: true }));
    try {
      const res = await AddVisitTourApiCall(tourObj);
      if (res) {
        dispatch(setVisitTourFormData(res));
        cb(res);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.details?.length &&
        error.response.data.error.details[0].message;
      toast.error(errorMessage || TOAST_ERROR.ADD_VISIT_TOUR.MESSAGE, {
        toastId: TOAST_ERROR.ADD_VISIT_TOUR.ID,
      });
      dispatch(setLoading({ key: 'isTourFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourFormLoader', value: false }));
  };
};

export const updateTourAction = (tourObj, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourFormLoader', value: true }));
    try {
      const res = await UpdateVisitTourApiCall(tourObj);
      if (res) {
        dispatch(setVisitTourFormData(res));
        cb(res);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.details?.length &&
        error.response.data.error.details[0].message;
      toast.error(errorMessage || TOAST_ERROR.UPDATE_VISIT_TOUR.MESSAGE, {
        toastId: TOAST_ERROR.UPDATE_VISIT_TOUR.ID,
      });
      dispatch(setLoading({ key: 'isTourFormLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourFormLoader', value: false }));
  };
};
