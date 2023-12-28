'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeVisitStatusAction } from '@/redux/visits/action.visits';
import { BsExclamationOctagon } from 'react-icons/bs';
import {
  getLocalStorageData,
  lookupToObject,
  setLocalStorageData,
} from '@/utils/helper.utils';
import {
  MODAL_MESSAGES,
  TOAST_SUCCESS,
  VISIT_STATUS,
} from '@/utils/constants/default.constants';
import { toast } from 'react-toastify';
import { StatusReasonModal } from './modals/StatusReasonModal';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { visitState } from '@/redux/visits/reducer.visits';
import { checkFeedbackExistsAction } from '@/redux/feedback/action.feedback';
import TabDocument from './tabs/document';
import AcceptVisitModal from './modals/AcceptVisitModal';
import TabMeeting from './tabs/meeting';
import CustomButton from '@/components/Button';
import TabFeedback from './tabs/feedback/form';
import TabTour from './tabs/tour';
import TabVisit from './tabs/visit';
import TabPrimary from './tabs/primary';
import TabSecondary from './tabs/secondary';
import TabService from './tabs/service';
import CustomModal from './modals/CustomModal';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { MdOutlineCancel } from 'react-icons/md';
import { IoCheckmarkDone } from 'react-icons/io5';
import TabAudioVideo from './tabs/audiovideo';
import TabSchedule from './tabs/schedule';

const TABS = [
  {
    id: 1,
    title: 'Visit',
    key: 'visitTab',
    name: '',
  },
  {
    id: 2,
    title: 'Primary Guest',
    key: 'primaryVisitorModel',
    name: '',
  },
  {
    id: 3,
    title: 'Secondary Guest',
    key: 'secondaryVisitorAvailable',
    name: '',
  },
  {
    id: 4,
    title: 'Schedule',
    key: 'scheduleModel',
    name: 'VIEW_VISIT_SCHEDULE',
  },
  {
    id: 5,
    title: 'Tour',
    key: 'tourAvailable',
    name: 'VIEW_VISIT_TOUR',
  },
  {
    id: 6,
    title: 'Services',
    key: 'servicesAvailable',
    name: 'VIEW_VISIT_SERVICE_LIST',
  },
  {
    id: 7,
    title: 'Meeting',
    key: 'meetingsAvailable',
    name: 'VIEW_VISIT_SERVICE_LIST',
  },
  {
    id: 8,
    title: 'Audio Video Request',
    key: 'interviewCoordinatorAvailable',
    name: '',
  },
  {
    id: 9,
    title: 'Feedback',
    key: 'feedbackAvailable',
    name: '',
  },
  {
    id: 10,
    title: 'Documents',
    key: 'documentsAvailable',
    name: 'VIEW_VISIT_DOCUMENT_LIST',
  },
];

