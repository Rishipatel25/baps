export const API_ENDPOINT = {
  ADD_VISITS: '/visits',
  GET_ALL_VISITS: '/visits',
  GET_VISIT: '/visits',
  GET_SEARCH_VISIT: '/visits',
  UPDATE_VISIT: '/visits',
  UPDATE_VISIT_STATUS: '/visits',
  GET_VISIT_STATUS: '/visits',
  GET_ALL_VISIT_DOCUMENTS: '/visits',
  ADD_VISIT_DOCUMENTS: '/visits',
  DELETE_VISIT_DOCUMENTS: '/visits',
  GET_ALL_VISIT_SERVICES: '/visits',
  GET_SCHEDULE: '/visits',
  GET_VISIT_PERSONNEL: '/visits/:visitId/personnel',
  SEARCH_VISITOR: 'visitors?search=',

  //Pre-booked Visit
  GET_ALL_PRE_BOOKED_VISITS: '/pre-booked',
  GET_PRE_BOOKED_VISITS: '/pre-booked/:visitId',
  UPDATE_PRE_BOOKED_VISITS: '/pre-booked/:visitId',

  // Teams
  GET_TEAMS: '/visits',
  UPDATE_TEAMS: '/visits',
  EXTERNAL_FEEDBACK: '/visits',

  //Services-Meetings
  SERVICES_TEMPLATES: '/services',
  GET_ALL_SERVICES_TEMPLATES: '/visits/:visitId/services?serviceType=SERVICE',
  GET_ALL_MEETING_TEMPLATE: '/visits/:visitId/services?serviceType=MEETING',
  ADD_SERVICES_TEMPLATES: '/visits/:visitId/services',
  UPDATE_SERVICES_TEMPLATES: '/visits/:visitId/services/:visitServiceId',
  GET_SERVICES_TEMPLATES: '/visits/:visitId/services/:visitServiceId',
  DELETE_SERVICES_TEMPLATES: '/visits/:visitId/services/:visitServiceId',

  // Visit Tour
  ADD_VISIT_TOUR: '/visits',
  GET_VISIT_TOUR: '/visits',
  UPDATE_VISIT_TOUR: '/visits',

  // Feedback
  ADD_VISIT_EXTERNAL_FEEDBACK: '/visits/:visitId/feedbacks/external',
  GET_VISIT_EXTERNAL_FEEDBACK: '/visits/:visitId/feedbacks/external',
  ADD_VISIT_INTERNAL_FEEDBACK: '/visits/:visitId/feedbacks/internal',
  GET_VISIT_INTERNAL_FEEDBACK: '/visits/:visitId/feedbacks/internal',
  DELETE_VISIT_INTERNAL_FEEDBACK: '/visits/:visitId/feedbacks/internal',

  // Public Feedback
  GET_PUBLIC_FEEDBACK: '/visits/feedbacks/:visitFeedbackId/public',
  ADD_VISIT_PUBLIC_FEEDBACK: '/visits/feedbacks/:visitFeedbackId/public',

  // Interview Setup
  GET_INTERVIEW_SETUP: '/visits/:visitId/interview-setup',
  SAVE_INTERVIEW_SETUP: '/visits/:visitId/interview-setup',
  DELETE_INTERVIEW_SETUP: '/visits/:visitId/interview-setup',

  // Roles
  GET_ROLES: '/roles',

  // Personnel
  GET_ALL_PERSONNEL: '/personnel',
  GET_PERSONNEL: 'personnel',
  GET_AVAILABLE_PERSONNEL: '/personnel/available',
  GET_AVAILABLE_TOKEN: '/personnel/token',

  // PUBLIC API
  GET_ALL_LOOKUP_API: '/lookup/public',
  GET_ALL_STATE_API: '/states/public',
  GET_ALL_COUNTRIES_API: '/countries/public',
  GET_ALL_LOCATIONS_API: '/locations/public',

  // Feedback
  CHECK_FEEDBACK_EXISTS: '/visits',

  // Tour slots
  TOUR_SLOT: {
    BASE: '/tour-slots',
    STAGE: '/tour-slots/stages',
    GET_TOUR_SLOTS: '/tour-slots',
    UPDATE_TOGGLE_TOUR_SLOTS: '/tour-slots/stages',
  },

  GET_ALL_TOUR_PAGE_SLOT: '/tour-slots/visits-associated',
  // Site
  GET_SITE_UUCODE: '/sites/uucode',
};

// visit: {
//   base: '/visits',
//   doc: '/doc',
// }
