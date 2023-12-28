import { FieldArray, Form, Formik } from 'formik';
import FormikController from '@/components/form-group/formik-controllers';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';
import CustomButton from '@/components/Button';
import LocationTableRow from './LocationTableRow';
import * as Yup from 'yup';
import { ERRORS } from '@/utils/constants/errors.constants';
import { BiReset } from 'react-icons/bi';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import {
  calculateNewLoactionEndTime,
  checkTimeError,
  formateDate,
} from '@/utils/helper.utils';

const LocationForm = ({
  formData,
  setFormData,
  locationOpt,
  handleSubmitTourGuide,
  updateLocation,
  setUpdateLocation,
  visitRes,
  tourFormData,
}) => {
  const [totalDuration, setTotalDuration] = useState(0);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const date = formateDate(visitRes.dateOfVisit).resDate;

  const checkIsEmpty = (value) => {
    if (value == '--:-- --' || value == '') return false;
    return true;
  };

  const checkIsInValid = (value) => {
    return !checkTimeError(value);
  };

  const addNewLocationsValidations = Yup.object({
    formPickupLocation: Yup.object().required(ERRORS.REQUIRED),
    formActualDuration: Yup.number()
      .required(ERRORS.REQUIRED)
      .min(1, ERRORS.MIN_DURATION_1)
      .max(999, ERRORS.MAX_DURATION_999),
    formStartDateTime: Yup.mixed()
      .required(ERRORS.REQUIRED)
      .test('is_empty', ERRORS.REQUIRED, checkIsEmpty)
      .test('is_invalid', 'Invalid Input Time', checkIsInValid),
  });

  const onSubmit = (values) => {
    const newlocation = {};
    const start = moment(values.formStartDateTime, 'hh:mm A').format(
      'HH:mm:ss',
    );
    const end = moment(values.formEndDateTime, 'hh:mm A').format('HH:mm:ss');
    newlocation.startDateTime = `${date} ${start || '00:00:00'}`;
    newlocation.endDateTime = `${date} ${end || '00:00:00'}`;
    newlocation.locationId = values?.formPickupLocation?.value || '';
    newlocation.locationTagEnum = 'NONE';
    handleSubmitTourGuide(
      'addLocation',
      [...tourFormData.visitLocationModelList, newlocation],
      () => {
        setFormData({
          ...formData,
          formPickupLocation: '',
          formActualDuration: '',
          formStartDateTime: '',
          formEndDateTime: '',
        });
      },
    );
  };
  useEffect(() => {
    setTotalDuration(0);
    let count = 0;
    formData.locationList?.forEach((location) => {
      if (location.actualDuration) {
        count = parseInt(location.actualDuration) + count;
        setTotalDuration(count);
      }
    });
  }, [formData.locationList]);

  return (
    <>
      <PermissionWrapper name={'ADD_VISIT_TOUR'}>
        <Formik
          initialValues={formData}
          validationSchema={addNewLocationsValidations}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue, handleBlur }) => (
            <FormComponent
              errors={errors}
              values={values}
              touched={touched}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              locationOpt={locationOpt}
            />
          )}
        </Formik>
      </PermissionWrapper>
      <LocationTable
        addLocationAndSubmit={addNewLocationsValidations}
        editRowIndex={editRowIndex}
        formData={formData}
        handleSubmitTourGuide={handleSubmitTourGuide}
        locationOpt={locationOpt}
        setEditRowIndex={setEditRowIndex}
        setUpdateLocation={setUpdateLocation}
        updateLocation={updateLocation}
        visitRes={visitRes}
        totalDuration={totalDuration}
      />
    </>
  );
};

export default LocationForm;

