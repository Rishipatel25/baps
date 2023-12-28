import { getScheduleAction } from '@/redux/visits/action.visits';
import { visitState } from '@/redux/visits/reducer.visits';
import { useEffect, useState } from 'react';
import { MdCall, MdLocationOn } from 'react-icons/md';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiTimeFive } from 'react-icons/bi';
import { PiEnvelopeSimpleLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import CustomButton from '@/components/Button';
import TableLoader from '@/components/loaders/TableLoader';
import moment from 'moment';
import logo from '@/assets/images/svg/logo.svg';
import Image from 'next/image';

const TabSchedule = ({
  currentVisitId,
  setCurrentActiveTab,
  setAcceptModalShow,
}) => {
  const [show, setShow] = useState(false);

  const {
    scheduleList,
    isScheduleLoader,
    currentVisitRes: { visitRes, primaryRes },
  } = useSelector(visitState);
  const dispatch = useDispatch();

  const handleClickClosePanelFromOutside = (e) => {
    if (
      !e.target.classList.contains('card-ele-schedule') &&
      !e.target.closest('.card-ele-schedule')
    ) {
      setShow(false);
    }
  };

  let sorted_scheduleList = [];
  if (scheduleList?.length) {
    const temp_scheduleList = [...scheduleList];
    sorted_scheduleList = temp_scheduleList.sort((a, b) => {
      return (
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
      );
    });
  }

  const handlePrint = () => {
    const printContainer = document.querySelector('.full-screen-print');
    const printContainerx = document.querySelector('.full-screen-printx');
    printContainerx.innerHTML = printContainer.innerHTML;
    window.print();
  };

  useEffect(() => {
    dispatch(getScheduleAction({ newVisitId: currentVisitId }));
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', handleClickClosePanelFromOutside);
    return () => {
      document.body.removeEventListener(
        'click',
        handleClickClosePanelFromOutside,
      );
    };
  }, []);

  return (
    <>
      <div className="position-relative">
        <div className="justify-content-between mt-2 d-flex gap-3 mb-1 align-items-center mobile-col">
          <div className="d-flex justify-content-between gap-3 w-100 flex-wrap bg-gray p-2">
            <div>
              <div className="font-bold">Visit Type</div>
              <div>{visitRes?.typeOfVisit?.label}</div>
            </div>
            <div>
              <div className="font-bold">Total Guests</div>
              <div className="text-center mobile-no-center">
                {visitRes?.totalVisitors}
              </div>
            </div>
            <div>
              <div className="font-bold">Primary Guest</div>
              <div>{`${primaryRes?.firstName} ${primaryRes?.lastName}`}</div>
            </div>
            <div>
              <div className="font-bold">City , State , Country</div>
              <div className="text-capitalize">
                {primaryRes?.city} ,
                {primaryRes?.state?.label ? primaryRes?.state?.label : '-'},{' '}
                {primaryRes?.country?.label}
              </div>
            </div>
            <div className="w-100">
              <div className="font-bold">Organization Name</div>
              <div className="text-break">
                {primaryRes?.organizationName
                  ? primaryRes?.organizationName
                  : '-'}
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <CustomButton variant="primary" onClick={() => setShow(true)}>
                ADD
              </CustomButton>
              {show && (
                <div className="card-ele-schedule">
                  <PermissionWrapper name={'VIEW_VISIT_TEAM'}>
                    <CustomButton
                      onClick={() => {
                        setAcceptModalShow(true);
                      }}
                    >
                      <AiOutlinePlus size={18} className="mr-2" />
                      <span>Team</span>
                    </CustomButton>
                  </PermissionWrapper>

                  <CustomButton
                    onClick={() => {
                      setCurrentActiveTab(5);
                    }}
                  >
                    <AiOutlinePlus size={18} className="mr-2" />
                    <span>Tour</span>
                  </CustomButton>
                  <CustomButton
                    onClick={() => {
                      setCurrentActiveTab(6);
                    }}
                  >
                    <AiOutlinePlus size={18} className="mr-2" />
                    <span>Service</span>
                  </CustomButton>
                  <CustomButton
                    onClick={() => {
                      setCurrentActiveTab(7);
                    }}
                  >
                    <AiOutlinePlus size={18} className="mr-2" />
                    <span>Meeting</span>
                  </CustomButton>
                </div>
              )}
            </div>
            <CustomButton variant="secondary" onClick={handlePrint}>
              Print
            </CustomButton>
          </div>
        </div>
      </div>
      <div className="table-container mt-3 ">
        <table className="table align-middle white-space-nowrap overflow-auto border-1">
          <thead>
            <tr>
              <th className="print_10">
                <span>Time</span>
              </th>
              <th>SERVICE</th>
              <th>ROLE</th>
              <th>PERSONNEL</th>
              <th>PHONE NUMBER </th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            {isScheduleLoader ? (
              <TableLoader columns={6} rows={5} />
            ) : sorted_scheduleList?.length ? (
              sorted_scheduleList?.map((data, idx) => {
                const startTime = data.startDateTime.split(' ')[1];
                const endTime = data.endDateTime.split(' ')[1];

                const personnelRoleName = data?.visitPersonnelModelList?.map(
                  (role) => role.roleName,
                );
                const personnelName = data?.visitPersonnelModelList?.map(
                  (personnel) => personnel.personnelName,
                );
                const personnelPhoneNumber = data?.visitPersonnelModelList?.map(
                  (phoneNum) => phoneNum.phoneNumber,
                );
                const personnelEmail = data?.visitPersonnelModelList?.map(
                  (email) => email.email,
                );
                return (
                  <tr key={idx}>
                    <td>
                      <div
                        className="d-flex gap-1 align-items-center"
                        data="sortDate"
                      >
                        <BiTimeFive className="text-gray" />
                        {moment(startTime.slice(0, -3), 'HH:mm').format(
                          'hh:mm A',
                        )}
                        <span className="showPrint">
                          -
                          {moment(endTime.slice(0, -3), 'HH:mm').format(
                            'hh:mm A',
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      {data?.serviceName || '-'}
                      {data.visitLocationModelList &&
                        data.visitLocationModelList.length > 0 && (
                          <div className="location-list">
                            {data.visitLocationModelList.map((element, key) => {
                              return (
                                <div key={key}>
                                  <MdLocationOn
                                    className="text-gray"
                                    size={15}
                                  ></MdLocationOn>{' '}
                                  {element.locationName}
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        {personnelRoleName?.map((roleNameList, idx) => (
                          <div key={idx}>{roleNameList || '-'}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        {personnelName?.map((personnelList, idx) => (
                          <div key={idx}>{personnelList || '-'}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        {personnelPhoneNumber?.map((PhoneNumlList, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center gap-2"
                          >
                            {PhoneNumlList || '-'}
                            <a href={`tel:${PhoneNumlList}`}>
                              <MdCall
                                className="text-gray hidePrint "
                                role="button "
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        {personnelEmail?.map((email, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center gap-2"
                          >
                            {email || '-'}
                            <a href={`mailto:${email}`}>
                              <PiEnvelopeSimpleLight className="text-gray hidePrint" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <>
                {!isScheduleLoader && (
                  <tr>
                    <td colSpan={6} className="text-center p-2">
                      <h5> No Schedule Found</h5>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className=" w-100 full-screen-print">
        <table className=" w-100  ">
          <tbody>
            <tr>
              <td>
                <Image src={logo} className=" w-150" alt="visitlogo" />
              </td>
              <td>
                <h3>
                  <b>Visit No: </b> {visitRes?.requestNumber}
                </h3>
                <div>
                  {visitRes?.dateOfVisit} {visitRes?.startDateTime} -{' '}
                  {visitRes?.endDateTime}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table width="100%">
          <tbody>
            <tr>
              <td className="p-3">
                <b>Primary Guest Details: </b>
                <br />
                <div>
                  {`${primaryRes?.firstName} ${primaryRes?.lastName}`}
                  <br />
                  {primaryRes?.city ? primaryRes?.city : '-'},
                  {primaryRes?.state?.label ? primaryRes?.state?.label : '-'},
                  {primaryRes?.country?.label
                    ? primaryRes?.country?.label
                    : '-'}
                </div>
                <b>Contact: </b>
                <span>
                  {primaryRes?.phoneNumber} ({primaryRes?.email})
                </span>
              </td>
              <td className="p-3">
                <b>Visit Type: </b>
                {visitRes?.typeOfVisit?.label}
                <br />
                <b>Total Guests: </b>
                {visitRes?.totalVisitors}
                <br />
                <b>Org Name: </b>
                {primaryRes?.organizationName
                  ? primaryRes?.organizationName
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <table className="print_table_border w-100">
          <thead>
            <tr>
              <th>TIME</th>
              <th>SERVICE</th>
              <th>Primary Guest Details</th>
            </tr>
          </thead>
          <tbody>
            {isScheduleLoader ? (
              <></>
            ) : sorted_scheduleList?.length ? (
              sorted_scheduleList?.map((data, idx) => {
                const startTime = data.startDateTime.split(' ')[1];
                const endTime = data.endDateTime.split(' ')[1];

                const personnelRoleName = data?.visitPersonnelModelList?.map(
                  (role) => role.roleName,
                );
                const personnelName = data?.visitPersonnelModelList?.map(
                  (personnel) => personnel.personnelName,
                );
                const personnelPhoneNumber = data?.visitPersonnelModelList?.map(
                  (phoneNum) => phoneNum.phoneNumber,
                );
                const personnelEmail = data?.visitPersonnelModelList?.map(
                  (email) => email.email,
                );
                return (
                  <tr key={idx}>
                    <td className="print_td">
                      {moment(startTime.slice(0, -3), 'HH:mm').format(
                        'hh:mm A',
                      )}
                      -{moment(endTime.slice(0, -3), 'HH:mm').format('hh:mm A')}
                    </td>
                    <td className="print_td">
                      {data?.serviceName || '-'}
                      {data.visitLocationModelList &&
                        data.visitLocationModelList.length > 0 && (
                          <div className="location-list">
                            {data.visitLocationModelList.map((element, key) => {
                              return (
                                <div key={key}>- {element.locationName}</div>
                              );
                            })}
                          </div>
                        )}
                    </td>
                    <td className="print_td">
                      {personnelPhoneNumber?.map((PhoneNumlList, idx) => (
                        <div
                          key={idx}
                          className="personal_details"
                          style={{
                            borderBottom:
                              personnelName.length > idx + 1
                                ? '1px solid #f1f1f1'
                                : 'none',
                          }}
                        >
                          {/* {personnelRoleName[idx] || '-'}
                          <br /> */}
                          {personnelName[idx]} ({personnelRoleName[idx] || '-'})
                          <br /> {personnelEmail[idx]} |
                          {personnelPhoneNumber[idx]}
                          {/* {personnelName.length > idx + 1 && <hr />} */}
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })
            ) : (
              <>
                {!isScheduleLoader && (
                  <tr>
                    <td colSpan={6} className="text-center p-2">
                      <h5> No Schedule Found</h5>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TabSchedule;
