'use client';

import MaintenanceIcon from '@/assets/images/icons/maintenance-icon.jpg';
import PageProgressIcon from '@/components/page-progress';

const Tours = () => {
  return (
    <div 
      className="padding-30"
    >
      <h5 className="can p-2 font-weight-bold">Settings</h5>

      <PageProgressIcon
        icon={MaintenanceIcon}
        title="System is down for Maintenance"
        description="We promise, we’ll be right back!"
      />
    </div>
  );
};

export default Tours;
