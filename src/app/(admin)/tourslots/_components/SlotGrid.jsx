'use client';

import CustomSelectDropdown from '@/components/form-group/custom-select/CustomSelectDropdown';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { getAvailablePersonnelAction } from '@/redux/personnel/action.personnel';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import {
  updateTourSlotsAction,
  updateTourSlotsStatusAction,
} from '@/redux/tour-slots/action.tour-slots';
import { tourSlotState } from '@/redux/tour-slots/reducer.tour-slots';
import { TOUR_SLOT_STATUS } from '@/utils/constants/default.constants';
import moment from 'moment';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';

const SlotGrid = ({
  timeIntervals,
  slotData,
  setSlotData,
  setTimeIntervals,
  getTourSlots,
  currentWeek,
}) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const toggleApiCall = (slotDateAndTime, cb) => {
    dispatch(
      updateTourSlotsAction(slotDateAndTime, () => {
        getTourSlots(currentWeek.startDate, currentWeek.endDate);
        cb && cb();
      }),
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      const header = document.querySelector('.header');
      const TourFilter = document.querySelector('.TourFilter');
      const slotsContainerHeight =
        window.innerHeight -
        (header.offsetHeight + TourFilter.offsetHeight + 20);
      containerRef.current.style.height = `${slotsContainerHeight}px`;
    }
  }, [slotData]);

  return (
    slotData?.length > 0 &&
    timeIntervals?.length > 0 && (
      <>
        <div className="app-container slotsContainer" ref={containerRef}>
          <div className="d-flex">
            <div className="leftColumn w-100">
              <div className="headerStyle">Slot</div>
              {timeIntervals.map((item, idx) => (
                <TimeComponent
                  item={item}
                  key={idx}
                  toggleApiCall={toggleApiCall}
                  currentWeek={currentWeek}
                />
              ))}
            </div>

            {slotData?.length > 0 &&
              slotData.map((day, idx) => {
                return (
                  <DateComponent
                    day={day}
                    key={idx}
                    setSlotData={setSlotData}
                    slotData={slotData}
                    setTimeIntervals={setTimeIntervals}
                    timeIntervals={timeIntervals}
                    toggleApiCall={toggleApiCall}
                  />
                );
              })}
          </div>
        </div>
      </>
    )
  );
};

const TimeComponent = ({ item, toggleApiCall, currentWeek }) => {
  const [isCheck, setIsCheck] = useState(true);
  const [isDisabled, setIsDisabled] = useState(item.isDisabled || false);
  const [isDisabledPermission, setDisablePermission] = useState(false);
  const showTime = item.time.start;
  const { isTourSlotCardLoader } = useSelector(tourSlotState);

  useEffect(() => {
    setIsCheck(item.isActive);
  }, [item.isActive]);

  useEffect(() => {
    setIsDisabled(item.isDisabled);
  }, [item.isDisabled]);

  return (
    <div className="cardStyle">
      <div>{showTime}</div>
      <div className="form-check form-switch">
        <PermissionWrapper
          name={'UPDATE_TOUR_SLOT'}
          mode="2"
          callback={(event) => {
            setDisablePermission(!event);
          }}
        >
          <input
            className="form-check-input"
            type="checkbox"
            checked={isCheck}
            id="flexSwitchCheckDefault"
            onChange={() => {
              if (
                !isTourSlotCardLoader &&
                currentWeek.startDate &&
                currentWeek.endDate &&
                item?.time?.start &&
                item?.time?.end
              ) {
                const req = {
                  stage: isCheck ? 'INACTIVE' : 'ACTIVE',
                  startDate: moment(currentWeek.startDate, 'MM-DD-YYYY').format(
                    'YYYY-MM-DD',
                  ),
                  endDate: moment(currentWeek.endDate, 'MM-DD-YYYY').format(
                    'YYYY-MM-DD',
                  ),
                  startTime: moment(item.time.start, 'hh:mm A').format(
                    'HH:mm:ss',
                  ),
                  endTime: moment(item.time.end, 'hh:mm A').format('HH:mm:ss'),
                };
                toggleApiCall(req, () => {
                  setIsCheck(!isCheck);
                });
              }
            }}
            disabled={
              isDisabled || isDisabledPermission || item?.isDisabledWeek
            }
          />
        </PermissionWrapper>
      </div>
    </div>
  );
};

