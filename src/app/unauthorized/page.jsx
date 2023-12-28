'use client';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import CustomButton from '@/components/Button';
import { ROUTES } from '@/utils/constants/routes.constants';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div>
      <div
        className={`d-flex justify-content-center align-items-center flex-column page-placeholder ${'border-0'}`}
        style={{ height: '95vh' }}
      >
        <Image src={DashboardProgressIcon} width="100" alt="work in progress" />
        <h4 className="m-3">Unauthorized</h4>
        <p className=" text-muted h5 fw-light mb-3">
          You are not allowed to access this page
        </p>
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <CustomButton
            variant="primary"
            onClick={() => {
              router.back();
            }}
          >
            Go Back
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={() => {
              localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
              localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_ROLE);
              router.push(ROUTES.BASE);
            }}
          >
            Logout
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
