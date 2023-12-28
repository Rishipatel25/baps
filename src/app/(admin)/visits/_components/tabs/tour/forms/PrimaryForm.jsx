import { Formik, Form } from 'formik';
import FormikController from '@/components/form-group/formik-controllers';
import { getAvailablePersonnelAction } from '@/redux/personnel/action.personnel';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GrEdit } from 'react-icons/gr';
import CustomButton from '@/components/Button';
import * as Yup from 'yup';
import { ERRORS } from '@/utils/constants/errors.constants';
import { addTourAction, updateTourAction } from '@/redux/tour/action.tour';
import { toast } from 'react-toastify';
import {
  MODAL_MESSAGES,
  TOAST_SUCCESS,
} from '@/utils/constants/default.constants';
import {
  checkObjectKey,
  checkTimeError,
  formateDate,
  getDateTimeSplitter,
  getVisitTourTab,
} from '@/utils/helper.utils';
import { tourState } from '@/redux/tour/reducer.tour';
import { setTabStatus } from '@/redux/visits/action.visits';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import CustomModal from '../../../modals/CustomModal';
import moment from 'moment';

const PrimaryForm = ({
  formData,
  setFormData,
  locationOpt,
  coordinatorOpt,
  tourGuideOptions,
  setCoordinatorOpt,
  showSubForm,
  setShowSubForm,
  isDisabled,
  setIsDisabled,
  handleSubmitTourGuide,
  partialLoader,
  setPartialLoader,
  tourFormData,
  isEditTour,
  setIsEditTour,
  visitRes,
  servicesList,
  coordinatorRoleId,
  currentVisitId,
  getTourGuides,
  tabStatus,
}) => {
  const [isTimeConfirmed, setIsTimeConfirmed] = useState(false);
  const dispatch = useDispatch();
  const date = formateDate(visitRes.dateOfVisit).resDate;

  const checkIsEmpty = (value) => {
    if (value == '--:-- --' || value == '') return false;
    return true;
  };

  const checkIsInValid = (value) => {
    return !checkTimeError(value);
  };

  const checkIsBetween = (inputValue) => {
    const format = 'hh:mm A';
    const startTime = moment(visitRes.startDateTime, format);
    const endTime = moment(visitRes.endDateTime, format);
    const givenTime = moment(inputValue, format);
    const isBetween = givenTime.isBetween(startTime, endTime, null, '[]');
    return isBetween;
  };

  const tourPrimaryValidations = Yup.object({
    pickupLocation: Yup.object().required(ERRORS.REQUIRED),
    endLocation: Yup.object().required(ERRORS.REQUIRED),
    startDateTime: Yup.mixed()
      .required(ERRORS.REQUIRED)
      .test('is_empty', ERRORS.REQUIRED, checkIsEmpty)
      .test('is_invalid', 'Invalid Input Time', checkIsInValid)
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
      )
      .test('out-of-range-time', 'Time is not in range.', checkIsBetween),
    endDateTime: Yup.mixed()
      .required(ERRORS.REQUIRED)
      .test('is_empty', ERRORS.REQUIRED, checkIsEmpty)
      .test('is_invalid', 'Invalid Input Time', checkIsInValid)
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
          if (!value || !startDateTime) return true;
          return (
            moment(value, 'hh:mm A').format('HHmm') >
            moment(startDateTime, 'hh:mm A').format('HHmm')
          );
        },
      )
      .test('out-of-range-time', 'Time is not in range.', checkIsBetween),
    tourCoordinator: Yup.object().required(ERRORS.REQUIRED),
    isEditForm: Yup.boolean(),
    tourGuide: Yup.array().when('isEditForm', {
      is: true,
      then: () => Yup.array().min(1, ERRORS.REQUIRED).required(ERRORS.REQUIRED),
    }),
  });

  const addFormHandler = (values) => {
    const tourData = {};
    const {
      endDateTime,
      startDateTime,
      endLocation,
      pickupLocation,
      tourCoordinator,
    } = values;
    if (date && servicesList?.length) {
      tourData.visitLocationModelList = [
        {
          startDateTime: `${date} ${moment(startDateTime, 'hh:mm A').format(
            'HH:mm',
          )}:00`,
          endDateTime: `${date} ${moment(startDateTime, 'hh:mm A').format(
            'HH:mm',
          )}:00`,
          locationId: pickupLocation.value,
          locationTagEnum: 'PICKUP',
        },
        {
          startDateTime: `${date} ${moment(endDateTime, 'hh:mm A').format(
            'HH:mm',
          )}:00`,
          endDateTime: `${date} ${moment(endDateTime, 'hh:mm A').format(
            'HH:mm',
          )}:00`,
          locationId: endLocation.value,
          locationTagEnum: 'DROP',
        },
      ];
      tourData.startDateTime = `${date} ${moment(
        startDateTime,
        'hh:mm A',
      ).format('HH:mm')}:00`;
      tourData.endDateTime = `${date} ${moment(endDateTime, 'hh:mm A').format(
        'HH:mm',
      )}:00`;
      tourData.tourCoordinator = {
        personnelId: tourCoordinator.value,
        roleId: coordinatorRoleId,
      };
      tourData.serviceTemplateId = servicesList[0]?.serviceTemplateId || '';
    }
    dispatch(
      addTourAction({ visitId: currentVisitId, tourData }, (res) => {
        toast.success(TOAST_SUCCESS.TOUR_ADDED.MESSAGE, {
          toastId: TOAST_SUCCESS.TOUR_ADDED.ID,
        });
        const tour = getVisitTourTab(res);
        if (!tabStatus?.tourAvailable) {
          dispatch(setTabStatus({ ...tabStatus, tourAvailable: true }));
        }
        setFormData({
          ...tour,
          formPickupLocation: '',
          formActualDuration: '',
          formStartDateTime: '',
          formEndDateTime: '',
          isEditForm: true,
        });
        setIsDisabled(true);
        setIsEditTour(true);
        getTourGuides(values);
        setShowSubForm(true);
      }),
    );
  };

  const onSubmit = (values) => {
    if (isEditTour) {
      const tourData = { ...tourFormData };
      const {
        endDateTime,
        startDateTime,
        endLocation,
        pickupLocation,
        tourCoordinator,
      } = values;

      const { time: startTime } = getDateTimeSplitter(
        tourFormData,
        'startDateTime',
      );
      const { time: endTime } = getDateTimeSplitter(
        tourFormData,
        'endDateTime',
      );
      if (startTime === startDateTime && endTime === endDateTime) {
        if (date && servicesList?.length) {
          const startLocation = {
            startDateTime: tourFormData.startDateTime,
            endDateTime: tourFormData.startDateTime,
            locationId: pickupLocation.value,
            locationTagEnum: 'PICKUP',
          };
          const dropLocation = {
            startDateTime: tourFormData.endDateTime,
            endDateTime: tourFormData.endDateTime,
            locationId: endLocation.value,
            locationTagEnum: 'DROP',
          };
          const restLocations = tourData.visitLocationModelList.filter(
            (location) =>
              location.locationTagEnum !== 'DROP' &&
              location.locationTagEnum !== 'PICKUP',
          );
          tourData.visitLocationModelList = [
            startLocation,
            ...restLocations,
            dropLocation,
          ];
          tourData.tourCoordinator = {
            personnelId: tourCoordinator.value,
            roleId: coordinatorRoleId,
            visitPersonnelId: tourFormData.tourCoordinator.visitPersonnelId,
          };
        }
      } else {
        tourData.startDateTime = `${date} ${moment(
          startDateTime,
          'hh:mm A',
        ).format('HH:mm')}:00`;
        tourData.endDateTime = `${date} ${moment(endDateTime, 'hh:mm A').format(
          'HH:mm',
        )}:00`;

        tourData.visitLocationModelList = [
          {
            startDateTime: `${date} ${moment(startDateTime, 'hh:mm A').format(
              'HH:mm',
            )}:00`,
            endDateTime: `${date} ${moment(startDateTime, 'hh:mm A').format(
              'HH:mm',
            )}:00`,
            locationId: pickupLocation.value,
            locationTagEnum: 'PICKUP',
          },
          {
            startDateTime: `${date} ${moment(endDateTime, 'hh:mm A').format(
              'HH:mm',
            )}:00`,
            endDateTime: `${date} ${moment(endDateTime, 'hh:mm A').format(
              'HH:mm',
            )}:00`,
            locationId: endLocation.value,
            locationTagEnum: 'DROP',
          },
        ];

        tourData.tourGuideList = [];
        tourData.tourCoordinator = {
          personnelId: tourCoordinator.value,
          roleId: coordinatorRoleId,
          visitPersonnelId: tourFormData.tourCoordinator.visitPersonnelId,
        };
      }

      dispatch(
        updateTourAction(
          { visitId: currentVisitId, tourData: tourData },
          (res) => {
            const tour = getVisitTourTab(res);
            setFormData({
              ...tour,
              formPickupLocation: '',
              formActualDuration: '',
              formStartDateTime: '',
              formEndDateTime: '',
              isEditForm: true,
            });
            setIsEditTour(true);
            setShowSubForm(true);
            setIsDisabled(true);

            toast.success(TOAST_SUCCESS.TOUR_UPDATED.MESSAGE, {
              toastId: TOAST_SUCCESS.TOUR_UPDATED.ID,
            });
          },
        ),
      );
    } else {
      addFormHandler(values);
    }
    setIsTimeConfirmed(false);
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={tourPrimaryValidations}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        isValid,
        errors,
        touched,
        values,
        setFieldValue,
        handleBlur,
        setFieldError,
        setFieldTouched,
      }) => (
        <FormCompanent
          errors={errors}
          values={values}
          formData={formData}
          setFormData={setFormData}
          isValid={isValid}
          touched={touched}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          setFieldError={setFieldError}
          locationOpt={locationOpt}
          isDisabled={isDisabled}
          setCoordinatorOpt={setCoordinatorOpt}
          coordinatorOpt={coordinatorOpt}
          showSubForm={showSubForm}
          tourGuideOptions={tourGuideOptions}
          setIsDisabled={setIsDisabled}
          handleSubmitTourGuide={handleSubmitTourGuide}
          partialLoader={partialLoader}
          setPartialLoader={setPartialLoader}
          setShowSubForm={setShowSubForm}
          isEditTour={isEditTour}
          setIsEditTour={setIsEditTour}
          isTimeConfirmed={isTimeConfirmed}
          setIsTimeConfirmed={setIsTimeConfirmed}
          setFieldTouched={setFieldTouched}
          visitRes={visitRes}
        />
      )}
    </Formik>
  );
};
export default PrimaryForm;

