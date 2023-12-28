import CustomBadge from '@/components/Badge';
import Search from '@/components/SearchBox';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import { getAllPreBookedListAction } from '@/redux/pre-book/action.pre-book';
import { preBookedState } from '@/redux/pre-book/reducer.pre-book';
import { formateDate, getInitials } from '@/utils/helper.utils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import { IoIosPeople } from 'react-icons/io';
import { MdCall, MdLocationOn } from 'react-icons/md';
import { PiEnvelopeSimpleLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

const GuestVisitListing = ({
  currentSelectedTourSlot,
  handleCloseSlot,
  setSelectedGuest,
  handleShowCompletedModal,
  handleShowCancelSlider,
  handleShow,
  setIsPreBookLoading,
  isPreBookLoading,
  filterObj,
  searchData,
  setSearchData,
}) => {
  const pathname = usePathname();

  const { preBookedGuestList } = useSelector(preBookedState);
  const { selectedRole } = useSelector(personnelState);
  const { tourGuidePersonnelBasicInfoModel, startDateTime } =
    currentSelectedTourSlot;

  const dispatch = useDispatch();

  const getGuestStage = (stage) => {
    switch (stage) {
      case 'ACCEPTED':
        return 'dropcolor-green';
      case 'COMPLETED':
        return 'dropcolor-info';
      case 'NOSHOW':
        return 'dropcolor-gray';
      case 'CANCELLED':
        return 'dropcolor-danger';
      default:
        return '';
    }
  };

  const getGuestList = () => {
    const params = {
      tourSlotId: currentSelectedTourSlot.tourSlotId,
      search: searchData || '',
      pageNo: 1,
      pageSize: 1000,
      selfAssignVisit: false,
    };
    if (pathname.includes('today') || pathname.includes('upcoming')) {
      params.visitStage = 'ACCEPTED';
    } else {
      params.visitStage = filterObj?.stage?.value || '';
    }
    if (selectedRole?.data?.permissionModelList?.length) {
      const isPermission =
        selectedRole?.data?.permissionModelList?.some(
          (perm) => perm.name === 'VIEW_PRE_BOOKED_VISIT_SELF_ASSIGN_LIST',
        ) ?? false;
      if (!isPermission) {
        params.selfAssignVisit = true;
      }
    }
    dispatch(
      getAllPreBookedListAction(
        params,
        () => {
          setIsPreBookLoading(false);
        },
        () => {
          setIsPreBookLoading(false);
        },
      ),
    );
  };

  useEffect(() => {
    setIsPreBookLoading(true);
    getGuestList();
  }, [searchData]);

  const handleSearchChange = (e) => {
    setSearchData(e.target.value);
  };

  return (
    <div className="tour-listing-slot">
      <div className="tour-slot-title px-3 py-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button onClick={handleCloseSlot} className="back-list">
            <FaArrowLeft size={10} />
          </button>

          <h5>Guest visiting for slot </h5>
          <p>{startDateTime ? formateDate(startDateTime).systemTime : ''}</p>
          <p className="text-gray">
            <GoDotFill className="mb-1" />{' '}
            {startDateTime ? formateDate(startDateTime).systemDate : ''}
          </p>
        </div>
        <div className="d-flex flex-wrap justify-content-center align-items-center">
          {tourGuidePersonnelBasicInfoModel?.phoneCountryCode &&
            tourGuidePersonnelBasicInfoModel?.phoneNumber && (
              <div>
                <a
                  href={`tel:${
                    tourGuidePersonnelBasicInfoModel?.phoneCountryCode +
                    ' ' +
                    tourGuidePersonnelBasicInfoModel?.phoneNumber
                  }`}
                >
                  <MdCall className="text-gray mr-1 mb-1 " role="button " />{' '}
                </a>
              </div>
            )}
          <h6>
            {tourGuidePersonnelBasicInfoModel?.lastName &&
            tourGuidePersonnelBasicInfoModel?.firstName
              ? tourGuidePersonnelBasicInfoModel?.firstName +
                ' ' +
                tourGuidePersonnelBasicInfoModel?.lastName
              : 'Unassigned'}
          </h6>
        </div>
      </div>

      <div>
        <div className="align-items-center m-2 search-input-guest p-2">
          <Search
            placeholder="Search Guests"
            value={searchData}
            showBorder={true}
            max_width="50%"
            onChange={(e) => handleSearchChange(e)}
            showBottomBorder={false}
          />
        </div>
      </div>
      {isPreBookLoading ? (
        <div className="guest-list-loader w-100">
          <SpinnerLoader />
        </div>
      ) : preBookedGuestList?.length ? (
        preBookedGuestList.map((guest, idx) => {
          const {
            primaryVisitorModel,
            seniorMaleCount,
            seniorFemaleCount,
            totalVisitors,
            stage = '',
            requestNumber,
            childMaleCount,
            childFemaleCount,
            adultMaleCount,
            adultFemaleCount,
          } = guest;
          let initials = 'UA';
          let fullName = '';
          if (primaryVisitorModel) {
            const { firstName, lastName } = primaryVisitorModel;
            if (firstName && lastName) {
              fullName = `${firstName} ${lastName}`;
              initials = getInitials(firstName, lastName);
            }
          }
          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedGuest(guest);
                handleShow(guest);
              }}
            >
              <div className="tour-slot-card">
                <div className="sm-d-none">
                  <div className="guest-profile">{initials}</div>
                </div>

                <div className="guest-details">
                  <div className="d-flex flex-wrap ml-2 text-wrap mb-2">
                    <div>
                      <strong>{fullName || ''} </strong>{' '}
                      <span className="font-12">{requestNumber}</span>
                      {primaryVisitorModel?.gender ? (
                        <CustomBadge variant={'secondary-light'}>
                          {primaryVisitorModel.gender}
                        </CustomBadge>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap ml-2 text-wrap mb-2 font-14">
                    {primaryVisitorModel?.phoneNumber &&
                      primaryVisitorModel?.phoneCountryCode}
                    <div className="mright-3 pt-c-2">
                      <a
                        href={`tel:${
                          primaryVisitorModel?.phoneCountryCode +
                          ' ' +
                          primaryVisitorModel?.phoneNumber
                        }`}
                      >
                        <MdCall
                          className="text-gray mr-1 "
                          size={18}
                          role="button "
                        />{' '}
                      </a>
                      {primaryVisitorModel?.phoneCountryCode +
                        ' ' +
                        primaryVisitorModel?.phoneNumber}
                    </div>
                    {primaryVisitorModel?.email && (
                      <div>
                        <a href={`mailto:${primaryVisitorModel?.email}`}>
                          <PiEnvelopeSimpleLight
                            className="text-gray mr-1"
                            size={18}
                          />
                        </a>
                        {primaryVisitorModel?.email}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-wrap ml-2 text-wrap mb-2 font-14">
                    <div>
                      <MdLocationOn className="text-gray mr-2" size={18} />
                      {[
                        primaryVisitorModel?.addressLine1,
                        primaryVisitorModel?.addressLine2,
                        primaryVisitorModel?.city,
                        primaryVisitorModel?.postalCode,
                        // primaryVisitorModel?.state,
                        // primaryVisitorModel?.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap ml-2 text-wrap mt-2 gap-3">
                    <GuestCountsBadge
                      male={seniorMaleCount}
                      female={seniorFemaleCount}
                      label="Senior"
                    />
                    <GuestCountsBadge
                      male={adultMaleCount}
                      female={adultFemaleCount}
                      label="Adult"
                    />
                    <GuestCountsBadge
                      male={childMaleCount}
                      female={childFemaleCount}
                      label="Child"
                    />
                  </div>
                </div>

                <div className="guest-badge-slot">
                  <div className="stage">
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={stage || ''}
                      className={`guest-slot ${getGuestStage(stage)} ${
                        ['COMPLETED', 'CANCELLED'].includes(stage)
                          ? 'disabled-tour'
                          : ''
                      }`}
                      disabled={['COMPLETED', 'CANCELLED'].includes(stage)}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <PermissionWrapper name={'UPDATE_PRE_BOOKED_VISIT'}>
                        {!pathname.includes('upcoming') && (
                          <Dropdown.Item
                            onClick={() => {
                              setSelectedGuest(guest);
                              handleShowCompletedModal(true);
                            }}
                          >
                            Completed
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item
                          onClick={() => {
                            setSelectedGuest(guest);
                            handleShowCancelSlider(true);
                          }}
                        >
                          Cancelled
                        </Dropdown.Item>
                      </PermissionWrapper>
                    </DropdownButton>
                  </div>
                  <div
                    className="guest-count"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IoIosPeople size={22} className="mr-1 text-gray" />{' '}
                    {totalVisitors || 0}
                  </div>
                  <div
                    className="text-center text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Guests
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-guest-found">No Guest Found</div>
      )}
    </div>
  );
};

const GuestCountsBadge = ({ label, male, female }) => {
  return (
    <div className="d-flex align-items-center">
      <CustomBadge variant={'secondary-light'}>
        {label}{' '}
        <span>
          <span>M - </span>
          {male || 0}
        </span>{' '}
        |{' '}
        <span>
          <span>F - </span>
          {female || 0}
        </span>
      </CustomBadge>
    </div>
  );
};

export default GuestVisitListing;
