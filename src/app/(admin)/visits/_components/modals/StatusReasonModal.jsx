import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import { getVisitStatusAction } from '@/redux/visits/action.visits';
import { ERRORS } from '@/utils/constants/errors.constants';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const initialValues = {
  reasonType: '',
  reason: '',
};
export const StatusReasonModal = ({
  reasonOptions = [],
  handleClose = () => {},
  handleSubmit = () => {},
  submitBtnText = '',
  status = '',
  title = '',
  isEdit = false,
  currentVisitId,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialValues);

  const validationSchema = Yup.object({
    reasonType: Yup.object().required(ERRORS.SELECT_REASON),
    reason: Yup.string().max(255, ERRORS.MAX_255).nullable(),
  });

  const onSubmit = (values) => {
    handleSubmit(
      {
        stage: status,
        reasonType: values.reasonType.value,
        reason: values.reason,
      },
      'Successfully declined',
    );
  };

  const setFormValues = (response) => {
    const { reason, reasonType } = response.at(-1);
    setFormData({
      reason,
      reasonType: { label: reasonType, value: reasonType },
    });
  };

  useEffect(() => {
    if (currentVisitId && isEdit) {
      dispatch(
        getVisitStatusAction(currentVisitId, (res) => {
          setFormValues(res);
        }),
      );
    }
  }, [currentVisitId]);

  return (
    <div>
      {!isEdit && (
        <>
          <p className="text-dark">{title}</p>
          <hr className="my-4" />
        </>
      )}
      <div>
        <Formik
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ handleBlur, values, setFieldValue, errors, touched }) => (
            <Form>
              <div>
                <FormikController
                  control="select"
                  options={reasonOptions}
                  label="Reason"
                  name="reasonType"
                  value={values.reasonType}
                  placeholder="Select reason"
                  handleChange={(e) => {
                    setFieldValue('reasonType', e ? e : '');
                  }}
                  handleBlur={handleBlur}
                  required={true}
                  errors={errors.reasonType}
                  touched={touched.reasonType}
                  disabled={isEdit}
                />
              </div>
              <div className=" mt-3">
                <FormikController
                  control="textarea"
                  label="Notes"
                  name="reason"
                  placeholder="Enter Notes"
                  className="form-control "
                  disabled={isEdit}
                  errors={errors?.reason}
                  touched={touched?.reason}
                />
              </div>

              <div className="d-flex gap-3 mt-3">
                {!isEdit && (
                  <CustomButton variant="primary" type="submit">
                    {submitBtnText}
                  </CustomButton>
                )}
                <CustomButton variant="secondary" onClick={handleClose}>
                  Cancel
                </CustomButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
