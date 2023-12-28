import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const GetExternalFeedbackApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.GET_VISIT_EXTERNAL_FEEDBACK.replace(
      ':visitId',
      visitId,
    )}`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const AddExternalFeedbackApiCall = (feedbackObj) => {
  try {
    const { visitId, feedbackData } = feedbackObj;
    const url = `${API_ENDPOINT.ADD_VISIT_EXTERNAL_FEEDBACK.replace(
      ':visitId',
      visitId,
    )}`;
    const res = axiosInstance.post(url, { ...feedbackData });
    return res;
  } catch (error) {
    return error;
  }
};

export const GetInternalFeedbackApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.GET_VISIT_INTERNAL_FEEDBACK.replace(
      ':visitId',
      visitId,
    )}`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const AddInternalFeedbackApiCall = (feedbackObj) => {
  try {
    const { visitId, feedbackData } = feedbackObj;
    const url = `${API_ENDPOINT.ADD_VISIT_INTERNAL_FEEDBACK.replace(
      ':visitId',
      visitId,
    )}`;
    const res = axiosInstance.post(url, { ...feedbackData });
    return res;
  } catch (error) {
    return error;
  }
};

export const DeleteInternalFeedbackApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.DELETE_VISIT_INTERNAL_FEEDBACK.replace(
      ':visitId',
      visitId,
    )}`;
    const res = axiosInstance.delete(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const checkFeedbackExists = (visitId) => {
  const url = `${API_ENDPOINT.CHECK_FEEDBACK_EXISTS}/${visitId}/feedbacks/external/exists`;
  try {
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const GetPublilcFeedbackApiCall = (feedbackId) => {
  try {
    const url = `${API_ENDPOINT.GET_PUBLIC_FEEDBACK.replace(
      ':visitFeedbackId',
      feedbackId,
    )}`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const AddPublicFeedbackApiCall = (feedbackObj) => {
  try {
    const { feedbackId, feedbackData } = feedbackObj;
    const url = `${API_ENDPOINT.ADD_VISIT_PUBLIC_FEEDBACK.replace(
      ':visitFeedbackId',
      feedbackId,
    )}`;
    const res = axiosInstance.post(url, { ...feedbackData });
    return res;
  } catch (error) {
    return error;
  }
};
