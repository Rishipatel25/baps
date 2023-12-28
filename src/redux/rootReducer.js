import { mastersReducer } from './masters/reducer.masters';
import { personnelReducer } from './personnel/reducer.personnel';
import { rolesReducer } from './roles/reducer.roles';
import { tourReducer } from './tour/reducer.tour';
import { feedbackReducer } from './feedback/reducer.feedback';
import { visitsReducer } from './visits/reducer.visits';
import { tourSlotsReducer } from './tour-slots/reducer.tour-slots';
import { siteReducer } from './site/reducer.site';
import { tourPageSlotsReducer } from './tour-page/reducer.tour-page';
import { preBookReducer } from './pre-book/reducer.pre-book';

export const rootReducer = {
  visit: visitsReducer,
  masters: mastersReducer,
  roles: rolesReducer,
  personnel: personnelReducer,
  tour: tourReducer,
  feedback: feedbackReducer,
  tourSlots: tourSlotsReducer,
  site: siteReducer,
  tourPageSlots: tourPageSlotsReducer,
  preBooked: preBookReducer,
};