const FormComponent = ({
  errors,
  values,
  touched,
  handleBlur,
  setFieldValue,
  locationOpt,
}) => {
  return (
    <Form>
      <Container fluid className="tabForm  pb-2">
        <Row>
          <Col>
            <b>Add New Location</b>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="addTourLocationForm align-items-center">
              <div className="location">
                <FormikController
                  control="select"
                  options={locationOpt}
                  name="formPickupLocation"
                  label="Location"
                  required={true}
                  value={values?.formPickupLocation}
                  errors={errors?.formPickupLocation}
                  touched={touched?.formPickupLocation}
                  handleBlur={handleBlur}
                  handleChange={(e) => {
                    setFieldValue('formPickupLocation', e || '');
                  }}
                />
              </div>
              <div className="actualTime position-relative">
                <label htmlFor="formPickupLocation">
                  Duration (min)
                  <span className="text-danger field-warning">*</span>
                </label>
                <input
                  className={`form-control  ${
                    errors?.formActualDuration && touched?.formActualDuration
                      ? 'is-invalid'
                      : ''
                  } `}
                  type="number"
                  name="formActualDuration"
                  placeholder="0"
                  value={values.formActualDuration}
                  onChange={(e) => {
                    const endTime = calculateNewLoactionEndTime(
                      values.formStartDateTime,
                      e?.target?.value,
                    );
                    setFieldValue('formEndDateTime', endTime);
                    setFieldValue('formActualDuration', e?.target?.value || '');
                  }}
                />
                {errors?.formActualDuration && touched?.formActualDuration ? (
                  <span className="text-danger position-absolute">
                    {errors?.formActualDuration}
                  </span>
                ) : null}
              </div>
              <div className="startTime">
                <FormikController
                  control="time"
                  name="formStartDateTime"
                  label="Start Time"
                  readOnly={true}
                  required={true}
                  hourFormat={12}
                  setFieldValue={setFieldValue}
                  disabled={false}
                  errors={errors?.formStartDateTime}
                  touched={touched?.formStartDateTime}
                  handleChange={() => {
                    const endTime = calculateNewLoactionEndTime(
                      values.formStartDateTime,
                      values.formActualDuration,
                    );
                    setFieldValue('formEndDateTime', endTime);
                  }}
                  value={values?.formStartDateTime}
                />
              </div>
              <div className="endTime">
                <FormikController
                  control="time"
                  label="End Time"
                  name="formEndDateTime"
                  disabled={true}
                  setFieldValue={setFieldValue}
                  value={values?.formEndDateTime}
                  errors={errors?.formEndDateTime}
                  touched={touched?.formEndDateTime}
                />
              </div>
              <div className="location-btn">
                <div>
                  <label htmlFor="formPickupLocation">&nbsp;</label>
                  <CustomButton variant="primary" type="submit">
                    <IoMdAdd /> Add
                  </CustomButton>
                </div>
                <div className="ml-2">
                  <label htmlFor="formPickupLocation">&nbsp;</label>
                  <CustomButton variant="outline-secondary" type="reset">
                    <BiReset /> Reset
                  </CustomButton>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

const LocationTable = ({
  formData,
  locationOpt,
  visitRes,
  editRowIndex,
  setEditRowIndex,
  handleSubmitTourGuide,
  updateLocation,
  setUpdateLocation,
  addLocationAndSubmit,
  totalDuration,
}) => {
  const locationTableValidations = Yup.object({
    locationList: Yup.array().when('isEditForm', {
      is: true,
      then: () =>
        Yup.array().of(
          Yup.object().shape({
            location: Yup.object().required(ERRORS.REQUIRED),
            startDateTime: Yup.string().required(ERRORS.REQUIRED),
            actualDuration: Yup.string().required(ERRORS.REQUIRED),
          }),
        ),
    }),
  });

  const onSubmit = (values) => {
    handleSubmitTourGuide('editLocation', values.locationList, () => {
      setEditRowIndex(null);
    });
  };

  return (
    <Formik
      initialValues={formData}
      onSubmit={onSubmit}
      validationSchema={locationTableValidations}
      enableReinitialize
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <Form>
          <Row>
            <Col>
              <div className="table-container mt-4">
                <table className="table table-borderless visit-tour-table">
                  <thead>
                    <tr>
                      <th scope="col" className="locationSelection">
                        LOCATION
                      </th>
                      <th scope="col" className="actualTimeField">
                        ACTUAL DURATION
                      </th>
                      <th scope="col" className="startTimeField">
                        START TIME
                      </th>
                      <th scope="col" className="endTimeField">
                        END TIME
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <FieldArray name="locationList">
                      {({ remove }) => (
                        <>
                          {values?.locationList?.length > 0 &&
                            values.locationList.map((location, index) => {
                              return (
                                <LocationTableRow
                                  key={index}
                                  index={index}
                                  formData={formData}
                                  totalCount={values?.locationList?.length}
                                  locationOpt={locationOpt}
                                  currentLocation={location}
                                  values={values}
                                  handleBlur={handleBlur}
                                  errors={errors}
                                  touched={touched}
                                  setFieldValue={setFieldValue}
                                  visitRes={visitRes}
                                  remove={remove}
                                  editRowIndex={editRowIndex}
                                  setEditRowIndex={setEditRowIndex}
                                  handleSubmitTourGuide={handleSubmitTourGuide}
                                  updateLocation={updateLocation}
                                  setUpdateLocation={setUpdateLocation}
                                  addLocationAndSubmit={addLocationAndSubmit}
                                />
                              );
                            })}
                        </>
                      )}
                    </FieldArray>
                  </tbody>
                  <tfoot className="text-bold">
                    <tr>
                      <td>
                        Total Locations :{' '}
                        <span>{values.locationList.length}</span>
                      </td>
                      <td colSpan="4">
                        Total Duration : <span>{totalDuration} Mins</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};
