import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { AiOutlineCopy } from 'react-icons/ai';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import { firstLatterCapital } from '@/utils/helper.utils';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import TableLoader from '@/components/loaders/TableLoader';

const TabDocumentList = ({
  isDocumentLoader,
  setSelectedDocument,
  setShowDeleteModal,
  documentTabList,
}) => {
  const clickToCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(TOAST_SUCCESS.URL_COPIED.MESSAGE, {
      toastId: TOAST_SUCCESS.URL_COPIED.ID,
    });
  };
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th className="w-20">Title</th>
            <th className="w-30">URL</th>
            <th className="w-50">Notes</th>
            <th className="w-1">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {isDocumentLoader ? (
            <TableLoader columns={4} rows={8} />
          ) : documentTabList?.length ? (
            documentTabList?.map((document, idx) => {
              return (
                <tr key={idx}>
                  <td className="w-20">
                    {firstLatterCapital(document?.title) || '-'}
                  </td>
                  <td className="w-30 text-underline ">
                    <a href={document?.url || '-'} target="_blank">
                      {document?.url || '-'}
                    </a>
                    <AiOutlineCopy
                      onClick={() => clickToCopy(document.url)}
                      size="20"
                      className="ml-2 cursor-pointer"
                    />
                  </td>
                  <td className="text-overflow-ellipsis w-50">
                    {firstLatterCapital(document?.note) || '-'}
                  </td>
                  <td>
                    <PermissionWrapper name={'DELETE_VISIT_DOCUMENT'}>
                      <BsTrash
                        role="button"
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowDeleteModal(true);
                        }}
                      />
                    </PermissionWrapper>
                  </td>
                </tr>
              );
            })
          ) : (
            <>
              {!isDocumentLoader && (
                <tr>
                  <td colSpan={3} className="text-center p-5">
                    <h5> No Document Found</h5>{' '}
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabDocumentList;
