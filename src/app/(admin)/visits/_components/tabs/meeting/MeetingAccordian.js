import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BsThreeDots } from 'react-icons/bs';
import {
  MdCall,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineModeEditOutline,
  MdLocationPin,
} from 'react-icons/md';
import { PiEnvelopeSimpleLight } from 'react-icons/pi';
import { RxCross1 } from 'react-icons/rx';
import {
  removeMeetingAction,
  getMeetingAction,
} from '@/redux/visits/action.visits';
import ServicesForm from './form/Form';
import CustomButton from '@/components/Button';
import CustomModal from '../../modals/CustomModal';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { MODAL_MESSAGES } from '@/utils/constants/default.constants';
import moment from 'moment';

const MeetingAccordian = ({ tabContent, visitId, visitServiceId, cb }) => {
  const [showAccordianCrudBox, setShowAccordianCrudBox] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({});
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const dispatch = useDispatch();

  const showAccordianCrud = () => {
    setShowAccordianCrudBox(!showAccordianCrudBox);
  };

  // Visit Remove Action
  const onRemoveVisitService = () => {
    dispatch(
      removeMeetingAction(visitId, visitServiceId, () => {
        setShowRemoveModal(false);
        cb('REMOVE');
      }),
    );
  };
  // Visit Edit Action
  const onEditVisitService = () => {
    dispatch(getMeetingAction(visitId, visitServiceId));
    cb('EDIT');
  };
  // Fill Meeting Template Form
  useEffect(() => {
    if (tabContent?.formTemplate?.length) {
      const properties = {};
      tabContent.formTemplate.map((element) => {
        properties[element.name] = element.defaultValue;
      });
      setFormData(properties);
    }
  }, [tabContent]);

  return (
    <>
      <div className="accordian">
        <div className="accordion-item">
          <div className="accordion-toggle">
            <div className="d-flex justify-content-center align-items-center gap-3  ">
              <div
                className="cursor-pointer p-1"
                onClick={() => {
                  setIsActive(!isActive);
                  if (!isActive || showAccordianCrudBox) {
                    setShowAccordianCrudBox(false);
                  }
                }}
              >
                {isActive ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </div>

              <div className="mobile-col d-flex grow-2 gap-2 justify-content-between">
                <div className="d-flex gap-2 align-items-center mr-120 mobile-no-margin mobile-left-30 tab-col">
                  <div>
                    <p>
                      <strong>Coordinator</strong>{' '}
                      <span className="text-nowrap mr-2">
                        {tabContent.personnelName}
                      </span>
                    </p>
                  </div>
                  <div className="d-flex align-items-center contactLinks-meeting flex-wrap">
                    <div className="d-flex align-items-center ml-2">
                      <a href={`tel:${tabContent.phoneNumber}`}>
                        <MdCall className="text-gray" size={20} />
                      </a>
                      <span>{tabContent.phoneNumber}</span>
                    </div>
                    <div className="d-flex align-items-center ml-2">
                      <a href={`mailto:${tabContent.email}`}>
                        <PiEnvelopeSimpleLight
                          className="text-gray"
                          size={20}
                        />
                      </a>
                      <span> {tabContent.email}</span>
                    </div>
                    <div className="d-flex align-items-center ml-2">
                      <MdLocationPin className="text-gray" size={20} />
                      <span>{tabContent.location}</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-5 tab-col tab-gap-1 justify-content-center  ">
                  <p className="d-flex gap-2 align-items-center">
                    <span className="text-nowrap">
                      <strong>Start Time</strong>{' '}
                    </span>
                    <span className="text-nowrap">
                      {moment(tabContent.startTime, 'HH:mm').format('hh:mm A')}
                    </span>
                  </p>

                  <p className="d-flex gap-2 align-items-center">
                    <span className="text-nowrap">
                      <strong>End Time</strong>{' '}
                    </span>
                    <span className="text-nowrap">
                      {moment(tabContent.endTime, 'HH:mm').format('hh:mm A')}
                    </span>
                  </p>
                  <p className="d-flex gap-2 align-items-center">
                    <span className="text-nowrap">
                      <strong>Meeting With</strong>
                    </span>{' '}
                    <span className="mr-3 text-nowrap">
                      {tabContent.meetingWith}
                    </span>
                  </p>
                </div>
              </div>

              {showAccordianCrudBox && isActive && (
                <div className="card-ele" onClick={(e) => e.stopPropagation()}>
                  <PermissionWrapper name={'UPDATE_VISIT_SERVICE'}>
                    <CustomButton
                      onClick={() => {
                        onEditVisitService();
                      }}
                    >
                      <MdOutlineModeEditOutline size={18} className="mr-2" />
                      <span>Edit</span>
                    </CustomButton>
                  </PermissionWrapper>
                  <PermissionWrapper name={'DELETE_VISIT_SERVICE'}>
                    <CustomButton
                      onClick={() => {
                        setShowRemoveModal(true);
                      }}
                    >
                      <RxCross1 size={18} className="mr-2" />
                      <span>Remove</span>
                    </CustomButton>
                  </PermissionWrapper>
                </div>
              )}
            </div>
            <BsThreeDots role="button" onClick={showAccordianCrud} size={20} />
          </div>
          {isActive && (
            <div className="accordion-content">
              <Formik initialValues={formData} enableReinitialize>
                {({
                  errors,
                  dirty,
                  touched,
                  values,
                  setFieldValue,
                  setFieldTouched,
                }) => (
                  <ServicesForm
                    fields={
                      tabContent?.formTemplate?.length
                        ? tabContent.formTemplate
                        : []
                    }
                    errors={errors}
                    values={values}
                    dirty={dirty}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    disabled={true}
                  />
                )}
              </Formik>
              {/* Task list */}
              {/* <TabServiceList /> */}
            </div>
          )}
        </div>
      </div>
      <CustomModal
        title={MODAL_MESSAGES.REMOVE_MEETING.TITLE}
        showModal={showRemoveModal}
        content={MODAL_MESSAGES.REMOVE_MEETING.CONTENT}
        cancelBtnText={MODAL_MESSAGES.REMOVE_MEETING.CANCEL_BUTTON_TEXT}
        closeAction={() => {
          setShowRemoveModal(false);
        }}
        submitAction={() => {
          onRemoveVisitService();
        }}
        submitBtnText={MODAL_MESSAGES.REMOVE_MEETING.SUBMIT_BUTTON_TEXT}
      />
    </>
  );
};

export default MeetingAccordian;
