import CustomButton from '@/components/Button';
import { MdStar, MdStarOutline } from 'react-icons/md';
import moment from 'moment';

const TourFeedback = ({
  handleNextStep,
  handleCanelStep,
  visitData,
  tourFeedback,
  handleImageClick,
}) => {
  return (
    <>
      <div className="d-flex justify-content-center flex-column align-items-center mt-5 mx-auto max-w-800">
        <h6 className="mb-2">
          <strong>Thank You for Visiting BAPS Akshardham Temple</strong>
        </h6>

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
            <p className="font-bold">Tour Feedback</p>
            <p className="text-secondary">
              Please slide the number to share your experience with us.
            </p>
            <hr className="w-50 mx-auto" />
          </div>
          <div className="p-4">
            <div className="feedback-table mobile_flex_col">
              {tourFeedback.map((item, key) => (
                <div className="feedback-row" key={key}>
                  <div className="feedback-title">{item.label}</div>
                  <div className="d-flex flex-grow-1 justify-content-between">
                    <div onClick={() => handleImageClick('TOUR', '1', key)}>
                      {item.select < '1' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div onClick={() => handleImageClick('TOUR', '2', key)}>
                      {item.select < '2' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div onClick={() => handleImageClick('TOUR', '3', key)}>
                      {item.select < '3' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div onClick={() => handleImageClick('TOUR', '4', key)}>
                      {item.select < '4' ? (
                        <MdStarOutline
                          size={35}
                          className="outline-metallic-yellow cursor-pointer"
                        />
                      ) : (
                        <MdStar size={35} className="text-metallic-yellow cursor-pointer" />
                      )}
                    </div>
                    <div onClick={() => handleImageClick('TOUR', '5', key)}>
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
            </div>
          </div>
        </div>

        <div className="feedback-button gap-2">
          <CustomButton
            variant="primary"
            type="button"
            onClick={handleNextStep}
          >
            Next
          </CustomButton>
          <CustomButton
            variant="outline-secondary"
            type="button"
            onClick={handleCanelStep}
          >
            Cancel
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default TourFeedback;
