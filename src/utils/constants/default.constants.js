export const recordLimit = [10, 20, 30, 50];

export const TOUR_SLOT_INTERVAL = 30;

export const VISIT_STATUS = {
  DECLINED: 'DECLINED',
  CANCEL: 'CANCELLED',
  ACCEPT: 'ACCEPTED',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CLOSED: 'CLOSED',
  EXPIRED: 'EXPIRED',
};

export const TOUR_SLOT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PARTIALLY: 'PARTIALLY',
  BOOKED: 'BOOKED',
};

export const TOUR_LISTING_INNERWIDTH = 1200;

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  RELATION_MANAGER: 'Relationship Manager',
  GUEST_VISIT_COORDINATOR: 'Guest Visit Coordinator',
  TOUR_COORDINATOR: 'Tour Coordinator',
  TOUR_GUIDE: 'Tour Guide',
  SERVICE_COORDINATOR: 'Service Coordinator',
  MEETING_COORDINATOR: 'Meeting Coordinator',
  VISIT_ADMIN: 'Visit Admin',
  GUEST_USHER: 'Guest Usher',
};

export const RESPONSE_STATUS = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

export const ROLETAG_ENUM = {
  TEAM: 'TEAM',
  SERVICE_COORDINATOR: 'SERVICE_COORDINATOR',
  TOUR_COORDINATOR: 'TOUR_COORDINATOR',
  TOUR_GUIDE: 'TOUR_GUIDE',
  MEETING_COORDINATOR: 'MEETING_COORDINATOR',
  INTERVIEW_COORDINATOR: 'INTERVIEW_SETUP_COORDINATOR',
  INTERVIEW_VOLUNTEER: 'INTERVIEW_SETUP_VOLUNTEER',
};

export const VISIT_FILTER_QUERY_PARAMS_KEYS = {
  VISIT_STATUS: 'visitStatus',
  VISIT_TYPE: 'visitType',
  VISIT_START_DATE: 'startDate',
  VISIT_END_DATE: 'endDate',
  VISIT_SEARCH_TEXT: 'searchText',
  VISIT_LIST_PAGE_SIZE: 'pageSize',
  VISIT_LIST_CURENT_PAGE: 'currentPage',
  VISIT_LIST_SORT_PROPERTY: 'sortProperty',
  VISIT_LIST_SORT_DIRECTION: 'sortDirection',
};

export const TOUR_FILTER_QUERY_PARAMS_KEYS = {
  SLOT_TYPE: 'slotType',
  SLOT_START_DATE: 'startDate',
  SLOT_END_DATE: 'endDate',
  SLOT_SEARCH_TEXT: 'searchText',
  SLOT_LIST_PAGE_SIZE: 'pageSize',
  SLOT_LIST_CURENT_PAGE: 'currentPage',
  SLOT_ID: 'slotId',
};

export const TOAST_CONFIGURATION = {
  TIMER: 4000,
  ERROR_MESSAGE_TIMER: 6000,
};

