import CustomButton from '@/components/Button';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { MdStar, MdStarOutline } from 'react-icons/md';

const successFeedback = require('@/assets/images/svg/Frame.svg');

const TourGuideFeedBack = ({
  visitData,
  tourGuideFeedback,
  handleImageClick,
  handlePrevStep,
  handleCanelStep,
  show,
  handleSubmit,
  showFinishModal,
  handleClose,
  feedback,
  setFeedback,
  isDone,
}) => {
  return (
    <>
      <div className="d-flex justify-content-center flex-column align-items-center mt-5 mx-auto max-w-800">
        <div className="tour-feedback">
          <div className="tour-details">
            <div className="d-flex justify-content-between px-3 py-2 mobile_flex_wrap">
              <div className="mt-2">
                <div className="font-normal text-dark">REFERENCE</div>
                <div className="text-dark-thin">{visitData.requestNumber}</div>
              </div>
              <div className="mt-2 mobile_text_right">
                <div className="font-normal text-dark">VISITOR NAME</div>
                <div className="text-dark-thin text-camel-case">
                  {visitData.visitorName}
                </div>
              </div>
              <div className="mt-2">
                <div className="font-normal text-dark">#Guest</div>
                <div className="text-dark-thin">{visitData.totalVisitors}</div>
              </div>
              <div className="mt-2 mobile_text_right">
                <div className="font-normal text-dark">VISIT DATE & TIME</div>
                <div className="text-dark-thin">
                  {moment(visitData.startDateTime).format('MM/DD/YYYY HH:mm A')}
                </div>
              </div>
            </div>
          </div>

          <div className="w-75 mx-auto text-center mt-3">
            <p className="font-bold">Your tour guide was...</p>
            <p className="text-secondary">
              Please slide the number to share your experience with us.
            </p>
            <hr className="w-50 mx-auto" />
          </div>
          <div className="p-4">
            <div className="feedback-table mobile_flex_col">
              {tourGuideFeedback.map((item, key) => (
                <div className="feedback-row" key={key}>
                  <div className="feedback-title">{item.label}</div>
                  <div className="d-flex flex-grow-1 justify-content-between">
                    <div
                      onClick={() => handleImageClick('TOUR_GUIDE', '1', key)}
                    >
                      {item.select < '1' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div
                      onClick={() => handleImageClick('TOUR_GUIDE', '2', key)}
                    >
                      {item.select < '2' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div
                      onClick={() => handleImageClick('TOUR_GUIDE', '3', key)}
                    >
                      {item.select < '3' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div
                      onClick={() => handleImageClick('TOUR_GUIDE', '4', key)}
                    >
                      {item.select < '4' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div
                      onClick={() => handleImageClick('TOUR_GUIDE', '5', key)}
                    >
                      {item.select < '5' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3">
                <h6>Additional Comments</h6>
                <textarea
                  className="w-100 mt-2 border-gray"
                  cols="5"
                  placeholder="Enter your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  disabled={isDone}
                  required
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="feedback-button-guide">
          <CustomButton
            variant="primary"
            type="button"
            onClick={handlePrevStep}
          >
            Previous
          </CustomButton>
          <div className="d-flex gap-2">
            {!isDone && (
              <CustomButton
                variant="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </CustomButton>
            )}
            <CustomButton
              variant="outline-secondary"
              type="button"
              onClick={handleCanelStep}
            >
              Cancel
            </CustomButton>
          </div>
        </div>
        {showFinishModal && (
          <div className="modal show modal-show d-block">
            <Modal
              show={show}
              onHide={handleClose}
              className="feedback-modal"
              centered
            >
              <Modal.Header closeButton>
                <div>
                  <Image
                    src={successFeedback}
                    className="mx-auto w-100"
                    height="40"
                    alt="logo"
                  />
                </div>
                <Modal.Title>Feedback submitted successfully!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Thank You for Your Feedback on Your Visit to BAPS Akshardham
                Temple
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                  close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default TourGuideFeedBack;
