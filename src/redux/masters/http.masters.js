import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const getMastersApiCall = (filterParams) => {
  let url = API_ENDPOINT.GET_ALL_LOOKUP_API;
  try {
    if (filterParams) url += filterParams;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getStateApiCall = (filterParams) => {
  let url = API_ENDPOINT.GET_ALL_STATE_API;
  try {
    if (filterParams) url += filterParams;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getLocationApiCall = (filterParams) => {
  let url = API_ENDPOINT.GET_ALL_LOCATIONS_API;
  try {
    if (filterParams) {
      url += filterParams
    } else {
      url += "?filter=serviceTypeEnum=='TOUR'";
    }
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getCountriesApiCall = (filterParams) => {
  let url = API_ENDPOINT.GET_ALL_COUNTRIES_API;
  try {
    if (filterParams) url += filterParams;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};