const DateComponent = ({
  day,
  setSlotData,
  slotData,
  setTimeIntervals,
  timeIntervals,
  toggleApiCall,
}) => {
  const [isCheck, setIsCheck] = useState(true);
  const [isDisabledTime, setIsDisabledTime] = useState(day.isDisabled || false);
  const [isDisabledPermission, setDisablePermission] = useState(false);
  const showDate = moment(day.tourSlotDate).format('ddd , MMM DD');
  const { isTourSlotCardLoader } = useSelector(tourSlotState);

  useEffect(() => {
    setIsCheck(day.isActive);
  }, [day.isActive]);

  useEffect(() => {
    setIsDisabledTime(day.isDisabled);
  }, [day.isDisabled]);

  return (
    <div className="w-100">
      <div className="headerStyle">
        {showDate}
        <div className="form-check form-switch">
          <PermissionWrapper
            name={'UPDATE_TOUR_SLOT'}
            mode="2"
            callback={(event) => {
              setDisablePermission(!event);
            }}
          >
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={isCheck}
              onChange={() => {
                if (!isTourSlotCardLoader) {
                  const startTime = moment(
                    timeIntervals.at(0).time.start,
                    'hh:mm A',
                  ).format('HH:mm:ss');
                  const endTime = moment(
                    timeIntervals.at(-1).time.end,
                    'hh:mm A',
                  ).format('HH:mm:ss');
                  const req = {
                    stage: isCheck ? 'INACTIVE' : 'ACTIVE',
                    startDate: day.tourSlotDate,
                    endDate: day.tourSlotDate,
                    startTime: startTime,
                    endTime: endTime,
                  };
                  toggleApiCall(req, () => {
                    setIsCheck(!isCheck);
                  });
                }
              }}
              disabled={
                isDisabledTime || isDisabledPermission || day?.isPastDate
              }
            />
          </PermissionWrapper>
        </div>
      </div>
      {day?.tourSlotModelList?.length &&
        day.tourSlotModelList.map((card, idx) => {
          const disable = card?.bookedGuestSize > 0;
          const isPastTime = moment(card.startDateTime).isBefore(moment());
          return (
            <CardComponent
              key={idx}
              data={card}
              setSlotData={setSlotData}
              slotData={slotData}
              timeIntervals={timeIntervals}
              setTimeIntervals={setTimeIntervals}
              isDisabled={disable}
              isPastTime={isPastTime}
            />
          );
        })}
    </div>
  );
};

