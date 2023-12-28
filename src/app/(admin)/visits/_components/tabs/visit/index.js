import { visitState } from '@/redux/visits/reducer.visits';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabVisitForm from './Form';
import * as Yup from 'yup';
import {
  checkTimeError,
  getLocalStorageData,
  setLocalStorageData,
} from '@/utils/helper.utils';
import { updateVisitAction } from '@/redux/visits/action.visits';
import { Formik } from 'formik';
import { ERRORS } from '@/utils/constants/errors.constants';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import moment from 'moment';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';

const visitTabInitialValues = {
  typeOfVisit: '',
  requesterPersonnelId: '',
  otherRequesterName: '',
  requesterNotes: '',
  startDateTime: '',
  endDateTime: '',
  childFemaleCount: '',
  childMaleCount: '',
  adultFemaleCount: '',
  adultMaleCount: '',
  seniorFemaleCount: '',
  seniorMaleCount: '',
  totalVisitors: '',
  dateOfVisit: '',
  requestedServices: '',
  visitorComments: '',
  type: 'VISIT',
};

const checkIsInt = (value) => {
  if (value === undefined || value === null) return true;
  const numericRegex = /^[0-9]+$/;
  return numericRegex.test(value);
};

const validationSchema = Yup.object({
  typeOfVisit: Yup.object().required(ERRORS.REQUIRED),
  requesterPersonnelId: Yup.object().required(ERRORS.REQUIRED),
  otherRequesterName: Yup.string().when('requesterPersonnelId', {
    is: (e) => e?.value === 'Other',
    then: () =>
      Yup.string()
        .required(ERRORS.REQUIRED)
        .min(3, ERRORS.MIN3)
        .max(64, ERRORS.MAX_64)
        .test('is_alpha_numeric', ERRORS.ONLY_ALPHA, (value) => {
          const regex = /^[a-zA-Z0-9\s]+$/;
          const isValid = regex.test(value?.toString());
          return isValid;
        }),
  }),
  requesterNotes: Yup.string().max(512, ERRORS.MAX_512),
  childMaleCount: Yup.number()
    .min(0, ERRORS.MIN_0)
    .max(999, ERRORS.COUNT_LESS_THEN_999)
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    }),
  childFemaleCount: Yup.number()
    .typeError(ERRORS.ONLY_NUMERIC)
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    })
    .min(0, ERRORS.MIN_0)
    .max(999, ERRORS.COUNT_LESS_THEN_999),
  adultMaleCount: Yup.number()
    .typeError(ERRORS.ONLY_NUMERIC)
    .min(0, ERRORS.MIN_0)
    .max(999, ERRORS.COUNT_LESS_THEN_999)
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    }),
  adultFemaleCount: Yup.number()
    .typeError(ERRORS.ONLY_NUMERIC)
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    })
    .min(0, ERRORS.MIN_0)
    .max(999, ERRORS.COUNT_LESS_THEN_999),
  seniorFemaleCount: Yup.number()
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    })
    .typeError(ERRORS.ONLY_NUMERIC)
    .min(0, ERRORS.MIN_0)
    .max(999, ERRORS.COUNT_LESS_THEN_999),
  seniorMaleCount: Yup.number()
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    })
    .min(0, ERRORS.MIN_0)
    .max(999, ERRORS.COUNT_LESS_THEN_999),
  totalVisitors: Yup.number()
    .min(1, ERRORS.MIN_1_GUEST)
    .max(9999, ERRORS.MAX_9999)
    .test('is_numeric', ERRORS.ONLY_NUMERIC, (value) => {
      return checkIsInt(value);
    })
    .typeError(ERRORS.ONLY_NUMERIC)
    .required(ERRORS.MIN_1_GUEST),
  dateOfVisit: Yup.date().required(ERRORS.REQUIRED),
  startDateTime: Yup.mixed()
    .required(ERRORS.REQUIRED)
    .test('is_empty', ERRORS.REQUIRED, (value) => {
      if (value == '--:-- --' || value == '') return false;
      return true;
    })
    .test('is_invalid', 'Invalid Input Time', (value) => {
      return !checkTimeError(value);
    })
    .test(
      'is-equal',
      'Start time and end time should not be same.',
      function (value) {
        const { endDateTime } = this.parent;
        if (!value || !endDateTime) return true;
        return (
          moment(value, 'hh:mm A').format('HHmm') !=
          moment(endDateTime, 'hh:mm A').format('HHmm')
        );
      },
    )
    .test(
      'is-valid-time',
      'Start time must be before end time',
      function (value) {
        const { endDateTime } = this.parent;

        if (!value || !endDateTime) return true;
        return (
          moment(value, 'hh:mm A').format('HHmm') <
          moment(endDateTime, 'hh:mm A').format('HHmm')
        );
      },
    ),
  endDateTime: Yup.mixed()
    .required(ERRORS.REQUIRED)
    .test('is_empty', ERRORS.REQUIRED, (value) => {
      if (value == '--:-- --' || value == '') return false;
      return true;
    })
    .test('is_invalid', 'Invalid Input Time', (value) => {
      return !checkTimeError(value);
    })
    .test(
      'is-equal',
      'Start time and end time should not be same.',
      function (value) {
        const { startDateTime } = this.parent;

        if (!value || !startDateTime) return true;
        return (
          moment(value, 'hh:mm A').format('HHmm') !=
          moment(startDateTime, 'hh:mm A').format('HHmm')
        );
      },
    )
    .test(
      'is-valid-time',
      'End time must be after start time',
      function (value) {
        const { startDateTime } = this.parent;

        if (!value || !startDateTime) return true; // If either field is empty, validation passes

        return (
          moment(value, 'hh:mm A').format('HHmm') >
          moment(startDateTime, 'hh:mm A').format('HHmm')
        );
      },
    ),

  visitorComments: Yup.string().max(512, ERRORS.MAX_512),
  requestedServices: Yup.array()
    .min(1, ERRORS.REQUIRED)
    .required(ERRORS.REQUIRED),
});

