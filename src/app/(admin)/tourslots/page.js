'use client';
import {
  createTourSlotsAction,
  getTourSlotsAction,
} from '@/redux/tour-slots/action.tour-slots';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import GenerateSlotFormikForm from './_components/GenerateSlotFormikForm';
import moment from 'moment';
import { tourSlotState } from '@/redux/tour-slots/reducer.tour-slots';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import SlotGrid from './_components/SlotGrid';
import { TOUR_SLOT_INTERVAL } from '@/utils/constants/default.constants';
import { ERRORS } from '@/utils/constants/errors.constants';
import PageProgressIcon from '@/components/page-progress';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';

const initialValues = {
  startDate: moment().startOf('week').format('MM-DD-YYYY'),
  endDate: moment().endOf('week').format('MM-DD-YYYY'),
  guestPerSlot: '',
};

const validationSchema = Yup.object({
  startDate: Yup.string().required(ERRORS.REQUIRED),
  endDate: Yup.string().required(ERRORS.REQUIRED),
  guestPerSlot: Yup.number().max(999, ERRORS.MAX_999).required(ERRORS.REQUIRED),
});

const TourSlot = () => {
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [isSlotGenerateDisabled, setIsSlotGenerateDisabled] = useState(false);
  const [currentWeek, setCurrentWeek] = useState({
    startDate: initialValues.startDate,
    endDate: initialValues.endDate,
  });
  const [isPastWeek, setIsPastWeek] = useState(false);
  const dispatch = useDispatch();
  const { isTourSlotLoader, tourSlotData, timeInterval } =
    useSelector(tourSlotState);

  const callBackGetTourSlots = (res) => {
    if (res?.tourDaySlotModelList?.length) {
      setCurrentWeek({
        startDate: moment(res.startDateTime).format('MM-DD-YYYY'),
        endDate: moment(res.endDateTime).format('MM-DD-YYYY'),
      });
    } else {
      setSlotData([]);
      setTimeIntervals([]);
      setIsSlotGenerateDisabled(false);
    }
  };

  const getTourSlots = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = moment(startDate, 'MM-DD-YYYY').format('YYYY-MM-DD');
      const end = moment(endDate, 'MM-DD-YYYY').format('YYYY-MM-DD');
      dispatch(
        getTourSlotsAction(
          {
            startDateTime: `${start} 00:00:00`,
            endDateTime: `${end} 23:59:59`,
          },
          callBackGetTourSlots,
        ),
      );
    }
  };

  const submitHandler = (values) => {
    const start = moment(values.startDate, 'MM-DD-YYYY').format('YYYY-MM-DD');
    const end = moment(values.endDate, 'MM-DD-YYYY').format('YYYY-MM-DD');
    dispatch(
      createTourSlotsAction({
        startDateTime: `${start} 00:00:00`,
        endDateTime: `${end} 23:59:59`,
        maxGuestSize: values.guestPerSlot,
        slotInterval: TOUR_SLOT_INTERVAL,
      }),
    );
  };

  useEffect(() => {
    const isDisabledWeek = moment(currentWeek?.endDate).isBefore(moment());
    setIsPastWeek(isDisabledWeek);
  }, [currentWeek]);

  useEffect(() => {
    if (tourSlotData?.length && timeInterval?.length) {
      setIsSlotGenerateDisabled(true);
    } else {
      setIsSlotGenerateDisabled(false);
    }
    setSlotData(tourSlotData?.length ? tourSlotData : []);
    setTimeIntervals(timeInterval?.length ? timeInterval : []);
  }, [tourSlotData, timeInterval]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
        enableReinitialize
      >
        {({ touched, errors, setFieldValue, values, setFieldTouched }) => (
          <GenerateSlotFormikForm
            errors={errors}
            setFieldValue={setFieldValue}
            touched={touched}
            values={values}
            getTourSlots={getTourSlots}
            isSlotGenerateDisabled={isSlotGenerateDisabled}
            setCurrentWeek={setCurrentWeek}
            setFieldTouched={setFieldTouched}
            isPastWeek={isPastWeek}
          />
        )}
      </Formik>
      {isTourSlotLoader ? (
        <SpinnerLoader />
      ) : tourSlotData.length > 0 ? (
        <SlotGrid
          timeIntervals={timeIntervals}
          tourSlotData={tourSlotData}
          slotData={slotData}
          setSlotData={setSlotData}
          setTimeIntervals={setTimeIntervals}
          getTourSlots={getTourSlots}
          currentWeek={currentWeek}
        />
      ) : (
        <PageProgressIcon
          icon={DashboardProgressIcon}
          title="No Slots Available"
          description="No slot created for this particular date range"
          border={false}
        />
      )}
    </>
  );
};

export default TourSlot;
