'use client';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { getPersonnelTokenAction } from '@/redux/personnel/action.personnel';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { ROUTES } from '@/utils/constants/routes.constants';
import { getAuthToken, setLocalStorageData } from '@/utils/helper.utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Authentication = () => {
  const searchParams = useSearchParams();
  const auth = searchParams.get('auth');
  const dispatch = useDispatch();
  const userToken = getAuthToken();
  const router = useRouter();

  const redirectToLoginPage = () => {
    if (userToken) {
      router.push(ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN);
    } else {
      router.push(ROUTES.DASHBOARD);
    }
  };

  // Checking authentication and saving data
  const checkAuth = () => {
    try {
      const { token: ssoToken } = JSON.parse(auth);
      if (ssoToken) {
        dispatch(
          getPersonnelTokenAction(ssoToken, () => {
            setLocalStorageData(LOCAL_STORAGE_KEYS.SSO_OBJ, auth);
            router.push(ROUTES.DASHBOARD);
          }),
        );
      } else {
        redirectToLoginPage();
      }
    } catch (error) {
      redirectToLoginPage();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <SpinnerLoader
      variant="primary"
      beforeText="Please wait we are verifying"
    />
  );
};

export default Authentication;
