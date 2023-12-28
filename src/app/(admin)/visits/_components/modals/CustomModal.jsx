import CustomButton from '@/components/Button';
import { Modal } from 'react-bootstrap';

const CustomModal = ({
  title = '',
  content = '',
  closeAction = () => {}, // handleclose
  submitAction = () => {},
  submitBtnText = '',
  cancelBtnText = '',
  isFooter = true,
  showModal = true,
}) => {
  return (
    <>
      <Modal show={showModal} onHide={closeAction} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        {isFooter ? (
          <Modal.Footer>
            {submitBtnText && (
              <CustomButton variant="primary" onClick={submitAction}>
                {submitBtnText}
              </CustomButton>
            )}
            {cancelBtnText && (
              <CustomButton variant="secondary" onClick={closeAction}>
                {cancelBtnText}
              </CustomButton>
            )}
          </Modal.Footer>
        ) : null}
      </Modal>
    </>
  );
};

export default CustomModal;
