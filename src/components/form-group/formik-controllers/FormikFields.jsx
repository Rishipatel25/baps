'use client';
import { useRef, useState, useEffect } from 'react';
import CustomSelectDropdown from '@/components/form-group/custom-select/CustomSelectDropdown';
import { ErrorMessage, Field } from 'formik';
import { BiTimeFive } from 'react-icons/bi';
import TimeKeeper from 'react-timekeeper';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import InputMask from 'react-input-mask';
import { checkObjectKey } from '@/utils/helper.utils';

export const PhoneField = (props) => {
  const {
    name = '',
    label = '',
    type = 'text',
    placeholder = '',
    required = false,
    errors = '',
    inputClass = '',
    touched,
    disabled,
    value,
    setFieldValue,
    ref,
  } = props;

  const [phone, setPhone] = useState(value);

  const formatPhoneNumber = (value) => {
    const formattedValue = value
      ?.replace(/\D/g, '')
      ?.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

    return !formattedValue[2]
      ? formattedValue[1]
      : `(${formattedValue[1]}) ${formattedValue[2]}` +
          (formattedValue[3] ? `-${formattedValue[3]}` : '');
  };

  useEffect(() => {
    const num = formatPhoneNumber(value);
    setPhone(num);
  }, [value]);

  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        min={type === 'number' ? 0 : null}
        className={`form-control  ${
          errors && touched ? 'is-invalid' : ''
        } ${inputClass}`}
        disabled={disabled}
        ref={ref}
        onChange={(e) => {
          let newValue = e.target.value;
          newValue = newValue.replace(/[()-]/g, '');
          setFieldValue(name, newValue);
        }}
        value={phone}
      />
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const InputField = (props) => {
  const {
    name = '',
    label = '',
    type = 'text',
    placeholder = '',
    required = false,
    errors = '',
    inputClass = '',
    touched,
    disabled,
  } = props;

  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <Field
        name={name}
        type={type}
        step={type === 'number' ? 1 : null}
        placeholder={placeholder}
        min={type === 'number' ? 0 : null}
        className={`form-control  ${
          errors && touched ? 'is-invalid' : ''
        } ${inputClass}`}
        disabled={disabled}
      />
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const InputNumberField = (props) => {
  const {
    name = '',
    label = '',
    placeholder = '',
    required = false,
    errors = '',
    inputClass = '',
    touched,
    disabled,
    setFieldValue,
    value,
    setFieldTouched,
    handleChange = () => {},
  } = props;

  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className={`form-control text-right ${
          errors && touched ? 'is-invalid' : ''
        } ${inputClass}`}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setFieldTouched(name, true);
          const val = e.target.value ? e.target.value : '';
          if (val) {
            if (/^-?\d*\.?\d+$/.test(val)) {
              setFieldValue(name, val);
              handleChange && handleChange(e);
            }
          } else {
            setFieldValue(name, '');
            handleChange && handleChange({ target: { value: 0 } });
          }
        }}
      />
      <span className="text-danger position-absolute">
        {errors && touched ? <span>{errors}</span> : null}
      </span>
    </div>
  );
};

