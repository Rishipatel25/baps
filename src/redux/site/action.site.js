import { createAction } from '@reduxjs/toolkit';
import { GetSiteInfoApiCall } from './http.site';

export const setLoading = createAction('site/setLoading');
export const setSiteInfo = createAction('site/setSiteInfo');

export const getSiteInfoAction = (cb = () => {}) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isSiteCodeLoader', value: true }));
    try {
      const res = await GetSiteInfoApiCall();
      res && dispatch(setSiteInfo(res));
      cb && cb(res);
    } catch (error) {
      dispatch(setLoading({ key: 'isSiteCodeLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isSiteCodeLoader', value: false }));
  };
};
