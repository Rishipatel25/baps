import { createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { GetRolesApiCall } from './http.roles';
import { ROLETAG_ENUM, TOAST_ERROR } from '@/utils/constants/default.constants';

export const setLoading = createAction('roles/setLoading');
export const setTeamsRoles = createAction('roles/setTeamsRoles');
export const setMeetingCoordinatorOptions = createAction(
  'roles/setMeetingCoordinatorOptions',
);
export const setServiceCoordinatorOptions = createAction(
  'roles/setServiceCoordinatorOptions',
);
export const setInterviewCoordinatorOptions = createAction(
  'roles/setInterviewCoordinatorOptions',
);
export const setInterviewVolunteerOptions = createAction(
  'roles/setInterviewVolunteerOptions',
);
export const setTourCoordinatorOptions = createAction(
  'roles/setTourCoordinatorOptions',
);
export const setTourGuideCoordinatorOptions = createAction(
  'roles/setTourGuideCoordinatorOptions',
);

export const getRolesAction = (rolesParams = '', cb = () => { }) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: 'isRolesLoader', value: true }));
    try {
      const res = await GetRolesApiCall(rolesParams);
      if (res?.length) {
        if (!rolesParams) {
          const teamsRoles = [];
          const serviceCoordinatorRoles = [];
          const tourCoordinatorRoles = [];
          const tourGuideRoles = [];
          const meetingCoordinatorRoles = [];
          const interviewCoordinatorRoles = [];
          const interviewVolunteerRoles = [];
          res.forEach((element) => {
            if (element?.roleTagModelList) {
              element.roleTagModelList.forEach((role) => {
                if (role.tag === ROLETAG_ENUM.TEAM) {
                  teamsRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } else if (role.tag === ROLETAG_ENUM.MEETING_COORDINATOR) {
                  meetingCoordinatorRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } else if (role.tag === ROLETAG_ENUM.SERVICE_COORDINATOR) {
                  serviceCoordinatorRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } else if (role.tag === ROLETAG_ENUM.TOUR_COORDINATOR) {
                  tourCoordinatorRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } else if (role.tag === ROLETAG_ENUM.TOUR_GUIDE) {
                  tourGuideRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } else if (role.tag === ROLETAG_ENUM.INTERVIEW_COORDINATOR) {
                  interviewCoordinatorRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } else if (role.tag === ROLETAG_ENUM.INTERVIEW_VOLUNTEER) {
                  interviewVolunteerRoles.push({
                    label: element.name,
                    value: element.roleId,
                    data: element,
                  });
                } 
              });
            }
          });
          dispatch(setTeamsRoles(teamsRoles));
          dispatch(setMeetingCoordinatorOptions(meetingCoordinatorRoles));
          dispatch(setServiceCoordinatorOptions(serviceCoordinatorRoles));
          dispatch(setTourCoordinatorOptions(tourCoordinatorRoles));
          dispatch(setTourGuideCoordinatorOptions(tourGuideRoles));
          dispatch(setInterviewCoordinatorOptions(interviewCoordinatorRoles));
          dispatch(setInterviewVolunteerOptions(interviewVolunteerRoles))
        }

        const rolesOptions = res.map((role) => ({
          label: role.name,
          value: role.roleId,
          data: role,
        }));

        cb({ options: rolesOptions, response: res });
      }
    } catch (error) {
      toast.error(TOAST_ERROR.GET_ROLES_ACTION.MESSAGE, {
        toastId: TOAST_ERROR.GET_ROLES_ACTION.ID,
      });
      dispatch(setLoading({ key: 'isRolesLoader', value: false }));
    }
    dispatch(setLoading({ key: 'isRolesLoader', value: false }));
  };
};
