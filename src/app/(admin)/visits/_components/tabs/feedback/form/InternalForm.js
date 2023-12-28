'use client';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import {
  addInternalFeedbackAction,
  getInternalFeedbackAction,
  deleteInternalFeedbackAction,
} from '@/redux/feedback/action.feedback';
import {
  MODAL_MESSAGES,
  TOAST_SUCCESS,
} from '@/utils/constants/default.constants';
import { toast } from 'react-toastify';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { MdCall } from 'react-icons/md';
import { PiEnvelopeSimpleLight } from 'react-icons/pi';
import CustomButton from '@/components/Button';
import TooltipIcon from '@/components/ToolTip';
import CustomModal from '../../../modals/CustomModal';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import moment from 'moment';

const InternalForm = ({ setShowModal, showModal }) => {
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const ClickToCallLink = ({ phoneNumber }) => {
    return <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>;
  };
  const ClickToEmailLink = ({ email }) => {
    return <a href={`mailto:${email}`}>{email}</a>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment) {
      dispatch(
        addInternalFeedbackAction(
          {
            visitId: searchParams.get('id'),
            feedbackData: { personnelFeedback: { text: comment } },
          },
          () => {
            toast.success(TOAST_SUCCESS.EXTERNAL_FEEDBACK_ADDED.MESSAGE, {
              toastId: TOAST_SUCCESS.EXTERNAL_FEEDBACK_ADDED.ID,
            });
            resetForm();
            getFeedback();
          },
        ),
      );
    }
  };

  const getFeedback = () => {
    dispatch(
      getInternalFeedbackAction(searchParams.get('id'), (res) => {
        setFeedbackList(res);
      }),
    );
  };

  const resetForm = () => {
    setComment('');
  };

  const handleDeleteFeedback = () => {
    dispatch(
      deleteInternalFeedbackAction(searchParams.get('id'), () => {
        setShowModal(false);
        getFeedback();
      }),
    );
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      getFeedback();
    }
  }, []);

  return (
    <div>
      <PermissionWrapper name={'ADD_VISIT_INTERNAL_FEEDBACK'}>
        <div className="feedback-internal">
          <div className="feedback-content">
            <div>Please Share Your Feedback</div>
            <textarea
              rows="5"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              className="w-100 border-gray h-75"
            ></textarea>
            <div className="d-flex gap-2 justify-content-end">
              <CustomButton onClick={handleSubmit} variant="success">
                Save
              </CustomButton>
              <CustomButton onClick={resetForm} variant="danger">
                Reset
              </CustomButton>
            </div>
          </div>
        </div>
      </PermissionWrapper>
      {feedbackList.map((element, key) => {
        return (
          <div className="feedback-internal" key={key}>
            <div className="internal-detail">
              <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="mobile-col d-flex justify-content-center align-items-center mobile-left gap-3 flex-wrap">
                  <div className="d-flex gap-2 align-items-center mr-10">
                    <p>
                      <strong>Name :</strong>
                    </p>
                    <p className="mr-3">
                      {element.personnel.firstName} {element.personnel.lastName}
                    </p>
                  </div>
                  <div className="d-flex gap-2 align-items-center mr-10">
                    <p>
                      <strong>
                        {' '}
                        <MdCall
                          size={15}
                          role="button"
                          className="text-gray mr-1"
                        />{' '}
                        Mobile :
                      </strong>
                    </p>
                    <ClickToCallLink
                      phoneNumber={element.personnel.phoneNumber}
                    />
                  </div>
                  <div className="d-flex gap-2 align-items-center mr-10">
                    <p>
                      <strong>
                        <PiEnvelopeSimpleLight
                          size={15}
                          role="button"
                          className="text-gray mr-1"
                        />{' '}
                        Email:
                      </strong>
                    </p>
                    <ClickToEmailLink email={element.personnel.email} />
                  </div>
                  <div className="d-flex gap-3 mr-10">
                    <p>
                      <strong>Date</strong>{' '}
                      {element?.personnelFeedback?.createdAt
                        ? moment
                            .utc(element?.personnelFeedback?.createdAt)
                            .local()
                            .format('MM-DD-YYYY HH:mm')
                        : '-'}
                    </p>
                  </div>
                </div>

                {/* trash  */}
                <PermissionWrapper name={'DELETE_VISIT_INTERNAL_FEEDBACK'}>
                  <div>
                    <div className="d-flex justify-self-end gap-3 mr-10 text-red">
                      <TooltipIcon
                        icon={
                          <BsFillTrash3Fill
                            size={20}
                            role="button"
                            onClick={() => setShowModal(true)}
                          />
                        }
                        text="Delete"
                      />
                    </div>
                  </div>
                </PermissionWrapper>
              </div>
            </div>
            <div className="feedback-content">
              <div className="w-100">
                <p>{element.personnelFeedback.text}</p>
              </div>
            </div>
          </div>
        );
      })}

      {showModal && (
        <CustomModal
          title={MODAL_MESSAGES.REMOVE_FEEDBACK.TITLE}
          showModal={showModal}
          content={MODAL_MESSAGES.REMOVE_FEEDBACK.CONTENT}
          cancelBtnText={MODAL_MESSAGES.REMOVE_FEEDBACK.CANCEL_BUTTON_TEXT}
          closeAction={() => {
            setShowModal(false);
          }}
          submitBtnText={MODAL_MESSAGES.REMOVE_FEEDBACK.SUBMIT_BUTTON_TEXT}
          submitAction={() => {
            handleDeleteFeedback();
          }}
        />
      )}
    </div>
  );
};

export default InternalForm;
