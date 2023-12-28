import FormikController from '@/components/form-group/formik-controllers';
import { Col, Row } from 'react-bootstrap';

/* Dynamic Fields Render */

const ServicesForm = ({
  fields,
  errors,
  values,
  touched,
  setFieldValue,
  setFieldTouched,
  disabled,
  setFieldError,
}) => {
  return (
    <Row className="mb-3">
      {fields.map((element, key) => {
        return (
          <Col key={key} xs={element.defaultCol} className="mt-4">
            <FormikController
              control={element.field === 'date' ? 'dateNew' : element.field}
              options={element.options ? element.options : []}
              label={element.label}
              name={element.name}
              dateFormat={element?.format}
              required={element.isRequired}
              errors={errors[element.name]}
              touched={touched[element.name]}
              rows={element.row ? element.row : null}
              value={values && values[element.name]}
              isMulti={element.isMultiSelect ? element.isMultiSelect : false}
              placeholder={element.placeholder}
              setFieldValue={setFieldValue}
              setFieldError={setFieldError}
              handleChange={(e) => {
                if (e.target) {
                  setFieldValue(element.name, e.target.value);
                } else {
                  setFieldValue(element.name, e ? e : '');
                }
              }}
              handleBlur={() => {
                setFieldTouched(element.name);
              }}
              disabled={disabled}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default ServicesForm;
