import {
  addDocumentAction,
  GET_DOCUMENT_LIST_ACTION,
  setTabStatus,
} from '@/redux/visits/action.visits';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import DocumentForm from './Form';
import { useState } from 'react';
import { ERRORS } from '@/utils/constants/errors.constants';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';

const documentTabInitialValues = {
  note: '',
  url: '',
  title: '',
};

const websiteRegex =
  /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/gi;

const validationSchema = Yup.object({
  title: Yup.string()
    .required(ERRORS.REQUIRED)
    .min(3, ERRORS.MIN_3)
    .max(36, ERRORS.MAX_36),
  note: Yup.string().min(3, ERRORS.MIN_3).max(255, ERRORS.MAX_255),
  url: Yup.string()
    .matches(websiteRegex, 'Invalid url')
    .max(255, ERRORS.MAX_255)
    .required(ERRORS.REQUIRED),
});

const TabDocumentForm = ({
  setShowForm,
  isDocumentLoader,
  currentVisitId,
  handleClose,
  tabStatus,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState(documentTabInitialValues);
  const dispatch = useDispatch();
  const handleSubmit = (values) => {
    dispatch(
      addDocumentAction(
        { visitId: currentVisitId, documentData: values },
        () => {
          toast.success(TOAST_SUCCESS.DOCUMENT_ADDED.MESSAGE, {
            toastId: TOAST_SUCCESS.DOCUMENT_ADDED.ID,
          });
          if (!tabStatus?.documentsAvailable) {
            dispatch(setTabStatus({ ...tabStatus, documentsAvailable: true }));
          }
          dispatch(GET_DOCUMENT_LIST_ACTION(currentVisitId));
          setShowForm(false);
        },
      ),
    );
  };

  return (
    <>
      <DocumentForm
        formData={formData}
        handleSubmit={handleSubmit}
        isDocumentLoader={isDocumentLoader}
        validationSchema={validationSchema}
        handleClose={handleClose}
      />
    </>
  );
};

export default TabDocumentForm;
