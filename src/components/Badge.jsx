const CustomBadge = ({ children, variant }) => {
  switch (variant) {
    case 'success':
      return (
        <span className="bg-green showStatusbg text-green">{children}</span>
      );
    case 'secondary':
      return <span className="bg-gray showStatusbg text-gray">{children}</span>;
    case 'warning':
      return (
        <span className="bg-yellow showStatusbg text-dark">{children}</span>
      );
    case 'danger':
      return (
        <span className="bg-red-light showStatusbg text-red">{children}</span>
      );
    case 'info':
      return (
        <span className="bg-info-light showStatusbg text-light">
          {children}
        </span>
      );
    case 'info-light':
      return (
        <span className="bg-info-lighter showStatusbg text-cyan-dark">
          {children}
        </span>
      );
    case 'blue':
      return (
        <span className="bg-info-light showStatusbg text-light">
          {children}
        </span>
      );
    case 'secondary-light':
      return (
        <span className="badge badge-pill badge-primary bg-light-gray showStatusbadge text-dark">
          {children}
        </span>
      );
    case 'gray':
      return (
        <span className="bg-dark-gray showStatusbg text-white">{children}</span>
      );
  }
};

export default CustomBadge;
