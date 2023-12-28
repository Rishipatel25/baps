import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import { searchServiceAction } from '@/redux/visits/action.visits';
import { visitState } from '@/redux/visits/reducer.visits';
import { lookupToObject } from '@/utils/helper.utils';
import { Form } from 'formik';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// import { DateFieldNew } from '@/components/form-group/custom-inputs/CustomAllInputs';
import CustomModal from '../../modals/CustomModal';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { MODAL_MESSAGES } from '@/utils/constants/default.constants';
import { DateFieldNew } from '@/components/form-group/formik-controllers/FormikFields';

const TabVisitForm = ({
  saveFormsDataLocally,
  currentVisitId,
  errors,
  values,
  isValid,
  touched,
  dirty,
  handleBlur,
  setFieldValue,
  setFieldError,
  // handleChange,
  // setHasError,
  setCurrentProgress,
  hasError,
  requestorOptions,
  setFieldTouched,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [serviceOption, setServiceOption] = useState([]);
  const [showTimeDifferenceModal, setShowTimeDifferenceModal] = useState(false);

  const dispatch = useDispatch();
  const { servicesList } = useSelector(visitState);
  const [isShowPermission, setShowPermission] = useState(false);

  useEffect(() => {
    dispatch(searchServiceAction(''));
  }, []);
  useEffect(() => {
    if (currentVisitId) {
      setIsDisabled(true);
    }
  }, [currentVisitId]);
  useEffect(() => {
    if (servicesList.length > 0) {
      const options = [];
      servicesList?.map((element) => {
        options.push({ label: element.name, value: element.serviceTemplateId });
      });
      setServiceOption(options);
    }
  }, [servicesList]);

  const calculateSum = (...values) => {
    // Calculate the sum using reduce and the + operator for type conversion
    const sum = values.reduce((acc, value) => acc + (+value || 0), 0);
    return sum;
  };

  const calculateTotalGuests = (values) => {
    return calculateSum(
      values.adultMaleCount || 0,
      values.adultFemaleCount || 0,
      values.seniorMaleCount || 0,
      values.seniorFemaleCount || 0,
      values.childMaleCount || 0,
      values.childFemaleCount || 0,
    );
  };

  const typeOfVisitsOptions = lookupToObject('TYPE_OF_VISIT');

  // Set value to redux store
  useEffect(() => {
    saveFormsDataLocally({
      currentFormNumber: 1,
      values,
      formProperties: { isValid, dirty },
    });
  }, [values]);

  useEffect(() => {
    if (!isValid && hasError && dirty) {
      setCurrentProgress(1);
    }
  }, [isValid, dirty]);

  const handleModalClose = () => {
    setShowTimeDifferenceModal(false);
  };

  return (
    <>
      {showTimeDifferenceModal && (
        <CustomModal
          showModal={showTimeDifferenceModal}
          closeAction={handleModalClose}
          title={MODAL_MESSAGES.TIME_ERROR.TITLE}
          content={MODAL_MESSAGES.TIME_ERROR.CONTENT}
          isFooter={false}
        />
      )}
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
              <Col md={6} sm={6} className="mt-4">
                <FormikController
                  control="select"
                  name="typeOfVisit"
                  options={typeOfVisitsOptions}
                  value={values.typeOfVisit}
                  label="Visit Type"
                  placeholder="Select Type"
                  required={true}
                  handleChange={(e) => {
                    setFieldValue('typeOfVisit', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  errors={errors.typeOfVisit}
                  touched={touched.typeOfVisit}
                  disabled={isShowPermission}
                />
              </Col>
              <Col md={6} sm={6} className="mt-4">
                <FormikController
                  control="select"
                  options={requestorOptions}
                  label="Relationship Manager"
                  name="requesterPersonnelId"
                  value={values.requesterPersonnelId}
                  placeholder="Select Relationship Manager"
                  handleChange={(e) => {
                    setFieldValue('requesterPersonnelId', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  required={true}
                  errors={errors.requesterPersonnelId}
                  touched={touched.requesterPersonnelId}
                  searchKey={['email', 'phoneNumber', 'firstName', 'lastName']}
                  disabled={isShowPermission}
                />
              </Col>
              <Col md={4} sm={6} className="mt-4">
                {values.requesterPersonnelId.value === 'Other' && (
                  <FormikController
                    control="input"
                    type="text"
                    label="Other Requestor"
                    name="otherRequesterName"
                    placeholder={'Enter Requestor Name'}
                    required={true}
                    errors={errors.otherRequesterName}
                    touched={touched.otherRequesterName}
                    disabled={isShowPermission}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col className="mt-4">
                <FormikController
                  control="textarea"
                  label="Requestor Note"
                  name="requesterNotes"
                  placeholder="Enter Requestor Note"
                  disabled={isShowPermission}
                  errors={errors?.requesterNotes}
                  touched={touched?.requesterNotes}
                />
              </Col>
            </Row>
            <Row>
              <Col md={4} lg={2} xs={12} className="mt-4">
                <DateFieldNew
                  control="date"
                  label="Date of Visit"
                  name="dateOfVisit"
                  required={true}
                  errors={errors.dateOfVisit}
                  touched={touched.dateOfVisit}
                  setFieldValue={setFieldValue}
                  disabled={isDisabled || isShowPermission}
                  placeholder={'Select Date'}
                />
              </Col>
              <Col md={4} lg={2} xs={12} className="mt-4">
                <FormikController
                  control="time"
                  label="Start Time"
                  name="startDateTime"
                  required={true}
                  placeholder="Enter Time"
                  errors={errors.startDateTime}
                  touched={touched.startDateTime}
                  disabled={isDisabled || isShowPermission}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  value={values?.startDateTime ? values?.startDateTime : ''}
                />
              </Col>
              <Col md={4} lg={2} xs={12} className="mt-4">
                <FormikController
                  control="time"
                  label="End Time"
                  name="endDateTime"
                  required={true}
                  placeholder="Enter Time"
                  errors={errors.endDateTime}
                  touched={touched.endDateTime}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  disabled={isDisabled || isShowPermission}
                  value={values?.endDateTime ? values?.endDateTime : ''}
                />
              </Col>
              <Col md={12} lg={6} xs={12} className="mt-4">
                <FormikController
                  control="select"
                  options={serviceOption}
                  label="Requested Services"
                  name="requestedServices"
                  value={values.requestedServices}
                  placeholder="Select Service"
                  handleChange={(e) => {
                    setFieldValue('requestedServices', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  required={true}
                  errors={errors.requestedServices}
                  touched={touched.requestedServices}
                  isMulti={true}
                  disabled={isShowPermission}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col sm={12} className="mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h6>Guest Details</h6>
                  <b>Total Guest: {values?.totalVisitors || 0}</b>
                </div>
                <small
                  className={`${
                    errors.totalVisitors && touched.totalVisitors
                      ? 'text-danger'
                      : 'text-muted'
                  }`}
                >
                  Kindly pick at least one guest.
                </small>

                <hr className="mt-0" />
              </Col>
              <Col xs={12} md={4} sm={12}>
                <Row>
                  <Col sm={6} xs={6} className="total-guest-detail">
                    <FormikController
                      control="number"
                      type="number"
                      label={
                        <>
                          Adult Male{' '}
                          <span className="visit-guest-age">(18-64)</span>
                        </>
                      }
                      name="adultMaleCount"
                      placeholder={'0'}
                      errors={errors.adultMaleCount}
                      touched={touched.adultMaleCount}
                      setFieldValue={setFieldValue}
                      setFieldError={setFieldError}
                      disabled={isShowPermission}
                      value={values.adultMaleCount}
                      setFieldTouched={setFieldTouched}
                      handleChange={(e) => {
                        const totalGuest = calculateTotalGuests({
                          ...values,
                          adultMaleCount: e.target.value || 0,
                        });
                        setFieldValue('totalVisitors', totalGuest || 0);
                      }}
                    />
                  </Col>
                  <Col sm={6} xs={6} className="total-guest-detail">
                    <FormikController
                      control="number"
                      type="number"
                      label={
                        <>
                          Adult Female{' '}
                          <span className="visit-guest-age">(18-64)</span>{' '}
                        </>
                      }
                      name="adultFemaleCount"
                      placeholder={'0'}
                      errors={errors.adultFemaleCount}
                      touched={touched.adultFemaleCount}
                      setFieldValue={setFieldValue}
                      setFieldError={setFieldError}
                      disabled={isShowPermission}
                      value={values.adultFemaleCount}
                      setFieldTouched={setFieldTouched}
                      handleChange={(e) => {
                        const totalGuest = calculateTotalGuests({
                          ...values,
                          adultFemaleCount: e.target.value || 0,
                        });
                        setFieldValue('totalVisitors', totalGuest || 0);
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={4} sm={12} className="total-guest-detail">
                <Row>
                  <Col sm={6} xs={6}>
                    <FormikController
                      control="number"
                      type="number"
                      label={
                        <>
                          Senior Male{' '}
                          <span className="visit-guest-age">(65+)</span>
                        </>
                      }
                      name="seniorMaleCount"
                      placeholder={'0'}
                      handleChange={(e) => {
                        const totalGuest = calculateTotalGuests({
                          ...values,
                          seniorMaleCount: e.target.value || 0,
                        });
                        setFieldValue('totalVisitors', totalGuest || 0);
                      }}
                      errors={errors.seniorMaleCount}
                      touched={touched.seniorMaleCount}
                      setFieldValue={setFieldValue}
                      setFieldError={setFieldError}
                      disabled={isShowPermission}
                      value={values.seniorMaleCount}
                      setFieldTouched={setFieldTouched}
                    />
                  </Col>
                  <Col sm={6} xs={6}>
                    <FormikController
                      control="number"
                      type="number"
                      label={
                        <>
                          Senior Female{' '}
                          <span className="visit-guest-age">(65+)</span>
                        </>
                      }
                      name="seniorFemaleCount"
                      placeholder={'0'}
                      handleChange={(e) => {
                        const totalGuest = calculateTotalGuests({
                          ...values,
                          seniorFemaleCount: e.target.value || 0,
                        });
                        setFieldValue('totalVisitors', totalGuest || 0);
                      }}
                      errors={errors.seniorFemaleCount}
                      touched={touched.seniorFemaleCount}
                      setFieldValue={setFieldValue}
                      setFieldError={setFieldError}
                      disabled={isShowPermission}
                      value={values.seniorFemaleCount}
                      setFieldTouched={setFieldTouched}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={4} sm={12} className="total-guest-detail">
                <Row>
                  <Col sm={6} xs={6}>
                    <FormikController
                      control="number"
                      type="number"
                      label={
                        <>
                          Children Male{' '}
                          <span className="visit-guest-age">(0-17)</span>
                        </>
                      }
                      name="childMaleCount"
                      placeholder={'0'}
                      handleChange={(e) => {
                        const totalGuest = calculateTotalGuests({
                          ...values,
                          childMaleCount: e.target.value || 0,
                        });
                        setFieldValue('totalVisitors', totalGuest || 0);
                      }}
                      errors={errors.childMaleCount}
                      touched={touched.childMaleCount}
                      onlyInteger={true}
                      setFieldValue={setFieldValue}
                      setFieldError={setFieldError}
                      disabled={isShowPermission}
                      value={values.childMaleCount}
                      setFieldTouched={setFieldTouched}
                    />
                  </Col>
                  <Col sm={6} xs={6}>
                    <FormikController
                      control="number"
                      type="number"
                      label={
                        <>
                          Children Female{' '}
                          <span className="visit-guest-age">(0-17)</span>
                        </>
                      }
                      name="childFemaleCount"
                      placeholder={'0'}
                      handleChange={(e) => {
                        const totalGuest = calculateTotalGuests({
                          ...values,
                          childFemaleCount: e.target.value || 0,
                        });
                        setFieldValue('totalVisitors', totalGuest || 0);
                      }}
                      errors={errors.childFemaleCount}
                      touched={touched.childFemaleCount}
                      setFieldValue={setFieldValue}
                      setFieldError={setFieldError}
                      disabled={isShowPermission}
                      value={values.childFemaleCount}
                      setFieldTouched={setFieldTouched}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="mt-4">
                <FormikController
                  control="textarea"
                  label="Comments"
                  name="visitorComments"
                  placeholder="Enter Comments"
                  disabled={isShowPermission}
                  errors={errors?.visitorComments}
                  touched={touched?.visitorComments}
                />
              </Col>
            </Row>
          </Container>
          <Container className="p-0 " fluid>
            <Row className="mt-4">
              <Col className="d-flex gap-2">
                <CustomButton
                  type="submit"
                  variant="primary"
                  disabled={isShowPermission}
                  onClick={() => {
                    document
                      .querySelector('.sliderContainer')
                      .scroll({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {currentVisitId ? 'Save' : 'Next'}
                </CustomButton>
                <CustomButton
                  variant="secondary"
                  type="reset"
                  disabled={isShowPermission}
                >
                  Reset
                </CustomButton>
              </Col>
            </Row>
          </Container>
        </Form>
      </PermissionWrapper>
    </>
  );
};

export default TabVisitForm;