export const TOAST_SUCCESS = {
  ONLINE: {
    MESSAGE: 'You are now online',
    ID: 'successOnline',
  },
  CHANGE_VISIT_STATUS_ACTION: {},
  successUpdateVisitAction: {
    MESSAGE: 'Visit updated successfully',
    ID: 'successUpdateVisitAction',
  },
  VISIT_CREATED_SUCCESSFULL: {
    MESSAGE: 'Visit created successfully',
    ID: 'visitCreatedSuccessfully',
  },
  DELETE_DOCUMENT: {
    MESSAGE: 'Document deleted successfully',
    ID: 'successDeleteDocument',
  },
  URL_COPIED: {
    MESSAGE: 'URL copied to clipboard',
    ID: 'urlCopied',
  },
  FEEDBACK_URL_COPIED: {
    MESSAGE: 'URL copied to clipboard',
    ID: 'feedbackUrlCopied',
  },
  DOCUMENT_ADDED: {
    MESSAGE: 'Document added successfully',
    ID: 'documentAdded',
  },
  SERVICE_TEMPLATE_ADDED: {
    MESSAGE: 'Service added successfully',
    ID: 'serviceTemplateAdded',
  },
  SERVICE_TEMPLATE_UPDATED: {
    MESSAGE: 'Service updated successfully',
    ID: 'serviceTemplateUpdated',
  },
  SERVICE_TEMPLATE_DELETED: {
    MESSAGE: 'Service deleted successfully',
    ID: 'serviceTemplateDeleted',
  },
  MEETING_TEMPLATE_ADDED: {
    MESSAGE: 'Meeting added successfully',
    ID: 'meetingTemplateAdded',
  },
  MEETING_TEMPLATE_UPDATED: {
    MESSAGE: 'Meeting updated successfully',
    ID: 'meetingTemplateUpdated',
  },
  MEETING_TEMPLATE_DELETED: {
    MESSAGE: 'Meeting deleted successfully',
    ID: 'meetingTemplateDeleted',
  },
  TOUR_ADDED: {
    MESSAGE: 'Tour added successfully',
    ID: 'successaddTourAction',
  },
  TOUR_UPDATED: {
    MESSAGE: 'Tour updated successfully',
    ID: 'successupdateTourAction',
  },
  EXTERNAL_FEEDBACK_ADDED: {
    MESSAGE: 'Feedback added successfully',
    ID: 'successaddExternalFeedbackAction',
  },
  INTERVIEW_SETUP_UPDATED: {
    MESSAGE: 'Audio Video updated successfully',
    ID: 'audioVideoAction',
  },
  TEXT_COPIED: {
    MESSAGE: 'Copied the text:',
  },
  UPDATE_TEAMS: {
    MESSAGE: 'Team members updated successfully',
    ID: 'updateTeamsAction',
  },
  ADD_TEAMS: {
    MESSAGE: 'Visit accepted and team members added',
    ID: 'addTeamsAction',
  },
  PRE_BOOOK_UPDATE: {
    MESSAGE: 'Tour visit updated successfully',
    ID: 'preBookVisitAction',
  },
};

