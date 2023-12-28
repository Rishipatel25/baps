'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants/routes.constants';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { useEffect } from 'react';

const Visits = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.VISITS.BASE + ROUTES.VISITS.ALL);
  }, []);
  return <SpinnerLoader />;
};

export default Visits;
