'use client';
import { RxCross1 } from 'react-icons/rx';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { BiExitFullscreen } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { visitState } from '@/redux/visits/reducer.visits';
import { Col, Container, Row } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { lookupToObject } from '@/utils/helper.utils';
import Offcanvas from 'react-bootstrap/Offcanvas';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import FormikController from '@/components/form-group/formik-controllers';
import CustomButton from '@/components/Button';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { ERRORS } from '@/utils/constants/errors.constants';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import * as Yup from 'yup';
import moment from 'moment';
import {
  getPreBookedAction,
  updatePreBookedAction,
} from '@/redux/pre-book/action.pre-book';

const TourSlider = ({ sliderShow, handleClose, selectedGuest }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [resetFrom, setResetForm] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [stateOptions, setStateOptions] = useState([]);
  const [tourObj, setTourObj] = useState({});
  const [isShowPermission, setShowPermission] = useState(false);
  const [guestFormData, setGuestFormData] = useState({
    saltuation: '',
    firstName: '',
    lastName: '',
    gender: '',
    middleName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    childMale: '',
    childFemale: '',
    adultMale: '',
    adultFemale: '',
    seniorMale: '',
    seniorFemale: '',
    comments: '',
  });
  const [guideFormData, setGuideFormData] = useState({
    totalGuest: '',
    slotTime: '',
    dateOfTour: '',
  });

  const dispatch = useDispatch();
  const countryOptions = useSelector((state) => state.masters.countries);
  const allStateOptions = useSelector((state) => state.masters.state);
  const { isGetByIdLoader } = useSelector(visitState);
  const genderOptions = lookupToObject('GENDER');

  const salutationOptions = [
    { label: 'Mr', value: 'Mr' },
    { label: 'Mrs', value: 'Mrs' },
  ];
  const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ERRORS.REQUIRED)
      .matches(emailRegExp, ERRORS.INVALID_EMAIL),
    firstName: Yup.string()
      .required(ERRORS.REQUIRED)
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
  });

  const handleDataResponse = (res) => {
    setRequestNumber(res.requestNumber);
    setTourObj(res);
    setGuideFormData((prevState) => ({
      ...prevState,
      dateOfTour: moment(res.startDateTime).format('MM-DD-yyyy'),
      slotTime:
        moment(res.startDateTime).format('HH:mm A') +
        ' - ' +
        moment(res.endDateTime).format('HH:mm A'),
      totalGuest: res.totalVisitors,
    }));
    setGuestFormData((prevState) => ({
      ...prevState,
      saltuation: res.primaryVisitorModel.salutation
        ? salutationOptions.find(
            (d) => d.value === res.primaryVisitorModel.salutation,
          )
        : '',
      firstName: res.primaryVisitorModel.firstName,
      lastName: res.primaryVisitorModel.lastName,
      gender: res.primaryVisitorModel.gender
        ? genderOptions.find((d) => d.value === res.primaryVisitorModel.gender)
        : '',
      middleName: res.primaryVisitorModel.middleName,
      email: res.primaryVisitorModel.email,
      phone: res.primaryVisitorModel.phoneNumber,
      address1: res.primaryVisitorModel.addressLine1,
      address2: res.primaryVisitorModel.addressLine2,
      country: res.primaryVisitorModel.country
        ? countryOptions.find(
            (d) => d.value === res.primaryVisitorModel.country,
          )
        : '',
      state: res.primaryVisitorModel.state ? res.primaryVisitorModel.state : '',
      city: res.primaryVisitorModel.city,
      zipcode: res.primaryVisitorModel.postalCode,
      childMale: res.childMaleCount,
      childFemale: res.childFemaleCount,
      adultMale: res.adultMaleCount,
      adultFemale: res.adultFemaleCount,
      seniorMale: res.seniorMaleCount,
      seniorFemale: res.seniorFemaleCount,
      comments: res.visitorComments,
    }));
    if (res.primaryVisitorModel.country) {
      const tempStateOptions = allStateOptions.filter((state) => {
        return state.countryId === res.primaryVisitorModel.country;
      });
      setStateOptions(tempStateOptions);
      setGuestFormData((prevState) => ({
        ...prevState,
        state: res.primaryVisitorModel.state
          ? tempStateOptions.find(
              (d) => d.value === res.primaryVisitorModel.state,
            )
          : '',
      }));
    }
  };

  const getDataById = () => {
    dispatch(getPreBookedAction(selectedGuest?.visitId, handleDataResponse));
  };

  const onSubmit = () => {
    const body = {
      visitId: selectedGuest?.visitId,
      tourData: {
        visitId: tourObj.visitId,
        tourSlotId: tourObj.tourSlotId,
        totalVisitors: guideFormData.totalGuest,
        childFemaleCount: guestFormData.childFemale,
        childMaleCount: guestFormData.childMale,
        adultFemaleCount: guestFormData.adultFemale,
        adultMaleCount: guestFormData.adultMale,
        seniorFemaleCount: guestFormData.seniorFemale,
        seniorMaleCount: guestFormData.seniorMale,
        visitorComments: guestFormData.visitorComments,
        primaryVisitorModel: {
          visitorId: tourObj.primaryVisitorModel.visitorId,
          salutation: guestFormData.saltuation
            ? guestFormData.saltuation.value
            : '',
          firstName: guestFormData.firstName,
          middleName: guestFormData.middleName,
          lastName: guestFormData.lastName,
          gender: guestFormData.gender ? guestFormData.gender.value : '',
          addressLine1: guestFormData.address1,
          addressLine2: guestFormData.address2,
          country: guestFormData.country ? guestFormData.country.value : '',
          state: guestFormData.state ? guestFormData.state.value : '',
          city: guestFormData.city,
          postalCode: guestFormData.zipcode,
          email: guestFormData.email,
          phoneNumber: guestFormData.phone,
        },
      },
    };
    dispatch(
      updatePreBookedAction(body, () => {
        setSubmit(false);
        toast.success(TOAST_SUCCESS.PRE_BOOOK_UPDATE.MESSAGE, {
          toastId: TOAST_SUCCESS.PRE_BOOOK_UPDATE.ID,
        });
        getDataById();
      }),
    );
    setSubmit(false);
  };

  function isSafari() {
    return (navigator.vendor.match(/apple/i) || '').length > 0;
  }

  useEffect(() => {
    if (guestFormData?.country?.value) {
      const tempStateOptions = allStateOptions.filter((state) => {
        return state.countryId === guestFormData.country.value;
      });
      setStateOptions(tempStateOptions);
    }
  }, [guestFormData.country]);

  useEffect(() => {
    if (selectedGuest?.visitId) {
      getDataById();
    }
  }, [selectedGuest]);

  useEffect(() => {
    if (resetFrom) {
      getDataById();
    }
    setResetForm(false);
  }, [resetFrom]);

  useEffect(() => {
    submit && onSubmit();
  }, [submit]);

  useEffect(() => {
    const sliderForm = document.querySelector('.sliderForm');
    if (fullScreen) {
      sliderForm.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreen]);

  return (
    <Offcanvas
      show={sliderShow}
      backdrop="static"
      placement="end"
      className="sliderForm"
    >
      {isGetByIdLoader ? (
        <SpinnerLoader />
      ) : (
        <>
          <Offcanvas.Header className="offcanvas-title-heading">
            <Offcanvas.Title className="w-100">
              <div className="d-flex align-items-center justify-content-between w-100">
                <h5 className="m-0">Tour details for {requestNumber}</h5>
                <div className="d-flex gap-3">
                  {!isSafari() ? (
                    <div
                      role="button"
                      onClick={() => setFullScreen(!fullScreen)}
                      className="p-1"
                    >
                      {fullScreen ? (
                        <BiExitFullscreen />
                      ) : (
                        <BsArrowsFullscreen />
                      )}
                    </div>
                  ) : null}
                  <div role="button" className="p-1" onClick={handleClose}>
                    <RxCross1 />
                  </div>
                </div>
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div>
              <Container fluid className="p-0 my-2">
                <h5 className="mb-2">Tour Details</h5>
              </Container>
              <div>
                <Formik initialValues={guideFormData} enableReinitialize>
                  {({ values }) => (
                    <Form>
                      <Container fluid className="tabForm">
                        <Row>
                          <Col md={4} sm={12}>
                            <label>
                              Date Of Tour
                              <DatePicker
                                dateFormat={'MM-dd-yyyy'}
                                placeholderText="To date"
                                className="form-control"
                                name="dateOfTour"
                                value={values.dateOfTour}
                                disabled={true}
                                showIcon={false}
                              />
                            </label>
                          </Col>
                          <Col md={4} sm={6}>
                            <FormikController
                              control="input"
                              type="text"
                              label="Slot Time"
                              name="slotTime"
                              value={values.slotTime}
                              disabled={true}
                            />
                          </Col>
                          <Col md={4} sm={6}>
                            <FormikController
                              control="input"
                              type="text"
                              label="Total Guest"
                              name="totalGuest"
                              value={values.totalGuest}
                              disabled={true}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="mt-3">
              <Container
                fluid
                className="p-0 d-flex justify-content-between my-2 align-items-center"
              >
                <h5>Guest Details</h5>
              </Container>

              <div>
                <PermissionWrapper
                  name={'UPDATE_PRE_BOOKED_VISIT'}
                  mode="2"
                  callback={(event) => {
                    setShowPermission(!event);
                  }}
                >
                  <Formik
                    initialValues={guestFormData}
                    validationSchema={validationSchema}
                    onSubmit={(e) => {
                      setGuestFormData(e);
                      setSubmit(true);
                    }}
                    enableReinitialize
                  >
                    {({ values, errors, touched, setFieldValue }) => (
                      <Form
                        onChange={(e) => {
                          setGuestFormData((prevState) => ({
                            ...prevState,
                            [e.target.name]: e.target.value,
                          }));
                        }}
                      >
                        <Container fluid className="tabForm">
                          <Row className="tour-guest-col">
                            <Col md={6} sm={12} className="mb-2">
                              <Container fluid className="p-0">
                                <Row>
                                  <Col md={4} sm={12}>
                                    <FormikController
                                      control="select"
                                      options={salutationOptions}
                                      label="Title"
                                      name="saltuation"
                                      value={values.saltuation}
                                      disabled={isShowPermission}
                                      handleChange={(e) => {
                                        setFieldValue('saltuation', e || '');
                                        setGuestFormData((prevState) => ({
                                          ...prevState,
                                          saltuation: e || '',
                                        }));
                                      }}
                                    />
                                  </Col>
                                  <Col md={8} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="First Name"
                                      name="firstName"
                                      errors={errors.firstName}
                                      touched={touched.firstName}
                                      required={true}
                                      disabled={isShowPermission}
                                      placeholder={'Enter First Name'}
                                    />
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                            <Col md={3} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Middle Name"
                                name="middleName"
                                disabled={isShowPermission}
                                placeholder={'Enter Middle Name'}
                              />
                            </Col>
                            <Col md={3} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Last Name"
                                name="lastName"
                                errors={errors.lastName}
                                touched={touched.lastName}
                                required={true}
                                disabled={isShowPermission}
                                placeholder={'Enter Last Name'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="select"
                                options={genderOptions}
                                label="Gender"
                                name="gender"
                                placeholder="Select Gender"
                                required={false}
                                value={values.gender}
                                disabled={isShowPermission}
                                handleChange={(e) => {
                                  setFieldValue('gender', e || '');
                                  setGuestFormData((prevState) => ({
                                    ...prevState,
                                    gender: e || '',
                                  }));
                                }}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Email Address"
                                name="email"
                                errors={errors.email}
                                touched={touched.email}
                                disabled={isShowPermission}
                                required={true}
                                placeholder={'Enter Email Address'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Phone"
                                name="phone"
                                disabled={isShowPermission}
                                required={false}
                                placeholder={'Enter Phone'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Address 1"
                                name="address1"
                                required={false}
                                disabled={isShowPermission}
                                placeholder={'Enter Address 1'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Address 2"
                                name="address2"
                                disabled={isShowPermission}
                                required={false}
                                placeholder={'Enter Address 2'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="select"
                                options={countryOptions}
                                label="Country "
                                name="country"
                                placeholder="Select Country"
                                value={values.country}
                                disabled={isShowPermission}
                                handleChange={(e) => {
                                  setFieldValue('country', e || '');
                                  setGuestFormData((prevState) => ({
                                    ...prevState,
                                    country: e || '',
                                    state: '',
                                  }));
                                }}
                                required={false}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="select"
                                options={stateOptions}
                                label="Province / State"
                                placeholder="Select State"
                                name="state"
                                value={values.state}
                                required={false}
                                disabled={isShowPermission}
                                handleChange={(e) => {
                                  setFieldValue('state', e || '');
                                  setGuestFormData((prevState) => ({
                                    ...prevState,
                                    state: e || '',
                                  }));
                                }}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="City"
                                name="city"
                                disabled={isShowPermission}
                                placeholder={'Enter City'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <FormikController
                                control="input"
                                label="Postalcode / Zipcode"
                                name="zipcode"
                                disabled={isShowPermission}
                                placeholder={'Enter Zipcode'}
                              />
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <Container fluid className="p-0">
                                <Row>
                                  <Col md={6} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="Children Male"
                                      name="childMale"
                                      disabled={isShowPermission}
                                      required={false}
                                      placeholder={'0'}
                                    />
                                  </Col>
                                  <Col md={6} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="Children Female"
                                      name="childFemale"
                                      required={false}
                                      disabled={isShowPermission}
                                      placeholder={'0'}
                                    />
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <Container fluid className="p-0">
                                <Row>
                                  <Col md={6} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="Adult Male"
                                      name="adultMale"
                                      required={false}
                                      disabled={isShowPermission}
                                      placeholder={'0'}
                                    />
                                  </Col>
                                  <Col md={6} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="Adult Female"
                                      name="adultFemale"
                                      required={false}
                                      disabled={isShowPermission}
                                      placeholder={'0'}
                                    />
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                            <Col md={4} sm={12} className="mb-2">
                              <Container fluid className="p-0">
                                <Row>
                                  <Col md={6} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="Senior Male"
                                      name="seniorMale"
                                      required={false}
                                      disabled={isShowPermission}
                                      placeholder={'0'}
                                    />
                                  </Col>
                                  <Col md={6} sm={12}>
                                    <FormikController
                                      control="input"
                                      label="Senior Female"
                                      name="seniorFemale"
                                      disabled={isShowPermission}
                                      required={false}
                                      placeholder={'0'}
                                    />
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                            <Col md={12} sm={12} className="mb-2">
                              <FormikController
                                control="textarea"
                                label="Comments"
                                name="visitorComments"
                                required={false}
                                disabled={isShowPermission}
                                placeholder="Enter Comments"
                                errors={errors?.visitorComments}
                                touched={touched?.visitorComments}
                              />
                            </Col>
                          </Row>
                        </Container>
                        <Container fluid className="p-0">
                          <Row className="mt-4">
                            <Col className="d-flex gap-2">
                              <CustomButton
                                type="submit"
                                variant="primary"
                                disabled={isShowPermission}
                                onClick={(e) => e.stopPropagation()}
                              >
                                SAVE
                              </CustomButton>
                              <CustomButton
                                variant="outline-secondary"
                                disabled={isShowPermission}
                                onClick={() => {
                                  setResetForm(true);
                                }}
                              >
                                Reset
                              </CustomButton>
                            </Col>
                          </Row>
                        </Container>
                      </Form>
                    )}
                  </Formik>
                </PermissionWrapper>
              </div>
            </div>
          </Offcanvas.Body>
        </>
      )}
    </Offcanvas>
  );
};

export default TourSlider;