export const TOAST_ERROR = {
  OFFLINE: {
    MESSAGE: 'You are offline. Please try again later',
    ID: 'offline',
  },
  PRIMARY_VISITOR_MODEL: {
    MESSAGE: 'Something went wrong',
    ID: 'primaryVisitorModel',
  },
  SAVE_WITHOUT_SECONDARY: {
    MESSAGE: 'Please fill mandatory filed of visit and primary guest.',
    ID: 'SAVE_WITHOUT_SECONDARY',
  },
  ALL_MASTERS_ACTION: {
    MESSAGE: 'Failed to get public lookup',
    ID: 'allMastersAction',
  },
  GETTING_PERSONNELS_ACTION: {
    MESSAGE: 'Failed to get personals',
    ID: 'gettingPersonnelsAction',
  },
  GET_ROLES_ACTION: {
    MESSAGE: 'Failed to get Roles',
    ID: 'getRolesAction',
  },
  CREATE_VISIT_FROM_ACTION: {
    MESSAGE: 'Invalid Form',
    ID: 'createVisitFromAction',
  },
  VISIT_FROM_ACTION: {
    MESSAGE: 'Invalid Visit Id',
    ID: 'visitFromAction',
  },
  GET_VISIT_SEARCH_ACTION: {
    MESSAGE: 'No data Found',
    ID: 'getVisitSearchAction',
  },
  CHANGE_VISIT_STATUS_ACTION: {
    MESSAGE: 'Failed to change status',
    ID: 'changeVisitStatusAction',
  },
  GET_VISIT_STATUS_ACTION: {
    MESSAGE: 'Failed to get status',
    ID: 'getVisitStatusAction',
  },
  GET_DOCUMENT_LIST_ACTION: {
    MESSAGE: 'Failed to get documents',
    ID: 'getDocumentListAction',
  },
  DELETE_DOCUMENT_ACTION: {
    MESSAGE: 'Failed to delete document',
    ID: 'deleteDocumentAction',
  },
  GET_ALL_SERVICES_ACTION: {
    MESSAGE: 'Failed to get services',
    ID: 'getAllServicesAction',
  },
  GET_SCHEDULE_ACTION: {
    MESSAGE: 'Failed to get schedule',
    ID: 'getScheduleAction',
  },
  DELETE_VISIT_SERVICE_ACTION: {
    MESSAGE: 'Failed to delete service',
    ID: 'deleteServiceAction',
  },
  ADD_TEAMS_ACTION: {
    MESSAGE: 'Failed to add teams',
    ID: 'addTeamsAction',
  },
  UPDATE_TEAMS_ACTION: {
    MESSAGE: 'Failed to update teams',
    ID: 'updateTeamsAction',
  },
  GET_TEAMS_ACTION: {
    MESSAGE: 'Failed to get teams',
    ID: 'getTeamsAction',
  },
  GET_PERSONNEL_ACTION: {
    MESSAGE: 'Failed to get Personnels',
    ID: 'getPersonnelAction',
  },
  GET_AVAILABLE_PERSONNEL_ACTION: {
    MESSAGE: 'Failed to get Available Coordinator',
    ID: 'getAvailablePersonnelAction',
  },
  GET_PERSONNEL_TOKEN: {
    MESSAGE: 'Failed to get Personnels Token',
    ID: 'getPersonnelTokenAction',
  },
  GET_AUDIO_VIDEO_ACTION: {
    MESSAGE: 'Failed to get audio video',
    ID: 'getAllAudioVideoAction',
  },
  DELETE_AUDIO_VIDEO_ACTION: {
    MESSAGE: 'Failed to delete audio video',
    ID: 'deleteAudioVideoAction',
  },
  ADD_VISIT_TOUR: {
    MESSAGE: 'Failed to add tour',
    ID: 'addTourAction',
  },
  UPDATE_VISIT_TOUR: {
    MESSAGE: 'Failed to update tour',
    ID: 'updateTourAction',
  },
  GET_VISIT_TOUR: {
    MESSAGE: 'Failed to get tour',
    ID: 'getTourAction',
  },
  ADD_VISIT_EXTERNAL_FEEDBACK: {
    MESSAGE: 'Failed to add external feedback',
    ID: 'addExternalFeedback',
  },
  GET_VISIT_EXTERNAL_FEEDBACK: {
    MESSAGE: 'Failed to get external feedback',
    ID: 'getExternalFeedbackAction',
  },
  GET_VISIT_INTERNAL_FEEDBACK: {
    MESSAGE: 'Failed to get internal feedback',
    ID: 'getInternalFeedbackAction',
  },
  ADD_VISIT_INTERNAL_FEEDBACK: {
    MESSAGE: 'Failed to add internal feedback',
    ID: 'addInternalFeedback',
  },
  DELETE_VISIT_INTERNAL_FEEDBACK: {
    MESSAGE: 'Failed to delete internal feedback',
    ID: 'deleteInternalFeedback',
  },
  SEARCH_MEETING_ACTION: {
    MESSAGE: 'Failed to get meetings',
    ID: 'searchMeetingsAction',
  },
  GET_ALL_MEETING_ACTION: {
    MESSAGE: 'Failed to get meetings',
    ID: 'getAllMeetingsAction',
  },
  GET_MEETING_ACTION: {
    MESSAGE: 'Failed to get meeting',
    ID: 'getMeetingsAction',
  },
  ADD_MEETING_ACTION: {
    MESSAGE: 'Failed to add meeting',
    ID: 'addMeetingsAction',
  },
  SAVE_AUDIO_VIDEO_ACTION: {
    MESSAGE: 'Failed to add audio video',
    ID: 'addAudioVideoAction',
  },
  UPDATE_MEETING_ACTION: {
    MESSAGE: 'Failed to update meeting',
    ID: 'updateMeetingsAction',
  },
  DELETE_MEETING_ACTION: {
    MESSAGE: 'Failed to delete meeting',
    ID: 'deleteMeetingsAction',
  },
  CHECK_FEEDBACK_EXISTS_ACTION: {
    MESSAGE: 'Failed to check feedback exists',
    ID: 'checkFeedbackExistsAction',
  },
  UPDATE_PRE_BOOK_ACTION: {
    MESSAGE: 'Failed to update pre-book tour',
    ID: 'updatetourPreBookAction',
  },
  TOGGLE_TOUR_SLOTS_ACTION: {
    MESSAGE: 'Failed to update slots',
    ID: 'TOGGLE_TOUR_SLOTS_ACTION',
  },
  UPDATE_TOUR_SLOT_CARD_ACTION: {
    MESSAGE: 'Failed to update slots',
    ID: 'UPDATE_TOUR_SLOT_CARD_ACTION',
  },
};

