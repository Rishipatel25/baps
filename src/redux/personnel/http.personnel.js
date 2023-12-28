import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const GetPersonnelApiCall = (personnelParams) => {
  try {
    let url = `${API_ENDPOINT.GET_PERSONNEL}`;
    personnelParams && (url += personnelParams);
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const GetAvailablePersonnelApiCall = (personnelParams) => {
  try {
    const res = axiosInstance.get(API_ENDPOINT.GET_AVAILABLE_PERSONNEL, {
      params: personnelParams,
    });
    return res;
  } catch (error) {
    return error;
  }
};

//get personel token
export const GetPersonnelTokenApiCall = (token = '') => {
  try {
    const res = axiosInstance.get(API_ENDPOINT.GET_AVAILABLE_TOKEN, {
      headers: {
        Authorization: token,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};
