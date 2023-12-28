import { VISIT_STATUS, recordLimit } from '@/utils/constants/default.constants';
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import CustomBadge from '@/components/Badge';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';
import { useRouter } from 'next/navigation';
import { formateDate } from '@/utils/helper.utils';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { ROUTES } from '@/utils/constants/routes.constants';
import TableLoader from '@/components/loaders/TableLoader';

const VisitPageContent = ({
  isLoading = true,
  visitsList = [],
  setPageNo = () => {},
  pageNo = 1,
  metadata = {},
  setPageSize = () => {},
  pageSize = recordLimit[0],
  openVisitModal = () => {},
  sortProperty,
  setSortProperty = () => {},
  sortDirection,
  setSortDirection = () => {},
}) => {
  const router = useRouter();

  const getStatus = (stage) => {
    switch (stage) {
      case VISIT_STATUS.PENDING:
        return <CustomBadge variant="secondary">Pending</CustomBadge>;
      case VISIT_STATUS.ACCEPT:
        return <CustomBadge variant="success">Accepted</CustomBadge>;
      case VISIT_STATUS.CANCEL:
        return <CustomBadge variant="warning">Cancelled</CustomBadge>;
      case VISIT_STATUS.DECLINED:
        return <CustomBadge variant="gray">Declined</CustomBadge>;
      case VISIT_STATUS.COMPLETED:
        return <CustomBadge variant="info">Completed</CustomBadge>;
      case VISIT_STATUS.CLOSED:
        return <CustomBadge variant="danger">Closed</CustomBadge>;
      case VISIT_STATUS.EXPIRED:
        return <CustomBadge variant="danger">Expired</CustomBadge>;
      default:
        return <span>-</span>;
    }
  };
  const calculateStartIndex = () => {
    return (pageNo - 1) * pageSize + 1;
  };
  const calculateEndIndex = () => {
    return pageNo * pageSize > metadata?.totalCount
      ? metadata?.totalCount
      : pageNo * pageSize;
  };
  const sortData = (column) => {
    setSortProperty(column);
    if (sortProperty === column) {
      if (sortDirection === '') {
        setSortDirection('ASC');
      } else if (sortDirection === 'ASC') {
        setSortDirection('DESC');
      } else {
        setSortDirection('');
        setSortProperty('');
      }
    } else {
      setSortDirection('ASC');
    }
  };

  return (
    <>
      <div className="app-container">
        <h5 className="can p-2 font-weight-bold">Visit</h5>
        <>
          <div className="table-container">
            <table className="table table-borderless sticky-visit-head">
              <thead>
                <tr>
                  <th onClick={() => sortData('requestNumber')}>
                    <div className="visit-thead">
                      <div> REFERENCE # </div>
                      <div>
                        {sortProperty === 'requestNumber' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('primaryVisitorName')}>
                    <div className="visit-thead">
                      <div> VISITOR NAME</div>
                      <div>
                        {sortProperty === 'primaryVisitorName' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('typeOfVisit')}>
                    <div className="visit-thead">
                      <div> VISIT TYPE</div>
                      <div>
                        {sortProperty === 'typeOfVisit' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('relationshipMangerName')}>
                    <div className="visit-thead">
                      <div> RELATIONSHIP MANAGER</div>
                      <div>
                        {sortProperty === 'relationshipMangerName' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('guestVisitCoordinatorName')}>
                    <div className="visit-thead">
                      <div>Guest Visit Coordinator </div>
                      <div>
                        {sortProperty === 'guestVisitCoordinatorName' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('totalVisitors')}>
                    <div className="visit-thead">
                      <div> #Guest </div>
                      <div>
                        {sortProperty === 'totalVisitors' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('startDateTime')}>
                    <div className="visit-thead">
                      <div> Visit Date & Time </div>
                      <div>
                        {sortProperty === 'startDateTime' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th onClick={() => sortData('visitStageEnum')}>
                    <div className="visit-thead">
                      <div> Status</div>
                      <div>
                        {sortProperty === 'visitStageEnum' && (
                          <Sort dir={sortDirection} />
                        )}
                      </div>
                    </div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableLoader columns={9} rows={5} />
                ) : (
                  <>
                    {visitsList?.length ? (
                      visitsList?.map((visitData, index) => {
                        let relationManager = '-';
                        let coordinator = '-';
                        if (
                          visitData?.relationshipManagerPersonnelBasicInfoModel
                            ?.firstName &&
                          visitData?.relationshipManagerPersonnelBasicInfoModel
                            ?.lastName
                        ) {
                          relationManager =
                            visitData
                              ?.relationshipManagerPersonnelBasicInfoModel
                              ?.firstName +
                            ' ' +
                            visitData
                              ?.relationshipManagerPersonnelBasicInfoModel
                              ?.lastName;
                        }
                        if (
                          visitData
                            ?.guestVisitCoordinatorPersonnelBasicInfoModel
                            ?.firstName &&
                          visitData
                            ?.guestVisitCoordinatorPersonnelBasicInfoModel
                            ?.lastName
                        ) {
                          coordinator =
                            visitData
                              ?.guestVisitCoordinatorPersonnelBasicInfoModel
                              ?.firstName +
                            ' ' +
                            visitData
                              ?.guestVisitCoordinatorPersonnelBasicInfoModel
                              ?.lastName;
                        }

                        return (
                          <tr
                            key={index}
                            onClick={() => {
                              openVisitModal(visitData?.visitId);
                            }}
                            className="visit_table"
                          >
                            <td key={index} className="cursor-pointer visit_no">
                              <u>{visitData?.requestNumber}</u>
                            </td>
                            <td className="text-camel-case cursor-pointer">{`${visitData?.primaryVisitorModel?.firstName} ${visitData?.primaryVisitorModel?.lastName}`}</td>
                            <td className="text-red cursor-pointer">
                              {visitData?.typeOfVisit}
                            </td>
                            <td className="text-camel-case cursor-pointer">
                              {relationManager}
                            </td>
                            <td className="text-camel-case cursor-pointer">
                              {coordinator}
                            </td>
                            <td
                              className={`text-center ${
                                visitData?.totalVisitors <= 50
                                  ? 'text-primary cursor-pointer'
                                  : visitData?.totalVisitors <= 150
                                    ? 'text-success cursor-pointer'
                                    : visitData?.totalVisitors >= 151
                                      ? 'text-red cursor-pointer'
                                      : 'cursor-pointer'
                              }`}
                            >
                              {visitData?.totalVisitors}
                            </td>
                            <td className=" cursor-pointer">
                              {formateDate(visitData?.startDateTime).systemDate}
                              <br />
                              {formateDate(visitData?.startDateTime).systemTime}
                            </td>
                            <td className="visit-status cursor-pointer">
                              {getStatus(visitData?.stage)}
                            </td>
                            <td
                              className="cursor-pointer p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant="success"
                                  id="dropdown-basic"
                                  className="visit-dropdown"
                                >
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <PermissionWrapper
                                  name={'ADD_VISIT_EXTERNAL_FEEDBACK'}
                                >
                                  <Dropdown.Menu>
                                    {(visitData.stage === 'COMPLETED' ||
                                      visitData.stage === 'CLOSED') && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          router.push(
                                            `${
                                              ROUTES.VISITS.BASE +
                                              ROUTES.FEEDBACK
                                            }?visitId=${
                                              visitData.visitId
                                            }&requestNumber=${
                                              visitData.requestNumber
                                            }&visitorName=${
                                              visitData.primaryVisitorModel
                                                .firstName +
                                              ' ' +
                                              visitData.primaryVisitorModel
                                                .lastName
                                            }&totalVisitors=${
                                              visitData.totalVisitors
                                            }&startDateTime=${
                                              visitData.startDateTime
                                            }`,
                                          );
                                        }}
                                      >
                                        Feedback
                                      </Dropdown.Item>
                                    )}
                                    {visitData.stage !== 'COMPLETED' &&
                                      visitData.stage !== 'CLOSED' && (
                                        <Dropdown.Item disabled>
                                          Feedback
                                        </Dropdown.Item>
                                      )}
                                  </Dropdown.Menu>
                                </PermissionWrapper>
                              </Dropdown>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <>
                        {!isLoading && (
                          <tr>
                            <td
                              colSpan={9}
                              className="text-center p-5 no-rows-found"
                            >
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {visitsList?.length ? (
            <div className="d-flex justify-content-between pagination-table">
              <div className="d-flex gap-3 align-items-center pagination-entries">
                <div>
                  Showing {calculateStartIndex()} to {calculateEndIndex()} of{' '}
                  {metadata?.totalCount || '-'} entries
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
                  metadata={metadata}
                  setCurrentPage={setPageNo}
                  currentPage={pageNo}
                />
              </div>
            </div>
          ) : null}
        </>
      </div>
    </>
  );
};

export default VisitPageContent;

export const Pagination = ({ metadata, currentPage = 1, setCurrentPage }) => {
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

export const Sort = ({ dir }) => {
  return (
    <div className="cursor-pointer text-disable-select d-inline-block">
      <div className="d-flex flex-column gap-1 ms-1 sortingIcons" role="button">
        <AiOutlineCaretUp className={`iconUp ${dir === 'ASC' && 'active'}`} />
        <AiOutlineCaretDown className={`${dir !== 'ASC' && 'active'}`} />
      </div>
    </div>
  );
};
