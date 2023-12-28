import maintainenceIcon from '@/assets/images/icons/maintenance-icon.jpg';
import PageProgressIcon from '@/components/page-progress';

const maintenancePage = () => {
  return (
    <div>
      <PageProgressIcon
        icon={maintainenceIcon}
        title="Maintenance"
        description="This page is under maintenance"
        height="95vh"
      />
    </div>
  );
};

export default maintenancePage;
