import { ClientRouter } from '@/helpers/ClientRouter';
import { RESPONSE_STATUS } from '@/utils/constants/default.constants';
import { ROUTES } from '@/utils/constants/routes.constants';
import { getAuthToken } from '@/utils/helper.utils';
import axios from 'axios';

const API_END_POINT = process.env.NEXT_PUBLIC_BAKEND_API;
const axiosInstance = axios.create({
  baseURL: API_END_POINT,
  // Change Timeout in api call from here
  timeout: process.env.NEXT_PUBLIC_API_TIMEOUT,
  headers: {
    'x-app-api-version': process.env.NEXT_PUBLIC_BACKEND_API_VERSION,
    'x-app-public-token-key': process.env.NEXT_PUBLIC_TOKEN_KEY,
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = token;
    // Added site uucode
    config.headers['x-app-siteuucode'] =
      process.env.NEXT_PUBLIC_SITE_UUCODE || '';
    return config;
  },
  (error) => {
    // Do something with request error
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  },
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data;
  },
  (error) => {
    if (error?.response?.status === RESPONSE_STATUS.FORBIDDEN) {
      ClientRouter(ROUTES.FORBIDDEN);
    }
    if (error?.response?.status === RESPONSE_STATUS.UNAUTHORIZED) {
      ClientRouter(ROUTES.UNAUTHORIZED);
    }
    // Do something with response error
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  },
);

export default axiosInstance;