const TabVisit = ({
  currentVisitId,
  setCurrentTab,
  setCurrentProgress,
  saveFormsDataLocally,
  callBackSetValues,
  setHasError,
  hasError,
}) => {
  const [formData, setFormData] = useState(visitTabInitialValues);
  const dispatch = useDispatch();
  const { visitFormData, isFormLoader } = useSelector(visitState);
  const { personnelOptions } = useSelector(personnelState);

  const [requestorOptions, setRequestorOptions] = useState([]);

  //add others to personnel options
  useEffect(() => {
    if (personnelOptions?.length > 0) {
      const requestorOptionsTemp = [...personnelOptions];
      setRequestorOptions(requestorOptionsTemp);
    }
  }, [personnelOptions]);

  const addSubmitHandel = (values) => {
    const getVisitData = getLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA);
    if (getVisitData?.visitVisitorModel) {
      const updatedVisit = {
        ...getVisitData,
        visitVisitorModel: { ...values },
      };
      setLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA, updatedVisit);
    } else {
      setLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA, {
        visitVisitorModel: { ...values },
      });
    }
    setCurrentTab((prev) => prev + 1);
    setCurrentProgress((prev) => prev + 1);
  };

  const updateSubmitHandel = (values) => {
    const fullData = { visitVisitorModel: { ...values } };
    // Get data form localStorage
    const { primaryVisitorModel, secondaryVisitorModel } = getLocalStorageData(
      LOCAL_STORAGE_KEYS.NEW_VISIT_DATA,
    );

    // If primary data is there then add in object
    if (primaryVisitorModel && Object.keys(primaryVisitorModel).length) {
      fullData.primaryVisitorModel = primaryVisitorModel;
    }

    // If secondary data is there then add in object
    if (secondaryVisitorModel && Object.keys(secondaryVisitorModel).length) {
      fullData.secondaryVisitorModel = secondaryVisitorModel;
    }

    // API call
    dispatch(
      updateVisitAction(fullData, () => {
        callBackSetValues(values, { isVisit: true });
      }),
    );
  };

  const onSubmit = (values) => {
    if (currentVisitId) {
      updateSubmitHandel(values);
    } else {
      addSubmitHandel(values);
    }
  };

  useEffect(() => {
    if (Object.keys(visitFormData).length) {
      setFormData(visitFormData);
    }
  }, []);

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        dirty,
        touched,
        errors,
        isValid,
        handleBlur,
        handleChange,
        setFieldValue,
        setFieldError,
        setFieldTouched,
      }) => (
        <TabVisitForm
          formData={formData}
          validationSchema={validationSchema}
          currentVisitId={currentVisitId}
          onSubmit={onSubmit}
          saveFormsDataLocally={saveFormsDataLocally}
          isFormLoader={isFormLoader}
          errors={errors}
          values={values}
          dirty={dirty}
          isValid={isValid}
          touched={touched}
          setHasError={setHasError}
          setCurrentProgress={setCurrentProgress}
          setFieldError={setFieldError}
          handleBlur={handleBlur}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          hasError={hasError}
          requestorOptions={requestorOptions}
          setFieldTouched={setFieldTouched}
        />
      )}
    </Formik>
  );
};

export default TabVisit;
