import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import { lookupToObject } from '@/utils/helper.utils';
import { Form } from 'formik';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';

const TabPrimaryForm = ({
  saveFormsDataLocally,
  currentVisitId,
  isFormLoader,
  setFormType,
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
  setReset,
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

  useEffect(() => {
    const section = document.querySelector('.offcanvas-title');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  //on country change set state options
  useEffect(() => {
    if (values?.country?.value) {
      const tempStateOptions = allStateOptions.filter((state) => {
        return state.countryId === values.country.value;
      });
      setStateOptions(tempStateOptions);
    }
  }, [values.country]);

  // Set value to redux store
  useEffect(() => {
    saveFormsDataLocally({
      currentFormNumber: 2,
      values,
      formProperties: { isValid, dirty, errors },
    });
  }, [values]);

  useEffect(() => {
    if (!isValid && hasError && dirty) {
      setCurrentProgress(2);
    }
  }, [isValid, dirty]);

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
                disabled={isShowPermission}
                handleChange={(e) => {
                  setFieldValue('gender', e ? e : '');
                }}
                handleBlur={handleBlur}
              />
            </Col>
            <Col md={8} className="mt-4">
              <FormikController
                control="radio"
                label="Preferred Communication"
                name="preferredCommMode"
                disabled={isShowPermission}
                options={preferredCommModeOptions}
                required={true}
                errors={errors.preferredCommMode}
                touched={touched.preferredCommMode}
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
                disabled={isShowPermission}
                placeholder={'Enter Email Address'}
                errors={errors.email}
                touched={touched.email}
                required={true}
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
                disabled={isShowPermission}
                required={true}
                handleBlur={handleBlur}
                handleChange={(e) => {
                  setFieldValue('phoneCountryCode', e ? e : '');
                }}
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
                disabled={isShowPermission}
                setFieldValue={setFieldValue}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Address 1"
                disabled={isShowPermission}
                name="addressLine1"
                placeholder={'Enter Address'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Address 2"
                name="addressLine2"
                disabled={isShowPermission}
                placeholder={'Enter Address'}
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
                disabled={isShowPermission}
                value={values.country}
                placeholder="Country"
                handleChange={(e) => {
                  setFieldValue('country', e ? e : '');
                  setFieldValue('state', '');
                  setStateOptions([]);
                }}
                handleBlur={handleBlur}
              />
            </Col>

            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="City"
                name="city"
                required={true}
                disabled={isShowPermission}
                placeholder={'Enter City'}
                errors={errors.city}
                touched={touched.city}
              />
            </Col>

            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="select"
                options={stateOptions}
                label="Province / State"
                name="state"
                value={values.state}
                disabled={isShowPermission}
                
                placeholder="Select State"
                handleChange={(e) => {
                  setFieldValue('state', e ? e : '');
                }}
                handleBlur={handleBlur}
                errors={errors.state}
                touched={touched.state}
                required={
                  values.country.countryCode === 'USA' ||
                  values.country.countryCode === 'CAN' ||
                  values.country.countryCode === 'IND'
                }
              />
            </Col>

            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Postalcode / Zipcode"
                name="postalCode"
                placeholder={'Enter Zipcode'}
                required={true}
                disabled={isShowPermission}
                errors={errors.postalCode}
                touched={touched.postalCode}
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
                disabled={isShowPermission}
                placeholder={'Enter Organization Address'}
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
                disabled={isShowPermission}
                placeholder={'Enter Designation'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Organization Name"
                name="organizationName"
                disabled={isShowPermission}
                placeholder={'Enter Organization Name'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Organization Website"
                name="organizationWebsite"
                disabled={isShowPermission}
                placeholder={'Enter Organization Website'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Linked In"
                name="linkedinId"
                disabled={isShowPermission}
                placeholder={'Enter Linked In'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Facebook"
                name="facebookId"
                disabled={isShowPermission}
                placeholder={'Enter Facebook'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="X (Twitter)"
                name="twitterId"
                disabled={isShowPermission}
                placeholder={'Enter X (Twitter)'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Instagram"
                name="instagramId"
                disabled={isShowPermission}
                placeholder={'Enter Instagram'}
              />
            </Col>
            <Col md={4} sm={6} xs={12} className="mt-4">
              <FormikController
                control="input"
                type="text"
                label="Telegram"
                name="telegramId"
                disabled={isShowPermission}
                placeholder={'Enter Telegram'}
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
                onClick={() => {
                  setFormType('callApi');
                }}
                disabled={isFormLoader || isShowPermission}
              >
                {currentVisitId ? 'Save' : 'Finish'}
              </CustomButton>
              {!currentVisitId && (
                <CustomButton
                  variant="primary"
                  type="submit"
                  onClick={() => {
                    setFormType('partialSubmit');
                    document
                      .querySelector('.sliderContainer')
                      .scroll({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={isFormLoader || isShowPermission}
                >
                  Next
                </CustomButton>
              )}

              <CustomButton
                type="reset"
                variant="secondary"
                onClick={() => {
                  setReset(true);
                }}
                disabled={isShowPermission}
              >
                Reset
              </CustomButton>
            </Col>
          </Row>
        </Container>
      </Form>
    </PermissionWrapper>
  );
};

export default TabPrimaryForm;
