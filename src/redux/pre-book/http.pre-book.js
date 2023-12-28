import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

let getPreBookListAboartController;

export const getAllPreBookedListApiCall = (visitParams) => {
  try {
    if (getPreBookListAboartController) {
      getPreBookListAboartController.abort();
    }
    getPreBookListAboartController = new AbortController();
    const res = axiosInstance.get(API_ENDPOINT.GET_ALL_PRE_BOOKED_VISITS, {
      params: { ...visitParams },
      signal: getPreBookListAboartController.signal,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const getPreBookedApiCall = (visitId) => {
  try {
    const url = API_ENDPOINT.GET_PRE_BOOKED_VISITS.replace(':visitId', visitId);
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const updatePreBookedApiCall = (tourObj) => {
  try {
    const { visitId, tourData } = tourObj;
    const url = API_ENDPOINT.UPDATE_PRE_BOOKED_VISITS.replace(
      ':visitId',
      visitId,
    );
    const res = axiosInstance.put(url, tourData);
    return res;
  } catch (error) {
    return error;
  }
};