export const EmailField = (props) => {
  const {
    name = '',
    label = '',
    placeholder = '',
    required = false,
    errors = '',
    touched,
    disabled,
  } = props;
  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <Field
        name={name}
        placeholder={placeholder}
        className={`form-control ${errors && touched ? 'is-invalid' : ''} `}
        disabled={disabled}
      />
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const DateField = (props) => {
  const {
    name = '',
    label = '',
    placeholder = '',
    required = false,
    errors = '',
    touched,
    disabled,
  } = props;

  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <Field
        name={name}
        placeholder={placeholder}
        className={`form-control ${errors && touched ? 'is-invalid' : ''} `}
        type="date"
        disabled={disabled}
      />
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const DateFieldNew = (props) => {
  const datepickerRef = useRef(null);
  const {
    name = '',
    label = '',
    placeholder = '',
    dateFormat = 'MM-dd-yyyy',
    required = false,
    errors = '',
    touched,
    disabled,
    setFieldValue,
  } = props;
  const clearIcon = (
    <span
      onClick={() => {
        const datepickerElement = datepickerRef.current;
        datepickerElement.setFocus(true);
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            fill="white"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    </span>
  );
  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <Field
        name={name}
        className={`form-control ${errors && touched ? 'is-invalid' : ''} `}
      >
        {({ field }) => (
          <DatePicker
            name={name}
            dateFormat={dateFormat}
            placeholderText={placeholder}
            showIcon={!field.value}
            disabled={disabled}
            selected={field.value ? moment(field.value).toDate() : null}
            autoComplete="off"
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            className={`form-control ${errors && touched ? 'is-invalid' : ''} `}
            onBeforeInput={(e) => {
              e.preventDefault();
            }}
            isClearable={!disabled}
            ref={datepickerRef}
            icon={clearIcon}
            onChange={(value) => {
              setFieldValue(
                name,
                value ? moment(value).format('YYYY-MM-DD') : null,
              );
            }}
          />
        )}
      </Field>
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const TimeField = ({
  name = '',
  label = '',
  placeholder = '',
  required = false,
  errors = '',
  touched = '',
  setFieldValue = () => {},
  disabledTimeRange = {},
  value = '',
  disabled = false,
  handleChange = () => {},
  handleBlur = () => {},
}) => {
  const [inputTime, setInputTime] = useState('');
  const [localError, setLocalError] = useState(false);
  const [localErrorMessage, setLocalErrorMessage] = useState('');
  const firstLetter = /[0-1]/;
  const secondLetter = /[0-9]/;
  const thirdLetter = /[0-9]/;
  const forthLetter = /[0-9]/;
  const aP = /[AaPp]/;
  const m = /[Mm]/;
  const mask = [
    firstLetter,
    secondLetter,
    ':',
    thirdLetter,
    forthLetter,
    ' ',
    aP,
    m,
  ];

  const checkError = () => {
    const chars = inputTime.split('');
    let isError = false;

    chars.forEach((char) => {
      if (char == '-') {
        isError = true;
        return isError;
      }
    });
    return isError;
  };

  const handleBlurCheck = () => {
    setLocalError(false);
    if (
      inputTime == '--:-- --' ||
      inputTime == '' ||
      inputTime == 'Invalid date'
    ) {
      handleBlur({ isError: true, isInValidDate: true });
      return;
    }
    const isError = checkError();
    if (isError) {
      handleBlur({ isError: true, isInValidDate: true });
      return;
    }
    if (!isError && disabledTimeRange && checkObjectKey(disabledTimeRange)) {
      const { from, to } = disabledTimeRange;
      setInputTime(moment(inputTime, 'hh:mm A').format('hh:mm A'));
      const format = 'hh:mm A';
      const startTime = moment(from, format);
      const endTime = moment(to, format);
      const givenTime = moment(inputTime, format);
      const isBetween = givenTime.isBetween(startTime, endTime, null, '[]');
      if (!isBetween) {
        setLocalError(true);
        setLocalErrorMessage('Time is not in range');
        handleBlur({ isError: true, isInValidDate: false });
      } else {
        setFieldValue(name, inputTime);
        handleBlur({ isError: false, isInValidDate: false });
      }
    } else {
      handleBlur({ isError: false, isInValidDate: false });
    }
  };

  const breakTime = (time) => {
    const hh = time.substring(0, 2);
    const mm = time.substring(3, 5);
    const amPm = time.substring(6, 8);
    return { hh, mm, amPm };
  };

  const handleKeyUp = (e) => {
    let time = e.target.value;
    if (!time) {
      time = '--:-- --';
    }
    let { hh, mm, amPm } = breakTime(time);
    if (hh === '00') hh = 12;
    if (hh > 12) hh = 12;
    if (mm > 59) mm = 59;
    if (amPm == 'a-' || amPm == 'A-') amPm = 'AM';
    if (amPm == 'p-' || amPm == 'P-') amPm = 'PM';
    if (amPm == '-m' || amPm == '-M') amPm = '--';

    setInputTime(`${hh}:${mm} ${amPm}`);
    setFieldValue(name, `${hh}:${mm} ${amPm}`);
  };

  useEffect(() => {
    setInputTime(value || '');
  }, [value]);

  return (
    <div className="d-inline-block position-relative w-100">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}

      <div className="position-relative">
        <InputMask
          type="text"
          mask={mask}
          maskPlaceholder="-"
          name={name}
          placeholder={placeholder}
          value={inputTime}
          disabled={disabled}
          className={` cursor-pointer text-uppercase form-control ${
            (errors && touched) || localError ? 'is-invalid' : ''
          } `}
          onChange={(e) => {
            handleKeyUp(e);
          }}
          onBlur={() => {
            handleBlurCheck();
            handleChange();
          }}
        />
        <span className="opacity-50">
          <BiTimeFive className="position-absolute time-icon" size="20px" />
        </span>
      </div>
      <span className="text-danger position-absolute">
        {localError ? <>{localErrorMessage}</> : <ErrorMessage name={name} />}
      </span>
    </div>
  );
};

export const TimeOriField = (props) => {
  const {
    name = '',
    label = '',
    placeholder = '',
    required = false,
    errors = '',
    touched,
    setFieldValue,
    disabledTimeRange,
    value,
    disabled,
    handleChange = () => {},
  } = props;
  const [showTime, setShowTime] = useState(false);

  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <div
        onClick={() => {
          if (!disabled) setShowTime(true);
        }}
        className="position-relative"
      >
        <Field
          name={name}
          id={name}
          placeholder={placeholder}
          type="text"
          className={`readonly-field cursor-pointer form-control ${
            errors && touched ? 'is-invalid' : ''
          } `}
          autoComplete="off"
          disabled={disabled}
          readOnly
        />
        <span className="opacity-50">
          <BiTimeFive className="position-absolute time-icon" size="20px" />
        </span>
      </div>

      {showTime && (
        <div
          className="time-drop position-fixed d-flex justify-content-center align-items-center"
          onClick={() => setShowTime(false)}
        >
          <div
            className="centerDiv"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <TimeKeeper
              time={value ? value : null}
              onDoneClick={(newTime) => {
                newTime.formatted24.length == 5
                  ? setFieldValue(name, newTime.formatted24)
                  : setFieldValue(name, '0' + newTime.formatted24);
                handleChange(newTime.formatted24);
                setShowTime(false);
              }}
              switchToMinuteOnHourSelect
              hour24Mode={true}
              coarseMinutes={5}
              forceCoarseMinutes
              disabledTimeRange={disabledTimeRange}
            />
          </div>
        </div>
      )}

      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const SelectField = (props) => {
  const {
    name = '',
    label = '',
    required = false,
    errors = '',
    touched,
    value = {},
    options = [],
    handleChange = () => {},
    handleBlur = () => {},
    placeholder = 'Select',
    isSearchable = true,
    isMulti = false,
    className = '',
    noOptionsMessage = '',
    showCustomOptionsList = false,
    Option = () => {},
    isClearable = true,
    ref,
    disabled,
    searchKey,
  } = props;

  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <CustomSelectDropdown
        value={value}
        name={name}
        options={options}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isMulti={isMulti}
        className={` ${errors && touched ? 'is-invalid' : ''} ${className}`}
        noOptionsMessage={noOptionsMessage}
        showCustomOptionsList={showCustomOptionsList}
        Option={Option}
        isClearable={isClearable}
        disabled={disabled}
        ref={ref}
        searchKey={searchKey}
      />
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const RadioField = (props) => {
  const {
    name = '',
    label = '',
    options = [],
    required = false,
    disabled = false,
  } = props;
  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name} className="mb-2">
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <div
        role="group"
        className="d-flex gap-3 flex-wrap"
        aria-labelledby={name}
      >
        {options.map((option, idx) => {
          return (
            <label
              key={idx}
              className="d-flex justify-center align-items-center"
            >
              <Field
                type="radio"
                name={name}
                value={option.value}
                disabled={disabled}
              />
              <span className="ms-2">{option.label}</span>
            </label>
          );
        })}
      </div>
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const CheckBoxesField = (props) => {
  const {
    name = '',
    label = '',
    options = [],
    required = false,
    disabled = false,
  } = props;
  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name} className="mb-2">
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <div role="group" className="d-flex gap-2" aria-labelledby={name}>
        {options.map((option, idx) => {
          return (
            <label key={idx}>
              <Field
                type="checkbox"
                name={name}
                value={option.value}
                disabled={disabled}
              />
              <span className="ms-2">{option.label}</span>
            </label>
          );
        })}
      </div>
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

export const TextareaField = (props) => {
  const {
    name = '',
    label = '',
    placeholder = '',
    required = false,
    errors = '',
    touched,
    disabled,
  } = props;
  return (
    <div className="position-relative">
      {label && (
        <label htmlFor={name}>
          {' '}
          {label} {required ? <RequiredIcon /> : null}
        </label>
      )}
      <Field
        as="textarea"
        id={name}
        name={name}
        placeholder={placeholder}
        className={`form-control textarea ${
          errors && touched ? 'is-invalid' : ''
        } `}
        disabled={disabled}
        rows="30"
      />
      <span className="text-danger position-absolute">
        <ErrorMessage name={name} />
      </span>
    </div>
  );
};

const RequiredIcon = () => {
  return <span className="text-danger field-warning">*</span>;
};
