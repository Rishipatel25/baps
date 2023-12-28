'use client';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { getPersonnelTokenAction } from '@/redux/personnel/action.personnel';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import {
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  PROTECTED_ROUTES_PERMISSIONS,
  ROUTES,
} from '@/utils/constants/routes.constants';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';

const AuthWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { selectedRole } = useSelector(personnelState);
  const [systemLevelPermission, setSystemLevelPermission] = useState([]);
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(personnelState);

  const checkTokenAndRedirect = () => {
    let userData = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    let token = null;
    if (userData) {
      userData = JSON.parse(userData);
      token = userData?.token || null;
    }
    if (token) {
      redirect(ROUTES.DASHBOARD);
    } else {
      redirect(ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN);
    }
  };

  const checkAuth = () => {
    let userData = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    let token = null;
    if (userData) {
      userData = JSON.parse(userData);
      token = userData?.token || null;
    }
    if (token) {
      if (!currentUser?.token && PROTECTED_ROUTES.includes(pathName)) {
        dispatch(
          getPersonnelTokenAction(token || '', () => {
            setIsAuthenticated(true);
            setLoading(false);
          }),
        );
      }
      if (
        PROTECTED_ROUTES.includes(pathName) ||
        AUTH_ROUTES.includes(pathName)
      ) {
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      const permissionList = [];
      selectedRole?.data?.permissionModelList?.map((res) => {
        permissionList.push(res.name);
      });
      setSystemLevelPermission(permissionList);
    }
  }, [selectedRole]);

  if (loading) {
    return <SpinnerLoader variant="primary" />;
  } else if (PROTECTED_ROUTES.includes(pathName)) {
    if (!isAuthenticated) {
      redirect(ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN);
    } else {
      const sel = PROTECTED_ROUTES_PERMISSIONS.filter((d) => d.menu.includes(pathName));
      if (sel.length > 0) {
        if (systemLevelPermission.length === 0) {
          return <SpinnerLoader variant="primary" />;
        }
        if (systemLevelPermission.includes(sel[0].name)) {
          return children;
        }
        redirect(ROUTES.UNAUTHORIZED);
      }
      return children;
    }
  } else if (AUTH_ROUTES.includes(pathName)) {
    if (isAuthenticated) {
      redirect(ROUTES.DASHBOARD);
    } else {
      return children;
    }
  } else {
    checkTokenAndRedirect();
  }
};

export default AuthWrapper;
