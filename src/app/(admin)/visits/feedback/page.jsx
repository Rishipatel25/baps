'use client';
import { useState, useEffect } from 'react';
import { lookupToObject } from '@/utils/helper.utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import {
  addExternalFeedbackAction,
  getExternalFeedbackAction,
} from '@/redux/feedback/action.feedback';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TourFeedBack from './form/TourFeedBack';
import TourGuideFeedBack from './form/TourGuideFeedBack';
import logo from '@/assets/images/svg/feedback-logo.svg';
import Image from 'next/image';

const FeedBackPage = () => {
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [show, setShow] = useState(false);
  const [visitData, setVisitData] = useState({
    visitId: '',
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
      addExternalFeedbackAction(
        {
          visitId: visitData.visitId,
          feedbackData: {
            visitorComment: { data: tourFeedback, comment: feedback },
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

  useEffect(() => {
    const json = lookupToObject('VISIT_GENERAL_FEEDBACK');
    const array = [];
    json.map((res) => {
      const nType = {
        label: res.label,
        value: res.value,
        select: '',
      };
      array.push(nType);
    });
    setTourFeedback(array);
  }, []);

  useEffect(() => {
    const json = lookupToObject('TG_RATING');
    const array = [];
    json.map((res) => {
      const nType = {
        label: res.label,
        value: res.value,
        select: '',
      };
      array.push(nType);
    });
    setTourGuideFeedback(array);
  }, []);

  useEffect(() => {
    if (visitData.visitId) {
      dispatch(
        getExternalFeedbackAction(visitData.visitId, (res) => {
          if (res.visitFeedbackId) {
            setDone(true);
            if (res.visitorComment) {
              const array = [];
              res.visitorComment.data.map((res) => {
                const nType = {
                  label: res.label,
                  value: res.value,
                  select: res.select,
                };
                array.push(nType);
              });
              setTourFeedback(array);
              setFeedback(res.visitorComment.comment);
            }
            if (res.visitorRatings) {
              const array = [];
              res.visitorRatings.data.map((res) => {
                const nType = {
                  label: res.label,
                  value: res.value,
                  select: res.select,
                };
                array.push(nType);
              });
              setTourGuideFeedback(array);
            }
          }
        }),
      );
    }
  }, [visitData.visitId]);

  useEffect(() => {
    setVisitData((prevState) => ({
      ...prevState,
      visitId: searchParams.get('visitId'),
      visitorName: searchParams.get('visitorName'),
      requestNumber: searchParams.get('requestNumber'),
      totalVisitors: searchParams.get('totalVisitors'),
      startDateTime: searchParams.get('startDateTime'),
    }));
  }, [searchParams]);

  return (
    <>
      <div className="bg-primary text-white pt-3 pb-3 d-flex align-items-center">
        <Image src={logo} width="100" height="50" alt="logo" />

        {/* <Image src={darkLogo} width="100" height="50" alt="logo" /> */}

        <h5>Feedback</h5>
      </div>

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
            feedback={feedback}
            setFeedback={setFeedback}
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
