import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const GetSiteInfoApiCall = () => {
  try {
    const res = axiosInstance.get(API_ENDPOINT.GET_SITE_UUCODE);
    return res;
  } catch (error) {
    return error;
  }
};
