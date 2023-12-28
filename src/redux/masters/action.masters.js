import { createAction } from '@reduxjs/toolkit';
import {
  getCountriesApiCall,
  getLocationApiCall,
  getMastersApiCall,
  getStateApiCall,
} from './http.masters';
import { setLocalStorageData } from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { toast } from 'react-toastify';
import { TOAST_ERROR } from '@/utils/constants/default.constants';

export const setLoading = createAction('masters/setLoading');
export const getAllMasters = createAction('masters/getAllMasters');
export const setAllMasters = createAction('masters/setAllMasters');
export const setCountries = createAction('masters/setCountries');
export const setState = createAction('masters/setState');
export const setLocation = createAction('masters/setLocation');

// eslint-disable-next-line no-unused-vars
export const getAllMastersAction = (filterParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isLoading', value: true }));
    try {
      const res = await getMastersApiCall(filterParams);
      if (res?.length && Array.isArray(res)) {
        dispatch(setAllMasters(res));

        const modifiedData = {};

        res.forEach((item) => {
          const key = item.key;
          const childLookup = item.childLookup.map((child) => ({
            value: child.key,
            label: child.value,
            data: child,
          }));
          modifiedData[key] = childLookup;
        });
        localStorage.setItem('ALL_LOOKUPS', JSON.stringify(modifiedData));
        cb && cb(res);
      } else {
        throw new Error('Invalid lookup response');
      }
    } catch (error) {
      toast.error(error?.message || TOAST_ERROR.ALL_MASTERS_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.ALL_MASTERS_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isLoading', value: false }));
  };
};

// eslint-disable-next-line no-unused-vars
export const getAllStateAction = (filterParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isLoading', value: true }));
    try {
      const res = await getStateApiCall(filterParams);
      if (res?.length) {
        const stateArray = [];
        res.forEach((state) => {
          if (
            state.stateId &&
            state.name &&
            state.abbrevation &&
            state.countryId
          )
            stateArray.push({
              value: state.stateId,
              label: state.name + ' (' + state.abbrevation + ')',
              countryId: state.countryId,
            });
        });
        // in response only send array
        dispatch(setState(stateArray));
        // Set In localStorage if need
        setLocalStorageData(LOCAL_STORAGE_KEYS.STATES, stateArray);
      }
    } catch (error) {
      dispatch(setLoading({ key: 'isLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isLoading', value: false }));
  };
};

export const getAllLocationAction = (filterParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isLoading', value: true }));
    try {
      const res = await getLocationApiCall(filterParams);
      if (res?.length) {
        const locationArray = [];
        res.forEach((location) => {
          if (
            location.locationId &&
            location.name &&
            location.abbrevation &&
            location.countryId
          )
            locationArray.push({
              value: location.locationId,
              label: location.name + ' (' + location.abbrevation + ')',
              countryId: location.countryId,
            });
          locationArray.push({
            value: location.locationId,
            label: location.name,
          });
        });
        // in response only send array
        dispatch(setLocation(locationArray));
        // Set In localStorage if need
        setLocalStorageData(LOCAL_STORAGE_KEYS.LOCATIONS, locationArray);
      }
    } catch (error) {
      dispatch(setLoading({ key: 'isLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isLoading', value: false }));
  };
};

// eslint-disable-next-line no-unused-vars
export const getAllCountriesAction = (filterParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isLoading', value: true }));
    try {
      const res = await getCountriesApiCall(filterParams);
      if (res?.length) {
        const countryArray = [];
        res.forEach((country) => {
          if (
            country.countryId &&
            country.name &&
            country.countryCode &&
            country.isdCode
          )
            countryArray.push({
              value: country.countryId,
              label: country.name + ' (' + country.countryCode + ')',
              name: country.name,
              countryCode: country.countryCode,
              isdCode: country.isdCode,
            });
        });
        // in response only send array
        dispatch(setCountries(countryArray));
        // Set In localStorage if need
        setLocalStorageData(LOCAL_STORAGE_KEYS.COUNTRIES, countryArray);
      }
    } catch (error) {
      dispatch(setLoading({ key: 'isLoading', value: false }));
    }
    dispatch(setLoading({ key: 'isLoading', value: false }));
  };
};
