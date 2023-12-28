import { visitState } from '@/redux/visits/reducer.visits';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLocalStorageData,
  setLocalStorageData,
  lookupToObject,
} from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { updateVisitAction } from '@/redux/visits/action.visits';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import { ERRORS } from '@/utils/constants/errors.constants';
import { TOAST_ERROR } from '@/utils/constants/default.constants';
import { Row, Col } from 'react-bootstrap';
import SearchVisitorModal from '../../modals/SearchVisitor';
import CustomButton from '@/components/Button';
import TabPrimaryForm from './Form';
import * as Yup from 'yup';
import FormikController from '@/components/form-group/formik-controllers';

const primaryTabInitalValues = {
  salutation: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  preferredCommMode: 'Both',
  phoneNumber: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  country: '',
  city: '',
  postalCode: '',
  designation: '',
  organizationName: '',
  organizationAddress: '',
  organizationWebsite: '',
  instagramId: '',
  facebookId: '',
  linkedinId: '',
  twitterId: '',
  telegramId: '',
  phoneCountryCode: '',
  visitorType: '',
};

const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validationSchema = Yup.object({
  gender: Yup.object().required(ERRORS.REQUIRED),
  salutation: Yup.object().required(ERRORS.REQUIRED),
  email: Yup.string()
    .required(ERRORS.REQUIRED)
    .matches(emailRegExp, ERRORS.INVALID_EMAIL),
  firstName: Yup.string()
    .required(ERRORS.REQUIRED)
    .min(3, ERRORS.MIN_3)
    .matches(/^[A-Za-z ]+$/, ERRORS.ONLY_ALPHA)
    .typeError('Invalid')
    .max(64, ERRORS.MAX_64),
  middleName: Yup.string()
    .min(3, ERRORS.MIN_3)
    .matches(/^[A-Za-z ]+$/, ERRORS.ONLY_ALPHA)
    .typeError('Invalid')
    .max(64, ERRORS.MAX_64),
  lastName: Yup.string()
    .required(ERRORS.REQUIRED)
    .min(3, ERRORS.MIN_3)
    .matches(/^[A-Za-z ]+$/, ERRORS.ONLY_ALPHA)
    .typeError('Invalid')
    .max(64, ERRORS.MAX_64),
  phoneNumber: Yup.number()
    .required(ERRORS.REQUIRED)
    .typeError(ERRORS.ONLY_NUMBERS)
    .positive(ERRORS.INVALID_PHONE)
    .integer(ERRORS.PHONE_NO_DECIMAL)
    .test('len', ERRORS.MIN_8, (val) => {
      if (val) {
        return val.toString().length > 7;
      }
    })
    .test('len', ERRORS.MAX_12, (val) => {
      if (val) {
        return val.toString().length < 13;
      }
    }),
  organizationName: Yup.string().max(255, ERRORS.MAX_255),
  addressLine1: Yup.string().max(100, ERRORS.MAX_100),
  addressLine2: Yup.string().max(100, ERRORS.MAX_100),
  organizationWebsite: Yup.string().max(255, ERRORS.MAX_255),
  organizationAddress: Yup.string().max(255, ERRORS.MAX_255),
  city: Yup.string().max(36, ERRORS.MAX_36).required(ERRORS.REQUIRED),
  postalCode: Yup.string()
    .required(ERRORS.REQUIRED)
    .max(8, ERRORS.MAX_8)
    .min(5, ERRORS.MIN_5),
  phoneCountryCode: Yup.object()
    .required(ERRORS.REQUIRED)
    .typeError(ERRORS.REQUIRED),
  preferredCommMode: Yup.string().required(ERRORS.REQUIRED),
  country: Yup.object().required(ERRORS.REQUIRED).typeError(ERRORS.REQUIRED),
  state: Yup.object().when('country', {
    is: (val) => {
      return (
        val?.countryCode === 'USA' ||
        val?.countryCode === 'CAN' ||
        val?.countryCode === 'IND'
      );
    },
    then: () => Yup.object().required(ERRORS.REQUIRED),
  }),
  linkedinId: Yup.string().max(255, ERRORS.MAX_255),
  twitterId: Yup.string().max(255, ERRORS.MAX_255),
  facebookId: Yup.string().max(255, ERRORS.MAX_255),
  instagramId: Yup.string().max(255, ERRORS.MAX_255),
  telegramId: Yup.string().max(255, ERRORS.MAX_255),
  designation: Yup.string().max(56, ERRORS.MAX_56),
});

