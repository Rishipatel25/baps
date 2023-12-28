'use client';
import CustomSelectDropdown from '@/components/form-group/custom-select/CustomSelectDropdown';
import { lookupToObject } from '@/utils/helper.utils';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { Row, Col, Container } from 'react-bootstrap';
import CustomButton from '@/components/Button';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const FilterCard = ({ filterObj, setFilterObj, showFilterCard }) => {
  const pathname = usePathname();
  const datepickerRef = useRef(null);
  const datepickerRef2 = useRef(null);
  const visitStatusOptions = lookupToObject('VISIT_STAGE');
  const visitTypeOptions = lookupToObject('TYPE_OF_VISIT');

  const currentStatus = () => {
    const path = pathname;
    if (path.includes('pending')) {
      return 'PENDING';
    } else if (path.includes('accepted')) {
      return 'ACCEPTED';
    } else if (path.includes('active')) {
      return 'ACTIVE';
    }
    return 'ALL';
  };
  const clearIcon = (
    <span
      onClick={() => {
        const datepickerElement = datepickerRef?.current;
        if (datepickerElement) {
          datepickerElement.setFocus(true);
        }
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
  const clearIcon2 = (
    <span
      onClick={() => {
        const datepickerElement = datepickerRef2?.current;
        if (datepickerRef2?.current) {
          datepickerElement.setFocus(true);
        }
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
    <>
      {showFilterCard && (
        <div className="filter-card">
          <div className="d-flex gap-3 filter-holder ">
            <Container fluid>
              <Row>
                {currentStatus() === 'ALL' && (
                  <Col lg={4} md={6} sm={12} className="mb-2">
                    <CustomSelectDropdown
                      options={visitStatusOptions}
                      className="dropdown-filter text-capitalize"
                      onChange={(e) => {
                        setFilterObj((prevState) => ({
                          ...prevState,
                          status: e,
                        }));
                      }}
                      value={filterObj.status}
                      isClearable={true}
                      placeholder="Select Visit Status"
                    />
                  </Col>
                )}
                <Col lg={4} md={6} sm={12} className="mb-2">
                  <CustomSelectDropdown
                    options={visitTypeOptions}
                    className="dropdown-filter text-capitalize"
                    onChange={(e) => {
                      setFilterObj((prevState) => ({ ...prevState, type: e }));
                    }}
                    value={filterObj.type}
                    isClearable
                    placeholder="Select Visit Type"
                  />
                </Col>
                <Col lg={2} md={6} sm={12} className="mb-2">
                  <DatePicker
                    ref={datepickerRef}
                    placeholderText="From date"
                    dateFormat={'MM-dd-yyyy'}
                    className="form-control"
                    selected={
                      filterObj?.startDate
                        ? moment(filterObj?.startDate).toDate()
                        : filterObj?.endDate
                          ? moment(filterObj?.endDate).toDate()
                          : ''
                    }
                    value={
                      filterObj?.startDate
                        ? moment(filterObj.startDate).format('MM-DD-yyyy')
                        : ''
                    }
                    icon={clearIcon}
                    showIcon={true}
                    maxDate={moment(filterObj.endDate).toDate()}
                    onChange={(value) => {
                      if (value) {
                        const selectedDate = moment(value).format('YYYY-MM-DD');
                        setFilterObj((prevState) => ({
                          ...prevState,
                          startDate: selectedDate,
                        }));
                      } else {
                        setFilterObj((prevState) => ({
                          ...prevState,
                          startDate: '',
                        }));
                      }
                    }}
                  />
                </Col>
                <Col lg={2} md={6} sm={12} className="mb-2">
                  <DatePicker
                    ref={datepickerRef2}
                    placeholderText="To date"
                    dateFormat={'MM-dd-yyyy'}
                    className="form-control"
                    icon={clearIcon2}
                    showIcon={true}
                    value={
                      filterObj?.endDate
                        ? moment(filterObj?.endDate).format('MM-DD-yyyy')
                        : filterObj?.startDate
                          ? moment(filterObj?.startDate).format('MM-DD-yyyy')
                          : ''
                    }
                    selected={
                      filterObj?.endDate
                        ? moment(filterObj?.endDate).toDate()
                        : ''
                    }
                    minDate={moment(filterObj?.startDate).toDate()}
                    onChange={(value) => {
                      if (value) {
                        const selectedDate = moment(value).format('YYYY-MM-DD');
                        if (moment(value).isBefore(filterObj?.startDate)) {
                          setFilterObj((prevState) => ({
                            ...prevState,
                            endDate: '',
                          }));
                        } else {
                          setFilterObj((prevState) => ({
                            ...prevState,
                            endDate: selectedDate,
                          }));
                        }
                      } else {
                        setFilterObj((prevState) => ({
                          ...prevState,
                          endDate: '',
                        }));
                      }
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </div>
          <div className="clear-visit-filter">
            <CustomButton
              onClick={() => {
                if (currentStatus() !== 'ALL') {
                  setFilterObj((prevState) => ({
                    ...prevState,
                    type: null,
                    startDate: '',
                    endDate: '',
                  }));
                } else {
                  setFilterObj((prevState) => ({
                    ...prevState,
                    status: null,
                    type: null,
                    startDate: '',
                    endDate: '',
                  }));
                }
              }}
            >
              <MdOutlineCleaningServices />
              <div className="clear-visit-btn d-flex align-items-center gap-1">
                Clear Filters
              </div>
            </CustomButton>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterCard;
