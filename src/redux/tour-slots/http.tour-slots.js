import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const GenerateTourSlotsApiCall = (slotParams) => {
  try {
    const res = axiosInstance.post(API_ENDPOINT.TOUR_SLOT.BASE, {
      ...slotParams,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const GetTourSlotsApiCall = (slotParams) => {
  try {
    const res = axiosInstance.get(API_ENDPOINT.TOUR_SLOT.BASE, {
      params: slotParams,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const UpdateTourSlotStatusApiCall = (tourParams) => {
  try {
    const { tourSlotId, data } = tourParams;
    const url = API_ENDPOINT.TOUR_SLOT.BASE + '/' + tourSlotId;
    const res = axiosInstance.put(url, data);
    return res;
  } catch (error) {
    return error;
  }
};

export const UpdateTourSlotsApiCall = (tourStatusParams) => {
  try {
    const url = API_ENDPOINT.TOUR_SLOT.UPDATE_TOGGLE_TOUR_SLOTS;
    const res = axiosInstance.put(url, { ...tourStatusParams });
    return res;
  } catch (error) {
    return error;
  }
};
