'use client';
import { RxCross1 } from 'react-icons/rx';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { BiExitFullscreen } from 'react-icons/bi';
import TabContainer from './TabContainer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getVisitFormByIdAction,
  saveCreateVisitFormData,
  savePrimaryGuestFormData,
  saveSecondaryGuestFormData,
} from '@/redux/visits/action.visits';
import { visitState } from '@/redux/visits/reducer.visits';
import moment from 'moment/moment';
import { getAllPersonnelAction } from '@/redux/personnel/action.personnel';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';

const Slider = ({
  sliderShow,
  handleClose,
  currentVisitId,
  getVisitListApi,
  addVisitApiCall,
}) => {
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);

  const dispatch = useDispatch();
  const {
    isGetByIdLoader,
    visitFormData,
    currentVisitRes: { visitRes },
  } = useSelector(visitState);
  /**
   * This Function is used to store data in state
   * @param {Number} currentFormNumber - currentFormNumber is tab sequence number like visit tab has 1.
   * @param {Object} values - values is form values.
   * @param {Boolean} formProperties - formProperties is to check wheather form is dirty or invalid.
   */
  const saveFormsDataLocally = ({
    currentFormNumber,
    values,
    formProperties,
  }) => {
    if (formProperties && !formProperties.isValid && formProperties.dirty) {
      setHasError(true);
    }
    switch (currentFormNumber) {
      case 1:
        return dispatch(saveCreateVisitFormData(values));
      case 2:
        return dispatch(savePrimaryGuestFormData(values));
      case 3:
        return dispatch(saveSecondaryGuestFormData(values));
      default:
        break;
    }
  };

  const setFormDataByIdCallBack = (response) => {
    setTitle(response?.requestNumber || 'Something went wrong');
  };

  const getVisitById = () => {
    dispatch(getVisitFormByIdAction(currentVisitId, setFormDataByIdCallBack));
  };

  function isSafari() {
    return (navigator.vendor.match(/apple/i) || '').length > 0;
  }

  useEffect(() => {
    const sliderForm = document.querySelector('.sliderContainer');
    if (fullScreen) {
      sliderForm.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreen]);
  useEffect(() => {
    if (sliderShow) {
      setAcceptModalShow(false);
      dispatch(getAllPersonnelAction());
      if (!currentVisitId) setHasError(true);
    }
  }, [sliderShow]);
  useEffect(() => {
    if (currentVisitId) {
      dispatch(getVisitFormByIdAction(currentVisitId, setFormDataByIdCallBack));
    }
  }, [currentVisitId]);
  return (
    <div className={`sliderHolder ${sliderShow ? 'open ' : ''}`}>
      {sliderShow && (
        <>
          <div className="backDrop" onClick={handleClose} />
          <div className="sliderContainer">
            {isGetByIdLoader ? (
              <SpinnerLoader />
            ) : (
              <>
                <div className="title w-100">
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <h5 className="m-0">
                      {currentVisitId ? (
                        <div className="print_schedule_title">
                          <strong>Visit</strong>{' '}
                          <span className="visitNo">#{title}</span>
                          {visitRes?.dateOfVisit && (
                            <span className="slider-sub-title">
                              (
                              {moment(
                                visitRes.dateOfVisit,
                                'YYYY-MM-DD',
                              ).format('MM-DD-YYYY')}
                              &nbsp;&nbsp;
                              {visitRes?.startDateTime}
                              &nbsp;-&nbsp;
                              {visitRes?.endDateTime})
                            </span>
                          )}
                        </div>
                      ) : (
                        'Add Visit'
                      )}
                    </h5>
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
                      <div role="button" onClick={handleClose} className="p-1">
                        <RxCross1 />
                      </div>
                    </div>
                  </div>
                </div>
                <TabContainer
                  currentVisitId={currentVisitId}
                  // title={title}
                  addVisitApiCall={addVisitApiCall}
                  handleClose={handleClose}
                  getVisitListApi={getVisitListApi}
                  hasError={hasError}
                  setHasError={setHasError}
                  saveFormsDataLocally={saveFormsDataLocally}
                  visitFormData={visitFormData}
                  isGetByIdLoader={isGetByIdLoader}
                  acceptModalShow={acceptModalShow}
                  setAcceptModalShow={setAcceptModalShow}
                  getVisitById={getVisitById}
                />
                {/* </Offcanvas.Body> */}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;
