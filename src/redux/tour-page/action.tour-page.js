import { createAction } from '@reduxjs/toolkit';
import { GetTourPageSlotListingApiCall } from './http.tour-page';
import { checkObjectKey } from '@/utils/helper.utils';
import axios from 'axios';

export const setLoading = createAction('tour-page/setLoading');
export const setTourPageSLotList = createAction(
  'tour-page/setTourPageSLotList',
);
export const setTourPageSLotMetaData = createAction(
  'tour-page/setTourPageSLotMetaData',
);

export const getTourPageSlotListing = (
  tourParams,
  successCb = () => {},
  errorCb = () => {},
) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isTourPageSlotLoader', value: true }));
    try {
      const res = await GetTourPageSlotListingApiCall(tourParams);
      if (res) {
        const { response, ...rest } = res;
        const metaInfo = { ...rest };
        const slotList = response?.length ? response : [];
        dispatch(
          setTourPageSLotMetaData(checkObjectKey(metaInfo) ? metaInfo : {}),
        );
        dispatch(setTourPageSLotList(slotList));

        successCb && successCb(response || []);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        errorCb && errorCb(error);
        dispatch(setLoading({ key: 'isTourPageSlotLoader', value: false }));
      }
    }
    dispatch(setLoading({ key: 'isTourPageSlotLoader', value: false }));
  };
};
