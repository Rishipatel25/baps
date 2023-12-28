'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import { visitState } from '@/redux/visits/reducer.visits';

export default function PermissionWrapper({
  name,
  children,
  mode = '1',
  callback = () => { },
}) {
  const { selectedRole } = useSelector(personnelState);
  const { visitPersonnel } = useSelector(visitState);
  const [systemLevelPermission, setSystemLevelPermission] = useState([]);
  const [visitLevelPermission, setVisitLevelPermission] = useState([]);
  const [permission, setPermission] = useState([]);

  const checkAccess = () => {
    if (name && permission.length > 0) {
      return permission.includes(name);
    }
    return true;
  };

  useEffect(() => {
    if (mode === '2' && permission.length > 0) {
      callback(checkAccess());
    }
  }, [mode, permission]);

  useEffect(() => {
    if (selectedRole && visitPersonnel && visitPersonnel.length > 0) {
      const permissionList = [];
      visitPersonnel.map((sel) => {
        if (sel.permissionModelList && sel.permissionModelList.length > 0) {
          sel.permissionModelList.map((res) => {
            permissionList.push(res?.name);
          });
        }
      });
      setVisitLevelPermission(permissionList);
    } else {
      setVisitLevelPermission([]);
    }
  }, [visitPersonnel]);

  useEffect(() => {
    if (selectedRole) {
      const permissionList = [];
      selectedRole?.data?.permissionModelList?.map((res) => {
        permissionList.push(res.name);
      });
      setSystemLevelPermission(permissionList);
    }
  }, [selectedRole]);

  useEffect(() => {
    const allPermissions = [
      ...new Set([...systemLevelPermission, ...visitLevelPermission]),
    ];
    // console.log(allPermissions);
    setPermission(allPermissions);
  }, [systemLevelPermission, visitLevelPermission]);

  return (
    <>{mode === '1' ? <>{checkAccess() && children}</> : <>{children}</>}</>
  );
}
