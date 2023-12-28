'use client';
/* eslint-disable no-console */

import moment from 'moment';
import { LOCAL_STORAGE_KEYS } from './constants/storage.constants';
import { TOUR_SLOT_STATUS } from './constants/default.constants';

export const getMonths = () => [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * This Function is used to convert Date Formate
 * @param {String} date Date string
 * @param {String} formatefrom Mention which formate date are you giving
 * @param {String} formateto Mention which formate date you want
 * @returns
 */
export const formateDate = (
  date,
  formatefrom = 'MM-DD-YYYY',
  formateto = 'MM-DD-YYYY',
) => {
  if (!date || typeof date !== 'string') return [];
  // Parse orignal date format
  const momentDate = moment(date, formatefrom);
  const data = {
    formattedDate: momentDate.format(formateto),
    date: momentDate.format('MM-DD-YYYY'),
    time: momentDate.format('HH:mm:ss'),
    timehm: momentDate.format('HH:mm'),
    timehmp: momentDate.format('hh:mm A'),
    full: momentDate.format(formateto + ' HH:mm:ss'),
    systemTime: moment(date).format('hh:mm A'),
    systemDate: moment(date).format('MM-DD-YYYY'),
    resDate: moment(date).format('YYYY-MM-DD'),
  };
  return data;
};

/**
  @params fields: Array of fields
  @params errors: Object of errors@returns boolean
  @description: This function will check if any of the field is in error state
*/
export const checkError = (fields, errors) => {
  let hasError = false;
  fields.forEach((element) => {
    if (element in errors) {
      hasError = true;
    }
  });
  return hasError;
};

/**
  @params selectedLanguage: String
  @returns String
  @description: This function will return the selected language
*/
export const setLanguagePreference = (selectedLanguage) => {
  localStorage.setItem(JSON.stringify(selectedLanguage));
};

/**
 *
 * @params window: Object
 * @returns Object
 * @description: This function will return the window dimensions
 */
export const getWindowDimensions = (window) => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const getDate = (date) => {
  if (!date) return '';
  const newDate = new Date(date);
  return `${
    newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()
  }/${
    newDate.getMonth() < 10
      ? `0${newDate.getMonth() + 1}`
      : newDate.getMonth() + 1
  }/${newDate.getFullYear()}`;
};

/**
 *
 * @param {String} key Key to get data from local storage
 * @param {Boolean} doParser doParser is a boolean value wheather to get parsed data or not
 * @returns It will return requested data from the localStorage
 */
export const getLocalStorageData = (key = '', doParser = true) => {
  let requestedData = null;
  try {
    const data = localStorage.getItem(key);
    if (doParser) requestedData = JSON.parse(data);
    else requestedData = data.replaceAll('"', '');
  } catch (error) {
    console.warn(
      `Something went wrong in getLocalStorageData localStorage key is ${key} and Error is ::: ${error}`,
    );
    requestedData = null;
  }
  return requestedData;
};

// set user details and access token
/**
 *
 * @param {String} key Key is used to identify local storage data
 * @param {String} value value is an data to store in local storage
 * @param {Boolean} doStringify doStringify is optional and by default it will be true
 */
export const setLocalStorageData = (
  key = '',
  value = '',
  doStringify = true,
) => {
  try {
    if (doStringify) value = JSON.stringify(value);
    localStorage.setItem(key, value);
  } catch (error) {
    console.log('ERROR from setLocalStorageData: ' + error);
  }

  //remove key if no value is passed
  if (!value) localStorage.removeItem(key);

  // below code used to set user data with encryption
  // const encrypt = CryptoJS.AES.encrypt(
  //   JSON.stringify(userDetails),
  //   process.env.REACT_APP_SECRET_KEY,
  // );
  // localStorage.setItem(USER_DETAILS_KEY, encrypt);
  // try {
  //   if (userDetails) {
  //     localStorage.setItem(USER_DETAILS_KEY, encrypt);
  //   } else {
  //     localStorage.removeItem(USER_DETAILS_KEY);
  //   }
  // } catch (error) {
  //   console.log('>>>>: src/helpers/Utils.js : setCurrentUser -> error', error);
  // }
};

// get access token from LS if available
// export const getUserAccessToken = () => {
//   const details = getUserDetails();
//   return details?.jsonToken;
// };

/**
 *
 * @param {Object} object
 * @param {String} key - Proerty of that  object
 * @returns date and time
 */
export const getDateTimeSplitter = (object = {}, key = '') => {
  let date,
    time = null;
  try {
    const array = object[key].split(' ');
    date = array[0];
    time = array[1].slice(0, -3);
  } catch (err) {
    date = null;
    time = null;
  }
  return { date, time };
};

/**
 * @param {String} string
 * @returns string
 * @description This function will return the string with first latter capital
 **/
export const firstLatterCapital = (string) => {
  string = string.trim();
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * @param {String} string
 * @returns object
 * @description This function will return the object in label, value and data format
 **/
export const lookupToObject = (key) => {
  let data = [];
  try {
    const storedData = JSON.parse(localStorage.getItem('ALL_LOOKUPS'));
    if (storedData) {
      data = storedData[key];
    }
  } catch (error) {
    data = [];
    console.error('ERROR in lookupToObject :', error);
  }
  return data;
};

/**
 *
 * @param  {String} key key of ALl_Lookups in localStorage
 * @returns  array of object
 */
export const localStorageToObject = (key) => {
  try {
    if (!key) {
      return [];
    }
    const data = JSON.parse(localStorage.getItem(key));
    const childLookup = data?.childLookup || {};
    return Object.values(childLookup)
      .filter((value) => value.key)
      .map(({ key }) => ({ label: key, value: key }));
  } catch (error) {
    console.error('Error parsing local storage data:', error);
    return [];
  }
};

/**
 * @param {String / Array} changedQueryParams query param of which to update
 * @param {Object} searchParams useSearchParams Client Component hook to read the current URL's query string.
 * @returns string of all query parameters excluding the changed query params
 */
export const generateUrlQueryParams = (changedQueryParams, searchParams) => {
  let urlQueryString = '';
  let count = 0;
  searchParams.forEach((value, key) => {
    if (!changedQueryParams.includes(key)) {
      urlQueryString =
        count === 0 ? `${key}=${value}` : urlQueryString + `&${key}=${value}`;
    }
    count++;
  });
  return urlQueryString;
};
export const checkObjectKey = (obj) => {
  if (!obj) {
    return false;
  }
  let isObjecthasKey = false;
  if (Object.keys(obj).length) {
    isObjecthasKey = true;
  }
  return isObjecthasKey;
};

export const sendVisitObject = (visitObject) => {
  const filteredObject = visitObject;
  if (filteredObject && checkObjectKey(filteredObject)) {
    filteredObject.startDateTime = `${filteredObject?.dateOfVisit} ${moment(
      filteredObject?.startDateTime,
      'HH:mm A',
    ).format('HH:mm')}:00`;
    filteredObject.endDateTime = `${filteredObject?.dateOfVisit} ${moment(
      filteredObject?.endDateTime,
      'HH:mm A',
    ).format('HH:mm')}:00`;
  }
  return filteredObject;
};

export const getVisitObject = (visitObject) => {
  const filteredObject = visitObject;

  // if requestPersonnelId is null or undefined then set to empty string
  if (checkObjectKey(filteredObject)) {
    filteredObject.requesterPersonnelId = {
      value:
        filteredObject.relationshipManagerPersonnelBasicInfoModel.personnelId,
      label: `${filteredObject.relationshipManagerPersonnelBasicInfoModel.firstName} ${filteredObject.relationshipManagerPersonnelBasicInfoModel.lastName}`,
    };
    filteredObject.adultFemaleCount = filteredObject?.adultFemaleCount || 0;
    filteredObject.adultMaleCount = filteredObject?.adultMaleCount || 0;
    filteredObject.childFemaleCount = filteredObject?.childFemaleCount || 0;
    filteredObject.childMaleCount = filteredObject?.childMaleCount || 0;
    filteredObject.seniorFemaleCount = filteredObject?.seniorFemaleCount || 0;
    filteredObject.seniorMaleCount = filteredObject?.seniorMaleCount || 0;
    // Dropdown values set
    filteredObject.typeOfVisit = {
      label: filteredObject.typeOfVisit,
      value: filteredObject.typeOfVisit,
    };

    // set date and time value
    let { time: startTime } = getDateTimeSplitter(
      filteredObject,
      'startDateTime',
    );
    let { time: endTime } = getDateTimeSplitter(filteredObject, 'endDateTime');

    startTime = moment(startTime, 'HH:mm').format('hh:mm A');
    endTime = moment(endTime, 'HH:mm').format('hh:mm A');

    filteredObject.dateOfVisit = filteredObject.startDateTime || '';
    filteredObject.startDateTime = startTime || '';
    filteredObject.endDateTime = endTime || '';
  }
  return filteredObject;
};

export const getVisitObjectById = (response) => {
  const { primaryVisitorModel, secondaryVisitorModel, ...visitData } = response;
  let visitVisitorModel = { ...visitData };
  const fullFilterdData = {};
  const countryList = getLocalStorageData(LOCAL_STORAGE_KEYS.COUNTRIES);

  /**
   * This function will set value in object field
   * @param { Object } model
   * @param { String } field
   * @param { String } value
   */
  const objectMapper = (model, field, value) => {
    if (!model || !field) {
      return;
    }
    if (value) {
      model[field] = { label: value, value: value };
    } else {
      model[field] = '';
    }
  };

  // Setting visit data
  if (checkObjectKey(visitVisitorModel)) {
    visitVisitorModel = getVisitObject(visitVisitorModel);
    fullFilterdData.visitVisitorModel = visitVisitorModel;
  }

  // Setting primary data
  if (primaryVisitorModel && checkObjectKey(primaryVisitorModel)) {
    // Setting salutation object
    objectMapper(
      primaryVisitorModel,
      'salutation',
      primaryVisitorModel.salutation,
    );

    // Setting visitorType object
    objectMapper(
      primaryVisitorModel,
      'visitorType',
      primaryVisitorModel.visitorType,
    );

    // Setting gender object
    objectMapper(primaryVisitorModel, 'gender', primaryVisitorModel.gender);

    countryList.forEach((newCountry) => {
      if (newCountry.value === primaryVisitorModel.country) {
        primaryVisitorModel.country = newCountry;
      }
    });

    countryList.forEach((newCountry) => {
      if (newCountry.isdCode === primaryVisitorModel.phoneCountryCode) {
        primaryVisitorModel.phoneCountryCode = {
          label: newCountry.isdCode,
          value: newCountry.isdCode,
        };
      }
    });
    if (primaryVisitorModel.state) {
      getLocalStorageData(LOCAL_STORAGE_KEYS.STATES).forEach((newState) => {
        if (newState.value === primaryVisitorModel.state) {
          primaryVisitorModel.state = newState;
        }
      });
    } else {
      primaryVisitorModel.state = '';
    }

    fullFilterdData.primaryVisitorModel = primaryVisitorModel;
  }

  // Setting secondary data
  if (secondaryVisitorModel && checkObjectKey(secondaryVisitorModel)) {
    // Setting salutation object
    objectMapper(
      secondaryVisitorModel,
      'salutation',
      secondaryVisitorModel.salutation,
    );

    // Setting visitorType object
    objectMapper(
      secondaryVisitorModel,
      'visitorType',
      secondaryVisitorModel.visitorType,
    );

    // Setting gender object
    objectMapper(secondaryVisitorModel, 'gender', secondaryVisitorModel.gender);

    secondaryVisitorModel.phoneCountryCode = {
      label: secondaryVisitorModel.phoneCountryCode,
      value: secondaryVisitorModel.phoneCountryCode,
    };
    countryList.forEach((newCountry) => {
      if (newCountry.value === secondaryVisitorModel.country) {
        secondaryVisitorModel.country = newCountry;
      }
    });

    if (primaryVisitorModel.state) {
      getLocalStorageData(LOCAL_STORAGE_KEYS.STATES).forEach((newState) => {
        if (newState.value === secondaryVisitorModel.state) {
          secondaryVisitorModel.state = newState;
        }
      });
    } else {
      secondaryVisitorModel.state = '';
    }

    fullFilterdData.secondaryVisitorModel = secondaryVisitorModel;
  }

  return fullFilterdData;
};

export const sendVisitObjectData = (visitObject) => {
  const { primaryVisitorModel, secondaryVisitorModel, visitVisitorModel } =
    visitObject;
  const fullFilterdData = {};

  if (visitVisitorModel && checkObjectKey(visitVisitorModel)) {
    visitVisitorModel.relationshipManagerPersonnelBasicInfoModel = {
      personnelId: visitVisitorModel.requesterPersonnelId.value,
    };

    const visitDate = formateDate(visitVisitorModel?.dateOfVisit).resDate;
    // Start date end date set
    //convert to 24 hours
    const startTime = moment(
      visitVisitorModel?.startDateTime,
      'hh:mm A',
    ).format('HH:mm:ss');
    const endTime = moment(visitVisitorModel?.endDateTime, 'hh:mm A').format(
      'HH:mm:ss',
    );
    visitVisitorModel.startDateTime = `${visitDate} ${startTime}`;
    visitVisitorModel.endDateTime = `${visitDate} ${endTime}`;

    if (!visitVisitorModel?.requestedServices?.length) {
      visitVisitorModel.requestedServices = [];
    }
    visitVisitorModel.requesterPersonnelId =
      visitVisitorModel.requesterPersonnelId.value;
    visitVisitorModel.typeOfVisit = visitVisitorModel.typeOfVisit.value;
    fullFilterdData.visitVisitorModel = visitVisitorModel;
  }

  if (primaryVisitorModel && checkObjectKey(primaryVisitorModel)) {
    primaryVisitorModel.country = primaryVisitorModel.country.value;
    primaryVisitorModel.visitorType = primaryVisitorModel.visitorType.value;
    primaryVisitorModel.gender = primaryVisitorModel.gender.value;
    primaryVisitorModel.phoneCountryCode =
      primaryVisitorModel.phoneCountryCode.value;
    primaryVisitorModel.salutation = primaryVisitorModel.salutation.value;
    primaryVisitorModel.state = primaryVisitorModel.state.value;
    fullFilterdData.primaryVisitorModel = primaryVisitorModel;
  }

  if (secondaryVisitorModel && checkObjectKey(secondaryVisitorModel)) {
    secondaryVisitorModel.country = secondaryVisitorModel.country.value;
    secondaryVisitorModel.visitorType = secondaryVisitorModel.visitorType.value;
    secondaryVisitorModel.gender = secondaryVisitorModel.gender.value;
    secondaryVisitorModel.phoneCountryCode =
      secondaryVisitorModel.phoneCountryCode.value;
    secondaryVisitorModel.salutation = secondaryVisitorModel.salutation.value;
    secondaryVisitorModel.state = secondaryVisitorModel.state.value;
    fullFilterdData.secondaryVisitorModel = secondaryVisitorModel;
  }

  return fullFilterdData;
};

export const generateOptions = ({ arrayList, label, value }) => {
  let options = [];
  try {
    if (!arrayList || !label || !value || !Array.isArray(arrayList)) {
      throw new Error('Failed to get options');
    }
    if (arrayList?.length) {
      arrayList.forEach((element) => {
        if (element[label] && element[value]) {
          options.push({
            label: element[label],
            value: element[value],
            data: element,
          });
        }
      });
    }
  } catch (error) {
    options = [];
    console.warn('Error while generating options :', error);
  }
  return options;
};

export const getVisitTourTab = (response) => {
  let tour = {};
  try {
    const pickup = [];
    const drop = [];
    const locations = [];
    let guides = [];
    if (response?.visitLocationModelList?.length) {
      response.visitLocationModelList.forEach((item) => {
        if (item.locationTagEnum === 'PICKUP') {
          pickup.push({
            value: item.locationId,
            label: item.locationName,
          });
        }
        if (item.locationTagEnum === 'DROP') {
          drop.push({
            value: item.locationId,
            label: item.locationName,
          });
        }
        locations.push({
          location: {
            value: item.locationId,
            label: item.locationName,
          },
          actualDuration: moment(item.endDateTime).diff(
            moment(item.startDateTime),
            'minutes',
          ),
          startDateTime: moment(item.startDateTime).format('hh:mm A'),
          endDateTime: moment(item.endDateTime).format('hh:mm A'),
        });
      });
      // Set Pickup Location
      tour.pickupLocation = pickup[0];
      // Set EndLocation Location
      tour.endLocation = drop[0];
      // Set Locations List
      tour.locationList = locations;
    }

    // Set StartTime
    tour.startDateTime = moment(response.startDateTime).format('hh:mm A');
    // Set EndTime
    tour.endDateTime = moment(response.endDateTime).format('hh:mm A');

    // Set Tour Coordinator
    if (
      response?.tourCoordinator?.personnelId &&
      response?.tourCoordinator?.personnelName &&
      response?.tourCoordinator?.roleId
    ) {
      tour.tourCoordinator = {
        value: response.tourCoordinator.personnelId,
        label: response.tourCoordinator.personnelName,
        roleId: response.tourCoordinator.roleId,
      };
    }
    // Set Tour Guide
    if (response?.tourGuideList?.length) {
      guides = response.tourGuideList.map((guide) => ({
        value: guide.personnelId,
        label: guide.personnelName,
        roleId: guide.roleId,
      }));
      tour.tourGuide = guides;
    } else {
      tour.tourGuide = '';
    }
  } catch (error) {
    tour = {};
    console.error('ERROR', error);
  }

  return tour;
};

/**
 *
 * @param {String} input Input string
 * @returns {Boolean} Boolean value
 */
export const checkTimeError = (input) => {
  if (!input) return;
  const chars = input.split('');
  let isError = false;

  chars.forEach((char) => {
    if (char == '-') {
      isError = true;
      return isError;
    }
  });
  return isError;
};

/**
 *
 * @param {String} startTime Start time
 * @param {String} endTime End time
 * @param {Number} intervalInMinutes Interval in minutes
 * @returns {Array} Array of Time intervals
 */
export const createTimeIntervals = (startTime, endTime, intervalInMinutes) => {
  let timeIntervals = [];
  try {
    const start = moment(startTime, 'HH:mm:ss');
    const end = moment(endTime, 'HH:mm:ss');
    const currentTime = start.clone();
    while (currentTime.isSameOrBefore(end)) {
      const endTime = currentTime.clone();
      endTime.add(intervalInMinutes, 'minutes');
      timeIntervals.push({
        start: currentTime.format('hh:mm A'),
        end: endTime.format('hh:mm A'),
      });
      currentTime.add(intervalInMinutes, 'minutes');
    }
  } catch (error) {
    console.error('Error in TimeInterval :', error);
    timeIntervals = [];
  }
  return timeIntervals;
};

export function getAuthToken() {
  let token = null;
  try {
    let userData = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (userData) {
      userData = JSON.parse(userData);
      token = userData?.token || null;
    }
  } catch (error) {
    token = null;
  }
  return token;
}

export function calculateNewLoactionEndTime(startTime, duration) {
  if (!checkTimeError(startTime) && duration) {
    return moment(startTime, 'hh:mm A')
      .add(duration, 'minutes')
      .format('hh:mm A');
  }
}

export const tourSlotSetData = (response) => {
  let newSlotArrayList,
    flattenedTimeArray = [];
  try {
    const isDisabledWeek = moment(response.endDateTime).isBefore(moment());
    const startTime = moment(response.startDateTime).format('HH:mm:ss');
    const endTime = moment(response.endDateTime).format('HH:mm:ss');
    const slotInterval = response.slotInterval;
    const intervals = createTimeIntervals(startTime, endTime, slotInterval);
    const slotModelList = response?.tourDaySlotModelList || [];
    flattenedTimeArray = intervals.map((time, index) => {
      let isActive = false;
      const isDisabled = slotModelList.some((day) => {
        const cardActive = [
          TOUR_SLOT_STATUS.ACTIVE,
          TOUR_SLOT_STATUS.PARTIALLY,
          TOUR_SLOT_STATUS.BOOKED,
        ].includes(day.tourSlotModelList[index].stage);
        if (cardActive) {
          isActive = true;
        }
        return day.tourSlotModelList[index]?.bookedGuestSize > 0;
      });
      return { time, isDisabled, isActive, isDisabledWeek };
    });
    newSlotArrayList = slotModelList.map((day) => {
      let isActive = false;
      const isDisabled = day.tourSlotModelList.some((tourPerDay) => {
        const cardActive = [
          TOUR_SLOT_STATUS.ACTIVE,
          TOUR_SLOT_STATUS.PARTIALLY,
          TOUR_SLOT_STATUS.BOOKED,
        ].includes(tourPerDay.stage);
        if (cardActive) {
          isActive = true;
        }
        return tourPerDay.bookedGuestSize > 0;
      });
      const date = moment(day?.tourSlotDate || '');
      return {
        ...day,
        isActive,
        isDisabled,
        isPastDate: date.isBefore(moment()),
      };
    });
  } catch (error) {
    console.error('Error In Tour slot: ', error);
    flattenedTimeArray = [];
    newSlotArrayList = [];
  }
  return { flattenedTimeArray, newSlotArrayList };
};

export const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return '';

  let initials = '';
  if (firstName && firstName?.length) initials += firstName.charAt(0);
  if (lastName && lastName?.length) initials += lastName.charAt(0);

  return initials;
};
