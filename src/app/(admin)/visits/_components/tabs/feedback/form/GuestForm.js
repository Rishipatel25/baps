import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getExternalFeedbackAction } from '@/redux/feedback/action.feedback';
import { useDispatch } from 'react-redux';
import { getLocalStorageData } from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { MdStar } from 'react-icons/md';
import { Form, Formik } from 'formik';
import { Col, Container, Row } from 'react-bootstrap';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import moment from 'moment';
import PageProgressIcon from '@/components/page-progress';
import FormikController from '@/components/form-group/formik-controllers';

const GuestForm = () => {
  const [isDone, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [tourFeedback, setTourFeedback] = useState([]);
  const [tourGuideFeedback, setTourGuideFeedback] = useState([]);
  const [formData, setFormData] = useState({
    guestName: '',
    feedbackDate: '',
  });
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchParams.get('id')) {
      dispatch(
        getExternalFeedbackAction(searchParams.get('id'), (res) => {
          if (res.visitFeedbackId) {
            setFormData((prevState) => ({
              ...prevState,
              feedbackDate: moment
                .utc(res.createdAt)
                .local()
                .format('MM-DD-YYYY HH:mm A'),
            }));
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
      const visitData = getLocalStorageData(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA);
      setFormData((prevState) => ({
        ...prevState,
        guestName:
          visitData.primaryVisitorModel.firstName +
          ' ' +
          visitData.primaryVisitorModel.lastName,
      }));
    }
  }, []);

  return (
    <>
      {isDone ? (
        <Formik initialValues={formData} enableReinitialize>
          {({ errors, touched, values, handleBlur }) => (
            <div className="font-15">
              <Form>
                <Container fluid className="p-0">
                  <Row>
                    <Col md={5} sm={6} className="mt-4 mb-3">
                      <FormikController
                        control="input"
                        label="Name of Guest"
                        inputClass="text-capitalize"
                        name="guestName"
                        placeholder="Aditya tripathi"
                        required={false}
                        disabled={true}
                        errors={errors.guestName}
                        touched={touched.guestName}
                        handleBlur={handleBlur}
                        value={values.guestName}
                      />
                    </Col>
                    <Col md={5} sm={6} className="mt-4">
                      <FormikController
                        control="input"
                        label="Date of feedback"
                        placeholder=""
                        name="feedbackDate"
                        required={false}
                        disabled={true}
                        errors={errors.feedbackDate}
                        touched={touched.feedbackDate}
                        handleBlur={handleBlur}
                        value={values.feedbackDate}
                      />
                    </Col>
                  </Row>
                </Container>
              </Form>

              <h6 className="bg-light-gray p-3 font-normal text-dark">
                Experience
              </h6>
              <Container className="p-2 m-0">
                <Row>
                  {tourFeedback.map((element, key) => {
                    return (
                      <>
                        <Col
                          md={3}
                          sm={6}
                          key={key}
                          className="mt-3 mb-3 d-flex align-items-center gap-1"
                        >
                          {element.label} :{' '}
                          <strong>{element.select || 0}</strong>
                          <MdStar size={30} className="text-metallic-yellow" />
                        </Col>
                      </>
                    );
                  })}
                </Row>
              </Container>
              {tourGuideFeedback.length > 0 && (
                <h6 className="bg-light-gray p-3 font-normal text-dark">
                  Tour Guide
                </h6>
              )}

              <Container className="p-2 m-0">
                <Row>
                  {tourGuideFeedback.map((element, key) => {
                    return (
                      <Col
                        key={key}
                        md={3}
                        sm={6}
                        className="mt-3 mb-3 d-flex align-items-center gap-1"
                      >
                        {element.label} : <strong>{element.select}</strong>
                        <MdStar size={30} className="text-metallic-yellow" />
                      </Col>
                    );
                  })}
                </Row>
              </Container>
              {feedback.length > 0 && (
                <Container fluid className="p-0">
                  <Row>
                    <strong>Additional Comments</strong>
                    <div className="feedback-content">
                      <div className="w-100">
                        <p>{feedback}</p>
                      </div>
                    </div>
                  </Row>
                </Container>
              )}
            </div>
          )}
        </Formik>
      ) : (
        <PageProgressIcon
          icon={DashboardProgressIcon}
          title="No Data Available"
          description="There is no data to show you right now"
          buttonText="Request For Feedback"
          buttonAction={() => {}}
        />
      )}
    </>
  );
};

export default GuestForm;
