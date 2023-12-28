'use client';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { ROUTES } from '@/utils/constants/routes.constants';
import { getLocalStorageData } from '@/utils/helper.utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = getLocalStorageData(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (user?.token) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN);
    }
  }, []);
  return <SpinnerLoader variant="primary" />;
}