export const MODAL_MESSAGES = {
  COMPLETE_VISIT: {
    SUBMIT_BUTTON_TEXT: 'Save',
    CANCEL_BUTTON_TEXT: 'Cancel',
    TITLE: 'Complete visit',
    CONTENT: 'Are you sure? You want to complete the visit!',
  },
  CLOSE_VISIT: {
    SUBMIT_BUTTON_TEXT: 'yes',
    CANCEL_BUTTON_TEXT: 'Cancel',
    TITLE: 'Close visit',
    CONTENT: 'Are you sure? You want to close the visit!',
    FEEDBACK_SUBMIT: 'You have not submitted the feedback yet.',
  },
  REMOVE_FEEDBACK: {
    SUBMIT_BUTTON_TEXT: 'yes',
    CANCEL_BUTTON_TEXT: 'Cancel',
    TITLE: 'Remove feedback',
    CONTENT: 'Are you sure? You want to remove feedback!',
  },
  REMOVE_MEETING: {
    SUBMIT_BUTTON_TEXT: 'yes',
    CANCEL_BUTTON_TEXT: 'Cancel',
    TITLE: 'Remove Meeting',
    CONTENT: 'Are you sure? You want to remove the meeting!',
  },
  REMOVE_SERVICE: {
    SUBMIT_BUTTON_TEXT: 'yes',
    CANCEL_BUTTON_TEXT: 'Cancel',
    TITLE: 'Remove service',
    CONTENT: 'Are you sure? You want to remove the service!',
  },
  EDIT_FEEDBACK: {
    SUBMIT_BUTTON_TEXT: 'Yes',
    CANCEL_BUTTON_TEXT: 'No',
    TITLE: 'Edit feedback',
    CONTENT:
      'Edit will remove all the tour guide, tour coordinator and visit location data.',
  },
  EDIT_TOUR_TIME: {
    SUBMIT_BUTTON_TEXT: 'Submit',
    CANCEL_BUTTON_TEXT: 'Cancel',
    TITLE: 'Edit tour time',
    CONTENT:
      'Submit will remove all the tour guide, tour coordinator and visit location data.',
  },
  TIME_ERROR: {
    TITLE: 'Time error',
    CONTENT: 'Start and End time must be different.',
  },
};

