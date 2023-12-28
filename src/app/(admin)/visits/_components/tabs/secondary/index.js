import { visitState } from '@/redux/visits/reducer.visits';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkObjectKey,
  getLocalStorageData,
  lookupToObject,
} from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { setTabStatus, updateVisitAction } from '@/redux/visits/action.visits';
import { Formik, Form } from 'formik';
import { Row, Col } from 'react-bootstrap';
import { ERRORS } from '@/utils/constants/errors.constants';
import TabSecondaryForm from './Form';
import CustomButton from '@/components/Button';
import * as Yup from 'yup';
import FormikController from '@/components/form-group/formik-controllers';
import SearchVisitorModal from '../../modals/SearchVisitor';

const secondaryTabInitalValues = {
  salutation: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  phoneNumber: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  country: '',
  preferredCommMode: 'Both',
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

const TabSecondary = ({
  currentVisitId,
  saveFormsDataLocally,
  addVisitApiCall,
  callBackSetValues,
  setCurrentProgress,
  setHasError,
  hasError,
  tabStatus,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(secondaryTabInitalValues);
  const { secondaryGuestFormData, isFormLoader } = useSelector(visitState);
  const [searchData, setSearchData] = useState({ visitor: '' });
  const [isReset, setReset] = useState(false);
  const [openSearchVisitorModal, setOpenSearchVisitorModal] = useState(false);
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
  const addSubmitHandel = (values) => {
    const { visitVisitorModel, primaryVisitorModel } = getLocalStorageData(
      LOCAL_STORAGE_KEYS.NEW_VISIT_DATA,
    );
    addVisitApiCall({
      visitVisitorModel,
      primaryVisitorModel,
      secondaryVisitorModel: {
        ...values,
      },
    });
  };

  const onSubmit = (values) => {
    if (currentVisitId) {
      const { visitVisitorModel, primaryVisitorModel, secondaryVisitorModel } =
        getLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA);
      let fullData = {};
      if (visitVisitorModel && checkObjectKey(visitVisitorModel)) {
        fullData = { visitVisitorModel };
      }
      if (primaryVisitorModel && checkObjectKey(primaryVisitorModel)) {
        fullData.primaryVisitorModel = primaryVisitorModel;
      }
      if (secondaryVisitorModel && checkObjectKey(secondaryVisitorModel)) {
        fullData.secondaryVisitorModel = {
          ...secondaryVisitorModel,
          ...values,
        };
      } else {
        fullData.secondaryVisitorModel = { ...values };
      }

      dispatch(
        updateVisitAction(fullData, (res) => {
          if (!tabStatus?.secondaryVisitorAvailable) {
            dispatch(
              setTabStatus({ ...tabStatus, secondaryVisitorAvailable: true }),
            );
          }
          callBackSetValues(res?.secondaryVisitorModel || {}, {
            isSecondary: true,
          });
        }),
      );
    } else {
      addSubmitHandel(values);
    }
  };

  useEffect(() => {
    if (secondaryGuestFormData && checkObjectKey(secondaryGuestFormData)) {
      setFormData(secondaryGuestFormData);
    }
  }, []);

  useEffect(() => {
    if (isReset) {
      const { secondaryVisitorModel } = getLocalStorageData(
        LOCAL_STORAGE_KEYS.NEW_VISIT_DATA,
      );
      if (secondaryVisitorModel && Object.keys(secondaryVisitorModel).length) {
        setFormData(secondaryVisitorModel);
      } else {
        setFormData(secondaryTabInitalValues);
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
        onSubmit={onSubmit}
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
          <TabSecondaryForm
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
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            hasError={hasError}
            addVisitApiCall={addVisitApiCall}
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

export default TabSecondary;
