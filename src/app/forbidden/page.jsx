'use client';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import PageProgressIcon from '@/components/page-progress';
import { ClientRouter } from '@/helpers/ClientRouter';
import { ROUTES } from '@/utils/constants/routes.constants';

const ForbiddenPage = () => {
  return (
    <div>
      <PageProgressIcon
        icon={DashboardProgressIcon}
        title="Access Denied"
        description="You are not authorized to access"
        buttonText="Go To Dashboard"
        buttonAction={() => {
          ClientRouter(ROUTES.BASE);
          // router.replace(ROUTES.BASE);
        }}
        height="95vh"
      />
    </div>
  );
};

export default ForbiddenPage;