const TabPrimary = ({
  currentVisitId,
  setCurrentTab,
  setCurrentProgress,
  saveFormsDataLocally,
  addVisitApiCall,
  callBackSetValues,
  setHasError,
  hasError,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(primaryTabInitalValues);
  const [formType, setFormType] = useState('partialSubmit');
  const [searchData, setSearchData] = useState({ visitor: '' });
  const [isReset, setReset] = useState(false);
  const [openSearchVisitorModal, setOpenSearchVisitorModal] = useState(false);
  const { primaryGuestFormData, isFormLoader } = useSelector(visitState);

  const countryOptions = useSelector((state) => state.masters.countries);
  const allStateOptions = useSelector((state) => state.masters.state);
  const genderOptions = lookupToObject('GENDER');
  const visitorTypeOptions = lookupToObject('VISITOR_TYPE');
  const salutationOptions = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
  ];
  const uniqueCountryOptions = countryOptions.filter(
    (country, index, self) =>
      index === self.findIndex((c) => c.isdCode === country.isdCode),
  );
  const countryPhoneCodeOptions = uniqueCountryOptions.map((country) => {
    return { label: country.isdCode, value: country.isdCode };
  });
  const updateSubmitHandel = ({
    visitVisitorModel,
    secondaryVisitorModel,
    values,
  }) => {
    let allTabsData = {};
    if (visitVisitorModel && Object.keys(visitVisitorModel).length) {
      allTabsData = { visitVisitorModel };

      if (secondaryVisitorModel && Object.keys(secondaryVisitorModel).length) {
        allTabsData.secondaryVisitorModel = secondaryVisitorModel;
      }

      allTabsData.primaryVisitorModel = { ...values };

      dispatch(
        updateVisitAction(allTabsData, () => {
          callBackSetValues(values, { isPrimary: true });
        }),
      );
    } else {
      toast.error(TOAST_ERROR.PRIMARY_VISITOR_MODEL.MESSAGE, {
        toastId: TOAST_ERROR.PRIMARY_VISITOR_MODEL.ID,
      });
    }
  };

  const savePrimaryData = (values) => {
    const getVisitData = getLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA);
    if (getVisitData?.primaryVisitorModel) {
      const updatedVisit = {
        ...getVisitData,
        primaryVisitorModel: values,
      };
      setLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA, updatedVisit);
    } else {
      setLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA, {
        ...getVisitData,
        primaryVisitorModel: values,
      });
    }
    setCurrentTab((prev) => prev + 1);
    setCurrentProgress((prev) => prev + 1);
  };

  const onSubmit = (values, type) => {
    // Why added values.firstName ?
    if (type === 'callApi' && values.firstName) {
      // get data from local storage
      const { visitVisitorModel, secondaryVisitorModel } = getLocalStorageData(
        LOCAL_STORAGE_KEYS.NEW_VISIT_DATA,
      );

      if (currentVisitId) {
        updateSubmitHandel({
          secondaryVisitorModel,
          values,
          visitVisitorModel,
        });
      } else {
        // If user is adding visit form then this will run
        addVisitApiCall({
          visitVisitorModel,
          primaryVisitorModel: {
            ...values,
          },
        });
      }
    } else if (type === 'partialSubmit') {
      savePrimaryData(values);
    }
  };

  useEffect(() => {
    if (Object.keys(primaryGuestFormData).length) {
      setFormData(primaryGuestFormData);
    }
  }, []);

  useEffect(() => {
    if (isReset) {
      const { primaryVisitorModel } = getLocalStorageData(
        LOCAL_STORAGE_KEYS.NEW_VISIT_DATA,
      );
      if (primaryVisitorModel && Object.keys(primaryVisitorModel).length) {
        setFormData(primaryVisitorModel);
      } else {
        setFormData(primaryTabInitalValues);
      }
    }
    setReset(false);
  }, [isReset]);

  return (
    <>
      <Formik
        initialValues={searchData}
        validationSchema={Yup.object({
          visitor: Yup.string().required(ERRORS.REQUIRED),
        })}
        onSubmit={(values) => {
          setSearchData(values);
          setOpenSearchVisitorModal(true);
        }}
        enableReinitialize
      >
        {({ values, errors, dirty, touched }) => (
          <Form>
            <Row className="mt-3 mb-3">
              <Col sm={4}>
                <FormikController
                  control="input"
                  type="text"
                  values={values.visitor}
                  required={true}
                  dirty={dirty.visitor}
                  errors={errors.visitor}
                  touched={touched.visitor}
                  name="visitor"
                  placeholder={'Search Visitor'}
                />
              </Col>
              <Col sm={4} className="tab-guest-search">
                <CustomButton variant="primary" type="submit">
                  Search
                </CustomButton>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values, formType)}
        enableReinitialize
      >
        {({
          isValid,
          errors,
          dirty,
          touched,
          values,
          setFieldValue,
          handleBlur,
        }) => (
          <TabPrimaryForm
            formData={formData}
            validationSchema={validationSchema}
            currentVisitId={currentVisitId}
            onSubmit={onSubmit}
            saveFormsDataLocally={saveFormsDataLocally}
            isFormLoader={isFormLoader}
            formType={formType}
            setFormType={setFormType}
            errors={errors}
            values={values}
            dirty={dirty}
            isValid={isValid}
            touched={touched}
            setHasError={setHasError}
            setCurrentProgress={setCurrentProgress}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            hasError={hasError}
            setReset={setReset}
          />
        )}
      </Formik>
      <SearchVisitorModal
        searchText={searchData.visitor}
        showModal={openSearchVisitorModal}
        closeAction={() => {
          setOpenSearchVisitorModal(false);
        }}
        submitAction={(element) => {
          setOpenSearchVisitorModal(false);
          setFormData((prevState) => ({
            ...prevState,
            addressLine1: element?.addressLine1 || '',
            addressLine2: element?.addressLine2 || '',
            city: element?.city || '',
            country: element?.country
              ? countryOptions.find((d) => d.value === element.country)
              : '',
            designation: element?.designation || '',
            email: element?.email || '',
            facebookId: element?.facebookId || '',
            firstName: element?.firstName || '',
            gender: element?.gender
              ? genderOptions.find((d) => d.value === element.gender)
              : '',
            instagramId: element?.instagramId || '',
            lastName: element?.lastName || '',
            linkedinId: element?.linkedinId || '',
            middleName: element?.middleName || '',
            organizationAddress: element?.organizationAddress || '',
            organizationName: element?.organizationName || '',
            organizationWebsite: element?.organizationWebsite || '',
            phoneCountryCode: element?.phoneCountryCode
              ? countryPhoneCodeOptions.find(
                  (d) => d.value === element.phoneCountryCode,
                )
              : '',
            phoneNumber: element?.phoneNumber || '',
            postalCode: element?.postalCode || '',
            preferredCommMode: element?.preferredCommMode || '',
            salutation: element?.salutation
              ? salutationOptions.find((d) => d.value === element.salutation)
              : '',
            state: element?.state
              ? allStateOptions.find((d) => d.value === element.state)
              : '',
            telegramId: element?.telegramId || '',
            twitterId: element?.twitterId || '',
            visitorType: element?.visitorType
              ? visitorTypeOptions.find((d) => d.value === element?.visitorType)
              : '',
          }));
        }}
      />
    </>
  );
};

export default TabPrimary;
