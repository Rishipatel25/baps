import { createAction } from '@reduxjs/toolkit';
import {
  GenerateTourSlotsApiCall,
  GetTourSlotsApiCall,
  UpdateTourSlotStatusApiCall,
  UpdateTourSlotsApiCall,
} from './http.tour-slots';
import { tourSlotSetData } from '@/utils/helper.utils';
import {
  TOAST_CONFIGURATION,
  TOAST_ERROR,
} from '@/utils/constants/default.constants';
import { toast } from 'react-toastify';

export const setLoading = createAction('tour-slots/setLoading');
export const setTourSlotData = createAction('tour-slots/setTourSlotData');
export const setTourTimingIntervals = createAction(
  'tour-slots/setTourTimingIntervals',
);

export const createTourSlotsAction = (slotParams, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourSlotLoader', value: true }));
    try {
      const res = await GenerateTourSlotsApiCall(slotParams);
      if (res.tourDaySlotModelList?.length) {
        const { flattenedTimeArray, newSlotArrayList } = tourSlotSetData(res);
        dispatch(setTourTimingIntervals(flattenedTimeArray));
        dispatch(setTourSlotData(newSlotArrayList));
        cb && cb(res);
      }
    } catch (error) {
      dispatch(setLoading({ key: 'isTourSlotLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourSlotLoader', value: false }));
  };
};

export const getTourSlotsAction = (slotParams, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourSlotLoader', value: true }));
    try {
      const res = await GetTourSlotsApiCall(slotParams);
      // const res = HOURLY_TOUR;
      if (res.tourDaySlotModelList?.length) {
        const { flattenedTimeArray, newSlotArrayList } = tourSlotSetData(res);
        dispatch(setTourTimingIntervals(flattenedTimeArray));
        dispatch(setTourSlotData(newSlotArrayList));
        cb && cb(res);
      } else {
        dispatch(setTourSlotData([]));
        dispatch(setTourTimingIntervals([]));
      }
    } catch (error) {
      dispatch(setLoading({ key: 'isTourSlotLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourSlotLoader', value: false }));
  };
};

export const updateTourSlotsStatusAction = (tourParams, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourSlotCardLoader', value: true }));
    try {
      const res = await UpdateTourSlotStatusApiCall(tourParams);
      cb && cb(res);
    } catch (error) {
      let errorMsg = TOAST_ERROR.UPDATE_TOUR_SLOT_CARD_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.UPDATE_TOUR_SLOT_CARD_ACTION.ID,
        autoClose: TOAST_CONFIGURATION.ERROR_MESSAGE_TIMER,
      });
      dispatch(setLoading({ key: 'isTourSlotCardLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourSlotCardLoader', value: false }));
  };
};

export const updateTourSlotsAction = (tourStatusParams, cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourSlotCardLoader', value: true }));
    try {
      const res = await UpdateTourSlotsApiCall(tourStatusParams);
      cb && cb(res);
    } catch (error) {
      let errorMsg = TOAST_ERROR.TOGGLE_TOUR_SLOTS_ACTION.MESSAGE;
      if (
        error?.response?.data?.error?.details &&
        error?.response?.data?.error?.details[0]
      ) {
        errorMsg = error?.response?.data?.error?.details[0].message;
      }
      toast.error(errorMsg, {
        toastId: TOAST_ERROR.TOGGLE_TOUR_SLOTS_ACTION.ID,
        autoClose: TOAST_CONFIGURATION.ERROR_MESSAGE_TIMER,
      });
      dispatch(setLoading({ key: 'isTourSlotCardLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isTourSlotCardLoader', value: false }));
  };
};
