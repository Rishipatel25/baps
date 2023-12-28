import {
  TextareaField,
  EmailField,
  DateField,
  DateFieldNew,
  InputField,
  TimeField,
  RadioField,
  CheckBoxesField,
  SelectField,
  PhoneField,
  InputNumberField,
} from './FormikFields';

const FormikController = (props) => {
  const { control, ...rest } = props;

  switch (control) {
    case 'input':
      return <InputField {...rest} />;
    case 'number':
      return <InputNumberField {...rest} />;
    case 'date':
      return <DateField {...rest} />;
    case 'dateNew':
      return <DateFieldNew {...rest} />;
    case 'time':
      return <TimeField {...rest} />;
    case 'email':
      return <EmailField {...rest} />;
    case 'select':
      return <SelectField {...rest} />;
    case 'radio':
      return <RadioField {...rest} />;
    case 'textarea':
      return <TextareaField {...rest} />;
    case 'checkbox':
      return <CheckBoxesField {...rest} />;
    case 'phone':
      return <PhoneField {...rest} />;
    default:
      return null;
  }
};

export default FormikController;
