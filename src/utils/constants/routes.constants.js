// All Routes
export const ROUTES = {
  BASE: '/',
  AUTHENTICATION: {
    BASE: '/authentication',
    LOGIN: '/login',
  },
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
  MAINTAINENCE: '/maintenance',
  FEEDBACK: '/feedback',
  DASHBOARD: '/dashboard',
  JSON_FORM: '/jsonForm',
  VISITS: {
    BASE: '/visits',
    ALL: '/all',
    PENDING: '/pending',
    ACCEPTED: '/accepted',
    ACTIVE: '/active',
  },
  TOUR: {
    BASE: '/tours',
    TODAY: '/today',
    UPCOMING: '/upcoming',
    ALL: '/all',
  },
  TOUR_SLOTS: '/tourslots',
};

// Add Protected routes here
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,

  // Visit
  ROUTES.VISITS.BASE,
  ROUTES.VISITS.BASE + ROUTES.VISITS.ALL,
  ROUTES.VISITS.BASE + ROUTES.VISITS.PENDING,
  ROUTES.VISITS.BASE + ROUTES.VISITS.ACCEPTED,
  ROUTES.VISITS.BASE + ROUTES.VISITS.ACTIVE,
  ROUTES.VISITS.BASE + ROUTES.FEEDBACK,

  // Tour
  ROUTES.TOUR.BASE,
  ROUTES.TOUR.BASE + ROUTES.TOUR.TODAY,
  ROUTES.TOUR.BASE + ROUTES.TOUR.UPCOMING,
  ROUTES.TOUR.BASE + ROUTES.TOUR.ALL,

  // Tour Slots
  ROUTES.TOUR_SLOTS,

  // Unauthorised route
  ROUTES.UNAUTHORIZED,

  // Forbidden route
  ROUTES.FORBIDDEN,
];

export const PROTECTED_ROUTES_PERMISSIONS = [
  {
    name: 'VIEW_VISIT_LIST',
    menu: [
      ROUTES.VISITS.BASE,
      ROUTES.VISITS.BASE + ROUTES.VISITS.ALL,
      ROUTES.VISITS.BASE + ROUTES.VISITS.PENDING,
      ROUTES.VISITS.BASE + ROUTES.VISITS.ACCEPTED,
      ROUTES.VISITS.BASE + ROUTES.VISITS.ACTIVE,
    ],
  },
  {
    name: 'VIEW_TOUR_SLOT_LIST',
    menu: [
      ROUTES.TOUR.BASE,
      ROUTES.TOUR.BASE + ROUTES.TOUR.TODAY,
      ROUTES.TOUR.BASE + ROUTES.TOUR.UPCOMING,
      ROUTES.TOUR.BASE + ROUTES.TOUR.ALL,
    ],
  },
];

// Authentication routes
export const AUTH_ROUTES = [
  ROUTES.AUTHENTICATION.BASE,
  ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN,
];

export const PUBLIC_ROUTES = [ROUTES.FEEDBACK, ROUTES.JSON_FORM];
