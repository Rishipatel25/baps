import ReactPaginate from 'react-paginate';
import { IoIosPeople } from 'react-icons/io';
import { MdCall } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { checkObjectKey, formateDate, getInitials } from '@/utils/helper.utils';
import {
  TOAST_SUCCESS,
  TOUR_LISTING_INNERWIDTH,
  VISIT_STATUS,
  recordLimit,
} from '@/utils/constants/default.constants';
import PageProgressIcon from '@/components/page-progress';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/constants/routes.constants';
import GuestVisitListing from './GuestVisitListing';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { changeVisitStatusAction } from '@/redux/visits/action.visits';
import { toast } from 'react-toastify';

const TourPageContent = ({
  slotList,
  slotMetaData,
  isTourPageSlotLoader,
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
  currentSelectedTourSlot,
  setCurrentTourSlot,
  handleShowCompletedModal,
  handleShowCancelSlider,
  showCompletedModal,
  show,
  handleSuccessCloseCompletedModal,
  setSelectedGuest,
  selectedGuest,
  handleShow,
  setIsPreBookLoading,
  isPreBookLoading,
  filterObj,
  guestSearchData,
  setGuestSearchData,
}) => {
  const [isWideScreen, setIsWideScreen] = useState(true);
  const pathName = usePathname();
  const dispatch = useDispatch();

  function getPageTitle() {
    if (pathName.includes(ROUTES.TOUR.ALL)) {
      return 'All';
    }
    if (pathName.includes(ROUTES.TOUR.TODAY)) {
      return 'Today';
    }
    if (pathName.includes(ROUTES.TOUR.UPCOMING)) {
      return 'Upcoming';
    }
    return 'All';
  }

  function changeVisitStatus() {
    const visitStatusInfo = {
      visitId: selectedGuest?.visitId,
      visitStatusData: {
        stage: VISIT_STATUS.COMPLETED,
        reasonType: '',
        reason: '',
      },
    };
    dispatch(
      changeVisitStatusAction(visitStatusInfo, () => {
        toast.success('Visit Completed Successfully', {
          toastId: TOAST_SUCCESS.CHANGE_VISIT_STATUS_ACTION.ID,
        });
        handleSuccessCloseCompletedModal();
      }),
    );
  }

  const handleCardClick = (data) => {
    setCurrentTourSlot(data);
  };

  const handleCloseSlot = () => {
    setCurrentTourSlot(null);
  };

  const calculateStartIndex = () => {
    return (pageNo - 1) * pageSize + 1;
  };

  const calculateEndIndex = () => {
    return pageNo * pageSize > slotMetaData?.totalCount
      ? slotMetaData?.totalCount
      : pageNo * pageSize;
  };

  useEffect(() => {
    const handleResize = () => {
      const isWide = window.innerWidth > TOUR_LISTING_INNERWIDTH;
      setIsWideScreen(isWide);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isTourPageSlotLoader) {
    return <SpinnerLoader />;
  }

  return !slotList?.length ? (
    <PageProgressIcon
      icon={DashboardProgressIcon}
      title="No Data Available"
      description="There is no data to show you right now"
    />
  ) : (
    <div className="app-container">
      <div className="d-flex position-relative">
        <div className={`tour-listing  ${isWideScreen ? 'full-width' : ''} `}>
          <h5 className=" px-3 py-3">Tours - {getPageTitle()}</h5>
          <div className="wrapper-list">
            {slotList.map((slot) => {
              const {
                tourGuidePersonnelBasicInfoModel,
                startDateTime,
                maxGuestSize,
                bookedGuestSize,
                tourSlotId,
              } = slot;
              let fullName = 'Unassigned';
              let initials = 'UA';
              let phoneNo = '';

              if (
                tourGuidePersonnelBasicInfoModel &&
                checkObjectKey(tourGuidePersonnelBasicInfoModel)
              ) {
                const { firstName, lastName, phoneCountryCode, phoneNumber } =
                  tourGuidePersonnelBasicInfoModel;

                if (firstName && lastName) {
                  fullName = `${firstName} ${lastName}`;
                  initials = getInitials(firstName, lastName);
                }
                if (phoneCountryCode && phoneNumber) {
                  phoneNo = phoneCountryCode + ' ' + phoneNumber;
                }
              }

              return (
                <div
                  key={tourSlotId}
                  className={` ${
                    currentSelectedTourSlot?.tourSlotId === tourSlotId
                      ? 'tour-card'
                      : 'tour-card-not-selected'
                  }`}
                  onClick={() => {
                    handleCardClick(slot);
                  }}
                >
                  <div className="sm-d-none">
                    <div className="guest-profile">{initials}</div>
                  </div>

                  <div className="guest-details">
                    <div className="d-flex flex-wrap ml-2 text-wrap">
                      <div>
                        <strong>{fullName}</strong>
                      </div>
                      <div className="mx-1">
                        | {formateDate(startDateTime).systemDate}{' '}
                      </div>
                      <div>
                        <GoDotFill className="text-gray" />{' '}
                        {formateDate(startDateTime).systemTime}{' '}
                      </div>
                    </div>
                    <div className="ml-2 font-14">
                      {phoneNo ? (
                        <>
                          {' '}
                          <a href={phoneNo ? 'tel:' + phoneNo : '#'}>
                            <MdCall
                              size={18}
                              className="text-gray mr-1 "
                              role="button "
                            />{' '}
                          </a>
                          {phoneNo || ''}
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="guest-badge">
                    <div className="guest-count">
                      <IoIosPeople size={20} className="mr-1 text-gray" />{' '}
                      {bookedGuestSize || 0}/{maxGuestSize || 0}
                    </div>
                    <div className="text-center text-primary">Guests</div>
                  </div>
                </div>
              );
            })}
            <div className="d-flex justify-content-between flex-wrap pagination-table-tour">
              <div className="d-flex gap-3 align-items-center pagination-entries">
                <div>
                  {' '}
                  Showing {calculateStartIndex()} to {calculateEndIndex()} of{' '}
                  {slotMetaData?.totalCount || '-'} entries
                </div>
                <div>
                  <select
                    name="pagelimit"
                    id="pagelimit"
                    onChange={(e) => {
                      setPageSize(e.target.value);
                    }}
                    defaultValue={pageSize}
                  >
                    {recordLimit.map((limit, idx) => {
                      return (
                        <option value={limit} key={idx}>
                          {limit}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                <Pagination
                  metadata={slotMetaData}
                  setCurrentPage={setPageNo}
                  currentPage={pageNo}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Right Side Visiting Guests Slots Listing */}
        {currentSelectedTourSlot && (
          <GuestVisitListing
            currentSelectedTourSlot={currentSelectedTourSlot}
            handleCloseSlot={handleCloseSlot}
            setCurrentTourSlot={setCurrentTourSlot}
            setSelectedGuest={setSelectedGuest}
            handleShowCompletedModal={handleShowCompletedModal}
            handleShowCancelSlider={handleShowCancelSlider}
            handleShow={handleShow}
            setIsPreBookLoading={setIsPreBookLoading}
            isPreBookLoading={isPreBookLoading}
            filterObj={filterObj}
            searchData={guestSearchData}
            setSearchData={setGuestSearchData}
          />
        )}
      </div>
      {showCompletedModal && (
        <div
          className="modal show "
          style={{ display: 'block', position: 'initial' }}
        >
          <Modal
            show={show}
            onHide={handleShowCompletedModal}
            className="feedback-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Complete!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to complete!</Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  changeVisitStatus();
                }}
              >
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ metadata, currentPage = 1, setCurrentPage }) => {
  const handlePageChange = (e) => {
    const page = e.selected + 1;
    setCurrentPage(page);
  };
  return (
    <>
      <ReactPaginate
        previousLabel="&laquo;"
        breakLabel="..."
        nextLabel="&raquo;"
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        pageCount={metadata?.totalPages > 0 ? metadata?.totalPages : 1}
        forcePage={currentPage - 1}
        renderOnZeroPageCount={null}
        className="pagination justify-content-end mb-0"
        activeClassName="active"
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageClassName="page-item"
        pageLinkClassName="page-link"
      />
    </>
  );
};

export default TourPageContent;
