import CustomButton from '@/components/Button';
import FormikController from '@/components/form-group/formik-controllers';
import { calculateNewLoactionEndTime } from '@/utils/helper.utils';
import { ErrorMessage } from 'formik';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { Button } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { CiTrash } from 'react-icons/ci';
import { TiTick } from 'react-icons/ti';

export default function LocationTableRow({
  index,
  totalCount,
  locationOpt,
  values,
  handleBlur,
  errors,
  touched,
  setFieldValue,
  visitRes,
  editRowIndex,
  setEditRowIndex,
  handleSubmitTourGuide,
  formData,
}) {
  return (
    <tr key={index}>
      <td>
        <FormikController
          control="select"
          options={locationOpt}
          value={values.locationList[index].location}
          name={`locationList.${index}.location`}
          handleBlur={handleBlur}
          errors={errors?.locationList && errors?.locationList[index]?.location}
          touched={
            touched?.locationList && touched?.locationList[index]?.location
          }
          handleChange={(e) => {
            setFieldValue(`locationList.${index}.location`, e ? e : '');
          }}
          disabled={editRowIndex !== index}
        />
      </td>
      <td>
        <div className="d-flex align-items-center gap-2 position-relative visit-tour-actual-time">
          <input
            name={`locationList.${index}.actualDuration`}
            className={`form-control ${
              errors?.locationList?.[index]?.actualDuration &&
              touched?.locationList?.[index]?.actualDuration
                ? 'is-invalid'
                : ''
            }`}
            type="number"
            value={values?.locationList?.[index]?.actualDuration}
            placeholder={'0'}
            onChange={(e) => {
              const endTime = calculateNewLoactionEndTime(
                values.locationList?.[index]?.startDateTime,
                e?.target?.value,
              );
              setFieldValue(
                `locationList.${index}.endDateTime`,
                endTime || '--:-- --',
              );
              setFieldValue(
                `locationList.${index}.actualDuration`,
                e?.target?.value || '',
              );
            }}
            disabled={editRowIndex !== index}
          />
          <span className="text-danger position-absolute ">
            <ErrorMessage name={`locationList.${index}.actualDuration`} />
          </span>
          <div>Min</div>
        </div>
      </td>
      <td>
        <FormikController
          control="time"
          placeholder="Start Time"
          setFieldValue={setFieldValue}
          name={`locationList.${index}.startDateTime`}
          errors={
            errors?.locationList && errors?.locationList[index]?.startDateTime
          }
          touched={
            touched?.locationList && touched?.locationList[index]?.startDateTime
          }
          value={values?.locationList[index]?.startDateTime}
          disabled={editRowIndex !== index}
          disabledTimeRange={{
            to: values?.locationList[index + 1]?.startDateTime,
            from:
              index > 0
                ? index == 1
                  ? values?.locationList[index - 1]?.startDateTime
                  : values?.locationList[index - 1]?.endDateTime
                : visitRes?.endDateTime,
          }}
          handleChange={() => {
            const endTime = calculateNewLoactionEndTime(
              values.locationList?.[index].startDateTime,
              values.locationList?.[index].actualDuration,
            );
            setFieldValue(`locationList.${index}.endDateTime`, endTime);
          }}
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          value={values?.locationList[index]?.endDateTime}
          disabled={true}
          name={`locationList.${index}.endDateTime`}
        />
      </td>
      <td>
        <PermissionWrapper name={'ADD_VISIT_TOUR'}>
          <div className="d-flex gap-3">
            {index > 0 && index + 1 != totalCount && (
              <>
                {editRowIndex == index ? (
                  <>
                    <CustomButton
                      classes="btn-icon btn-green"
                      variant="primary"
                      type="submit"
                    >
                      <TiTick size={20} />
                    </CustomButton>

                    <CustomButton
                      classes="btn-icon"
                      variant="danger"
                      type="button"
                      onClick={() => {
                        setFieldValue(
                          `locationList.${index}.actualDuration`,
                          formData.locationList?.[index]?.actualDuration,
                        );
                        setFieldValue(
                          `locationList.${index}.startDateTime`,
                          formData.locationList?.[index]?.startDateTime,
                        );
                        setFieldValue(
                          `locationList.${index}.endDateTime`,
                          formData.locationList?.[index]?.endDateTime,
                        );
                        setFieldValue(
                          `locationList.${index}.location`,
                          formData.locationList?.[index]?.location,
                        );
                        setEditRowIndex(null);
                      }}
                    >
                      <AiOutlineClose size={20} />
                    </CustomButton>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="btn-icon"
                      variant="primary"
                      onClick={() => setEditRowIndex(index)}
                    >
                      <AiOutlineEdit size={20} />
                    </Button>
                    <CustomButton
                      variant="danger"
                      classes="btn-icon"
                      type="button"
                      onClick={() => {
                        const locations = [...(values?.locationList || {})];
                        locations.splice(index, 1);
                        handleSubmitTourGuide(
                          'editLocation',
                          locations,
                          () => {},
                        );
                      }}
                    >
                      <CiTrash size={20} />
                    </CustomButton>
                  </>
                )}
              </>
            )}
          </div>
        </PermissionWrapper>
      </td>
    </tr>
  );
}
