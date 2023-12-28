import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constants/api-endpoint.constants';

export const getAllVisitListApiCall = (visitParams) => {
  try {
    const res = axiosInstance.get(API_ENDPOINT.GET_ALL_VISITS, {
      params: { ...visitParams },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const createVisitApiCall = (visitData) => {
  try {
    const res = axiosInstance.post(API_ENDPOINT.ADD_VISITS, { ...visitData });
    return res;
  } catch (error) {
    return error;
  }
};

export const getVisitFormApiCall = (visitId) => {
  try {
    const url = API_ENDPOINT.GET_VISIT + '/' + visitId;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const SearchVisitApiCall = (serachParams) => {
  const { searchData, pageSize } = serachParams;
  try {
    const url = `/visits?pageNo=${1}&pageSize=${pageSize}&filter=requestNumber=="*${searchData}*"`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const FilterVisitApiCall = (serachParams) => {
  const { filterData1, page } = serachParams;
  const pageSize = page.pageSize;
  try {
    let url = `/visits?pageNo=${1}&pageSize=${pageSize}`;
    if (filterData1.visitStatus || filterData1.visitType) {
      url += '&filter=';
      //visitStatus
      if (filterData1.visitStatus) {
        if (filterData1.visitType) {
          url += `visitStageEnum=='${filterData1.visitStatus}';`;
        } else {
          url += `visitStageEnum=='${filterData1.visitStatus}'`;
        }
      }
      // visitType
      if (filterData1.visitType) {
        if (filterData1.visitStatus) {
          url += `typeOfVisit=='${filterData1.visitType}';`;
        } else {
          url += `typeOfVisit=='${filterData1.visitType}'`;
        }
      }
    }
    if (url.charAt(url.length - 1) == ';') {
      url = url.substring(0, url.length - 1); //for removing end ";" from url
    }
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const sortVisitApiCall = (serachParams) => {
  const { filterData1, pageSize } = serachParams;
  try {
    const url = `/visits?pageNo=${1}&pageSize=${pageSize}&filter=sortDirection=${filterData1.t1}&sortProperty=${filterData1.t2}`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const updateVisitFormApiCall = (visitData) => {
  try {
    const visitId = '/' + visitData?.visitId || '';
    const res = axiosInstance.put(`${API_ENDPOINT.UPDATE_VISIT}${visitId}`, {
      ...visitData,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateVisitStatusApiCall = (visitStatusInfo) => {
  try {
    const { visitId, visitStatusData } = visitStatusInfo;
    const url = `${API_ENDPOINT.UPDATE_VISIT_STATUS}/${visitId}/stage`;
    const res = axiosInstance.put(url, { ...visitStatusData });
    return res;
  } catch (error) {
    return error;
  }
};

export const getVisitStatusApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.GET_VISIT_STATUS}/${visitId}/stage`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getVisitPersonnelApiCall = (visitId) => {
  try {
    const url = API_ENDPOINT.GET_VISIT_PERSONNEL.replace(':visitId', visitId);
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const searchVisitorApiCall = (searchString) => {
  try {
    const url = API_ENDPOINT.SEARCH_VISITOR + searchString;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

// Document API
export const getAllDocumentsApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.GET_ALL_VISIT_DOCUMENTS}/${visitId}/documents`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const addDocumentsApiCall = (documentObj) => {
  try {
    const { visitId, documentData } = documentObj;
    const url = `${API_ENDPOINT.ADD_VISIT_DOCUMENTS}/${visitId}/documents`;
    const res = axiosInstance.post(url, { ...documentData });
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteDocumentsApiCall = (documentObj) => {
  try {
    const { visitId, title } = documentObj;
    const url = `${API_ENDPOINT.DELETE_VISIT_DOCUMENTS}/${visitId}/documents`;
    const res = axiosInstance.delete(url, { params: { title } });
    return res;
  } catch (error) {
    return error;
  }
};

export const GetScheduleDataApiCall = (scheduleParams) => {
  try {
    const { newVisitId } = scheduleParams;
    const url = `${API_ENDPOINT.GET_SCHEDULE}/${newVisitId}/schedules`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

// Teams api
export const AddTeamsApiCall = (teamsObj) => {
  try {
    const { visitId, teamsData } = teamsObj;
    const url = `${API_ENDPOINT.GET_ALL_VISIT_SERVICES}/${visitId}/teams`;
    const res = axiosInstance.post(url, [...teamsData]);
    return res;
  } catch (error) {
    return error;
  }
};

export const UpdateTeamsApiCall = (teamsObj) => {
  try {
    const { visitId, teamsData } = teamsObj;
    const url = `${API_ENDPOINT.UPDATE_TEAMS}/${visitId}/teams`;
    const res = axiosInstance.put(url, [...teamsData]);
    return res;
  } catch (error) {
    return error;
  }
};
export const GetTeamsApiCall = (visitId) => {
  try {
    const url = `${API_ENDPOINT.GET_TEAMS}/${visitId}/teams`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};
//Service API
export const searchServiceApiCall = (searchString) => {
  try {
    let url = `${API_ENDPOINT.SERVICES_TEMPLATES}`;
    if (searchString) {
      url = url + '?filter=' + searchString;
    }
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getAllServiceTemplateApiCall = (servicesParams) => {
  try {
    const { visitId } = servicesParams;
    const url = API_ENDPOINT.GET_ALL_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    );
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const createServiceTemplateApiCall = (templateObj) => {
  try {
    const { visitId, templateData } = templateObj;
    const url = API_ENDPOINT.ADD_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    );
    const res = axiosInstance.post(url, { ...templateData });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateServiceTemplateApiCall = (templateObj) => {
  try {
    const { visitId, visitServiceId, templateData } = templateObj;
    const url = API_ENDPOINT.UPDATE_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    ).replace(':visitServiceId', visitServiceId);
    const res = axiosInstance.put(url, { ...templateData });
    return res;
  } catch (error) {
    return error;
  }
};

export const getServiceTemplateApiCall = (visitId, visitServiceId) => {
  try {
    const url = API_ENDPOINT.GET_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    ).replace(':visitServiceId', visitServiceId);
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteServiceTemplateCall = (visitId, visitServiceId) => {
  try {
    const url = API_ENDPOINT.DELETE_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    ).replace(':visitServiceId', visitServiceId);
    const res = axiosInstance.delete(url);
    return res;
  } catch (error) {
    return error;
  }
};

//Meeting API
export const searchMeetingTemplateApiCall = (searchString) => {
  try {
    let url = `${API_ENDPOINT.SERVICES_TEMPLATES}`;
    if (searchString) {
      url = url + '?filter=' + searchString;
    }
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getAllMeetingTemplateApiCall = (servicesParams) => {
  try {
    const { visitId } = servicesParams;
    const url = API_ENDPOINT.GET_ALL_MEETING_TEMPLATE.replace(
      ':visitId',
      visitId,
    );
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const createMeetingTemplateApiCall = (templateObj) => {
  try {
    const { visitId, templateData } = templateObj;
    const url = API_ENDPOINT.ADD_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    );
    const res = axiosInstance.post(url, { ...templateData });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateMeetingTemplateApiCall = (templateObj) => {
  try {
    const { visitId, visitServiceId, templateData } = templateObj;
    const url = API_ENDPOINT.UPDATE_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    ).replace(':visitServiceId', visitServiceId);
    const res = axiosInstance.put(url, { ...templateData });
    return res;
  } catch (error) {
    return error;
  }
};

export const getMeetingTemplateApiCall = (visitId, visitServiceId) => {
  try {
    const url = API_ENDPOINT.GET_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    ).replace(':visitServiceId', visitServiceId);
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteMeetingTemplateCall = (visitId, visitServiceId) => {
  try {
    const url = API_ENDPOINT.DELETE_SERVICES_TEMPLATES.replace(
      ':visitId',
      visitId,
    ).replace(':visitServiceId', visitServiceId);
    const res = axiosInstance.delete(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const externalFeedbackApiCall = (feedbackParams) => {
  const { visitId } = feedbackParams;
  try {
    const url = `${API_ENDPOINT.EXTERNAL_FEEDBACK}/${visitId}/feedbacks/external`;
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

// Audio Video API
export const getAudioVideoApiCall = (visitId) => {
  try {
    const url = API_ENDPOINT.GET_INTERVIEW_SETUP.replace(':visitId', visitId);
    const res = axiosInstance.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteAudioVideoApiCall = (visitId) => {
  try {
    const url = API_ENDPOINT.DELETE_INTERVIEW_SETUP.replace(
      ':visitId',
      visitId,
    );
    const res = axiosInstance.delete(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const saveAudioVideoApiCall = (audioVideoObj) => {
  try {
    const { visitId, audioVideoData } = audioVideoObj;
    const url = API_ENDPOINT.SAVE_INTERVIEW_SETUP.replace(':visitId', visitId);
    const res = axiosInstance.put(url, { ...audioVideoData });
    return res;
  } catch (error) {
    return error;
  }
};
