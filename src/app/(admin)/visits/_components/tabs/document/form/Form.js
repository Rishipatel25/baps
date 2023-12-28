import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import { visitState } from '@/redux/visits/reducer.visits';
import { Form, Formik } from 'formik';
import moment from 'moment';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const DocumentForm = ({
  formData,
  validationSchema,
  handleSubmit,
  isDocumentLoader,
  handleClose,
}) => {
  const {
    currentVisitRes: { visitRes },
  } = useSelector(visitState);
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ touched, errors, isValid, handleBlur }) => (
        <div className="fullModal">
          <div className="d-flex align-items-baseline gap-2 mb-3">
            <h4 className="m-0">Add Document</h4>
            <h5>#{visitRes?.requestNumber}</h5>
            <span className="slider-sub-title">
              (
              {moment(visitRes?.dateOfVisit, 'YYYY-MM-DD').format(
                'DD-MMM-YYYY',
              )}
              &nbsp;&nbsp;{visitRes.startDateTime} &nbsp;- &nbsp;
              {visitRes.endDateTime})
            </span>
          </div>
          <Form>
            <Container fluid className="tabForm mb-4">
              <Row>
                <Col md={6} sm={6} className="mt-4">
                  <FormikController
                    control="input"
                    type="text"
                    label="Title"
                    name="title"
                    required={true}
                    placeholder={'Enter Title'}
                    handleBlur={handleBlur}
                    errors={errors.title}
                    touched={touched.title}
                  />
                </Col>

                <Col md={12} sm={12} className="mt-4">
                  <FormikController
                    control="input"
                    type="text"
                    label="URL"
                    name="url"
                    required={true}
                    placeholder={'Add URL'}
                    errors={errors.url}
                    touched={touched.url}
                  />
                </Col>
              </Row>
              <Row md={12} sm={12}>
                <Col md={12} sm={12} className="mt-4">
                  <FormikController
                    control="textarea"
                    type="text"
                    label="Notes"
                    name="note"
                    placeholder={'Enter Notes'}
                    errors={errors.note}
                    touched={touched.note}
                  />
                  <div className="m-2"></div>
                </Col>
              </Row>
            </Container>
            <Container fluid className="p-0">
              <Row className="mt-4">
                <Col className="d-flex gap-2">
                  <CustomButton
                    type="submit"
                    variant="primary"
                    disabled={!isValid || isDocumentLoader}
                  >
                    SAVE
                  </CustomButton>
                  <CustomButton variant="secondary" onClick={handleClose}>
                    CANCEL
                  </CustomButton>
                </Col>
              </Row>
            </Container>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default DocumentForm;
