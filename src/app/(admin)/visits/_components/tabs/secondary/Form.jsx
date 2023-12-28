import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import {
  checkObjectKey,
  getLocalStorageData,
  lookupToObject,
} from '@/utils/helper.utils';
import { Form } from 'formik';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { toast } from 'react-toastify';
import { TOAST_ERROR } from '@/utils/constants/default.constants';

const TabSecondaryForm = ({
  saveFormsDataLocally,
  currentVisitId,
  isFormLoader,
  errors,
  values,
  isValid,
  touched,
  dirty,
  handleBlur,
  setFieldValue,
  // setHasError,
  setCurrentProgress,
  hasError,
  addVisitApiCall,
  setReset
}) => {
  const [stateOptions, setStateOptions] = useState([]);
  const [isShowPermission, setShowPermission] = useState(false);

  const countryOptions = useSelector((state) => state.masters.countries);
  const allStateOptions = useSelector((state) => state.masters.state);

  const genderOptions = lookupToObject('GENDER');
  const visitorTypeOptions = lookupToObject('VISITOR_TYPE');

  const preferredCommModeOptions = lookupToObject('PREFERRED_COMM_MODE');
  const salutationOptions = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
  ];
  // make unique country options by isdCode for phone code
  const uniqueCountryOptions = countryOptions.filter(
    (country, index, self) =>
      index === self.findIndex((c) => c.isdCode === country.isdCode),
  );
  const countryPhoneCodeOptions = uniqueCountryOptions.map((country) => {
    return {
      label: country.isdCode,
      value: country.isdCode,
    };
  });

  const savePrimaryData = () => {
    const { visitVisitorModel, primaryVisitorModel } = getLocalStorageData(
      LOCAL_STORAGE_KEYS.NEW_VISIT_DATA,
    );
    if (
      checkObjectKey(visitVisitorModel) &&
      checkObjectKey(primaryVisitorModel)
    ) {
      addVisitApiCall({
        visitVisitorModel,
        primaryVisitorModel,
      });
    } else {
      toast.error(TOAST_ERROR.SAVE_WITHOUT_SECONDARY.MESSAGE, {
        toastId: TOAST_ERROR.SAVE_WITHOUT_SECONDARY.ID,
      });
    }
  };

  //on country change set state options
  useEffect(() => {
    if (values.country.value) {
      const tempStateOptions = allStateOptions.filter((state) => {
        return state.countryId === values.country.value;
      });
      setStateOptions(tempStateOptions);
    }
  }, [values.country]);

  // Set value to redux store
  useEffect(() => {
    saveFormsDataLocally({
      currentFormNumber: 3,
      values,
      formProperties: { isValid, dirty },
    });
  }, [values]);

  useEffect(() => {
    if (!isValid && hasError && dirty) {
      setCurrentProgress(3);
    }
  }, [isValid, dirty]);

  // // If error set has error
  // useEffect(() => {
  //   if (!isValid || !dirty) {
  //     setHasError(true);
  //     setCurrentProgress(3);
  //   }
  //   // else{
  //   //   setHasError(false);
  //   // }
  // }, [isValid]);

  return (
    <PermissionWrapper
      name={'UPDATE_VISIT'}
      mode="2"
      callback={(event) => {
        setShowPermission(!event);
      }}
    >
      <Form>
        <Container fluid className="tabForm mb-4 pb-3">
          <Row>
            <Col lg={4} xs={12} sm={12}>
              <Row>
                <Col sm={6} className="mt-4">
                  <FormikController
                    control="select"
                    options={salutationOptions}
                    label="Title"
                    name="salutation"
                    required={true}
                    errors={errors.salutation}
                    touched={touched.salutation}
                    value={values.salutation}
                    placeholder="Title"
                    handleChange={(e) => {
                      setFieldValue('salutation', e ? e : '');
                    }}
                    handleBlur={handleBlur}
                    disabled={isShowPermission}
                  />
                </Col>

                <Col sm={6} className="mt-4">
                  <FormikController
                    control="input"
                    type="text"
                    label="First Name"
                    name="firstName"
                    required={true}
                    placeholder={'Enter First Name'}
                    errors={errors.firstName}
                    touched={touched.firstName}
                    disabled={isShowPermission}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={8} xs={12} sm={12}>
              <Row>
                <Col lg={4} sm={6} className="mt-4">
                  <FormikController
                    control="input"
                    type="text"
                    label="Middle Name"
                    name="middleName"
                    placeholder={'Enter Middle Name'}
                    disabled={isShowPermission}
                  />
                </Col>
                <Col lg={4} sm={6} className="mt-4">
                  <FormikController
                    control="input"
                    type="text"
                    label="Last Name"
                    name="lastName"
                    required={true}
                    placeholder={'Enter Last Name'}
                    errors={errors.lastName}
                    touched={touched.lastName}
                    disabled={isShowPermission}
                  />
                </Col>
                <Col sm={6} lg={4} className="mt-4">
                  <FormikController
                    control="select"
                    options={visitorTypeOptions}
                    label="Visitor Type"
                    name="visitorType"
                    disabled={isShowPermission}
                    errors={errors.visitorType}
                    touched={touched.visitorType}
                    value={values.visitorType}
                    placeholder="Visitor Type"
                    handleChange={(e) => {
                      setFieldValue('visitorType', e ? e : '');
                    }}
                    handleBlur={handleBlur}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mt-4">
              <FormikController
                control="select"
                options={genderOptions}
                label="Select your Gender"
                name="gender"
                required={true}
                errors={errors.gender}
                touched={touched.gender}
                value={values.gender}
                placeholder="Gender"
                handleChange={(e) => {
                  setFieldValue('gender', e ? e : '');
                }}
                handleBlur={handleBlur}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={8} className="mt-4">
              <FormikController
                control="radio"
                label="Preferred Communication"
                name="preferredCommMode"
                options={preferredCommModeOptions}
                required={true}
                errors={errors.preferredCommMode}
                touched={touched.preferredCommMode}
                disabled={isShowPermission}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="email"
                label="Email Address"
                name="email"
                placeholder={'Enter Email Address'}
                errors={errors.email}
                touched={touched.email}
                required={true}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={3} sm={6} xs={12} lg={2} className="mt-4">
              <FormikController
                control="select"
                options={countryPhoneCodeOptions}
                label="Code"
                name="phoneCountryCode"
                errors={errors.phoneCountryCode}
                touched={touched.phoneCountryCode}
                value={values.phoneCountryCode}
                placeholder="Code"
                required={true}
                handleChange={(e) => {
                  setFieldValue('phoneCountryCode', e ? e : '');
                }}
                handleBlur={handleBlur}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={12} xs={12} className="mt-4">
              <FormikController
                control="phone"
                type="tel"
                label="Phone"
                name="phoneNumber"
                required={true}
                placeholder={'Enter Phone Number'}
                errors={errors.phoneNumber}
                touched={touched.phoneNumber}
                value={values.phoneNumber}
                setFieldValue={setFieldValue}
                disabled={isShowPermission}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Address 1"
                name="addressLine1"
                placeholder={'Enter Address'}
                errors={errors.addressLine1}
                touched={touched.addressLine1}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Address 2"
                name="addressLine2"
                placeholder={'Enter Address'}
                errors={errors.addressLine2}
                touched={touched.addressLine2}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="select"
                options={countryOptions}
                label="Country"
                name="country"
                errors={errors.country}
                touched={touched.country}
                required={true}
                value={values.country}
                placeholder="Country"
                handleChange={(e) => {
                  setFieldValue('country', e ? e : '');
                  setFieldValue('state', '');
                }}
                handleBlur={handleBlur}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="City"
                name="city"
                placeholder={'Enter City'}
                required={true}
                errors={errors.city}
                touched={touched.city}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="select"
                options={stateOptions}
                label="Province / State"
                name="state"
                required={
                  values.country.countryCode === 'USA' ||
                  values.country.countryCode === 'CAN' ||
                  values.country.countryCode === 'IND'
                }
                value={values.state}
                placeholder="Select State"
                handleChange={(e) => {
                  setFieldValue('state', e ? e : '');
                }}
                handleBlur={handleBlur}
                disabled={isShowPermission}
                errors={errors.state}
                touched={touched.state}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                required={true}
                label="Postalcode / Zipcode"
                name="postalCode"
                placeholder={'Enter Zipcode'}
                errors={errors.postalCode}
                touched={touched.postalCode}
                disabled={isShowPermission}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <FormikController
                control="input"
                type="text"
                label="Organization Address"
                name="organizationAddress"
                placeholder={'Enter Organization Address'}
                errors={errors.organizationAddress}
                touched={touched.organizationAddress}
                disabled={isShowPermission}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Designation"
                name="designation"
                placeholder={'Enter Designation'}
                errors={errors.designation}
                touched={touched.designation}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Organization Name"
                name="organizationName"
                placeholder={'Enter Organization Name'}
                errors={errors.organizationName}
                touched={touched.organizationName}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Oraganization Website"
                name="organizationWebsite"
                placeholder={'Enter Oraganization Website'}
                errors={errors.organizationWebsite}
                touched={touched.organizationWebsite}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Linked In"
                name="linkedinId"
                placeholder={'Enter Linked In'}
                errors={errors.linkedinId}
                touched={touched.linkedinId}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Facebook"
                name="facebookId"
                placeholder={'Enter Facebook'}
                errors={errors.facebookId}
                touched={touched.facebookId}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="X (Twitter)"
                name="twitterId"
                placeholder={'Enter X (Twitter)'}
                errors={errors.twitterId}
                touched={touched.twitterId}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Instagram"
                name="instagramId"
                placeholder={'Enter Instagram'}
                errors={errors.instagramId}
                touched={touched.instagramId}
                disabled={isShowPermission}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Telegram"
                name="telegramId"
                placeholder={'Enter Telegram'}
                errors={errors.telegramId}
                touched={touched.telegramId}
                disabled={isShowPermission}
              />
            </Col>
          </Row>
        </Container>
        <Container className="p-0" fluid>
          <Row className="mt-4">
            <Col className="d-flex gap-2">
              <CustomButton
                variant="primary"
                type="submit"
                disabled={isFormLoader || isShowPermission}
                onClick={() => {
                  document
                    .querySelector('.sliderContainer')
                    .scroll({ top: 0, behavior: 'smooth' });
                }}
              >
                {currentVisitId ? 'Save' : 'Finish'}
              </CustomButton>
              {!currentVisitId ? (
                <CustomButton
                  variant="primary"
                  type="button"
                  disabled={isFormLoader || isShowPermission}
                  onClick={() => savePrimaryData()}
                >
                  Save without secondary guest details
                </CustomButton>
              ) : null}
              <CustomButton onClick={() => { setReset(true) }} type="reset" variant="secondary">
                Reset
              </CustomButton>
            </Col>
          </Row>
        </Container>
      </Form>
    </PermissionWrapper>
  );
};

export default TabSecondaryForm;