export const TOUR_LISTING = [
  {
    tourid: 'vm-123-12312',
    name: 'Alice',
    date: '10-12-2023',
    startTime: '11:00AM - 12:00 PM',
    totalGuest: 200,
    tourGuide: 'John Smith',
    status: 'Completed',
  },

  {
    tourid: 'vm-456-78901',
    name: 'Bob',
    date: '10-12-2023',
    startTime: '10:30AM - 11:30 AM',
    totalGuest: 150,
    tourGuide: 'Emily Johnson',
    status: 'completed',
  },

  {
    tourid: 'vm-789-45678',
    name: 'Charlie',
    date: '11-02-2023',
    startTime: '1:00PM - 2:00 PM',
    totalGuest: 100,
    tourGuide: 'Sarah Davis',
    status: 'completed',
  },

  {
    tourid: 'vm-234-56789',
    name: 'David',
    date: '11-10-2023',
    startTime: '2:30PM - 3:30 PM',
    totalGuest: 75,
    tourGuide: 'Michael Wilson',
    status: 'completed',
  },

  {
    tourid: 'vm-567-12345',
    name: 'Eva',
    date: '11-10-2023',
    startTime: '3:30PM - 4:30 PM',
    totalGuest: 120,
    tourGuide: 'Linda Brown',
    status: 'completed',
  },

  {
    tourid: 'vm-890-23456',
    name: 'Frank',
    date: '12-05-2023',
    startTime: '9:30AM - 10:30 AM',
    totalGuest: 180,
    tourGuide: 'James Lee',
    status: 'completed',
  },

  {
    tourid: 'vm-123-67890',
    name: 'Grace',
    date: '12-12-2023',
    startTime: '11:30AM - 12:30 PM',
    totalGuest: 250,
    tourGuide: 'Sophia Martin',
    status: 'completed',
  },

  {
    tourid: 'vm-456-34567',
    name: 'Henry',
    date: '12-1-2023',
    startTime: '2:00PM - 3:00 PM',
    totalGuest: 95,
    tourGuide: 'Daniel Turner',
    status: 'completed',
  },

  {
    tourid: 'vm-789-67890',
    name: 'Ivy',
    date: '01-04-2024',
    startTime: '10:00AM - 11:00 AM',
    totalGuest: 110,
    tourGuide: 'Olivia Harris',
    status: 'completed',
  },

  {
    tourid: 'vm-234-23456',
    name: 'Jack',
    date: '01-10-2024',
    startTime: '3:00PM - 4:00 PM',
    totalGuest: 160,
    tourGuide: 'William Turner',
    status: 'completed',
  },
];

export const TOUR_SLOT_LISTING = {
  pageNo: 1,
  pageSize: 1,
  totalCount: 1,
  totalPages: 1,
  response: [
    {
      visitId: 'd5587798-5365-4bb3-ad23-a67f7159d636',
      requestNumber: 'TM-011223-0007',
      stage: 'ACCEPTED',
      startDateTime: '2023-12-28 09:30:00',
      endDateTime: '2023-12-28 10:29:59',
      tourSlotId: '3a280845-c26d-4691-8b64-b392c4926c5d',
      totalVisitors: 1,
      childFemaleCount: null,
      childMaleCount: null,
      adultFemaleCount: null,
      adultMaleCount: null,
      seniorFemaleCount: null,
      seniorMaleCount: null,
      primaryVisitorModel: {
        visitorId: 'e6c60ff4-1cc6-4a07-992b-9c76e7dd3aca',
        salutation: '',
        firstName: 'Mukesh1234',
        middleName: null,
        lastName: 'singht1234',
        gender: '',
        addressLine1: null,
        addressLine2: null,
        country: null,
        state: 'gujrat1234',
        city: 'ahemdabad1234',
        postalCode: '38255124',
        email: 'apps.vtms@bapffs.dev1234',
        phoneCountryCode: '',
        phoneNumber: '82844564',
        preferredCommMode: null,
        designation: null,
        organizationName: null,
        organizationAddress: null,
        organizationWebsite: null,
        telegramId: null,
        facebookId: null,
        linkedinId: null,
        twitterId: null,
        instagramId: null,
        visitorType: null,
      },
      tourGuidePersonnelBasicInfoModel: {
        personnelId: 'fc28af16-96cf-4cbf-97d2-19dac1e5eee7',
        firstName: 'Nita',
        middleName: null,
        lastName: 'Rabara',
        phoneCountryCode: '+91',
        phoneNumber: '3200340914',
        email: 'apps.vtms@baps.dev',
      },
      createdAt: '2023-12-01 15:15:36',
    },
  ],
};
