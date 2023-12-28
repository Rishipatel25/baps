import { getAvailablePersonnelAction } from '@/redux/personnel/action.personnel';
import { getRolesAction } from '@/redux/roles/action.roles';
import { ERRORS } from '@/utils/constants/errors.constants';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { visitState } from '@/redux/visits/reducer.visits';
import CustomButton from '@/components/Button';
import {
  getTeamsAction,
  updateTeamsAction,
} from '@/redux/visits/action.visits';
import { toast } from 'react-toastify';
import {
  SYSTEM_ROLES,
  TOAST_SUCCESS,
} from '@/utils/constants/default.constants';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import FormikController from '@/components/form-group/formik-controllers';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';

const initialValues = {
  team: [
    {
      personnel: '',
      role: '',
    },
  ],
};

const schema = Yup.object().shape({
  team: Yup.array()
    .of(
      Yup.object().shape({
        personnel: Yup.object().when('role', {
          is: (val) => {
            return val?.uucode != 'GUEST_USHER';
          },
          then: () => Yup.object().required(ERRORS.REQUIRED),
        }),
        role: Yup.object().required(ERRORS.REQUIRED),
      }),
    )
    .required(ERRORS.REQUIRED),
});

const AcceptVisitModal = ({
  visitStatus,
  currentVisitId,
  setAcceptModalShow,
  getVisitById,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [personnelOpt, setPersonnelOpt] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    currentVisitRes: { visitRes },
    isTeamsLoader,
  } = useSelector(visitState);
  const filterTypes = { role: 'role', personnel: 'personnel' };
  const [isShowPermission, setShowPermission] = useState(false);

  const filterRoles = ({ e, values, index, type }) => {
    if (type === filterTypes.personnel && e?.value) {
      const filterPersonnel = personnelOpt.filter(
        (personnel) => personnel.value !== e.value,
      );
      if (values?.team[index]?.personnel) {
        filterPersonnel.push(values.team[index].personnel);
      }
      setPersonnelOpt(filterPersonnel);
    } else if (values?.team[index]?.personnel) {
      setPersonnelOpt((prev) => [...prev, values.team[index].personnel]);
    }
  };

  const getTeamsCallBack = async (teams) => {
    const getApiOptions = [];
    getApiOptions.push(...teams);
    await dispatch(
      getRolesAction(
        'roleTagList.roleTagEnum==TEAM;name!="Visit Admin"',
        ({ options }) => {
          let filterRoles = options.filter((role) => {
            return !getApiOptions.some((res) => res.role.value === role.value);
          });
          if (filterRoles?.length) {
            filterRoles = filterRoles.map((item) => {
              return {
                [filterTypes.role]: { ...item, uucode: item?.data?.uucode },
                [filterTypes.personnel]: '',
              };
            });
          }
          getApiOptions.push(...filterRoles);
        },
      ),
    );
    await dispatch(
      getAvailablePersonnelAction(
        {
          startDateTime: `${visitRes.dateOfVisit} ${visitRes.startDateTime}`,
          endDateTime: `${visitRes.dateOfVisit} ${visitRes.endDateTime}`,
        },
        ({ options }) => {
          const filterPersonnels = options.filter((role) => {
            return !getApiOptions.some(
              (res) => res.personnel.value === role.value,
            );
          });
          setPersonnelOpt(filterPersonnels || []);
        },
      ),
    );
    setFormData({
      team: getApiOptions,
    });
    setIsLoading(false);
  };

  const onSubmit = (values) => {
    const teamObj = { visitId: currentVisitId };
    const teamsData = [];
    if (values.team?.length) {
      values.team.forEach((element) => {
        if (element?.personnel?.value && element?.role?.value) {
          teamsData.push({
            personnelId: element.personnel.value,
            roleId: element.role.value,
            visitPersonnelId: element?.role?.visitPersonnelId,
          });
        }
      });
    }
    teamObj.teamsData = teamsData;
    dispatch(
      updateTeamsAction(teamObj, () => {
        if (visitStatus === 'PENDING') {
          toast.success(TOAST_SUCCESS.ADD_TEAMS.MESSAGE, {
            toastId: TOAST_SUCCESS.ADD_TEAMS.ID,
          });
        } else {
          toast.success(TOAST_SUCCESS.UPDATE_TEAMS.MESSAGE, {
            toastId: TOAST_SUCCESS.UPDATE_TEAMS.ID,
          });
        }
        setAcceptModalShow(false);
        getVisitById();
      }),
    );
  };

  useEffect(() => {
    if (currentVisitId) {
      setIsLoading(true);
      dispatch(
        getTeamsAction(currentVisitId, ({ teams }) => {
          getTeamsCallBack(teams);
        }),
      );
    }
  }, []);

  return isTeamsLoader || isLoading ? (
    <SpinnerLoader />
  ) : (
    <div>
      <PermissionWrapper
        name="UPDATE_VISIT_TEAM"
        mode="2"
        callback={(event) => {
          setShowPermission(!event);
        }}
      >
        <Formik
          initialValues={formData}
          validationSchema={schema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleBlur, values, setFieldValue, errors, touched }) => (
            <Form className="tabForm">
              <Container fluid>
                <FieldArray name="team">
                  {() => (
                    <div>
                      {values?.team?.length > 0 &&
                        values.team.map((team, index) => {
                          const isGuestUsher =
                            team?.role?.uucode === 'GUEST_USHER';
                          const isVisitAdmin =
                            team?.role?.label === SYSTEM_ROLES.VISIT_ADMIN;
                          return (
                            <Row key={index}>
                              <Col md={4} sm={6} className="mt-4">
                                <FormikController
                                  control="select"
                                  options={[]}
                                  value={values?.team[index]?.role}
                                  label="Role"
                                  name={`team.${index}.role`}
                                  required={!isGuestUsher}
                                  handleBlur={handleBlur}
                                  handleChange={(e) => {
                                    setFieldValue(
                                      `team.${index}.role`,
                                      e ? e : '',
                                    );
                                  }}
                                  disabled={true}
                                />
                              </Col>
                              <Col md={4} sm={6} className="mt-4">
                                <FormikController
                                  control="select"
                                  options={personnelOpt}
                                  label="Personnel"
                                  name={`team.${index}.personnel`}
                                  required={!isGuestUsher}
                                  value={values?.team[index]?.personnel}
                                  errors={
                                    errors?.team &&
                                    errors?.team[index]?.personnel
                                  }
                                  touched={
                                    touched?.team &&
                                    touched?.team[index]?.personnel
                                  }
                                  handleBlur={handleBlur}
                                  handleChange={(e) => {
                                    filterRoles({
                                      e,
                                      values,
                                      index,
                                      type: filterTypes.personnel,
                                    });
                                    setFieldValue(
                                      `team.${index}.personnel`,
                                      e ? e : '',
                                    );
                                  }}
                                  disabled={isVisitAdmin || isShowPermission}
                                  searchKey={[
                                    'email',
                                    'phoneNumber',
                                    'firstName',
                                    'lastName',
                                  ]}
                                />
                              </Col>
                            </Row>
                          );
                        })}
                    </div>
                  )}
                </FieldArray>
                <div className="d-flex gap-3 mt-3">
                  <CustomButton
                    type="submit"
                    variant="primary"
                    disabled={isShowPermission}
                  >
                    {visitStatus && visitStatus === 'ACCEPTED'
                      ? 'Update'
                      : 'Save'}
                  </CustomButton>
                  <CustomButton
                    variant="secondary"
                    disabled={isShowPermission}
                    onClick={() => setAcceptModalShow(false)}
                  >
                    Cancel
                  </CustomButton>
                </div>
              </Container>
            </Form>
          )}
        </Formik>
      </PermissionWrapper>
    </div>
  );
};

export default AcceptVisitModal;
