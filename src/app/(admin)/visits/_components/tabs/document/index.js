import { useEffect, useState } from 'react';
import TabDocumentForm from './form';
import TabDocumentList from './List';
import { useDispatch, useSelector } from 'react-redux';
import {
  DELETE_DOCUMENT_ACTION,
  GET_DOCUMENT_LIST_ACTION,
} from '@/redux/visits/action.visits';
import { visitState } from '@/redux/visits/reducer.visits';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import { RxCross1 } from 'react-icons/rx';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import CustomButton from '@/components/Button';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import PageProgressIcon from '@/components/page-progress';

const TabDocument = ({ currentVisitId, tabStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [documentTabList, setDocumentTabList] = useState([]);

  const { isDocumentDeleteLoader } = useSelector(visitState);
  const dispatch = useDispatch();
  const { documentList, isDocumentLoader } = useSelector(visitState);

  const handleShow = () => {
    setShowForm(!showForm);
  };
  const deleteDocument = () => {
    if (selectedDocument.title) {
      dispatch(
        DELETE_DOCUMENT_ACTION(
          {
            visitId: currentVisitId,
            title: encodeURIComponent(selectedDocument.title),
          },
          () => {
            dispatch(GET_DOCUMENT_LIST_ACTION(currentVisitId));
            setShowDeleteModal(false);
            toast.success(TOAST_SUCCESS.DELETE_DOCUMENT.MESSAGE, {
              toastId: TOAST_SUCCESS.DELETE_DOCUMENT.ID,
            });
          },
        ),
      );
    }
  };
  const handleAddDocument = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  useEffect(() => {
    // Call api
    dispatch(GET_DOCUMENT_LIST_ACTION(currentVisitId));
  }, []);

  useEffect(() => {
    if (documentList?.length) {
      setDocumentTabList(documentList);
    }
  }, [documentList]);

  useEffect(() => {
    setDocumentTabList(
      documentList.filter((item) => {
        return searchValue === ''
          ? item
          : item.title.toLowerCase().includes(searchValue.toLowerCase());
      }),
    );
  }, [searchValue]);

  if (!showForm && !documentList?.length && !isDocumentLoader) {
    return (
      <PageProgressIcon
        icon={DashboardProgressIcon}
        title="No Data Available"
        description="There is no data to show you right now"
        buttonText="+ ADD DOCUMENT"
        buttonAction={handleAddDocument}
        handleClose={handleClose}
        name={'ADD_VISIT_DOCUMENT'}
      />
    );
  }
  return (
    <>
      <ModalDelete
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        successAction={deleteDocument}
        selectedDocument={selectedDocument}
        title="Delete document"
        body="Are you sure? You want to delete!"
        actionBtnText="Delete"
        cancelBtnText="Cancel"
        isLoading={isDocumentDeleteLoader}
      />
      {showForm ? (
        <TabDocumentForm
          showForm={showForm}
          setShowForm={setShowForm}
          isDocumentLoader={isDocumentLoader}
          currentVisitId={currentVisitId}
          handleClose={handleClose}
          tabStatus={tabStatus}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center pt-4 pb-3">
            <div className="d-flex gap-2 align-items-center search-input">
              <input
                type="text"
                id="visit-search"
                placeholder="Search Document"
                className="inside-search-input"
                value={searchValue}
                autoComplete="off"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {searchValue.length ? (
                <button
                  className="cross-search-icon"
                  onClick={() => setSearchValue('')}
                >
                  <RxCross1
                    id="visit-search"
                    className="cursor-pointer inside-search-icon"
                  />
                </button>
              ) : (
                <button className="cross-search-icon">
                  <FiSearch
                    id="visit-search"
                    className="cursor-pointer inside-search-icon "
                  />
                </button>
              )}
            </div>
            <div className="document-add-btn">
              <PermissionWrapper name={'ADD_VISIT_DOCUMENT'}>
                <CustomButton variant="outline-secondary" onClick={handleShow}>
                  <MdAdd size={15} />
                  <span className="hide-sm">ADD</span>
                </CustomButton>
              </PermissionWrapper>
            </div>
          </div>

          <TabDocumentList
            handleShow={handleShow}
            documentList={documentList}
            isDocumentLoader={isDocumentLoader}
            currentVisitId={currentVisitId}
            setSelectedDocument={setSelectedDocument}
            setShowDeleteModal={setShowDeleteModal}
            searchValue={searchValue}
            documentTabList={documentTabList}
            showForm={showForm}
          />
        </>
      )}
    </>
  );
};

const ModalDelete = ({
  showModal,
  setShowModal,
  successAction,
  title,
  body,
  actionBtnText,
  cancelBtnText,
  isLoading,
}) => {
  const handleModalClose = () => setShowModal(false);
  return (
    <Modal show={showModal} onHide={handleModalClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <CustomButton
          variant="primary"
          onClick={successAction}
          disabled={isLoading}
        >
          {actionBtnText}
        </CustomButton>
        <CustomButton
          variant="secondary"
          onClick={handleModalClose}
          disabled={isLoading}
        >
          {cancelBtnText}
        </CustomButton>
      </Modal.Footer>
    </Modal>
  );
};

export default TabDocument;
