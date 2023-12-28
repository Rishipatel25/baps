import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const GetRolesApiCall = (rolesParams = '') => {
  try {
    let url = `${API_ENDPOINT.GET_ROLES}`;
    url += rolesParams ? `?filter=${rolesParams}` : '';
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};