const CardComponent = ({
  data,
  slotData,
  setSlotData,
  setTimeIntervals,
  timeIntervals,
  isDisabled,
  isPastTime,
}) => {
  const [showSelect, setShowSelect] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [maxGuestCount, setMaxGuestCount] = useState(0);
  const [stage, setStage] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [currentPerson, setCurrentPerson] = useState({});
  const [personnelOptions, setPersonnelOptions] = useState([]);
  const [isDisabledPermission, setDisablePermission] = useState(false);
  const dispatch = useDispatch();
  const { isAvailableLoader } = useSelector(personnelState);
  const showTime = moment(data.startDateTime).format('hh:mm A');
  const guestInputRef = useRef(null);

  const UPDATE_TYPES = {
    STATUS: 'status',
    GUEST_COUNT: 'no_of_guest',
    PERSONNEL: 'personnel',
  };

  /**
   * If inactive then card color will be white
   * If person is unassigned then yellow
   * If person is assigned then active
   * If slot has booking then (green color)
   */
  function getCardClassName() {
    if (isPastTime) {
      return 'disabled';
    } else if (!stage) {
      return '';
    } else if (!currentPerson?.label && !currentPerson?.value) {
      return 'warn';
    } else if (data?.bookedGuestSize > 0) {
      return 'primary';
    } else if (stage && currentPerson?.label && currentPerson?.value) {
      return 'active';
    }
    return '';
  }

  const updateTourSlot = async (
    { stage, maxGuestSize, tourGuidePersonnelBasicInfoModel },
    type,
    cb,
  ) => {
    setIsCardLoading(true);
    const tourData = { ...data };
    if (UPDATE_TYPES.STATUS === type) {
      tourData.stage = stage;
    }
    if (UPDATE_TYPES.GUEST_COUNT === type) {
      tourData.maxGuestSize = maxGuestSize;
    }
    if (UPDATE_TYPES.PERSONNEL === type) {
      tourData.tourGuidePersonnelBasicInfoModel =
        tourGuidePersonnelBasicInfoModel || null;
    }
    try {
      await dispatch(
        updateTourSlotsStatusAction(
          {
            tourSlotId: data.tourSlotId,
            data: { ...tourData },
          },
          cb,
        ),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('ERROR in update tour', error);
    } finally {
      setIsCardLoading(false);
    }
  };

  const changeStatus = (status) => {
    const newStatus = status ? 'ACTIVE' : 'INACTIVE';
    updateTourSlot({ stage: newStatus }, UPDATE_TYPES.STATUS, () => {
      const updatedData = slotData.map((entry) => {
        let isActive = false;
        let isDisabled = false;
        let updatedTourSlotModelList = [];
        if (entry?.tourSlotModelList?.length) {
          updatedTourSlotModelList = entry.tourSlotModelList.map(
            (tourPerDay) => {
              let status = tourPerDay.stage;
              if (tourPerDay.tourSlotId === data.tourSlotId) {
                status = newStatus;
              }
              const cardActive = [
                TOUR_SLOT_STATUS.ACTIVE,
                TOUR_SLOT_STATUS.PARTIALLY,
                TOUR_SLOT_STATUS.BOOKED,
              ].includes(status);

              if (cardActive) {
                isActive = true;
              }
              if (tourPerDay.bookedGuestSize > 0) {
                isDisabled = true;
              }
              return { ...tourPerDay, stage: status };
            },
          );
        }
        return {
          ...entry,
          isActive,
          isDisabled,
          tourSlotModelList: updatedTourSlotModelList,
        };
      });
      const newTimeArray = timeIntervals.map((item, index) => {
        const formattedTime = item.time;
        let isActive = false;
        const isDisabled = updatedData.some((day) => {
          const cardActive = [
            TOUR_SLOT_STATUS.ACTIVE,
            TOUR_SLOT_STATUS.PARTIALLY,
            TOUR_SLOT_STATUS.BOOKED,
          ].includes(day.tourSlotModelList[index].stage);
          if (cardActive) {
            isActive = true;
          }
          return day.tourSlotModelList[index]?.bookedGuestSize > 0;
        });
        return { time: formattedTime, isDisabled, isActive };
      });
      setTimeIntervals(newTimeArray);
      setSlotData(updatedData);
      setStage(status);
    });
  };

  const changePersonnel = (e) => {
    updateTourSlot(
      { tourGuidePersonnelBasicInfoModel: e?.data || null },
      UPDATE_TYPES.PERSONNEL,
      () => {
        setCurrentPerson(e || '');
        if (e?.data) {
          setShowSelect(false);
        }
      },
    );
  };

  useEffect(() => {
    if (showInput) {
      if (guestInputRef.current) {
        guestInputRef.current.focus();
      }
    }
  }, [showInput]);

  useEffect(() => {
    if (showSelect) {
      dispatch(
        getAvailablePersonnelAction(
          {
            startDateTime: moment(data.startDateTime).format(
              'YYYY-MM-DD hh:mm A',
            ),
            endDateTime: moment(data.startDateTime).format(
              'YYYY-MM-DD hh:mm A',
            ),
          },
          ({ options }) => {
            setPersonnelOptions(options);
          },
        ),
      );
    }
  }, [showSelect]);

  useEffect(() => {
    setStage(
      [
        TOUR_SLOT_STATUS.ACTIVE,
        TOUR_SLOT_STATUS.PARTIALLY,
        TOUR_SLOT_STATUS.BOOKED,
      ].includes(data.stage),
    );
    setMaxGuestCount(data.maxGuestSize || 0);
    if (
      data?.tourGuidePersonnelBasicInfoModel?.personnelId &&
      data?.tourGuidePersonnelBasicInfoModel?.firstName
    ) {
      setCurrentPerson({
        label:
          data.tourGuidePersonnelBasicInfoModel.firstName +
            ' ' +
            data.tourGuidePersonnelBasicInfoModel?.lastName || '',
        value: data.tourGuidePersonnelBasicInfoModel.personnelId,
        data: data.tourGuidePersonnelBasicInfoModel,
      });
    } else {
      setCurrentPerson('');
    }
  }, [data]);

  return (
    <div className={`cardStyle ${getCardClassName()} `}>
      {isCardLoading ? (
        <div className="cardloading">
          <SpinnerLoader variant="primary" />
        </div>
      ) : (
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="form-check text-muted">
              <PermissionWrapper
                name={'UPDATE_TOUR_SLOT'}
                mode="2"
                callback={(event) => {
                  setDisablePermission(!event);
                }}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={stage}
                  onChange={(e) => {
                    changeStatus(e.target.checked);
                  }}
                  disabled={isDisabled || isDisabledPermission || isPastTime}
                  id="flexCheckDefault"
                />
              </PermissionWrapper>
              {showTime}
            </div>
            {showInput ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isPastTime) {
                    updateTourSlot(
                      { maxGuestSize: maxGuestCount },
                      UPDATE_TYPES.GUEST_COUNT,
                      () => {
                        setShowInput(false);
                      },
                    );
                  }
                }}
              >
                <input
                  ref={guestInputRef}
                  type="number"
                  step={1}
                  max={999}
                  min={data?.bookedGuestSize || 1}
                  className="form-control form-control-sm grid-input-number"
                  value={maxGuestCount}
                  onBlur={() => {
                    setMaxGuestCount(data?.maxGuestSize || 0);
                    setShowInput(false);
                  }}
                  onChange={(e) => {
                    let value = e.target.value || '';
                    if (value) value = Math.floor(value);
                    setMaxGuestCount(value);
                  }}
                  required
                  disabled={isPastTime}
                />
              </form>
            ) : (
              <span
                className="font-bold-500 maxGuestCount"
                onClick={() => {
                  !isDisabledPermission && !isPastTime && setShowInput(true);
                }}
              >
                {data?.bookedGuestSize || 0}/{maxGuestCount || 0}
              </span>
            )}
          </div>
          {showSelect ? (
            <CustomSelectDropdown
              options={personnelOptions}
              className="form-select-sm"
              onChange={changePersonnel}
              value={currentPerson}
              isClearable={true}
              onBlur={() => {
                setShowSelect(false);
              }}
              placeholder="Select Personnel"
              isLoading={isAvailableLoader}
              searchKey={['email', 'phoneNumber', 'firstName', 'lastName']}
            />
          ) : stage ? (
            <PermissionWrapper
              name={'UPDATE_TOUR_SLOT'}
              mode="2"
              callback={(event) => {
                setDisablePermission(!event);
              }}
            >
              <span
                className="float-start font-bold-500 unassigned-text"
                onClick={() => {
                  if (!isDisabledPermission && !isPastTime) {
                    setPersonnelOptions([]);
                    setShowSelect(true);
                  }
                }}
              >
                {currentPerson?.label && currentPerson?.value
                  ? currentPerson.label
                  : 'Unassigned'}
              </span>
            </PermissionWrapper>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SlotGrid;
