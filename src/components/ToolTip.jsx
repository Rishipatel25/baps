'use client'
import  { useState } from 'react';

const TooltipIcon = ({ icon='', text='',onClick=()=>{} }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="tooltip-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onClick}>
      {showTooltip && <div className="tooltips">{text}</div>}
      {icon}
    </div>
  );
};

export default TooltipIcon;
