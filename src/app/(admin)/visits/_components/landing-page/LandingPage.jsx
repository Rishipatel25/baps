'use client';

import { setVisitTourFormData } from '@/redux/tour/action.tour';
import {
  createVisitFormAction,
  getVisitPersonnelByIdAction,
  getVisitsListAction,
  resetCreateVisitForm,
  setTabStatus,
  setVisitPersonnel,
} from '@/redux/visits/action.visits';
import { visitState } from '@/redux/visits/reducer.visits';
import {
  TOAST_SUCCESS,
  VISIT_FILTER_QUERY_PARAMS_KEYS,
} from '@/utils/constants/default.constants';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import VisitPageHeader from '../VisitPageHeader';
import Slider from '../Slider';
import VisitPageContent from '../VisitPageContent';
import moment from 'moment';
import { getLocalStorageData } from '@/utils/helper.utils';
import { personnelState } from '@/redux/personnel/reducer.personnel';

const LandingPage = () => {
  const [searchData, setSearchData] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [sortProperty, setSortProperty] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const [sliderShow, setSliderShow] = useState(false);
  const [currentVisitId, setCurrentVisitId] = useState(null);
  const [isFetchData, setFetchData] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [filterObj, setFilterObj] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: '',
    assigned:
      getLocalStorageData(LOCAL_STORAGE_KEYS.USER_PREFRENCES)?.v_self || false,
  });
  const { visitsList, metadata } = useSelector(visitState);
  const { selectedRole } = useSelector(personnelState);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const resetSlider = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.NEW_VISIT_DATA);
    setCurrentVisitId(null);
    dispatch(resetCreateVisitForm());
    dispatch(setVisitTourFormData({}));
    dispatch(setTabStatus({}));
  };

  const handleShow = () => {
    resetSlider();
    setSliderShow(true);
  };

  const handleClose = () => {
    router.replace(removeQueryParam('id'));
    resetSlider();
    setSliderShow(!sliderShow);
    dispatch(setVisitPersonnel([]));
  };

  const openVisitModal = (id) => {
    setCurrentVisitId(id);
    setSliderShow(true);
    if (!searchParams.get('id')) {
      const url = currentPath() + `&id=${id}`;
      router.push(url);
    }
    getVisitListApi();
  };
  const getVisitListApi = () => {
    const params = {
      pageNo: pageNo,
      pageSize: pageSize,
      sortProperty: sortProperty,
      sortDirection: sortDirection,
      search: searchData,
      startDateTime:
        filterObj.startDate &&
        moment(filterObj?.startDate).isValid() &&
        filterObj.startDate + ' 00:00:00',
      endDateTime:
        filterObj.endDate &&
        moment(filterObj?.endDate).isValid() &&
        filterObj.endDate + ' 23:59:59',
      visitStage: filterObj.status
        ? getStatus(filterObj.status.value)
        : currentStatus() !== 'ALL'
          ? currentStatus()
          : undefined,
      typeOfVisit: filterObj?.type?.value,
      selfAssignVisit: filterObj.assigned || false,
    };

    if (selectedRole?.data?.permissionModelList?.length) {
      const isPermission =
        selectedRole?.data?.permissionModelList?.some(
          (perm) => perm.name === 'VIEW_VISIT_ALL_LIST',
        ) ?? false;
      if (!isPermission) {
        params.selfAssignVisit = true;
      }
    }
    pageNo &&
      pageSize &&
      dispatch(
        getVisitsListAction(params, () => {
          setLoading(false);
        }),
      );
    setFetchData(false);
  };

  const getStatus = (status) => {
    if (status === 'ACTIVE') {
      return 'COMPLETED,ACCEPTED';
    }
    return filterObj.status.value;
  };

  const addVisitApiCall = (visitData) => {
    dispatch(
      createVisitFormAction(visitData, () => {
        toast.success(TOAST_SUCCESS.VISIT_CREATED_SUCCESSFULL.MESSAGE, {
          toastId: TOAST_SUCCESS.VISIT_CREATED_SUCCESSFULL.ID,
        });
        dispatch(resetCreateVisitForm());
        getVisitListApi();
        setSliderShow(false);
      }),
    );
  };

  const currentPath = () => {
    const path = pathname;
    const search = window.location.search;
    return path + search;
  };

  const removeQueryParam = (paramName) => {
    const path = pathname;
    let queryParams = '';
    let count = 0;
    searchParams.forEach((value, key) => {
      if (paramName !== key) {
        queryParams =
          count === 0 ? `?${key}=${value}` : queryParams + `&${key}=${value}`;
      }
      count++;
    });
    return path + queryParams;
  };

  const currentStatus = () => {
    const path = pathname;
    if (path.includes('pending')) {
      return 'PENDING';
    } else if (path.includes('accepted')) {
      return 'ACCEPTED';
    }
    return 'ALL';
  };

  useEffect(() => {
    let url = currentPath();
    const existingParam_4 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS +
      '=' +
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS);
    const updatedParam_4 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS +
      '=' +
      (filterObj.status ? filterObj.status.value : currentStatus());
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS) != null
        ? url.replace(existingParam_4, updatedParam_4)
        : url + '?' + updatedParam_4;

    const existingParam_1 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE +
      '=' +
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE);
    const updatedParam_1 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE +
      '=' +
      (pageSize || 10);
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE) !=
      null
        ? url.replace(existingParam_1, updatedParam_1)
        : url + '&' + updatedParam_1;

    const existingParam_2 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE +
      '=' +
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE);
    const updatedParam_2 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE +
      '=' +
      (pageNo || 1);
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE) !=
      null
        ? url.replace(existingParam_2, updatedParam_2)
        : url + '&' + updatedParam_2;

    const existingParam_3 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT +
      '=' +
      encodeURIComponent(
        searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT),
      );
    const updatedParam_3 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT +
      '=' +
      encodeURIComponent(searchData);
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT) != null
        ? url.replace(existingParam_3, updatedParam_3)
        : url + '&' + updatedParam_3;

    const existingParam_5 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE +
      '=' +
      encodeURIComponent(
        searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE),
      );
    const updatedParam_5 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE +
      '=' +
      (filterObj.type ? filterObj.type.value : '');
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE) != null
        ? url.replace(existingParam_5, updatedParam_5)
        : url + '&' + updatedParam_5;

    const existingParam_6 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE +
      '=' +
      encodeURIComponent(
        searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE),
      );
    const updatedParam_6 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE +
      '=' +
      encodeURIComponent(filterObj.startDate);
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE) != null
        ? url.replace(existingParam_6, updatedParam_6)
        : url + '&' + updatedParam_6;

    const existingParam_7 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE +
      '=' +
      encodeURIComponent(
        searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE),
      );
    const updatedParam_7 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE +
      '=' +
      encodeURIComponent(filterObj.endDate);
    url =
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE) != null
        ? url.replace(existingParam_7, updatedParam_7)
        : url + '&' + updatedParam_7;

    const existingParam_8 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_PROPERTY +
      '=' +
      encodeURIComponent(
        searchParams.get(
          VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_PROPERTY,
        ),
      );
    const updatedParam_8 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_PROPERTY +
      '=' +
      encodeURIComponent(sortProperty);
    url =
      searchParams.get(
        VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_PROPERTY,
      ) != null
        ? url.replace(existingParam_8, updatedParam_8)
        : url + '&' + updatedParam_8;

    const existingParam_9 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_DIRECTION +
      '=' +
      encodeURIComponent(
        searchParams.get(
          VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_DIRECTION,
        ),
      );
    const updatedParam_9 =
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_DIRECTION +
      '=' +
      encodeURIComponent(sortDirection);
    url =
      searchParams.get(
        VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_DIRECTION,
      ) != null
        ? url.replace(existingParam_9, updatedParam_9)
        : url + '&' + updatedParam_9;

    router.push(url);
  }, [pageSize, pageNo, searchData, filterObj, sortProperty, sortDirection]);

  useEffect(() => {
    const status = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS,
    );
    const type = searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE);
    const startDate = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE,
    );
    const endDate = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE,
    );
    const searchText = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT,
    );
    const pageNo = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE,
    );
    const pageSize = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE,
    );
    const sortProperty = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_PROPERTY,
    );
    const sortDirection = searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_SORT_DIRECTION,
    );
    const id = searchParams.get('id');

    if (
      status &&
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS) !== 'ALL' &&
      !filterObj.status
    ) {
      setFilterObj((prevState) => ({
        ...prevState,
        status: { value: status.toUpperCase(), label: status.toLowerCase() },
      }));
    }
    if (type && !filterObj.type) {
      setFilterObj((prevState) => ({
        ...prevState,
        type: {
          value: decodeURIComponent(type),
          label: decodeURIComponent(type),
        },
      }));
    }
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
    if (sortProperty) {
      setSortProperty(decodeURIComponent(sortProperty));
    }
    if (sortDirection) {
      setSortDirection(decodeURIComponent(sortDirection));
    }
    if (id) {
      openVisitModal(id);
    }
    setFetchData(true);
  }, [searchParams]);

  useEffect(() => {
    isFetchData && getVisitListApi();
  }, [isFetchData]);

  useEffect(() => {
    if (sliderShow) {
      document.body.classList.add('sliderOpen');
      dispatch(getVisitPersonnelByIdAction(currentVisitId));
    } else document.body.classList.remove('sliderOpen');
  }, [sliderShow]);

  return (
    <section>
      <VisitPageHeader
        handleShow={handleShow}
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
        setFetchData={setFetchData}
      />

      <Slider
        sliderShow={sliderShow}
        handleClose={handleClose}
        currentVisitId={currentVisitId}
        getVisitListApi={getVisitListApi}
        addVisitApiCall={addVisitApiCall}
      />

      <VisitPageContent
        isLoading={isLoading}
        visitsList={visitsList}
        metadata={metadata}
        pageSize={pageSize}
        setPageSize={(e) => {
          setPageNo(1);
          setPageSize(e);
        }}
        pageNo={pageNo}
        setPageNo={setPageNo}
        sortProperty={sortProperty}
        setSortProperty={(e) => {
          setPageNo(1);
          setSortProperty(e);
        }}
        sortDirection={sortDirection}
        setSortDirection={(e) => {
          setPageNo(1);
          setSortDirection(e);
        }}
        openVisitModal={openVisitModal}
      />
    </section>
  );
};

export default LandingPage;
