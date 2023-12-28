'use client';
import {
  VISIT_STATUS,
  TOAST_SUCCESS,
} from '@/utils/constants/default.constants';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { RxCross1 } from 'react-icons/rx';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { BiExitFullscreen } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { lookupToObject } from '@/utils/helper.utils';
import { ERRORS } from '@/utils/constants/errors.constants';
import { changeVisitStatusAction } from '@/redux/visits/action.visits';
import { toast } from 'react-toastify';
import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import * as Yup from 'yup';

const TourCancelSlider = ({
  sliderCancelOpen,
  handleSliderSuccessClose,
  handleSliderCancelClose,
  selectedGuest,
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
  });

  const cancelReasonOpt = lookupToObject('CANCELLED_REASON');
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    reason: Yup.object().required(ERRORS.REQUIRED),
    notes: Yup.string().max(255, ERRORS.MAX_255),
  });
  function isSafari() {
    // Check if it's likely a Safari browser based on the user agent string
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('safari') && !userAgent.includes('chrome');
  }

  const resetForm = () => {
    setFormData({
      reason: '',
      notes: '',
    });
  };

  const onSubmit = () => {
    const visitStatusInfo = {
      visitId: selectedGuest?.visitId,
      visitStatusData: {
        stage: VISIT_STATUS.CANCEL,
        reasonType: formData.reason?.value,
        reason: formData.notes,
      },
    };
    dispatch(
      changeVisitStatusAction(visitStatusInfo, () => {
        toast.success('Visit Cancelled Successfully', {
          toastId: TOAST_SUCCESS.CHANGE_VISIT_STATUS_ACTION.ID,
        });
        setSubmit(false);
        resetForm();
        handleSliderSuccessClose();
      }),
    );
    setSubmit(false);
  };

  useEffect(() => {
    submit && onSubmit();
  }, [submit]);

  useEffect(() => {
    const sliderForm = document.querySelector('.sliderCancelForm');
    if (fullScreen) {
      sliderForm.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreen]);

  return (
    <Offcanvas
      show={sliderCancelOpen}
      backdrop="static"
      placement="end"
      className="sliderCancelForm"
    >
      <Offcanvas.Header className="offcanvas-title-heading">
        <Offcanvas.Title className="w-100">
          <div className="d-flex align-items-center justify-content-between w-100">
            <h5 className="m-0">Tour {selectedGuest?.requestNumber} </h5>
            <div className="d-flex gap-3">
              {!isSafari() ? (
                <button
                  type="button"
                  onClick={() => setFullScreen(!fullScreen)}
                  className="p-1"
                >
                  {fullScreen ? <BiExitFullscreen /> : <BsArrowsFullscreen />}
                </button>
              ) : null}
              <button
                type="button"
                className="p-1"
                onClick={() => {
                  resetForm();
                  handleSliderCancelClose();
                }}
              >
                <RxCross1 />
              </button>
            </div>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={(e) => {
            setFormData(e);
            setSubmit(true);
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Container fluid className="tabForm">
                <div className="title-cancel">
                  Please give appropriate reason for the cancelled booked tour.
                </div>
                <Row className="mt-2">
                  <Col md={12} sm={12} className="mt-2 mb-2">
                    <FormikController
                      control="select"
                      options={cancelReasonOpt}
                      label="Reason"
                      name="reason"
                      value={values.reason}
                      errors={errors.reason}
                      touched={touched.reason}
                      handleChange={(e) => {
                        setFieldValue('reason', e || '');
                      }}
                      required={true}
                      placeholder={'Select Reason'}
                    />
                  </Col>
                  <Col md={12} sm={12} className="mt-3 mb-2">
                    <FormikController
                      control="input"
                      type="text"
                      label="Notes"
                      name="notes"
                      value={values.notes}
                      disabled={false}
                      required={false}
                      placeholder={'Enter Notes'}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={12} className="d-flex gap-2">
                    <CustomButton type="submit" variant="primary">
                      Submit
                    </CustomButton>
                    <CustomButton
                      type="reset"
                      variant="secondary"
                      onClick={() => {
                        resetForm();
                      }}
                    >
                      Reset
                    </CustomButton>
                  </Col>
                </Row>
              </Container>
            </Form>
          )}
        </Formik>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default TourCancelSlider;
