import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiTimeFive } from 'react-icons/bi';
import { MdCall } from 'react-icons/md';
import { lookupToObject } from '@/utils/helper.utils';
import {
  getAvailablePersonnelAction,
  setCoordinatorOptions,
} from '@/redux/personnel/action.personnel';
import {
  getAudioVideoAction,
  deleteAudioVideoAction,
  saveAudioVideoAction,
  setTabStatus,
} from '@/redux/visits/action.visits';
import { getRolesAction } from '@/redux/roles/action.roles';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import { visitState } from '@/redux/visits/reducer.visits';
import { rolesState } from '@/redux/roles/reducer.roles';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import { toast } from 'react-toastify';
import CustomButton from '@/components/Button';
import Select from 'react-select';
import TableLoader from '@/components/loaders/TableLoader';
import moment from 'moment';
import { MdLocationOn } from 'react-icons/md';
import { Form, Formik } from 'formik';
import { Col, Container, Row, Modal } from 'react-bootstrap';
import FormikController from '@/components/form-group/formik-controllers';
import logo from '@/assets/images/svg/logo.svg';

const initialValues = {
  avCordinator: '',
};
const TabAudioVideo = ({ tabStatus }) => {
  const [cordinatorOption, setCordinatorOption] = useState([]);
  const [personnelId, setPersonnelId] = useState(null);
  const [audioVideoList, setAudioVideoList] = useState([]);
  const [roleId, setRoleId] = useState('');
  const [roleVolunteerId, setVolunteerRoleId] = useState('');
  const [isError, setError] = useState(false);
  const [visitNo, setVisitNo] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [cordinatorPhoneNumber, setCordinatorPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { interviewCooridnatorsRoles, interviewVolunteerRoles } =
    useSelector(rolesState);
  const { coordinatorOptions } = useSelector(personnelState);
  const {
    currentVisitRes: { visitRes },
  } = useSelector(visitState);
  const { isAudioVideoListLoader, isAudioVideoLoader } =
    useSelector(visitState);
  const [callVolunteerOptions, setCallVolunteerOptions] = useState(false);
  const VISIT_INTERVIEW_SETUP = lookupToObject('VISIT_INTERVIEW_SETUP');

  const onSubmit = () => {
    setError(false);
    if (!personnelId) {
      setError(true);
      return;
    }
    let isError = false;
    const copyData = [...audioVideoList];
    copyData.forEach((res) => {
      if (res.visitLocationBasicInfoModelList) {
        res.visitLocationBasicInfoModelList.map((childElement) => {
          if (childElement.personnelId && !childElement.interviewPackage) {
            childElement.isRequiredPackage = true;
            isError = true;
          }
        });
      }
    });
    if (isError) {
      setAudioVideoList(copyData);
      return;
    }
    const body = {
      interviewCoordinatorVisitPersonnelModel: {
        personnelId: personnelId,
        roleId: roleId,
      },
      visitServiceBasicInfoModelList: [],
    };
    audioVideoList.forEach((res) => {
      const nType = {
        visitLocationBasicInfoModelList: [],
      };
      if (res.visitLocationBasicInfoModelList) {
        res.visitLocationBasicInfoModelList.map((childElement) => {
          nType.visitLocationBasicInfoModelList.push({
            visitLocationId: childElement.visitLocationId,
            interviewPackage: childElement.interviewPackage,
            comments: childElement.comments,
            interviewVolunteerVisitPersonnelModel: childElement.personnelId
              ? {
                  personnelId: childElement.personnelId,
                  roleId: roleVolunteerId,
                }
              : null,
          });
        });
      }
      body.visitServiceBasicInfoModelList.push(nType);
    });
    dispatch(
      saveAudioVideoAction(
        { visitId: visitRes.visitId, audioVideoData: body },
        () => {
          toast.success(TOAST_SUCCESS.INTERVIEW_SETUP_UPDATED.MESSAGE, {
            toastId: TOAST_SUCCESS.INTERVIEW_SETUP_UPDATED.ID,
          });
          getData();
          if (!tabStatus?.interviewCoordinatorAvailable) {
            dispatch(
              setTabStatus({
                ...tabStatus,
                interviewCoordinatorAvailable: true,
              }),
            );
          }
        },
      ),
    );
  };

  // for print
  const handlePrint = () => {
    setTimeout(function () {
      const visitNo = document.querySelector('.visitNo').innerHTML;
      setVisitNo(visitNo);
      const visitDate = document.querySelector('.slider-sub-title').innerHTML;
      setVisitDate(visitDate.replaceAll('&nbsp', ' '));
      setTimeout(function () {
        const printContainer = document.querySelector('.full-screen-print');
        printContainer.innerHTML = printContainer.innerHTML.replace(
          /&nbsp;/g,
          ' ',
        );
        const printContainerx = document.querySelector('.full-screen-printx');
        printContainerx.innerHTML = printContainer.innerHTML;
        setTimeout(function () {
          window.print();
        }, 200);
      }, 500);
    }, 200);
  };

  const getPersonCoordinator = () => {
    dispatch(
      getAvailablePersonnelAction(
        {
          startDateTime: `${visitRes.dateOfVisit} ${visitRes.startDateTime}`,
          endDateTime: `${visitRes.dateOfVisit} ${visitRes.endDateTime}`,
        },
        ({ options }) => {
          setCordinatorOption([]);
          dispatch(setCoordinatorOptions(options));
        },
      ),
    );
  };

  const getData = () => {
    dispatch(
      getAudioVideoAction(visitRes.visitId, (res) => {
        if (
          res.interviewCoordinatorVisitPersonnelModel &&
          res.interviewCoordinatorVisitPersonnelModel.personnelId
        ) {
          setPersonnelId(
            res.interviewCoordinatorVisitPersonnelModel.personnelId,
          );
        }
        if (res.visitServiceBasicInfoModelList) {
          res.visitServiceBasicInfoModelList.map((element) => {
            if (
              element.visitLocationBasicInfoModelList &&
              element.visitLocationBasicInfoModelList.length > 0
            ) {
              element.visitLocationBasicInfoModelList.map(
                async (childElement) => {
                  childElement.isRequiredPackage = false;
                  childElement.volunteerOptions = [];
                  childElement.personnelId =
                    childElement.interviewVolunteerVisitPersonnelModel
                      ? childElement.interviewVolunteerVisitPersonnelModel
                          .personnelId
                      : null;
                  childElement.volunteerPhoneNumber =
                    childElement.interviewVolunteerVisitPersonnelModel
                      ? childElement.interviewVolunteerVisitPersonnelModel
                          .phoneNumber
                      : null;
                },
              );
            }
          });
          setAudioVideoList(res.visitServiceBasicInfoModelList);
          if (res.visitServiceBasicInfoModelList.length > 0) {
            setCallVolunteerOptions(true);
          }
        }
      }),
    );
  };

  const deleteData = () => {
    dispatch(
      deleteAudioVideoAction(visitRes.visitId, () => {
        setPersonnelId(null);
        setAudioVideoList([]);
        setCallVolunteerOptions(false);
        getData();
        setShowModal(false);
      }),
    );
  };

  const getVolunteer = async (parentIndex, childIndex) => {
    const copyData = [...audioVideoList];
    const parentLength = copyData.length;
    if (
      copyData.length > 0 &&
      copyData[parentIndex].visitLocationBasicInfoModelList
    ) {
      const childLength =
        copyData[parentIndex].visitLocationBasicInfoModelList.length;
      const startTime =
        copyData[parentIndex].visitLocationBasicInfoModelList[childIndex]
          .startDateTime;
      const endTime =
        copyData[parentIndex].visitLocationBasicInfoModelList[childIndex]
          .endDateTime;
      const sTime = `${visitRes.dateOfVisit} ${moment(startTime).format(
        'hh:mm A',
      )}`;
      const eTime = `${visitRes.dateOfVisit} ${moment(endTime).format(
        'hh:mm A',
      )}`;
      dispatch(
        getAvailablePersonnelAction(
          { startDateTime: sTime, endDateTime: eTime },
          ({ options }) => {
            copyData[parentIndex].visitLocationBasicInfoModelList[
              childIndex
            ].volunteerOptions = options;
            setAudioVideoList(copyData);
            if (childIndex !== childLength - 1) {
              getVolunteer(parentIndex, ++childIndex);
            } else if (parentIndex !== parentLength - 1) {
              getVolunteer(++parentIndex, 0);
            } else {
              setCallVolunteerOptions(false);
            }
          },
        ),
      );
    } else if (parentIndex !== parentLength - 1) {
      getVolunteer(++parentIndex, 0);
    } else {
      setCallVolunteerOptions(false);
    }
  };

  useEffect(() => {
    callVolunteerOptions && getVolunteer(0, 0);
  }, [callVolunteerOptions]);

  useEffect(() => {
    if (interviewCooridnatorsRoles && interviewCooridnatorsRoles.length > 0) {
      setRoleId(interviewCooridnatorsRoles[0].value);
    }
  }, [interviewCooridnatorsRoles]);

  useEffect(() => {
    if (interviewVolunteerRoles && interviewVolunteerRoles.length > 0) {
      setVolunteerRoleId(interviewVolunteerRoles[0].value);
    }
  }, [interviewVolunteerRoles]);

  useEffect(() => {
    if (Array.isArray(coordinatorOptions)) {
      setCordinatorOption(coordinatorOptions);
    } else {
      setCordinatorOption([]);
    }
  }, [coordinatorOptions]);

  useEffect(() => {
    if (personnelId && cordinatorOption && cordinatorOption.length > 0) {
      const sel = cordinatorOption.find((d) => d.value === personnelId);
      setCordinatorPhoneNumber(
        sel ? sel.data.phoneCountryCode + ' ' + sel.data.phoneNumber : '',
      );
    } else {
      setCordinatorPhoneNumber('');
    }
  }, [personnelId, cordinatorOption]);

  useEffect(() => {
    getPersonCoordinator();
    getData();
    dispatch(getRolesAction(''));
  }, [visitRes.visitId]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-end flex-wrap">
        <Formik initialValues={initialValues} enableReinitialize>
          {({ errors, touched, setFieldValue, handleBlur }) => (
            <Form className="flex-grow-1 mt-3">
              <Container fluid className="p-0">
                <Row>
                  <Col lg={4} md={6}>
                    <div
                      className={`${
                        !personnelId && isError && 'is-invalid'
                      } position-relative mb-2`}
                    >
                      <FormikController
                        control="select"
                        options={cordinatorOption}
                        label="Audio Video Coordinator"
                        name="avCordinator"
                        required={true}
                        errors={errors.avCordinator}
                        touched={touched.avCordinator}
                        value={
                          personnelId
                            ? cordinatorOption.find(
                                (d) => d.value === personnelId,
                              )
                            : null
                        }
                        placeholder={'Select Coordinator'}
                        handleChange={(e) => {
                          setFieldValue('avCordinator', e ? e : '');
                          setPersonnelId(e?.value);
                        }}
                        handleBlur={handleBlur}
                      />
                      {!personnelId && isError && (
                        <div className="text-danger position-absolute">
                          Input Required
                        </div>
                      )}
                    </div>
                  </Col>
                  {cordinatorPhoneNumber && (
                    <Col lg={8} md={6} className="d-flex align-items-center">
                      <div style={{ marginTop: '20px' }}>
                        <label>
                          Coordinator Phone Number:
                          <a
                            className="ps-2"
                            href={`tel:${cordinatorPhoneNumber}`}
                          >
                            {cordinatorPhoneNumber}
                            <MdCall className="text-gray ml-1" size={20} />
                          </a>
                        </label>
                      </div>
                    </Col>
                  )}
                </Row>
              </Container>
            </Form>
          )}
        </Formik>
        <div className="tag-width-audio-printbtn d-flex mb-2">
          <CustomButton variant="primary" onClick={handlePrint}>
            Print
          </CustomButton>
          &nbsp;
          <CustomButton
            variant="danger"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Delete
          </CustomButton>
        </div>
      </div>
      <div className="table-container audio-video-list">
        <table className="table">
          <thead>
            <tr>
              <th className="w-20">Time</th>
              <th className="w-30">Location</th>
              <th className="w-1">Package</th>
              <th className="w-1">Volunteer</th>
            </tr>
          </thead>
          <tbody>
            {isAudioVideoListLoader ? (
              <TableLoader columns={4} rows={8} />
            ) : audioVideoList?.length ? (
              audioVideoList.map((element, key) => {
                return (
                  <React.Fragment key={key}>
                    <tr colSpan="5">
                      {' '}
                      <td className="text-underline">
                        <h6>{element.serviceTemplateName}</h6>
                      </td>
                    </tr>
                    <tr className="border-avv-parent">
                      <td colSpan="4">
                        <div className="d-flex gap-5">
                          {element.visitLocationBasicInfoModelList &&
                            element.visitLocationBasicInfoModelList.map(
                              (childElement, childKey) => {
                                const roleName =
                                  element.visitPersonnelModelList.map(
                                    (role) => role.roleName,
                                  );
                                const personnelName =
                                  element.visitPersonnelModelList.map(
                                    (role) => role.personnelName,
                                  );
                                const personnelPhoneNumber =
                                  element.visitPersonnelModelList.map(
                                    (role) => role.phoneNumber,
                                  );
                                if (!childKey) {
                                  return (
                                    <div
                                      key={childKey}
                                      className="d-flex gap-4 align-items-center flex-wrap"
                                    >
                                      {roleName?.map((roleNameList, idx) => (
                                        <div key={idx}>
                                          <b>{roleName[idx]}</b> :{' '}
                                          <b className="text-gray">
                                            {personnelName[idx]}
                                          </b>{' '}
                                          <br />
                                          {personnelPhoneNumber[idx]}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                              },
                            )}
                        </div>
                      </td>
                    </tr>
                    {element.visitLocationBasicInfoModelList &&
                      element.visitLocationBasicInfoModelList.map(
                        (childElement, childKey) => {
                          return (
                            <tr
                              key={childKey}
                              className={`align-middle border-left-1 border-right-1 border-avv ${
                                childKey + 1 ==
                                element.visitLocationBasicInfoModelList.length
                                  ? 'last-border-aav-child'
                                  : ''
                              }`}
                            >
                              <td className="pb-4">
                                <div className="d-flex align-items-center gap-1">
                                  <BiTimeFive
                                    size={18}
                                    className="text-gray"
                                    alt="time"
                                  />
                                  {moment(childElement.startDateTime).format(
                                    'hh:mm A',
                                  )}{' '}
                                  to{' '}
                                  {moment(childElement.endDateTime).format(
                                    'hh:mm A',
                                  )}
                                </div>
                              </td>
                              <td className="pb-4">
                                <div className="d-flex align-items-center gap-1">
                                  <MdLocationOn
                                    className="text-gray"
                                    size={18}
                                  />
                                  {childElement.locationName || '-'}
                                </div>
                              </td>
                              <td className="pb-4">
                                <div
                                  className={`w-300 ${
                                    childElement.isRequiredPackage &&
                                    !childElement.interviewPackage &&
                                    'is-invalid'
                                  }`}
                                >
                                  <Select
                                    options={VISIT_INTERVIEW_SETUP}
                                    isDisabled={!personnelId}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    isClearable={true}
                                    menuShouldScrollIntoView={false}
                                    value={VISIT_INTERVIEW_SETUP.find(
                                      (d) =>
                                        d.value ===
                                        childElement.interviewPackage,
                                    )}
                                    onChange={(e) => {
                                      const copyData = [...audioVideoList];
                                      copyData[
                                        key
                                      ].visitLocationBasicInfoModelList[
                                        childKey
                                      ].interviewPackage = e ? e.value : null;
                                      if (!e) {
                                        copyData[
                                          key
                                        ].visitLocationBasicInfoModelList[
                                          childKey
                                        ].personnelId = null;
                                        copyData[
                                          key
                                        ].visitLocationBasicInfoModelList[
                                          childKey
                                        ].volunteerPhoneNumber = null;
                                      }
                                      setAudioVideoList(copyData);
                                    }}
                                    placeholder={'Select Package'}
                                  />
                                  {childElement.isRequiredPackage &&
                                    !childElement.interviewPackage && (
                                      <div className="text-danger">
                                        Required Field
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td className="position-relative pb-4">
                                <div>
                                  <Select
                                    options={childElement?.volunteerOptions}
                                    isDisabled={
                                      !personnelId ||
                                      !childElement.interviewPackage
                                    }
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    isClearable={true}
                                    menuShouldScrollIntoView={false}
                                    value={
                                      childElement?.volunteerOptions.find(
                                        (d) =>
                                          d.value === childElement.personnelId,
                                      ) || null
                                    }
                                    onChange={(e) => {
                                      const copyData = [...audioVideoList];
                                      copyData[
                                        key
                                      ].visitLocationBasicInfoModelList[
                                        childKey
                                      ].personnelId = e ? e.value : null;
                                      copyData[
                                        key
                                      ].visitLocationBasicInfoModelList[
                                        childKey
                                      ].volunteerPhoneNumber = e
                                        ? e.data.phoneCountryCode +
                                          ' ' +
                                          e.data.phoneNumber
                                        : '';
                                      if (!e) {
                                        copyData[
                                          key
                                        ].visitLocationBasicInfoModelList[
                                          childKey
                                        ].isRequiredPackage = false;
                                      }
                                      setAudioVideoList(copyData);
                                    }}
                                    placeholder={'Select Volunteer'}
                                  />
                                </div>
                                {childElement.volunteerPhoneNumber && (
                                  <div className="position-absolute">
                                    {childElement.volunteerPhoneNumber}
                                    <a
                                      className="ps-2"
                                      href={`tel:${childElement.volunteerPhoneNumber}`}
                                    >
                                      <MdCall className="text-gray" size={20} />
                                    </a>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        },
                      )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-5 no-rows-found">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* for print  */}

      <div className=" w-100 full-screen-print">
        <table className=" w-100">
          <tbody>
            <tr>
              <td>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} className=" w-150" alt="" />
              </td>
              <td>
                <h3>
                  <b>Visit No: </b>
                  {visitNo}
                </h3>
                <div>{visitDate}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <table className="print_table_border w-100">
          <thead>
            <tr>
              <th>TIME</th>
              <th>LOCATION</th>
            </tr>
          </thead>
          <tbody>
            {audioVideoList.length > 0 ? (
              audioVideoList.map((element, key) => {
                return (
                  <React.Fragment key={key}>
                    <tr>
                      <td className="p-4 font-bold" colSpan="5">
                        <span>{element.serviceTemplateName}</span>
                      </td>
                    </tr>
                    <tr className="border-avv-parent">
                      <td colSpan="4">
                        <div className="d-flex gap-5">
                          {element.visitLocationBasicInfoModelList &&
                            element.visitLocationBasicInfoModelList.map(
                              (childElement, childKey) => {
                                const roleName =
                                  element.visitPersonnelModelList.map(
                                    (role) => role.roleName,
                                  );
                                const personnelName =
                                  element.visitPersonnelModelList.map(
                                    (role) => role.personnelName,
                                  );
                                const personnelPhoneNumber =
                                  element.visitPersonnelModelList.map(
                                    (role) => role.phoneNumber,
                                  );
                                if (!childKey) {
                                  return (
                                    <div
                                      key={childKey}
                                      className="d-flex gap-4 align-items-center flex-wrap"
                                    >
                                      {roleName?.map((roleNameList, idx) => (
                                        <div key={idx}>
                                          <b>{roleName[idx]}</b> :{' '}
                                          <b className="text-gray">
                                            {personnelName[idx]}
                                          </b>{' '}
                                          <br />
                                          {personnelPhoneNumber[idx]}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                              },
                            )}
                        </div>
                      </td>
                    </tr>
                    {element.visitLocationBasicInfoModelList &&
                      element.visitLocationBasicInfoModelList.map(
                        (childElement, childKey) => {
                          return (
                            <tr key={childKey} className="align-middle">
                              <td className="print_td">
                                <div className="d-flex align-items-center gap-1">
                                  <BiTimeFive
                                    size={18}
                                    className="text-gray"
                                    alt="time"
                                  />
                                  {moment(childElement.startDateTime).format(
                                    'hh:mm A',
                                  )}{' '}
                                  to{' '}
                                  {moment(childElement.endDateTime).format(
                                    'hh:mm A',
                                  )}
                                </div>
                              </td>

                              <td className="print_td">
                                <div className="d-flex align-items-center gap-1">
                                  <MdLocationOn
                                    className="text-gray"
                                    size={18}
                                  />
                                  {childElement.locationName || '-'}
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )}
                  </React.Fragment>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex">
        <CustomButton
          variant="primary"
          disabled={isAudioVideoLoader}
          type="button"
          onClick={() => {
            onSubmit();
          }}
        >
          SAVE
        </CustomButton>
        &nbsp;&nbsp;
        <CustomButton
          variant="secondary"
          disabled={isAudioVideoLoader}
          onClick={() => {
            getData();
          }}
          type="button"
        >
          Reset
        </CustomButton>
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure? You want to delete!</Modal.Body>
        <Modal.Footer>
          <CustomButton variant="primary" onClick={deleteData}>
            Delete
          </CustomButton>
          <CustomButton
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TabAudioVideo;
