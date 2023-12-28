'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  TOUR_FILTER_QUERY_PARAMS_KEYS,
  TOUR_LISTING_INNERWIDTH,
} from '@/utils/constants/default.constants';
import TourPageHeader from '../TourPageHeader';
import TourPageContent from '../listing/TourPageContent';
import TourSlider from '../TourSlider';
import TourCancelSlider from '../TourCancelSlider';
import { getTourPageSlotListing } from '@/redux/tour-page/action.tour-page';
import { getAllPreBookedListAction } from '@/redux/pre-book/action.pre-book';
import { tourPageSlotState } from '@/redux/tour-page/reducer.tour-page';
import moment from 'moment';
import { getLocalStorageData } from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { personnelState } from '@/redux/personnel/reducer.personnel';

const LandingPage = () => {
  const [sliderShow, setSliderShow] = useState(false);
  const [sliderCancelOpen, setSliderCancelOpen] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [show, setShow] = useState(false);
  const [filterObj, setFilterObj] = useState({
    startDate: '',
    endDate: '',
    stage: '',
    assigned:
      getLocalStorageData(LOCAL_STORAGE_KEYS.USER_PREFRENCES)?.t_self || false,
  });
  const [currentSelectedTourSlot, setCurrentTourSlot] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isSlotLoading, setIsSlotLoading] = useState(true);
  const [isPreBookLoading, setIsPreBookLoading] = useState(true);
  const [isFetchData, setFetchData] = useState(false);

  const { tourPageSlotList, tourPageSlotMetaData } =
    useSelector(tourPageSlotState);
  const { selectedRole } = useSelector(personnelState);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [guestSearchData, setGuestSearchData] = useState('');

  const handleShowCompletedModal = () => {
    setShowCompletedModal(!showCompletedModal);
    setShow(!showCompletedModal);
  };

  const handleShowCancelSlider = () => {
    setSliderCancelOpen(true);
  };
  const handleSliderCancelClose = () => {
    setSliderCancelOpen(false);
  };

  const handleShow = () => {
    setSliderShow(true);
  };

  const handleClose = () => {
    getGuestListApi();
    setSliderShow(!sliderShow);
  };

  const getSlotsApi = () => {
    setIsSlotLoading(true);
    const params = {
      pageNo: pageNo,
      pageSize: pageSize,
      search: searchData,
      sortProperty: 'startDateTime',
      // selfAssignVisit: false,
      hasVisit: true,
      selfAssignVisit: filterObj.assigned || false,
    };
    if (pathname.includes('today')) {
      params.startDateTime = moment().format('YYYY-MM-DD') + ' ' + '00:00:00';
      params.endDateTime = moment().format('YYYY-MM-DD') + ' ' + '23:59:59';
      params.sortDirection = 'ASC';
      params.hasVisit = false;
    } else if (pathname.includes('upcoming')) {
      params.startDateTime =
        moment().add(1, 'days').format('YYYY-MM-DD') + ' ' + '00:00:00';
      if (filterObj?.startDate && moment(filterObj?.startDate).isValid()) {
        params.startDateTime = filterObj?.startDate + ' 00:00:00';
      }
      if (filterObj?.endDate && moment(filterObj?.endDate).isValid()) {
        params.endDateTime = filterObj?.endDate + ' 23:59:59';
      }
      params.visitStage = 'ACCEPTED';
      params.sortDirection = 'ASC';
    } else if (pathname.includes('all')) {
      const { startDate, endDate, stage } = filterObj;
      params.sortDirection = 'DESC';
      if (startDate && moment(startDate).isValid()) {
        params.startDateTime = startDate + ' 00:00:00';
      }
      if (endDate && moment(endDate).isValid()) {
        params.endDateTime = endDate + ' 23:59:59';
      }
      if (stage?.value) {
        params.visitStage = stage?.value;
      }
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
    pageNo &&
      pageSize &&
      dispatch(
        getTourPageSlotListing(
          params,
          (res) => {
            if (res?.length && window.innerWidth > TOUR_LISTING_INNERWIDTH) {
              setCurrentTourSlot(res[0] || null);
            }
            setIsSlotLoading(false);
          },
          () => {
            setIsSlotLoading(false);
          },
        ),
      );
    setFetchData(false);
  };

  const getGuestListApi = () => {
    setIsPreBookLoading(true);
    const params = {
      tourSlotId: currentSelectedTourSlot.tourSlotId,
      search: guestSearchData || '',
      pageNo: 1,
      pageSize: 1000,
      // selfAssignVisit: false,
      selfAssignVisit: filterObj.assigned || false,
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

  const currentPath = () => {
    const path = pathname;
    const search = window.location.search;
    return path + search;
  };

  useEffect(() => {
    let url = currentPath();

    const existingParam_1 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_PAGE_SIZE +
      '=' +
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_PAGE_SIZE);
    const updatedParam_1 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_PAGE_SIZE +
      '=' +
      (pageSize || 10);
    url =
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_PAGE_SIZE) !=
      null
        ? url.replace(existingParam_1, updatedParam_1)
        : url + '?' + updatedParam_1;

    const existingParam_2 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_CURENT_PAGE +
      '=' +
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_CURENT_PAGE);
    const updatedParam_2 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_CURENT_PAGE + '=' + (pageNo || 1);
    url =
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_CURENT_PAGE) !=
      null
        ? url.replace(existingParam_2, updatedParam_2)
        : url + '&' + updatedParam_2;

    const existingParam_3 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_SEARCH_TEXT +
      '=' +
      encodeURIComponent(
        searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_SEARCH_TEXT),
      );
    const updatedParam_3 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_SEARCH_TEXT +
      '=' +
      encodeURIComponent(searchData);
    url =
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_SEARCH_TEXT) != null
        ? url.replace(existingParam_3, updatedParam_3)
        : url + '&' + updatedParam_3;

    const existingParam_6 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_START_DATE +
      '=' +
      encodeURIComponent(
        searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_START_DATE),
      );
    const updatedParam_6 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_START_DATE +
      '=' +
      encodeURIComponent(filterObj.startDate);
    url =
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_START_DATE) != null
        ? url.replace(existingParam_6, updatedParam_6)
        : url + '&' + updatedParam_6;

    const existingParam_7 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_END_DATE +
      '=' +
      encodeURIComponent(
        searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_END_DATE),
      );
    const updatedParam_7 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_END_DATE +
      '=' +
      encodeURIComponent(filterObj.endDate);
    url =
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_END_DATE) != null
        ? url.replace(existingParam_7, updatedParam_7)
        : url + '&' + updatedParam_7;

    const existingParam_8 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_TYPE +
      '=' +
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_TYPE);
    const updatedParam_8 =
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_TYPE +
      '=' +
      (filterObj.stage ? filterObj.stage.value : '');
    url =
      searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_TYPE) != null
        ? url.replace(existingParam_8, updatedParam_8)
        : url + '&' + updatedParam_8;
    router.push(url);
  }, [pageSize, pageNo, searchData, filterObj]);

  useEffect(() => {
    const startDate = searchParams.get(
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_START_DATE,
    );
    const endDate = searchParams.get(
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_END_DATE,
    );
    const searchText = searchParams.get(
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_SEARCH_TEXT,
    );
    const pageNo = searchParams.get(
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_CURENT_PAGE,
    );
    const pageSize = searchParams.get(
      TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_LIST_PAGE_SIZE,
    );
    // const slotId = searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_ID);
    // setGuestSearchData(
    //   searchParams.get(TOUR_FILTER_QUERY_PARAMS_KEYS.SLOT_SEARCH_TEXT) || '',
    // );

    if (startDate && !filterObj.startDate && moment(startDate).isValid()) {
      setFilterObj((prevState) => ({
        ...prevState,
        startDate: decodeURIComponent(startDate),
      }));
    }
    if (endDate && !filterObj.endDate && moment(endDate).isValid()) {
      setFilterObj((prevState) => ({
        ...prevState,
        endDate: decodeURIComponent(endDate),
      }));
    }
    if (searchText && !searchData) {
      setSearchData(decodeURIComponent(searchText));
    }
    if (pageNo) {
      setPageNo(pageNo);
    }
    if (pageSize) {
      setPageSize(pageSize);
    }
    // if (!slotId) {
    // }
    setFetchData(true);
  }, [searchParams]);

  useEffect(() => {
    if (currentSelectedTourSlot?.tourSlotId) {
      getGuestListApi();
    }
  }, [currentSelectedTourSlot]);

  useEffect(() => {
    isFetchData && getSlotsApi();
  }, [isFetchData]);

  return (
    <section>
      <TourPageHeader
        searchData={searchData}
        setSearchData={(e) => {
          setPageNo(1);
          setSearchData(e);
        }}
        filterObj={filterObj}
        setFilterObj={(e) => {
          setPageNo(1);
          setFilterObj(e);
        }}
        isFilterBtnActive={!pathname.includes('today')}
        setFetchData={setFetchData}
      />

      <TourSlider
        sliderShow={sliderShow}
        handleClose={handleClose}
        selectedGuest={selectedGuest}
      />
      <TourCancelSlider
        handleSliderSuccessClose={() => {
          getSlotsApi();
          handleSliderCancelClose();
        }}
        handleSliderCancelClose={handleSliderCancelClose}
        handleShowCancelSlider={handleShowCancelSlider}
        sliderCancelOpen={sliderCancelOpen}
        selectedGuest={selectedGuest}
      />

      <TourPageContent
        isTourPageSlotLoader={isSlotLoading}
        slotList={tourPageSlotList}
        slotMetaData={tourPageSlotMetaData}
        pageSize={pageSize}
        handleShowCompletedModal={handleShowCompletedModal}
        currentSelectedTourSlot={currentSelectedTourSlot}
        setCurrentTourSlot={setCurrentTourSlot}
        handleSuccessCloseCompletedModal={() => {
          getSlotsApi();
          handleShowCompletedModal();
        }}
        showCompletedModal={showCompletedModal}
        show={show}
        handleShowCancelSlider={handleShowCancelSlider}
        setPageSize={(e) => {
          setPageNo(1);
          setPageSize(e);
        }}
        handleShow={handleShow}
        handleClose={handleClose}
        pageNo={pageNo}
        setPageNo={setPageNo}
        selectedGuest={selectedGuest}
        setSelectedGuest={setSelectedGuest}
        setIsPreBookLoading={setIsPreBookLoading}
        isPreBookLoading={isPreBookLoading}
        filterObj={filterObj}
        guestSearchData={guestSearchData}
        setGuestSearchData={setGuestSearchData}
      />
    </section>
  );
};

export default LandingPage;
