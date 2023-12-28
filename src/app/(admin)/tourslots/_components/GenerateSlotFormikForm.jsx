/* eslint-disable no-console */
'use client';

import CustomButton from '@/components/Button';
import { Form } from 'formik';
import { useEffect, useState } from 'react';
import FormikController from '@/components/form-group/formik-controllers';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTourSlotData,
  setTourTimingIntervals,
} from '@/redux/tour-slots/action.tour-slots';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import ReactDatePicker from 'react-datepicker';
import { CiCalendarDate } from 'react-icons/ci';
import { tourSlotState } from '@/redux/tour-slots/reducer.tour-slots';
import infoIcon from '@/assets/images/svg/info-icon-svgrepo-com.svg';
import Image from 'next/image';

const GenerateSlotFormikForm = ({
  errors,
  touched,
  setFieldValue,
  setFieldError,
  values,
  getTourSlots,
  isSlotGenerateDisabled,
  setCurrentWeek,
  setFieldTouched,
  isPastWeek,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const dispatch = useDispatch();
  const { isTourSlotLoader } = useSelector(tourSlotState);
  const TOOL_TIP_INFO = [
    { bgColor: '', label: 'Inactive slot' },
    { bgColor: 'grey', label: 'Slot expired' },
    { bgColor: 'yellow', label: 'Assign T.G.' },
    { bgColor: 'light_blue', label: 'No bookings yet' },
    { bgColor: 'primary', label: 'Active slots with bookings' },
  ];

  const resetSlots = () => {
    dispatch(setTourSlotData([]));
    dispatch(setTourTimingIntervals([]));
  };

  const handlePrevWeekClick = () => {
    const newStartDate = moment(values.startDate, 'MM-DD-YYYY')
      .subtract(7, 'days')
      .format('MM-DD-YYYY');
    const newEndDate = moment(values.endDate, 'MM-DD-YYYY')
      .subtract(7, 'days')
      .format('MM-DD-YYYY');
    setFieldValue('startDate', newStartDate);
    setFieldValue('endDate', newEndDate);
    setFieldValue('guestPerSlot', '');
    setFieldTouched('guestPerSlot', false);
    resetSlots();
    setCurrentWeek({ startDate: newStartDate, endDate: newEndDate });
  };

  const handleNextWeekClick = () => {
    const newStartDate = moment(values.startDate, 'MM-DD-YYYY')
      .add(7, 'days')
      .format('MM-DD-YYYY');
    const newEndDate = moment(values.endDate, 'MM-DD-YYYY')
      .add(7, 'days')
      .format('MM-DD-YYYY');
    setFieldValue('startDate', newStartDate);
    setFieldValue('endDate', newEndDate);
    setFieldValue('guestPerSlot', '');
    setFieldTouched('guestPerSlot', false);
    resetSlots();
    setCurrentWeek({ startDate: newStartDate, endDate: newEndDate });
  };

  useEffect(() => {
    if (values?.startDate && values?.endDate) {
      getTourSlots(values.startDate, values.endDate);
    }
  }, [values?.startDate, values?.endDate]);

  return (
    <Form className="TourFilter">
      <div className="page-header-container app-container position-relative">
        <div className="d-flex justify-content-between align-items-baseline  pt-2 mobile-col tab-col-670">
          <div>
            <b className="tourSlotTitle">Tour Slot</b>
          </div>
          <div className="d-flex justify-content-between align-items-center gap-2 mb-2  mobile-col mobile-no-gap mobileFull">
            <div className="tourFilterCal d-flex   gap-2 mr-1">
              <div className="position-relative calIcon mt-3">
                <div
                  role="button"
                  onClick={() => {
                    setIsCalenderOpen(!isCalenderOpen);
                  }}
                >
                  <CiCalendarDate size={40} />
                </div>
                {isCalenderOpen && (
                  <>
                    <div
                      className="backDrop calendar"
                      onClick={() => {
                        setIsCalenderOpen(!isCalenderOpen);
                      }}
                    />
                    <div className="tourslotdatepicker position-absolute">
                      <ReactDatePicker
                        selected={selectedDate}
                        className="hidecalendar"
                        onChange={(e) => {
                          setIsCalenderOpen(false);
                          setSelectedDate(e);
                          const start = moment(e)
                            .startOf('week')
                            .format('MM-DD-YYYY');
                          const end = moment(e)
                            .endOf('week')
                            .format('MM-DD-YYYY');
                          setFieldValue('startDate', start);
                          setFieldValue('endDate', end);
                          setFieldValue('guestPerSlot', '');
                          setFieldTouched('guestPerSlot', false);
                          resetSlots();
                          setCurrentWeek({ startDate: start, endDate: end });
                        }}
                        inline
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="mb-0">Slot Dates</label>
                <div className="dateSliderContainer d-flex justify-content-between align-items-center mb-2">
                  <button
                    onClick={handlePrevWeekClick}
                    type="button"
                    className="prev"
                  >
                    Prev{' '}
                  </button>
                  <div className="datePlaceholder">{values.startDate}</div>
                  <div>to</div>
                  <div className="datePlaceholder">{values.endDate}</div>
                  <button
                    onClick={handleNextWeekClick}
                    type="button"
                    className="next"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-start align-items-center gap-2 mb-2 mobile-center mobileFull">
              <div className="guestPerSlotContainer">
                <FormikController
                  control="number"
                  type="number"
                  label="Guest Per Slot"
                  name="guestPerSlot"
                  placeholder="0"
                  required={true}
                  errors={errors.guestPerSlot}
                  touched={touched.guestPerSlot}
                  onlyInteger={true}
                  disabled={
                    isSlotGenerateDisabled || isTourSlotLoader || isPastWeek
                  }
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  value={values.guestPerSlot}
                  setFieldTouched={setFieldTouched}
                />
              </div>
              <PermissionWrapper name={'CREATE_TOUR_SLOT'}>
                <div>
                  <label className="mb-1">&nbsp;</label>
                  <CustomButton
                    variant="primary"
                    type="submit"
                    disabled={
                      isSlotGenerateDisabled || isTourSlotLoader || isPastWeek
                    }
                  >
                    Generate
                  </CustomButton>
                </div>
              </PermissionWrapper>
            </div>
          </div>
        </div>
        <div className="relative info_box cursor-pointer">
          <Image
            src={infoIcon}
            className="info-icon"
            alt="Info icon"
            width={20}
          />
          <span className="info-text position-absolute left-4 border border-1 border-solid border-grey-300 bg-white p-2 rounded-4 z-10">
            {TOOL_TIP_INFO.map((item, idx) => {
              return (
                <div
                  className="d-flex gap-2 justify-center items-center"
                  key={idx}
                >
                  <span className={`info_color ${item.bgColor}`} />
                  {item?.label || '-'}
                </div>
              );
            })}
          </span>
        </div>
      </div>
    </Form>
  );
};
export default GenerateSlotFormikForm;
