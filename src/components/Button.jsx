import Button from 'react-bootstrap/Button';

const CustomButton = ({
  variant = '',
  children = null,
  type = 'button',
  disabled = false,
  onClick = () => {},
  onChange = () => {},
  isContentPosition = 'center',
  classes = '',
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      onChange={onChange}
      disabled={disabled}
      type={type}
      className={`${
        isContentPosition == 'center'
          ? 'text-center  d-flex justify-content-center gap-1'
          : 'text-end'
      }
        ${classes}
      `}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
