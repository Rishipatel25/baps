import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { Modal } from 'react-bootstrap';
import { ERRORS } from '@/utils/constants/errors.constants';
import { Row, Col } from 'react-bootstrap';
import { SearchVisitorAction } from '@/redux/visits/action.visits';
import { Spinner } from 'react-bootstrap';
import FormikController from '@/components/form-group/formik-controllers';
import CustomButton from '@/components/Button';
import * as Yup from 'yup';

const SearchVisitorModal = ({
  searchText,
  closeAction = () => {},
  submitAction = () => {},
  showModal = false,
}) => {
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState({ visitor: '' });
  const [searchList, setSearchList] = useState([]);
  const [selectKey, setSelectKey] = useState(-1);
  const [isLoading, setLoading] = useState(true);

  const resetSearch = () => {
    setSearchData((prevState) => ({ ...prevState, visitor: '' }));
  };

  useEffect(() => {
    setLoading(true);
    if (searchData.visitor) {
      showModal &&
        dispatch(
          SearchVisitorAction(searchData.visitor, (res) => {
            setSearchList(res);
            setSelectKey(-1);
            setLoading(false);
          }),
        );
    } else {
      setSearchList([]);
      setLoading(false);
    }
  }, [searchData.visitor]);

  useEffect(() => {
    if (showModal) {
      setSearchData((prevState) => ({ ...prevState, visitor: searchText }));
      setSearchList([]);
      setSelectKey(-1);
    }
  }, [showModal]);

  return (
    <>
      <Modal
        show={showModal}
        size="lg"
        onHide={() => {
          resetSearch();
          closeAction();
        }}
        backdrop="static"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Search Visitor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={searchData}
            validationSchema={Yup.object({
              visitor: Yup.string().required(ERRORS.REQUIRED),
            })}
            onSubmit={(values) => {
              setSearchData(values);
            }}
            enableReinitialize
          >
            {({ values, errors, dirty, touched }) => (
              <Form>
                <Row className="mb-3">
                  <Col sm={10}>
                    <FormikController
                      control="input"
                      type="text"
                      values={values.visitor}
                      required={true}
                      dirty={dirty.visitor}
                      errors={errors.visitor}
                      touched={touched.visitor}
                      name="visitor"
                      placeholder={'Search Visitor'}
                    />
                  </Col>
                  <Col sm={2} className="ps-0">
                    <CustomButton variant="primary" type="submit">
                      Search
                    </CustomButton>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          {!isLoading ? (
            <div>
              {searchList.map((element, key) => {
                const {
                  salutation,
                  firstName,
                  lastName,
                  middleName,
                  phoneCountryCode,
                  phoneNumber,
                  email,
                  addressLine1,
                  addressLine2,
                  city,
                  //   country,
                  designation,
                  facebookId,
                  gender,
                  instagramId,
                  linkedinId,
                  organizationAddress,
                  organizationName,
                  organizationWebsite,
                  postalCode,
                  preferredCommMode,
                  telegramId,
                  twitterId,
                  visitorType,
                } = element;
                const concatenateWithPipe = (...values) =>
                  values.filter(Boolean).join(' | ');
                const fullName = salutation + ' ' + firstName + ' ' + lastName;
                const phone = phoneCountryCode + ' ' + phoneNumber;
                // const tempCountry = country
                const concatenatedData = concatenateWithPipe(
                  fullName,
                  middleName,
                  phone,
                  email,
                  addressLine1,
                  addressLine2,
                  city,
                  designation,
                  facebookId,
                  gender,
                  instagramId,
                  linkedinId,
                  organizationAddress,
                  organizationName,
                  organizationWebsite,
                  postalCode,
                  preferredCommMode,
                  telegramId,
                  twitterId,
                  visitorType,
                );
                return (
                  <div
                    key={key}
                    className={`search-row ${
                      selectKey === key && 'search-row-selected'
                    }`}
                    onClick={() => {
                      setSelectKey(key);
                    }}
                  >
                    {concatenatedData}
                  </div>
                );
              })}
              {searchList.length === 0 && (
                <div className="search-row">No Visitor Found.</div>
              )}
            </div>
          ) : (
            <div className="search-modal-loader">
              <Spinner animation="border" variant={'primary'} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            disabled={selectKey < 0}
            variant="primary"
            classes="px-4"
            onClick={() => {
              submitAction(searchList[selectKey]);
              resetSearch();
            }}
          >
            Ok
          </CustomButton>
          <CustomButton
            variant="secondary"
            onClick={() => {
              resetSearch();
              setSelectKey(-1);
            }}
          >
            Reset
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SearchVisitorModal;
