import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const GetVisitTourApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.GET_VISIT_TOUR}/${visitId}/tours`;
    const res = axiosInstance.get(url);

    return res;
  } catch (error) {
    return error;
  }
};

export const AddVisitTourApiCall = (tourObj) => {
  try {
    const { visitId, tourData } = tourObj;
    const url = `${API_ENDPOINT.ADD_VISIT_TOUR}/${visitId}/tours`;
    const res = axiosInstance.post(url, { ...tourData });
    return res;
  } catch (error) {
    return error;
  }
};

export const UpdateVisitTourApiCall = (tourObj) => {
  try {
    const { visitId, tourData } = tourObj;
    const url = `${API_ENDPOINT.UPDATE_VISIT_TOUR}/${visitId}/tours`;
    const res = axiosInstance.put(url, { ...tourData });
    return res;
  } catch (error) {
    return error;
  }
};
