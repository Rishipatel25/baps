import { createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  GetAvailablePersonnelApiCall,
  GetPersonnelApiCall,
  GetPersonnelTokenApiCall,
} from './http.personnel';
import { TOAST_ERROR } from '@/utils/constants/default.constants';
import {
  formateDate,
  generateOptions,
  setLocalStorageData,
  getLocalStorageData,
} from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { ClientRouter } from '@/helpers/ClientRouter';
import { ROUTES } from '@/utils/constants/routes.constants';

export const setLoading = createAction('personnel/setLoading');
export const setPersonnelOptions = createAction(
  'personnel/setPersonnelOptions',
);
export const setCurrentUserRoles = createAction(
  'personnel/setCurrentUserRoles',
);
export const setSelectedRole = createAction('personnel/setSelectedRole');
export const setCurrentLoggedInUser = createAction(
  'personnel/setCurrentLoggedInUser',
);
export const setCoordinatorOptions = createAction(
  'personnel/setCoordinatorOptions',
);
export const resetCoordinatorOptions = createAction(
  'personnel/resetCoordinatorOptions',
);

export const getAllPersonnelAction = (personnelParams) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isPersonnelLoader', value: true }));
    try {
      const res = await GetPersonnelApiCall(personnelParams);
      if (res?.length) {
        const personnelOptions = res.map((personnel) => ({
          label: personnel.firstName + ' ' + personnel.lastName,
          value: personnel.personnelId,
          data: personnel,
        }));
        dispatch(setPersonnelOptions(personnelOptions));
      }
    } catch (error) {
      toast.error(TOAST_ERROR.GET_PERSONNEL_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_PERSONNEL_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isPersonnelLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isPersonnelLoader', value: false }));
  };
};

export const getAvailablePersonnelAction = (personnelParams, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isAvailableLoader', value: true }));
    try {
      personnelParams.endDateTime = formateDate(
        personnelParams.endDateTime,
        'YYYY-MM-DD hh:mm A',
        'YYYY-MM-DD HH:mm:ss',
      ).formattedDate;
      personnelParams.startDateTime = formateDate(
        personnelParams.startDateTime,
        'YYYY-MM-DD hh:mm A',
        'YYYY-MM-DD HH:mm:ss',
      ).formattedDate;
      const res = await GetAvailablePersonnelApiCall(personnelParams);
      if (res?.length) {
        const personnelOptions = res.map((personnel) => ({
          label: personnel?.firstName + ' ' + personnel?.lastName,
          value: personnel.personnelId,
          data: personnel,
        }));
        cb({ options: personnelOptions, res });
      }
    } catch (error) {
      toast.error(TOAST_ERROR.GET_AVAILABLE_PERSONNEL_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_AVAILABLE_PERSONNEL_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isAvailableLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isAvailableLoader', value: false }));
  };
};

export const getPersonnelTokenAction = (token, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isPersonnelTokenLoader', value: true }));
    try {
      const res = await GetPersonnelTokenApiCall(token);
      if (res) {
        const roles = generateOptions({
          arrayList: res?.roleModelList || [],
          label: 'name',
          value: 'roleId',
        });
        setLocalStorageData(LOCAL_STORAGE_KEYS.CURRENT_USER, { ...res, token });
        dispatch(setCurrentLoggedInUser({ ...res, token }));
        dispatch(setCurrentUserRoles(roles));
        if (roles && roles.length > 0) {
          const currentRole = getLocalStorageData(
            LOCAL_STORAGE_KEYS.CURRENT_ROLE,
          );
          const sel = currentRole
            ? roles.find((d) => d.value === currentRole)
            : null;
          if (sel) {
            dispatch(setSelectedRole(sel));
          } else {
            setLocalStorageData(
              LOCAL_STORAGE_KEYS.CURRENT_ROLE,
              roles[0].value,
            );
            dispatch(setSelectedRole(roles[0]));
          }
        }
        if (cb) cb(res);
      }
    } catch (error) {
      const errorTimer = 2500;
      const errorMessage =
        error?.response?.data?.error?.details?.length &&
        error?.response?.data?.error?.details[0].message;
      toast.error(errorMessage || TOAST_ERROR.GET_PERSONNEL_TOKEN.MESSAGE, {
        toastId: TOAST_ERROR.GET_PERSONNEL_TOKEN.ID,
        autoClose: errorTimer,
      });

      localStorage.clear();
      // Added set timeout to prevent toast to remove when url changes
      setTimeout(() => {
        ClientRouter(ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN);
      }, errorTimer);

      dispatch(setLoading({ key: 'isPersonnelTokenLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isPersonnelTokenLoader', value: false }));
  };
};