const TabContainer = ({
  currentVisitId,
  addVisitApiCall,
  hasError,
  saveFormsDataLocally,
  setHasError,
  isGetByIdLoader,
  acceptModalShow,
  setAcceptModalShow,
  getVisitById,
}) => {
  const [currentActiveTab, setCurrentActiveTab] = useState(TABS[0].id);
  const [currentProgress, setCurrentProgress] = useState(TABS[0].id);
  const [declinedModalShow, setDeclinedModalShow] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);
  const [completeModalShow, setCompleteModalShow] = useState(false);
  const [closeModalShow, setCloseModalShow] = useState(false);
  const [isFeedbackRemaining, setIsFeedbackRemaining] = useState(false);
  const [showHiddenMenu, setShowHiddenMenu] = useState(false);
  const [lastBtnIndex, setLastBtnIndex] = useState(0);
  const [resetSize, setResetSize] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const dispatch = useDispatch();
  const {
    tabStatus,
    currentVisitRes: { visitRes },
  } = useSelector(visitState);
  const declineReasonOptions = lookupToObject('DECLINED_REASON');
  const cancelReasonOptions = lookupToObject('CANCELLED_REASON');

  const handleResize = () => {
    const ele = document.getElementsByClassName('sliderContainer')[0];
    setDimensions({
      width: ele.offsetWidth,
      height: ele.offsetWidth,
    });
  };

  const setButtonsDisplay = () => {
    let w = 0;
    const tabs = document.getElementById('tabsHeader');
    if (tabs) {
      const buttons = document.querySelectorAll('#tabsHeader button');
      const threeDotsTabs = document.getElementById('threeDotsTabs');
      const stickyTabCloseBtn = document.getElementById('stickyTabCloseBtn');
      const stickyTabCloseBtnWidth = stickyTabCloseBtn
        ? stickyTabCloseBtn.offsetWidth
        : 0;
      buttons.forEach((button, index) => {
        button.style.display = 'block';
        w += button.offsetWidth;
        threeDotsTabs.style.display = 'none';
        if (index !== 0) {
          if (w > dimensions.width - (stickyTabCloseBtnWidth + 100)) {
            button.style.display = 'none';
            threeDotsTabs.style.display = 'block';
            threeDotsTabs.style.marginTop = '7px';
          } else {
            setLastBtnIndex(index);
          }
        }
      });
      tabs.style.opacity = 1;
    }
  };

  const handleThreeDotsTabsClick = () => {
    setShowHiddenMenu(!showHiddenMenu);

    const threeDotsButtons1 = document.querySelectorAll(
      '#threeDotsTabsContent button',
    );

    threeDotsButtons1.forEach((button) => {
      button.style.display = 'none';
    });

    setButtonsDisplay();
  };

  // check and return is tab disabled
  const checkDisabledTab = (selectedTab) => {
    if (currentActiveTab === selectedTab.id) {
      return false;
    }

    if (currentVisitId) {
      // Edit form
    } else {
      // Add form validations
      // eslint-disable-next-line no-lonely-if
      if (hasError && currentProgress < selectedTab.id) {
        return true;
      }
    }
  };

  const changeVisitStatus = (dataObj, successMessage, cb) => {
    const visitStatusInfo = {
      visitId: currentVisitId,
      visitStatusData: { ...dataObj },
    };
    dispatch(
      changeVisitStatusAction(visitStatusInfo, () => {
        toast.success(successMessage, {
          toastId: TOAST_SUCCESS.CHANGE_VISIT_STATUS_ACTION.ID,
        });
        setAcceptModalShow(false);
        setCancelModalShow(false);
        setDeclinedModalShow(false);
        getVisitById();
        if (cb) {
          cb();
        }
      }),
    );
  };

  const callBackSetValues = (values, { isVisit, isPrimary, isSecondary }) => {
    let { visitVisitorModel, primaryVisitorModel, secondaryVisitorModel } =
      getLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA);
    if (isVisit) {
      visitVisitorModel = { ...values };
    } else if (isPrimary) {
      primaryVisitorModel = { ...values };
    } else if (isSecondary) {
      secondaryVisitorModel = { ...values };
    }
    setHasError(false);
    setLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA, {
      visitVisitorModel,
      primaryVisitorModel,
      secondaryVisitorModel,
    });
    toast.success(TOAST_SUCCESS.successUpdateVisitAction.MESSAGE, {
      toastId: TOAST_SUCCESS.successUpdateVisitAction.ID,
    });
  };

  const filterTab = () => {
    if (!currentVisitId) {
      return TABS.filter((d) => d.id <= 3);
    } else if (
      currentVisitId &&
      visitRes &&
      visitRes.stage &&
      (visitRes.stage === VISIT_STATUS.DECLINED ||
        visitRes.stage === VISIT_STATUS.EXPIRED ||
        visitRes.stage === VISIT_STATUS.PENDING)
    ) {
      return TABS.filter((d) => d.id <= 3);
    } else if (
      currentVisitId &&
      visitRes &&
      visitRes.stage &&
      visitRes.stage !== VISIT_STATUS.DECLINED &&
      visitRes.stage !== VISIT_STATUS.EXPIRED &&
      visitRes.stage !== VISIT_STATUS.PENDING
    ) {
      return TABS;
    }
    return [];
  };

  useEffect(() => {
    setTimeout(function () {
      handleResize();
    }, 500);
    window.addEventListener('resize', handleResize, false);
    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);

  useEffect(() => {
    const tabs = document.getElementById('tabsHeader');
    if (tabs) {
      tabs.style.opacity = 0;
    }
    dimensions.width > 0 && setButtonsDisplay();
  }, [dimensions.width]);

  useEffect(() => {
    setButtonsDisplay();
  }, [visitRes?.stage]);

  useEffect(() => {
    if (resetSize) {
      setButtonsDisplay();
      setResetSize(false);
    }
  }, [resetSize]);

  useEffect(() => {
    if (!showHiddenMenu) return;
    const threeDotsButtons = document.querySelectorAll(
      '#threeDotsTabsContent button',
    );

    threeDotsButtons.forEach((button, index) => {
      threeDotsButtons[index].style.display = 'none';
      if (lastBtnIndex < index) {
        threeDotsButtons[index].style.display = 'block';
      }
    });
  }, [showHiddenMenu]);

  if (declinedModalShow) {
    return (
      <StatusReasonModal
        reasonOptions={declineReasonOptions}
        handleClose={() => {
          setDeclinedModalShow(false);
          setResetSize(true);
        }}
        handleSubmit={(values) =>
          changeVisitStatus(values, 'Visit declined successfully')
        }
        submitBtnText="Save"
        status={VISIT_STATUS.DECLINED}
        title="Please give appropriate reason for the decline visit."
        isEdit={visitRes?.stage === VISIT_STATUS.DECLINED}
        currentVisitId={currentVisitId}
      />
    );
  } else if (cancelModalShow) {
    return (
      <StatusReasonModal
        reasonOptions={cancelReasonOptions}
        handleClose={() => {
          setCancelModalShow(false);
          setResetSize(true);
        }}
        handleSubmit={(values) =>
          changeVisitStatus(values, 'Visit cancelled successfully')
        }
        submitBtnText="Save"
        status={VISIT_STATUS.CANCEL}
        title="Please give appropriate reason for the cancelled  visit."
        isEdit={visitRes?.stage === VISIT_STATUS.CANCEL}
        currentVisitId={currentVisitId}
      />
    );
  } else if (acceptModalShow) {
    return (
      <AcceptVisitModal
        currentVisitId={currentVisitId}
        visitStatus={visitRes?.stage || ''}
        setAcceptModalShow={(e) => {
          setAcceptModalShow(e);
          setResetSize(!e);
        }}
        getVisitById={getVisitById}
      />
    );
  }

  return (
    <>
      {/* Tabs */}
      <div id="contact-us" />
      <div className="tabs">
        <div className="tab-header d-flex flex-row gap-2">
          <div className="gap-3">
            <div className="no-margin tabs-header" id="tabsHeader">
              {filterTab().map((tab) => {
                return (
                  <PermissionWrapper key={tab.id} name={tab.name}>
                    <TabHeaderRenderer
                      tab={tab}
                      checkDisabledTab={checkDisabledTab}
                      currentActiveTab={currentActiveTab}
                      setCurrentActiveTab={setCurrentActiveTab}
                      tabStatus={tabStatus}
                      setShowHiddenMenu={setShowHiddenMenu}
                    />
                  </PermissionWrapper>
                );
              })}
            </div>

            <div id="threeDotsTabs">
              <div className="dots" onClick={handleThreeDotsTabsClick}>
                ...
              </div>
              {showHiddenMenu && (
                <div id="threeDotsTabsContent">
                  {filterTab().map((tab) => {
                    return (
                      <PermissionWrapper key={tab.id} name={tab.name}>
                        <TabHeaderRenderer
                          tab={tab}
                          checkDisabledTab={checkDisabledTab}
                          currentActiveTab={currentActiveTab}
                          setCurrentActiveTab={setCurrentActiveTab}
                          tabStatus={tabStatus}
                          setShowHiddenMenu={setShowHiddenMenu}
                        />
                      </PermissionWrapper>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {currentVisitId && (
            <StatusButtonContainer
              visitRes={visitRes}
              currentVisitId={currentVisitId}
              setDeclinedModalShow={setDeclinedModalShow}
              setCancelModalShow={setCancelModalShow}
              setAcceptModalShow={setAcceptModalShow}
              setCompleteModalShow={setCompleteModalShow}
              changeVisitStatus={changeVisitStatus}
              setCloseModalShow={setCloseModalShow}
              setIsFeedbackRemaining={setIsFeedbackRemaining}
              isFeedbackRemaining={isFeedbackRemaining}
            />
          )}
        </div>
        <>
          {(currentActiveTab === 1 && (
            <TabVisit
              currentVisitId={currentVisitId}
              setCurrentProgress={setCurrentProgress}
              setCurrentTab={setCurrentActiveTab}
              saveFormsDataLocally={saveFormsDataLocally}
              callBackSetValues={callBackSetValues}
              setHasError={setHasError}
              hasError={hasError}
            />
          )) ||
            (currentActiveTab === 2 && (
              <TabPrimary
                setCurrentTab={setCurrentActiveTab}
                saveFormsDataLocally={saveFormsDataLocally}
                setCurrentProgress={setCurrentProgress}
                addVisitApiCall={addVisitApiCall}
                isFormLoader={isGetByIdLoader}
                currentVisitId={currentVisitId}
                callBackSetValues={callBackSetValues}
                setHasError={setHasError}
                hasError={hasError}
              />
            )) ||
            (currentActiveTab === 3 && (
              <TabSecondary
                addVisitApiCall={addVisitApiCall}
                currentVisitId={currentVisitId}
                saveFormsDataLocally={saveFormsDataLocally}
                callBackSetValues={callBackSetValues}
                setHasError={setHasError}
                setCurrentProgress={setCurrentProgress}
                hasError={hasError}
                tabStatus={tabStatus}
              />
            )) ||
            (currentActiveTab === 4 && (
              <TabSchedule
                setCurrentActiveTab={setCurrentActiveTab}
                currentVisitId={currentVisitId}
                setAcceptModalShow={setAcceptModalShow}
              />
            )) ||
            (currentActiveTab === 5 && (
              <TabTour currentVisitId={currentVisitId} tabStatus={tabStatus} />
            )) ||
            (currentActiveTab === 6 && (
              <TabService
                currentVisitId={currentVisitId}
                tabStatus={tabStatus}
              />
            )) ||
            (currentActiveTab === 7 && (
              <TabMeeting
                currentVisitId={currentVisitId}
                tabStatus={tabStatus}
              />
            )) ||
            (currentActiveTab === 8 && (
              <TabAudioVideo
                currentVisitId={currentVisitId}
                tabStatus={tabStatus}
              />
            )) ||
            (currentActiveTab === 9 && (
              <TabFeedback currentVisitId={currentVisitId} />
            )) ||
            (currentActiveTab === 10 && (
              <TabDocument
                currentVisitId={currentVisitId}
                tabStatus={tabStatus}
              />
            ))}
        </>
      </div>
      {/* Complete Modal */}
      <CustomModal
        title={MODAL_MESSAGES.COMPLETE_VISIT.TITLE}
        showModal={completeModalShow}
        content={MODAL_MESSAGES.COMPLETE_VISIT.CONTENT}
        cancelBtnText={MODAL_MESSAGES.COMPLETE_VISIT.CANCEL_BUTTON_TEXT}
        closeAction={() => {
          setCompleteModalShow(false);
        }}
        submitBtnText={MODAL_MESSAGES.COMPLETE_VISIT.SUBMIT_BUTTON_TEXT}
        submitAction={() => {
          changeVisitStatus(
            {
              stage: VISIT_STATUS.COMPLETED,
              reasonType: '',
              reason: '',
            },
            'Visit Completed Successfully',
            () => {
              setCompleteModalShow(false);
            },
          );
        }}
      />
      {/* Close Modal */}
      <CustomModal
        title={MODAL_MESSAGES.CLOSE_VISIT.TITLE}
        showModal={closeModalShow}
        content={
          isFeedbackRemaining ? (
            <p>
              <div className="text-danger d-flex align-items-center gap-1">
                <div>
                  {' '}
                  <BsExclamationOctagon />{' '}
                </div>
                <div>{MODAL_MESSAGES.CLOSE_VISIT.FEEDBACK_SUBMIT}</div>
              </div>
              {MODAL_MESSAGES.CLOSE_VISIT.CONTENT}
            </p>
          ) : (
            <p> {MODAL_MESSAGES.CLOSE_VISIT.CONTENT}</p>
          )
        }
        cancelBtnText={MODAL_MESSAGES.CLOSE_VISIT.CANCEL_BUTTON_TEXT}
        closeAction={() => {
          setCloseModalShow(false);
        }}
        submitBtnText={MODAL_MESSAGES.CLOSE_VISIT.SUBMIT_BUTTON_TEXT}
        submitAction={() => {
          changeVisitStatus(
            {
              stage: VISIT_STATUS.CLOSED,
              reasonType: '',
              reason: '',
            },
            'Successfully Closed',
            () => {
              setCancelModalShow(false);
            },
          );
        }}
      />
    </>
  );
};

const StatusButtonContainer = ({
  setDeclinedModalShow,
  visitRes,
  setCancelModalShow,
  setAcceptModalShow,
  setCompleteModalShow,
  currentVisitId,
  setCloseModalShow,
  setIsFeedbackRemaining,
}) => {
  const dispatch = useDispatch();
  const getStatusButton = (stage) => {
    switch (stage) {
      case VISIT_STATUS.ACCEPT:
        return (
          <>
            <PermissionWrapper name={'UPDATE_VISIT_STAGE'}>
              <CustomButton
                variant="danger"
                onClick={() => setCancelModalShow(true)}
              >
                <span className="text-underline hide-mobile">Cancel Visit</span>
                <span className="text-underline show-mobile">
                  <MdOutlineCancel size="25" />
                </span>
              </CustomButton>{' '}
            </PermissionWrapper>
            <PermissionWrapper name={'UPDATE_VISIT_STAGE'}>
              <CustomButton
                variant="info"
                onClick={() => setCompleteModalShow(true)}
              >
                <span className="text-underline hide-mobile">
                  Complete Visit
                </span>
                <span className="text-underline show-mobile">
                  <IoCheckmarkDone size="25" />
                </span>
              </CustomButton>
            </PermissionWrapper>
          </>
        );
      case VISIT_STATUS.DECLINED:
        return (
          <CustomButton
            variant="danger"
            onClick={() => setDeclinedModalShow(true)}
          >
            <span className="hide-mobile">Visit</span> Declined{' '}
            <AiOutlineInfoCircle className="ms-2 cursor-pointer" size={20} />
          </CustomButton>
        );
      case VISIT_STATUS.CANCEL:
        return (
          <CustomButton
            variant="primary"
            onClick={() => setCancelModalShow(true)}
          >
            <span className="hide-mobile">Visit</span> Cancelled{' '}
            <AiOutlineInfoCircle className="ms-2 cursor-pointer" size={20} />
          </CustomButton>
        );
      case VISIT_STATUS.CLOSED:
        return (
          <CustomButton variant="danger">
            <span className="hide-mobile">Visit</span> Closed
            <AiOutlineInfoCircle className="ms-2 cursor-pointer" size={20} />
          </CustomButton>
        );
      case VISIT_STATUS.EXPIRED:
        return (
          <CustomButton variant="secondary">
            <span className="hide-mobile">Visit</span> Expired{' '}
            <AiOutlineInfoCircle className="ms-2 cursor-pointer" size={20} />
          </CustomButton>
        );
      case VISIT_STATUS.COMPLETED:
        return (
          <CustomButton
            variant="primary"
            onClick={() => {
              dispatch(
                checkFeedbackExistsAction(currentVisitId, (res) => {
                  setIsFeedbackRemaining(!res);
                  setCloseModalShow(true);
                }),
              );
            }}
          >
            <span className="text-underline">
              <span className="hide-mobile">Close Visit</span>
              <span className="show-mobile">
                <MdOutlineCancel size="25" />
              </span>
            </span>
          </CustomButton>
        );
    }
  };
  return (
    <div
      className="d-flex flex-row gap-2 ps-3 sticky-tab-closebtn"
      id="stickyTabCloseBtn"
    >
      {visitRes?.stage === VISIT_STATUS.PENDING && (
        <>
          <PermissionWrapper name={'UPDATE_VISIT_STAGE'}>
            <CustomButton
              variant="danger"
              onClick={() => setCancelModalShow(true)}
            >
              Cancel <span className="hide-mobile">Visit</span>
            </CustomButton>
            <CustomButton
              variant="danger"
              onClick={() => setDeclinedModalShow(true)}
            >
              Decline
            </CustomButton>
            <CustomButton
              variant="success"
              onClick={() => setAcceptModalShow(true)}
            >
              Accept
            </CustomButton>
          </PermissionWrapper>
        </>
      )}
      {getStatusButton(visitRes?.stage)}
    </div>
  );
};

const TabHeaderRenderer = ({
  tab,
  currentActiveTab,
  setCurrentActiveTab,
  checkDisabledTab,
  tabStatus,
  setShowHiddenMenu,
}) => {
  let classname = '';
  if (tabStatus && tabStatus[tab.key]) {
    classname = 'text-underline';
  }
  return (
    <>
      <button
        id={tab.id}
        key={tab.id}
        className={`${
          currentActiveTab === tab.id ? 'selected-tab text-white' : ''
        } ${classname}`}
        onClick={() => {
          setShowHiddenMenu(false);
          setCurrentActiveTab(tab.id);
        }}
        disabled={checkDisabledTab(tab)}
      >
        {tab.title}
      </button>
    </>
  );
};

export default TabContainer;