const FormCompanent = ({
  errors,
  values,
  formData,
  touched,
  handleBlur,
  setFieldValue,
  setFieldError,
  locationOpt,
  isDisabled,
  setCoordinatorOpt,
  coordinatorOpt,
  tourGuideOptions,
  setIsDisabled,
  handleSubmitTourGuide,
  setFormData,
  showSubForm,
  setShowSubForm,
  isTimeConfirmed,
  setIsTimeConfirmed,
  isEditTour,
  setFieldTouched,
  visitRes,
}) => {
  const { tourFormData } = useSelector(tourState);
  const [modalStatus, setModalStatus] = useState({ show: false, type: '' });
  const [isShowPermission, setShowPermission] = useState(false);
  const date = formateDate(visitRes.dateOfVisit).resDate;
  const dispatch = useDispatch();

  function handleModalClose() {
    const tour = getVisitTourTab(tourFormData);
    if (modalStatus.type === 'startDateTime') {
      setFieldValue('startDateTime', tour.startDateTime);
    } else setFieldValue('endDateTime', tour.endDateTime);
    setModalStatus({ show: false, type: '' });
  }

  function modalSubmitAction() {
    setFormData({
      ...values,
      tourCoordinator: '',
      tourGuide: [],
      locationList: [],
      isEditForm: false,
    });
    setIsTimeConfirmed(true);
    //call to erase data
    setModalStatus({ show: false, type: '' });
  }

  useEffect(() => {
    setCoordinatorOpt([]);
    if (!isEditTour) setFieldValue('tourCoordinator', '');
    if (date && values.startDateTime && values.endDateTime && !isDisabled) {
      if (
        !checkTimeError(values.startDateTime) &&
        !checkTimeError(values.endDateTime)
      ) {
        const starttime = moment(values.startDateTime, 'hh:mm A').format(
          'HH:mm:ss',
        );
        const endtime = moment(values.endDateTime, 'hh:mm A').format(
          'HH:mm:ss',
        );

        dispatch(
          getAvailablePersonnelAction(
            {
              startDateTime: `${date} ${starttime}`,
              endDateTime: `${date} ${endtime}`,
            },
            ({ options }) => {
              setCoordinatorOpt(options);
            },
          ),
        );
      }
    }
  }, [values.startDateTime, values.endDateTime]);

  return (
    <>
      <CustomModal
        showModal={modalStatus.show}
        closeAction={handleModalClose}
        title={MODAL_MESSAGES.EDIT_TOUR_TIME.TITLE}
        content={MODAL_MESSAGES.EDIT_TOUR_TIME.CONTENT}
        isFooter={true}
        submitAction={modalSubmitAction}
        submitBtnText={MODAL_MESSAGES.EDIT_TOUR_TIME.SUBMIT_BUTTON_TEXT}
        cancelBtnText={MODAL_MESSAGES.EDIT_TOUR_TIME.CANCEL_BUTTON_TEXT}
      />
      <PermissionWrapper
        name={'ADD_VISIT_TOUR'}
        mode="2"
        callback={(event) => {
          setShowPermission(!event);
        }}
      >
        <Form>
          <Container fluid className="tabForm  pb-0">
            <Row>
              <Col lg={4} sm={6} className="mt-4">
                <FormikController
                  control="select"
                  options={locationOpt}
                  label="Pickup Location"
                  name="pickupLocation"
                  required={true}
                  errors={errors.pickupLocation}
                  touched={touched.pickupLocation}
                  value={values.pickupLocation}
                  placeholder="Select Location"
                  handleChange={(e) => {
                    setFieldValue('pickupLocation', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  disabled={isDisabled || isShowPermission}
                />
              </Col>
              <Col lg={4} sm={6} className="mt-4">
                <FormikController
                  control="select"
                  options={locationOpt}
                  label="End Location"
                  name="endLocation"
                  required={true}
                  errors={errors.endLocation}
                  touched={touched.endLocation}
                  value={values.endLocation}
                  placeholder="Select Location"
                  handleChange={(e) => {
                    setFieldValue('endLocation', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  disabled={isDisabled || isShowPermission}
                />
              </Col>
              <Col lg={2} sm={3} className="mt-4">
                <FormikController
                  control="time"
                  label="Start Time"
                  name="startDateTime"
                  required={true}
                  placeholder="Start Time"
                  errors={errors.startDateTime}
                  touched={touched.startDateTime}
                  disabledTimeRange={{
                    to: visitRes?.endDateTime,
                    from: visitRes?.startDateTime,
                  }}
                  handelFocus={(e) => {
                    setFieldTouched(e.target.name, true);
                  }}
                  setFieldValue={setFieldValue}
                  disabled={isDisabled || isShowPermission}
                  value={values?.startDateTime}
                  handleChange={() => {
                    if (formData?.startDateTime && values?.startDateTime) {
                      const isSame =
                        formData?.startDateTime === values?.startDateTime;
                      if (!isTimeConfirmed && isEditTour && !isSame) {
                        setModalStatus({ show: true, type: 'startDateTime' });
                      }
                    }
                  }}
                />
              </Col>
              <Col lg={2} sm={3} className="mt-4">
                <FormikController
                  control="time"
                  label="End Time"
                  name="endDateTime"
                  required={true}
                  placeholder="End Time"
                  disabled={isDisabled || isShowPermission}
                  errors={errors.endDateTime}
                  touched={touched.endDateTime}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  handelFocus={(e) => {
                    setFieldTouched(e.target.name, true);
                  }}
                  disabledTimeRange={{
                    from: values?.startDateTime
                      ? values?.startDateTime
                      : visitRes?.startDateTime,
                    to: visitRes?.endDateTime,
                  }}
                  value={values?.endDateTime}
                  handleChange={() => {
                    if (formData?.endDateTime && values?.endDateTime) {
                      const isSame =
                        formData?.endDateTime === values?.endDateTime;
                      if (!isTimeConfirmed && isEditTour && !isSame) {
                        setModalStatus({ show: true, type: 'endDateTime' });
                      }
                    }
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4} sm={6} className="mt-4">
                <FormikController
                  control="select"
                  options={coordinatorOpt}
                  label="Tour Coordinator"
                  name="tourCoordinator"
                  required={true}
                  disabled={isDisabled || isShowPermission}
                  errors={errors.tourCoordinator}
                  touched={touched.tourCoordinator}
                  value={values.tourCoordinator}
                  placeholder="Select Coordinator"
                  handleChange={(e) => {
                    setFieldValue('tourCoordinator', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  searchKey={['email', 'phoneNumber', 'firstName', 'lastName']}
                />
              </Col>
              <Col lg={8} sm={6} className="mt-4 pt-4">
                {isDisabled ? (
                  <div className="text-right float-x-right">
                    <PermissionWrapper name={'UPDATE_VISIT_TOUR'}>
                      <CustomButton
                        variant="outline-secondary"
                        type=""
                        onClick={(e) => {
                          e.preventDefault();
                          setIsDisabled(false);
                          setShowSubForm(false);
                          setFormData({ ...formData, isEditForm: false });
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <GrEdit />
                          Edit
                        </div>
                      </CustomButton>
                    </PermissionWrapper>
                  </div>
                ) : (
                  <div className="text-right d-flex gap-3 float-x-right">
                    <CustomButton
                      variant="primary"
                      type="submit"
                      disabled={isShowPermission}
                    >
                      Save
                    </CustomButton>
                    <CustomButton
                      variant="secondary"
                      type="reset"
                      disabled={isShowPermission}
                      onClick={() => {
                        setCoordinatorOpt([]);
                        if (checkObjectKey(tourFormData)) {
                          setIsDisabled(true);
                          const tour = getVisitTourTab(tourFormData);
                          setFormData({
                            ...tour,
                            formPickupLocation: '',
                            formActualDuration: '',
                            formStartDateTime: '',
                            formEndDateTime: '',
                            isEditForm: true,
                          });
                          setShowSubForm(true);
                          setIsTimeConfirmed(false);
                        }
                      }}
                    >
                      Reset
                    </CustomButton>
                  </div>
                )}
              </Col>
            </Row>
            {showSubForm && (
              <>
                <Row>
                  <Col lg={8} sm={12}>
                    <FormikController
                      control="select"
                      options={tourGuideOptions}
                      label="Tour Guide"
                      name="tourGuide"
                      required={true}
                      errors={errors.tourGuide}
                      touched={touched.tourGuide}
                      value={values.tourGuide}
                      placeholder="Select Tour Guide"
                      handleChange={(e) => {
                        handleSubmitTourGuide('tourGuideList', e, () =>
                          setFieldValue('tourGuide', e ? e : ''),
                        );
                      }}
                      handleBlur={handleBlur}
                      disabled={isShowPermission}
                      isMulti={true}
                      searchKey={[
                        'email',
                        'phoneNumber',
                        'firstName',
                        'lastName',
                      ]}
                    />
                  </Col>
                </Row>
                <hr className="divider mb-2" />
              </>
            )}
          </Container>
        </Form>
      </PermissionWrapper>
    </>
  );
};
