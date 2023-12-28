'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants/routes.constants';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { useEffect } from 'react';

const HourlyTourMainPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.TOUR.BASE + ROUTES.TOUR.TODAY);
  }, []);
  return <SpinnerLoader />;
};

export default HourlyTourMainPage;
