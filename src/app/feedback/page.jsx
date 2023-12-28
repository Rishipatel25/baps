'use client';
import { useState, useEffect } from 'react';
import { checkObjectKey, lookupToObject } from '@/utils/helper.utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import {
  addPublicFeedbackAction,
  getPublicFeedbackAction,
  setLoading,
} from '@/redux/feedback/action.feedback';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TourFeedBack from './form/TourFeedBack';
import TourGuideFeedBack from './form/TourGuideFeedBack';
import PageProgressIcon from '@/components/page-progress';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import { feedbackState } from '@/redux/feedback/reducer.feedback';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { getAllMastersAction } from '@/redux/masters/action.masters';

const FeedBackPage = () => {
  const [step, setStep] = useState(1);
  const [comments, setComments] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [show, setShow] = useState(false);
  const [visitData, setVisitData] = useState({
    feedbackId: '',
    visitorName: '',
    requestNumber: '',
    totalVisitors: '',
    startDateTime: '',
  });
  const [tourFeedback, setTourFeedback] = useState([]);
  const [tourGuideFeedback, setTourGuideFeedback] = useState([]);
  const [isDone, setDone] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { isGetPublicFeedbackLoading } = useSelector(feedbackState);

  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handleClose = () => {
    setShow(false);
    router.back();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addPublicFeedbackAction(
        {
          feedbackId: visitData.feedbackId,
          feedbackData: {
            visitorComment: { data: tourFeedback, comment: comments },
            visitorRatings: { data: tourGuideFeedback },
          },
        },
        () => {
          toast.success(TOAST_SUCCESS.EXTERNAL_FEEDBACK_ADDED.MESSAGE, {
            toastId: TOAST_SUCCESS.EXTERNAL_FEEDBACK_ADDED.ID,
          });
          setShowFinishModal(true);
          setShow(true);
        },
      ),
    );
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  const handleCanelStep = () => {
    router.back();
  };
  const handleImageClick = (type, rating, index) => {
    if (isDone) {
      return;
    }
    const copyData =
      type === 'TOUR' ? [...tourFeedback] : [...tourGuideFeedback];
    if (copyData[index].select !== rating) {
      copyData[index].select = rating;
    } else {
      copyData[index].select = (copyData[index].select - 1).toString();
    }
    if (type === 'TOUR') {
      setTourFeedback(copyData);
    } else {
      setTourGuideFeedback(copyData);
    }
  };

  const getRatings = (key = '') => {
    try {
      if (!key) {
        return [];
      }
      let tgRatingLabels = lookupToObject(key);
      if (tgRatingLabels?.length) {
        tgRatingLabels = tgRatingLabels.map((res) => ({
          label: res.label,
          value: res.value,
          select: '',
        }));
        return tgRatingLabels;
      }
      dispatch(getAllMastersAction(), () => {
        tgRatingLabels = lookupToObject(key);
        if (tgRatingLabels?.length) {
          tgRatingLabels = tgRatingLabels.map((res) => ({
            label: res.label,
            value: res.value,
            select: '',
          }));
          return tgRatingLabels;
        }
        return [];
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Something went wrong while getting tourguide');
      return [];
    }
  };

  const getFeedBackApi = (feedbackID) => {
    if (feedbackID) {
      dispatch(
        getPublicFeedbackAction(feedbackID, (res) => {
          if (
            checkObjectKey(res?.visitorComment) ||
            checkObjectKey(res?.visitorRatings)
          ) {
            setDone(true);
          } else {
            setDone(false);
          }
          if (res.visitFeedbackId) {
            const visitorFeedback = [];
            const tourGuidFeedback = [];

            // Geeting visit general feedback
            if (res?.visitorComment?.data?.length) {
              res.visitorComment.data.map((res) => {
                const nType = {
                  label: res.label,
                  value: res.value,
                  select: res.select,
                };
                visitorFeedback.push(nType);
              });
            } else {
              const localGetTGRating = getRatings('VISIT_GENERAL_FEEDBACK');
              if (localGetTGRating?.length) {
                visitorFeedback.push(...localGetTGRating);
              }
            }

            // Geeting tour guide feedback
            if (res?.visitorRatings?.data?.length) {
              res.visitorRatings.data.map((res) => {
                const nType = {
                  label: res.label,
                  value: res.value,
                  select: res.select,
                };
                tourGuidFeedback.push(nType);
              });
            } else {
              const localGetTGRating = getRatings('TG_RATING');
              if (localGetTGRating?.length) {
                tourGuidFeedback.push(...localGetTGRating);
              }
            }

            // setting data
            setTourFeedback(visitorFeedback);
            setTourGuideFeedback(tourGuidFeedback);
            setComments(res?.visitorComment?.comment || '');
            if (res.visitBasicInfoModel) {
              const fullName = [
                res?.visitBasicInfoModel?.primaryVisitorModel?.firstName,
                res?.visitBasicInfoModel?.primaryVisitorModel?.lastName,
              ]
                .filter(Boolean)
                .join(' ');
              setVisitData({
                requestNumber: res?.visitBasicInfoModel?.requestNumber || '-',
                startDateTime: res?.visitBasicInfoModel?.startDateTime || '-',
                totalVisitors: res?.visitBasicInfoModel?.totalVisitors || '-',
                visitorName: fullName || '-',
                feedbackId: res.visitFeedbackId,
              });
            }
          } else {
            // eslint-disable-next-line no-console
            console.warn('FeedbackId not found');
          }
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(setLoading({ key: 'isGetPublicFeedbackLoading', value: true }));
    const feedbackID = searchParams.get('id');
    if (feedbackID) {
      // Setting values in local state
      setTourGuideFeedback(getRatings('TG_RATING') || []);
      setTourFeedback(getRatings('VISIT_GENERAL_FEEDBACK') || []);
      getFeedBackApi(feedbackID);
    }
  }, [searchParams]);

  if (!searchParams.get('id')) {
    return (
      <PageProgressIcon
        icon={DashboardProgressIcon}
        title="Unauthorized"
        description="Something went wrong please contact site admin."
      />
    );
  }

  if (isGetPublicFeedbackLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <TourFeedBack
            visitData={visitData}
            tourFeedback={tourFeedback}
            handleImageClick={handleImageClick}
            handleNextStep={handleNextStep}
            handleCanelStep={handleCanelStep}
          />
        )}

        {step === 2 && (
          <TourGuideFeedBack
            visitData={visitData}
            tourGuideFeedback={tourGuideFeedback}
            handleImageClick={handleImageClick}
            handleNextStep={handleNextStep}
            handleCanelStep={handleCanelStep}
            handleSubmit={handleSubmit}
            handlePrevStep={handlePrevStep}
            step={step}
            comments={comments}
            setComments={setComments}
            showFinishModal={showFinishModal}
            handleClose={handleClose}
            show={show}
            isDone={isDone}
          />
        )}
      </form>
    </>
  );
};

export default FeedBackPage;
