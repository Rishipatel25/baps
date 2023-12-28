import { VISIT_FILTER_QUERY_PARAMS_KEYS } from '@/utils/constants/default.constants';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
/**
 * custom hook to create DB query for selected filter
 * @returns {Object} all generated filter query object
 */
export default function useVisitsListFilterQueryBuilder() {
  const [filterQuery, setFilterQuery] = useState('');
  const searchParams = useSearchParams();
  const queryParams = {
    visitStageEnum: searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS,
    ),
    typeOfVisit: searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE),
    startDateTime: searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE,
    ),
    endDateTime: searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE,
    ),
    searchText: searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT,
    ),
    pageSize: searchParams.get(
      VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE,
    ),
  };
  useEffect(() => {
    const query = {
      filter: '',
      nestedFilter: '',
      pageSize: searchParams.get(
        VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE,
      ),
      pageNo: searchParams.get(
        VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE,
      ),
      sorting: '',
    };

    // filter status
    if (
      queryParams.visitStageEnum &&
      queryParams.visitStageEnum.toLowerCase() !== 'all'
    ) {
      query.filter = query.filter
        ? `${query.filter};visitStageEnum=="${queryParams.visitStageEnum}"`
        : `visitStageEnum=="${queryParams.visitStageEnum}"`;
    }
    // filter type
    if (queryParams.typeOfVisit) {
      query.filter = query.filter
        ? `${query.filter};typeOfVisit=in=("${queryParams.typeOfVisit.replace(
            '-',
            '","',
          )}")`
        : `typeOfVisit=in=("${queryParams.typeOfVisit.replace('-', '","')}")`;
    }

    // nested filter search
    if (queryParams.searchText) {
      query.nestedFilter = `(visitVisitorList.visitorContactTypeEnum=="PRIMARY";visitVisitorList.visitor.firstName=ilike='${queryParams.searchText}'),requestNumber=ilike='${queryParams.searchText}'`;
    }
    // filter date
    if (
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE) &&
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE)
    ) {
      query.filter = query.filter
        ? `${query.filter};(startDateTime=ge="${queryParams.startDateTime} 00:00:00";startDateTime=le="${queryParams.endDateTime} 00:00:00",endDateTime=ge="${queryParams.startDateTime} 23:59:59";endDateTime=le="${queryParams.endDateTime} 23:59:59")`
        : `(startDateTime=ge="${queryParams.startDateTime} 00:00:00";startDateTime=le="${queryParams.endDateTime} 00:00:00",endDateTime=ge="${queryParams.startDateTime} 23:59:59";endDateTime=le="${queryParams.endDateTime} 23:59:59")`;
    } else if (
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE)
    ) {
      query.filter = query.filter
        ? `${query.filter};startDateTime=ge="${queryParams.startDateTime} 00:00:00"`
        : `startDateTime=ge="${queryParams.startDateTime} 00:00:00"`;
    } else if (
      searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE)
    ) {
      query.filter = query.filter
        ? `${query.filter};endDateTime=le="${queryParams.endDateTime} 00:00:00"`
        : `endDateTime=le="${queryParams.endDateTime} 00:00:00"`;
    }
    setFilterQuery(query);
  }, [
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS),
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_TYPE),
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_START_DATE),
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_END_DATE),
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_SEARCH_TEXT),
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_PAGE_SIZE),
    searchParams.get(VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_LIST_CURENT_PAGE),
  ]);
  return filterQuery;
}
