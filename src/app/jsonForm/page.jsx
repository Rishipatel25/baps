'use client';
import { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { Col, Container, Row } from 'react-bootstrap';
import FormikController from '@/components/form-group/formik-controllers';
import * as Yup from 'yup';
import CustomButton from '@/components/Button';

const JsonForm = () => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({ json: '' });
  const [validationSchema, setValidationSchema] = useState(null);

  const createYupSchema = (schema, config) => {
    const { name, validationType, validations = [] } = config;
    if (!Yup[validationType]) {
      return schema;
    }
    let validator = Yup[validationType]();
    validations.forEach((validation) => {
      const { params, type } = validation;
      if (!validator[type]) {
        return;
      }
      const copyPrams = [...params];
      if (type === 'matches') {
        if (copyPrams.length === 2) {
          copyPrams[0] = new RegExp(copyPrams[0]);
        }
      }
      validator = validator[type](...copyPrams);
    });
    schema[name] = validator;
    return schema;
  };

  const onSubmit = () => {};

  useEffect(() => {
    if (fields.length > 0) {
      const yepSchema = fields.reduce(createYupSchema, {});
      setValidationSchema(Yup.object().shape(yepSchema));
      fields.forEach((element) => {
        setFormData((prevState) => ({
          ...prevState,
          [element.name]: element.defaultValue,
        }));
      });
    }
  }, [fields]);

  useEffect(() => {
    if (formData.json) {
      const convertedJson = JSON.parse(formData.json);
      if (convertedJson && convertedJson.length > 0) {
        setFields(convertedJson);
      }
    }
  }, [formData.json]);

  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
          <>
            <Form
              onChange={(e) => {
                setFormData((prevState) => ({
                  ...prevState,
                  [e.target.name]: e.target.value,
                }));
              }}
            >
              <Container fluid>
                <Row>
                  <Col sm={4} className="mt-4 mb-4 service-json-textarea">
                    <FormikController
                      control="textarea"
                      type="text"
                      label="Service Json"
                      name="json"
                      value={values.json}
                      setFieldValue={setFieldValue}
                      placeholder={'Enter Json'}
                      onChange={() => {}}
                    />
                  </Col>
                  <Col sm={8} className="mt-5 mb-4 pe-4">
                    {fields.length > 0 && (
                      <Row className="tabForm">
                        {fields.map((element, key) => {
                          return (
                            <Col
                              key={key}
                              xs={element.defaultCol}
                              className="mt-4"
                            >
                              <FormikController
                                control={
                                  element.field === 'date'
                                    ? 'dateNew'
                                    : element.field
                                }
                                options={element.options ? element.options : []}
                                label={element.label}
                                name={element.name}
                                dateFormat={element?.format}
                                required={element.isRequired}
                                errors={errors[element.name]}
                                touched={touched[element.name]}
                                rows={element.row ? element.row : null}
                                value={values && values[element.name]}
                                isMulti={
                                  element.isMultiSelect
                                    ? element.isMultiSelect
                                    : false
                                }
                                placeholder={element.placeholder}
                                setFieldValue={setFieldValue}
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
                              />
                            </Col>
                          );
                        })}
                        <Col sm={12} className="mt-4">
                          <CustomButton type="submit" variant="primary">
                            SAVE
                          </CustomButton>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Container>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default JsonForm;
