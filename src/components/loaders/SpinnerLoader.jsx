import { Spinner } from 'react-bootstrap';

const SpinnerLoader = ({ variant = 'primary', beforeText = '' }) => {
  return (
    <div className="spinner-loader gap-3">
      <div>{beforeText}</div> <Spinner animation="border" variant={variant} />
    </div>
  );
};

export default SpinnerLoader;
