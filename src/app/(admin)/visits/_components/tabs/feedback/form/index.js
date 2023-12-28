'use client';
import { useState } from 'react';
import GuestForm from './GuestForm';
import InternalForm from './InternalForm';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';

const TabFeedback = () => {
  const [feedbackTab1, setFeedbackTab1] = useState(1);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="tabForm pb-3 container-fluid">
      <div className="d-flex flex-row border-bottom-gray justify-content-between">
        <div className="d-flex white-space-nowrap feedback-tab-buttons">
          {' '}
          <button
            onClick={() => setFeedbackTab1(1)}
            className={
              feedbackTab1 === 1
                ? 'bg-dark-gray text-light border-bottom-dark mb-0'
                : 'mb-0'
            }
          >
            Guest Feedback
          </button>
          <button
            onClick={() => setFeedbackTab1(2)}
            className={
              feedbackTab1 === 2
                ? 'bg-dark-gray text-light border-bottom-dark mb-0'
                : 'mb-0'
            }
          >
            Internal Feedback
          </button>
        </div>
        {/* {feedbackTab1 === 1 && (
          <div className="d-flex align-items-center gap-2">
            <div>
              Last feedback requested on <strong>06-06-2023 9:00 AM </strong>
            </div> 
            <TooltipIcon
              icon={
                textCopied ? (
                  <TiTick size={23} role="button" />
                ) : (
                  <MdOutlineContentCopy size={23} role="button" />
                )
              }
              text={textCopied ? 'Copied' : 'Copy'}
              onClick={() => {
                copyToClipboard(feedbackUrl);
                setTextCopied(true);
                toast.success(TOAST_SUCCESS.FEEDBACK_URL_COPIED.MESSAGE, {
                  toastId: TOAST_SUCCESS.FEEDBACK_URL_COPIED.ID,
                });
                setTimeout(() => {
                  setTextCopied(false);
                }, 2000);
              }}
            />
          </div>
        )} */}
      </div>
      {feedbackTab1 === 1 && (
        <PermissionWrapper name={'VIEW_VISIT_EXTERNAL_FEEDBACK'}>
          <GuestForm />
        </PermissionWrapper>
      )}
      {feedbackTab1 === 2 && (
        <PermissionWrapper name={'VIEW_VISIT_INTERNAL_FEEDBACK'}>
          <InternalForm setShowModal={setShowModal} showModal={showModal} />
        </PermissionWrapper>
      )}
    </div>
  );
};

export default TabFeedback;
