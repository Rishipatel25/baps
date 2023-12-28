import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

let getVisitListAboartController;

export const GetTourPageSlotListingApiCall = (tourParams) => {
  try {
    if (getVisitListAboartController) {
      getVisitListAboartController.abort();
    }
    getVisitListAboartController = new AbortController();
    const res = axiosInstance.get(API_ENDPOINT.GET_ALL_TOUR_PAGE_SLOT, {
      params: tourParams,
      signal: getVisitListAboartController.signal,
    });
    return res;
  } catch (error) {
    return error;
  }
};
