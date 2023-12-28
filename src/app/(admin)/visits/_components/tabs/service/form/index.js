import { visitState } from '@/redux/visits/reducer.visits';
import {
  searchServiceAction,
  createServiceTemplateAction,
  updateServiceTemplateAction,
  setTabStatus,
} from '@/redux/visits/action.visits';
import { getRolesAction } from '@/redux/roles/action.roles';
import { masterState } from '@/redux/masters/reducer.masters';
import { rolesState } from '@/redux/roles/reducer.roles';
import { getAllLocationAction } from '@/redux/masters/action.masters';
import {
  getAvailablePersonnelAction,
  setCoordinatorOptions,
} from '@/redux/personnel/action.personnel';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ServicesForm from './Form';
import FormikController from '@/components/form-group/formik-controllers';
import { ERRORS } from '@/utils/constants/errors.constants';
import * as Yup from 'yup';
import {
  TOAST_SUCCESS,
  SYSTEM_ROLES,
} from '@/utils/constants/default.constants';
import moment from 'moment';
import CustomButton from '@/components/Button';
import { formateDate } from '@/utils/helper.utils';

const initialFieldValue = {
  service: null,
  cordinator: null,
  startDateTime: '',
  endDateTime: '',
  location: null,
};

const TabServiceForm = ({
  setShowForm,
  currentVisitId,
  getServicesTabList,
  fromMode,
  tabStatus,
}) => {
  const initialFieldValidationSchema = Yup.object({
    service: Yup.object().required(ERRORS.REQUIRED),
    cordinator: Yup.object().required(ERRORS.REQUIRED),
    startDateTime: Yup.string().required(ERRORS.REQUIRED),
    endDateTime: Yup.string().required(ERRORS.REQUIRED),
  });

  const [serviceOption, setServiceOption] = useState([]);
  const [locationOpt, setLocationOpt] = useState([]);
  const [cordinatorOption, setCordinatorOption] = useState([]);
  const [fields, setFields] = useState([]);
  const [submitAction, setSubmitAction] = useState('SAVE');
  const [serviceTemplateId, setServiceTemplateId] = useState(null);
  const [visitServiceId, setVisitServiceId] = useState(null);
  const [visitPersonnelId, setVisitPersonnelId] = useState(null);
  const [roleId, setRoleId] = useState('');
  const [checkVisitTime, setCheckVisitTime] = useState(false);
  const [isStartTimeError, setStartTimeError] = useState(false);
  const [isEndTimeError, setEndTimeError] = useState(false);
  const [isStartTimeInvalid, setStartTimeInvalid] = useState(false);
  const [isEndTimeInvalid, setEndTimeInvalid] = useState(false);

  const [validationSchema, setValidationSchema] = useState(
    initialFieldValidationSchema,
  );
  const [formData, setFormData] = useState(initialFieldValue);
  const dispatch = useDispatch();
  const { serviceCooridnatorsRoles } = useSelector(rolesState);
  const { locationOption } = useSelector(masterState);
  const {
    servicesList,
    setServicesFormData,
    currentVisitRes: { visitRes },
  } = useSelector(visitState);
  const { coordinatorOptions } = useSelector(personnelState);

  //Valiation Schema
  const createYupSchema = (schema, config) => {
    const { name, validationType, validations = [] } = config;
    if (!Yup[validationType]) {
      return schema;
    }
    let validator = Yup[validationType]();
    validations.forEach((validation) => {
      const { params, type } = validation;
      if (!validator[type]) {
        return;
      }
      const copyPrams = [...params];
      if (type === 'matches') {
        if (copyPrams.length === 2) {
          copyPrams[0] = new RegExp(copyPrams[0]);
        }
      }
      validator = validator[type](...copyPrams);
    });
    schema[name] = validator;
    return schema;
  };
  //Save Service Template Form
  const onSubmit = (values) => {
    const metaData = JSON.parse(JSON.stringify(fields));
    metaData.map((element) => {
      element.defaultValue = values[element.name];
    });
    const body = {
      coordinator: {
        personnelId: values.cordinator.value,
        roleId: roleId,
      },
      serviceTemplateId: values.service.value,
      startDateTime:
        formateDate(visitRes.dateOfVisit).resDate +
        ' ' +
        moment(values.startDateTime, 'hh:mm A').format('HH:mm') +
        ':00',
      endDateTime:
        formateDate(visitRes.dateOfVisit).resDate +
        ' ' +
        moment(values.endDateTime, 'hh:mm A').format('HH:mm') +
        ':00',
      metadata: metaData,
      serviceType: 'SERVICE',
    };
    if (values?.location?.value) {
      body.visitLocationModelList = [
        {
          startDateTime:
            formateDate(visitRes.dateOfVisit).resDate +
            ' ' +
            moment(values.startDateTime, 'hh:mm A').format('HH:mm') +
            ':00',
          endDateTime:
            formateDate(visitRes.dateOfVisit).resDate +
            ' ' +
            moment(values.endDateTime, 'hh:mm A').format('HH:mm') +
            ':00',
          locationId: values.location.value,
          locationTagEnum: 'NONE',
        },
      ];
    }
    if (fromMode === 'ADD') {
      dispatch(
        createServiceTemplateAction(
          { visitId: currentVisitId, templateData: body },
          onSuccess,
        ),
      );
    } else {
      body.visitServiceId = visitServiceId;
      body.coordinator.visitPersonnelId = visitPersonnelId;
      dispatch(
        updateServiceTemplateAction(
          {
            visitId: currentVisitId,
            visitServiceId: visitServiceId,
            templateData: body,
          },
          onSuccess,
        ),
      );
    }
  };
  // After Success Call
  const onSuccess = () => {
    getServicesTabList();
    if (fromMode === 'ADD') {
      toast.success(TOAST_SUCCESS.SERVICE_TEMPLATE_ADDED.MESSAGE, {
        toastId: TOAST_SUCCESS.SERVICE_TEMPLATE_ADDED.ID,
      });
    } else {
      toast.success(TOAST_SUCCESS.SERVICE_TEMPLATE_UPDATED.MESSAGE, {
        toastId: TOAST_SUCCESS.SERVICE_TEMPLATE_UPDATED.ID,
      });
    }
    if (submitAction === 'SAVE') {
      setShowForm(false);
    } else {
      setFormData(initialFieldValue);
      setValidationSchema(initialFieldValidationSchema);
      setServiceTemplateId(null);
    }
    if (!tabStatus?.servicesAvailable) {
      dispatch(setTabStatus({ ...tabStatus, servicesAvailable: true }));
    }
  };
  //Call Service List
  useEffect(() => {
    dispatch(searchServiceAction("serviceTypeEnum=='SERVICE'"));
    dispatch(getRolesAction(''));
    dispatch(getAllLocationAction("?filter=serviceTypeEnum=='SERVICE'"));
  }, []);
  //Set Field Validation
  useEffect(() => {
    if (fields.length > 0) {
      const copyFields = [...fields];
      copyFields.push({
        name: 'service',
        validationType: 'object',
        validations: [
          {
            type: 'required',
            params: [ERRORS.REQUIRED],
          },
        ],
      });
      copyFields.push({
        name: 'cordinator',
        validationType: 'object',
        validations: [
          {
            type: 'required',
            params: [ERRORS.REQUIRED],
          },
        ],
      });
      copyFields.push({
        name: 'startDateTime',
        validationType: 'string',
        validations: [
          {
            type: 'required',
            params: [ERRORS.REQUIRED],
          },
        ],
      });
      copyFields.push({
        name: 'endDateTime',
        validationType: 'string',
        validations: [
          {
            type: 'required',
            params: [ERRORS.REQUIRED],
          },
        ],
      });
      const yepSchema = copyFields.reduce(createYupSchema, {});
      setValidationSchema(Yup.object().shape(yepSchema));
      fields.forEach((element) => {
        setFormData((prevState) => ({
          ...prevState,
          [element.name]: element.defaultValue,
        }));
      });
    }
  }, [fields]);
  //Set Service Template
  useEffect(() => {
    if (serviceTemplateId && fromMode === 'ADD') {
      const sel = servicesList.find(
        (d) => d.serviceTemplateId === serviceTemplateId,
      );
      setFields([]);
      sel && setFields(sel.fields);
    }
  }, [serviceTemplateId]);
  //Set Service Data
  useEffect(() => {
    if (servicesList.length > 0) {
      const options = [];
      servicesList?.map((element) => {
        options.push({ label: element.name, value: element.serviceTemplateId });
      });
      setServiceOption(options);
    }
  }, [servicesList]);
  //Retrieve Data
  useEffect(() => {
    if (fromMode === 'EDIT' && setServicesFormData.serviceTemplateId) {
      setFormData({
        service: {
          label: setServicesFormData.serviceTemplateName,
          value: setServicesFormData.serviceTemplateId,
        },
        cordinator: {
          label: setServicesFormData.coordinator.personnelName,
          value: setServicesFormData.coordinator.personnelId,
        },
        startDateTime: moment(setServicesFormData.startDateTime).format(
          'hh:mm A',
        ),
        endDateTime: moment(setServicesFormData.endDateTime).format('hh:mm A'),
        location:
          setServicesFormData.visitLocationModelList &&
          setServicesFormData.visitLocationModelList.length > 0
            ? {
                label:
                  setServicesFormData.visitLocationModelList[0].locationName,
                value: setServicesFormData.visitLocationModelList[0].locationId,
              }
            : null,
      });
      setServicesFormData.metadata && setFields(setServicesFormData.metadata);
      setServiceTemplateId(setServicesFormData.serviceTemplateId);
      const sel = servicesList.find(
        (d) => d.serviceTemplateId === setServicesFormData.serviceTemplateId,
      );
      sel && setCheckVisitTime(sel.checkVisitTime);
      setVisitServiceId(setServicesFormData.visitServiceId);
      setVisitPersonnelId(setServicesFormData.coordinator.visitPersonnelId);
    }
  }, [setServicesFormData]);
  //Get Service Cooridanator list
  useEffect(() => {
    if (
      Array.isArray(coordinatorOptions) &&
      formData.startDateTime &&
      formData.endDateTime
    ) {
      setCordinatorOption(coordinatorOptions);
    } else {
      setCordinatorOption([]);
    }
  }, [coordinatorOptions]);
  //Get Availibility
  useEffect(() => {
    if (
      visitRes.dateOfVisit &&
      formData.startDateTime &&
      formData.endDateTime
    ) {
      dispatch(
        getAvailablePersonnelAction(
          {
            startDateTime: `${visitRes.dateOfVisit} ${formData.startDateTime}`,
            endDateTime: `${visitRes.dateOfVisit} ${formData.endDateTime}`,
          },
          ({ options }) => {
            setCordinatorOption([]);
            dispatch(setCoordinatorOptions(options));
          },
        ),
      );
    }
  }, [formData.startDateTime, formData.endDateTime]);
  //Get Service Cooridanator Roles
  useEffect(() => {
    if (serviceCooridnatorsRoles && serviceCooridnatorsRoles.length > 0) {
      const sel = serviceCooridnatorsRoles.find(
        (d) => d.label === SYSTEM_ROLES.SERVICE_COORDINATOR,
      );
      if (sel) {
        setRoleId(sel.value);
      } else {
        setRoleId(serviceCooridnatorsRoles[0].value);
      }
    }
  }, [serviceCooridnatorsRoles]);

  //Call Location List
  useEffect(() => {
    if (locationOption?.length) {
      setLocationOpt(locationOption);
    }
  }, [locationOption]);

  const checkIsBetween = (inputValue) => {
    const format = 'hh:mm A';
    const startTime = moment(visitRes.startDateTime, format);
    const endTime = moment(visitRes.endDateTime, format);
    const givenTime = moment(inputValue, format);
    const isBetween = givenTime.isBetween(startTime, endTime, null, '[]');
    return isBetween;
  };

  const checkIsSame = () => {
    if (formData.startDateTime && formData.endDateTime) {
      const format = 'hh:mm A';
      const startTime = moment(formData.startDateTime, format);
      const endTime = moment(formData.endDateTime, format);
      const isSame = startTime.isSame(endTime);
      return isSame;
    }
  };

  const checkIsBefore = () => {
    if (formData.startDateTime && formData.endDateTime) {
      const format = 'hh:mm A';
      const startTime = moment(formData.startDateTime, format);
      const endTime = moment(formData.endDateTime, format);
      const isBefore = endTime.isBefore(startTime);
      return isBefore;
    }
  };

  const checkIsAfter = () => {
    if (formData.startDateTime && formData.endDateTime) {
      const format = 'hh:mm A';
      const startTime = moment(formData.startDateTime, format);
      const endTime = moment(formData.endDateTime, format);
      const isAfter = startTime.isAfter(endTime);
      return isAfter;
    }
  };

  return (
    <div className="fullModal">
      <div className="d-flex align-items-baseline gap-2 mb-3">
        <h4 className="m-0">Add Service</h4>
        <h5>#{visitRes?.requestNumber}</h5>
        <span className="slider-sub-title">
          ({moment(visitRes?.dateOfVisit, 'YYYY-MM-DD').format('DD-MMM-YYYY')}
          &nbsp;&nbsp;{visitRes.startDateTime} &nbsp;- &nbsp;
          {visitRes.endDateTime})
        </span>
      </div>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (
            !checkVisitTime ||
            (!isStartTimeError &&
              !isEndTimeError &&
              !isStartTimeInvalid &&
              !isEndTimeInvalid &&
              checkIsBetween(values.startDateTime) &&
              checkIsBetween(values.endDateTime) &&
              !checkIsSame() &&
              !checkIsBefore() &&
              !checkIsAfter())
          ) {
            onSubmit(values);
          }
        }}
        enableReinitialize
      >
        {({
          errors,
          dirty,
          touched,
          values,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          setFieldError,
        }) => (
          <Form
            onChange={(e) => {
              if (
                e.target.name === 'startDateTime' ||
                e.target.name === 'endDateTime'
              ) {
                return;
              }
              setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }));
            }}
          >
            <Container fluid className="tabForm">
              <Row>
                <Col lg={3} md={4} sm={6} className="mt-4 ">
                  <FormikController
                    control="select"
                    options={serviceOption}
                    label="Service"
                    name="service"
                    required={true}
                    disabled={fromMode === 'EDIT'}
                    errors={errors.service}
                    touched={touched.service}
                    handleChange={(e) => {
                      setFieldValue('service', e ? e : '');
                      setFormData((prevState) => ({
                        ...prevState,
                        service: e ? e : '',
                        startDateTime: '',
                        endDateTime: '',
                        cordinator: null,
                        location: null,
                      }));
                      !e && setValidationSchema(initialFieldValidationSchema);
                      if (e) {
                        const sel = servicesList.find(
                          (d) => d.serviceTemplateId === e.value,
                        );
                        sel && setCheckVisitTime(sel.checkVisitTime);
                      }
                      setServiceTemplateId(e ? e.value : null);
                    }}
                    handleBlur={handleBlur}
                    value={values.service}
                    placeholder={'Select Service'}
                  />
                </Col>
                <Col lg={3} md={4} sm={6} className="mt-4">
                  <FormikController
                    control="time"
                    label="Start Time"
                    name="startDateTime"
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                    required={true}
                    placeholder="Start Time"
                    hourFormat={12}
                    errors={
                      errors.startDateTime ||
                      checkIsSame() ||
                      checkIsAfter() ||
                      isStartTimeInvalid
                    }
                    touched={
                      touched.startDateTime ||
                      checkIsSame() ||
                      checkIsAfter() ||
                      isStartTimeInvalid
                    }
                    handleChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        startDateTime: values?.startDateTime,
                      }));
                    }}
                    handleBlur={(e) => {
                      setStartTimeError(e.isError);
                      setStartTimeInvalid(e.isInValidDate);
                    }}
                    disabledTimeRange={
                      checkVisitTime
                        ? {
                            to: visitRes?.endDateTime,
                            from: visitRes?.startDateTime,
                          }
                        : null
                    }
                    value={values?.startDateTime ? values?.startDateTime : ''}
                  />
                  {checkIsSame() && !isStartTimeInvalid && (
                    <span className="text-danger custom-error-message">
                      Start time and end time should not be same.
                    </span>
                  )}
                  {checkIsAfter() && !isStartTimeInvalid && (
                    <span className="text-danger custom-error-message">
                      Start time must be before end time.
                    </span>
                  )}
                  {isStartTimeInvalid && (
                    <span className="text-danger custom-error-message">
                      Invalid Input Time
                    </span>
                  )}
                </Col>
                <Col lg={3} md={4} sm={6} className="mt-4">
                  <FormikController
                    control="time"
                    label="End Time"
                    name="endDateTime"
                    required={true}
                    placeholder="End Time"
                    hourFormat={12}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                    errors={
                      errors.endDateTime ||
                      checkIsSame() ||
                      checkIsBefore() ||
                      isEndTimeInvalid
                    }
                    touched={
                      touched.endDateTime ||
                      checkIsSame() ||
                      checkIsBefore() ||
                      isEndTimeInvalid
                    }
                    handleChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        endDateTime: values?.endDateTime,
                      }));
                    }}
                    handleBlur={(e) => {
                      setEndTimeError(e.isError);
                      setEndTimeInvalid(e.isInValidDate);
                    }}
                    disabledTimeRange={
                      checkVisitTime
                        ? {
                            to: visitRes?.endDateTime,
                            from: visitRes?.startDateTime,
                          }
                        : null
                    }
                    value={values?.endDateTime ? values?.endDateTime : ''}
                  />
                  {checkIsSame() && !isEndTimeInvalid && (
                    <span className="text-danger custom-error-message">
                      Start time and end time should not be same.
                    </span>
                  )}
                  {checkIsBefore() && !isEndTimeInvalid && (
                    <span className="text-danger custom-error-message">
                      End time must be after start time.
                    </span>
                  )}
                  {isEndTimeInvalid && (
                    <span className="text-danger custom-error-message">
                      Invalid Input Time
                    </span>
                  )}
                </Col>
                <Col lg={3} md={4} sm={6} className="mt-4">
                  <FormikController
                    control="select"
                    options={cordinatorOption}
                    label="Coordinator"
                    name="cordinator"
                    required={true}
                    errors={errors.cordinator}
                    touched={touched.cordinator}
                    handleChange={(e) => {
                      setFieldValue('cordinator', e ? e : '');
                      setFormData((prevState) => ({
                        ...prevState,
                        cordinator: e ? e : '',
                      }));
                    }}
                    handleBlur={handleBlur}
                    value={values.cordinator}
                    searchKey={[
                      'email',
                      'phoneNumber',
                      'firstName',
                      'lastName',
                    ]}
                    placeholder={'Select Coordinator'}
                  />
                </Col>
                <Col lg={3} md={4} sm={6} className="mt-4 mb-4">
                  <FormikController
                    control="select"
                    options={locationOpt}
                    label="Location"
                    name="location"
                    required={false}
                    value={values.location}
                    handleChange={(e) => {
                      setFieldValue('location', e ? e : '');
                      setFormData((prevState) => ({
                        ...prevState,
                        location: e ? e : '',
                      }));
                    }}
                    handleBlur={handleBlur}
                    placeholder={'Select Location'}
                  />
                </Col>
              </Row>
              {serviceTemplateId && <hr />}
              {serviceTemplateId && (
                <ServicesForm
                  fields={fields}
                  errors={errors}
                  values={values}
                  dirty={dirty}
                  touched={touched}
                  setFieldValue={(name, value) => {
                    setFieldValue(name, value);
                    setFormData((prevState) => ({
                      ...prevState,
                      [name]: value,
                    }));
                  }}
                  setFieldTouched={setFieldTouched}
                />
              )}
            </Container>
            <Container className="p-0" fluid>
              <Row className="mt-4">
                <Col className="d-flex gap-2">
                  <CustomButton
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      setSubmitAction('SAVE');
                    }}
                  >
                    {fromMode === 'ADD' ? 'SAVE' : 'UPDATE'}
                  </CustomButton>
                  {fromMode === 'ADD' && (
                    <CustomButton
                      variant="primary"
                      type="submit"
                      onClick={() => {
                        setSubmitAction('SAVE_AND_NEW');
                      }}
                    >
                      SAVE & ADD NEW
                    </CustomButton>
                  )}
                  <CustomButton
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                    }}
                    type="reset"
                  >
                    CANCEL
                  </CustomButton>
                </Col>
              </Row>
            </Container>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default TabServiceForm;
