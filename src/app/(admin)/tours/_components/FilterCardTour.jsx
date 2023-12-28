'use client';
import { lookupToObject } from '@/utils/helper.utils';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { Row, Col, Container } from 'react-bootstrap';
import CustomButton from '@/components/Button';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useRef, useEffect, useState } from 'react';
import CustomSelectDropdown from '@/components/form-group/custom-select/CustomSelectDropdown';
import { usePathname } from 'next/navigation';

const FilterCardTour = ({ filterObj, setFilterObj, showFilterCard }) => {
  const [minDate, setMinDate] = useState(undefined);

  const datepickerRef = useRef(null);
  const datepickerRef2 = useRef(null);
  const pathname = usePathname();
  const preBookVisitStatusOptions = lookupToObject(
    'PRE_BOOKED_VISIT_STAGE_FILTER',
  );
  const currentStatus = () => {
    const path = window.location.pathname;
    if (path.includes('upcoming')) {
      return 'UPCOMING';
    } else if (path.includes('today')) {
      return 'TODAY';
    } else if (path.includes('all')) {
      return 'ALL';
    }
    return 'ALL';
  };

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
  const clearIcon2 = (
    <span
      onClick={() => {
        const datepickerElement = datepickerRef2.current;
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

  useEffect(() => {
    const todayDate = moment().format('YYYY-MM-DD');
    const tomorrowDate = moment().add(1, 'days').format('YYYY-MM-DD');
    if (currentStatus() === 'TODAY') {
      setFilterObj((prevState) => ({
        ...prevState,
        startDate: todayDate,
        endDate: todayDate,
      }));
    } else if (currentStatus() === 'UPCOMING') {
      setMinDate(moment().add(1, 'days').toDate());
      setFilterObj((prevState) => ({
        ...prevState,
        startDate: tomorrowDate,
      }));
    }
  }, []);

  return (
    <>
      {showFilterCard && (
        <div className="filter-card">
          <div className="d-flex gap-3 filter-holder ">
            <Container fluid>
              <Row>
                {pathname.includes('all') && (
                  <Col lg={4} md={6} sm={12} className="mb-2">
                    <CustomSelectDropdown
                      options={preBookVisitStatusOptions}
                      className="dropdown-filter text-capitalize"
                      onChange={(e) => {
                        setFilterObj((prevState) => ({
                          ...prevState,
                          stage: e,
                        }));
                      }}
                      value={filterObj.stage}
                      isClearable={true}
                      placeholder="Select Status"
                    />
                  </Col>
                )}
                {!pathname.includes('today') && (
                  <Col lg={4} md={6} sm={12} className="mb-2">
                    <DatePicker
                      dateFormat={'MM-dd-yyyy'}
                      placeholderText="From date"
                      className="form-control"
                      minDate={minDate}
                      value={
                        filterObj?.startDate
                          ? moment(filterObj.startDate).format('MM-DD-yyyy')
                          : ''
                      }
                      maxDate={moment(filterObj.endDate).toDate()}
                      selected={
                        filterObj.startDate
                          ? moment(filterObj.startDate).toDate()
                          : filterObj.endDate
                            ? moment(filterObj.endDate).toDate()
                            : ''
                      }
                      ref={datepickerRef}
                      icon={clearIcon}
                      showIcon={true}
                      onChange={(value) => {
                        setFilterObj((prevState) => ({
                          ...prevState,
                          startDate: value
                            ? moment(value).format('YYYY-MM-DD')
                            : '',
                        }));
                      }}
                    />
                  </Col>
                )}
                {!pathname.includes('today') && (
                  <Col lg={4} md={6} sm={12} className="mb-2">
                    <DatePicker
                      dateFormat={'MM-dd-yyyy'}
                      placeholderText="To date"
                      className="form-control"
                      value={
                        filterObj?.endDate
                          ? moment(filterObj?.endDate).format('MM-DD-yyyy')
                          : ''
                      }
                      selected={
                        filterObj.endDate
                          ? moment(filterObj.endDate).toDate()
                          : filterObj.startDate
                            ? moment(filterObj.startDate).toDate()
                            : ''
                      }
                      showIcon={true}
                      icon={clearIcon2}
                      ref={datepickerRef2}
                      minDate={
                        filterObj.startDate
                          ? moment(filterObj.startDate).toDate()
                          : ''
                      }
                      onChange={(value) => {
                        const selectedDate = value
                          ? moment(value).format('YYYY-MM-DD')
                          : '';
                        if (
                          value &&
                          moment(value).isBefore(filterObj?.startDate)
                        ) {
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
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Container>
          </div>
          <div className="clear-visit-filter">
            <CustomButton
              onClick={() => {
                if (currentStatus() === 'UPCOMING') {
                  setFilterObj((prevState) => ({
                    ...prevState,
                    startDate: moment().add(1, 'days').format('YYYY-MM-DD'),
                    endDate: '',
                  }));
                } else {
                  setFilterObj((prevState) => ({
                    ...prevState,
                    stage: '',
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

export default FilterCardTour;
