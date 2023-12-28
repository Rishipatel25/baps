'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import { getLocalStorageData, setLocalStorageData } from '@/utils/helper.utils';
import logo from '@/assets/images/png/logo-light.png';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';
import { ROUTES } from '@/utils/constants/routes.constants';
import { BiHomeAlt } from 'react-icons/bi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';
import Modal from 'react-bootstrap/Modal';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { VISIT_FILTER_QUERY_PARAMS_KEYS } from '@/utils/constants/default.constants';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '@/components/Button';
import {
  setCurrentLoggedInUser,
  setSelectedRole,
} from '@/redux/personnel/action.personnel';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';

export default function Sidebar({ menuState, setMenuState }) {
  const [showRoleList, setShowRoleList] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [parentMenu, setParentMenu] = useState('/Dashboard');
  const [currentRole, setCurrentRoles] = useState(null);

  const dispatch = useDispatch();
  const { currentUserRoles, selectedRole } = useSelector(personnelState);
  const router = useRouter();
  const pathname = usePathname();
  const user = getLocalStorageData(LOCAL_STORAGE_KEYS.CURRENT_USER);
  const searchParams = useSearchParams();

  const userName =
    user?.firstName && user?.lastName
      ? user?.firstName + ' ' + user?.lastName
      : '';

  const nameInitals =
    user?.firstName && user?.lastName
      ? user?.firstName?.charAt(0) + ' ' + user?.lastName?.charAt(0)
      : '';

  let visitStatus = '';
  visitStatus = searchParams.get('visitStatus');
  visitStatus = visitStatus?.toLowerCase() ? visitStatus?.toLowerCase() : 'all';

  const MenuList = [
    {
      name: 'Dashboard',
      id: 'dashboard',
      icon: <BiHomeAlt size={22} />,
      link: ROUTES.DASHBOARD,
      haveSubmenu: false,
      menuPermissionName: '',
    },
    {
      name: 'Visits',
      id: 'visits',
      icon: <HiOutlineLocationMarker size={22} />,
      link: ROUTES.VISITS.BASE,
      haveSubmenu: true,
      primarySubmenu: visitStatus ? visitStatus : 'all',
      menuPermissionName: 'VIEW_VISIT_LIST',
      submenu: [
        {
          name: 'All',
          id: 'all',
          link: ROUTES.VISITS.BASE + ROUTES.VISITS.ALL,
        },
        {
          name: 'Pending',
          id: 'pending',
          link: ROUTES.VISITS.BASE + ROUTES.VISITS.PENDING,
        },
        {
          name: 'Accepted',
          id: 'accepted',
          link: ROUTES.VISITS.BASE + ROUTES.VISITS.ACCEPTED,
        },
        {
          name: 'Active',
          id: 'active',
          link: ROUTES.VISITS.BASE + ROUTES.VISITS.ACTIVE,
        },
      ],
    },
    {
      name: 'Tour Slot',
      id: 'tourslot',
      icon: <AiOutlineClockCircle size={22} />,
      link: ROUTES.TOUR_SLOTS,
      haveSubmenu: false,
      menuPermissionName: 'VIEW_TOUR_SLOT_LIST',
    },
    {
      name: 'Tours',
      id: 'tours',
      icon: <AiOutlineClockCircle size={22} />,
      link: ROUTES.TOUR.BASE,
      haveSubmenu: true,
      menuPermissionName: '',
      submenu: [
        {
          name: 'Today',
          id: 'today',
          link: ROUTES.TOUR.BASE + ROUTES.TOUR.TODAY,
        },
        {
          name: 'Upcoming',
          id: 'upcoming',
          link: ROUTES.TOUR.BASE + ROUTES.TOUR.UPCOMING,
        },
        {
          name: 'All',
          id: 'all',
          link: ROUTES.TOUR.BASE + ROUTES.TOUR.ALL,
        },
      ],
    },
  ];

  const handleClick = (e, link, haveSubmenu, primarySubmenu = null) => {
    document.querySelector('.submenu').classList.remove('open');
    setParentMenu(null);
    if (haveSubmenu) {
      handleSubMenu();
      setParentMenu(link);
      router.push(link);
      document.querySelector('#' + primarySubmenu)?.classList?.add('active');
      setMenuState(window.innerWidth < 850);
    } else {
      router.push(link);
      setMenuState(window.innerWidth < 850);
      if (window.innerWidth < 850) {
        e.target.classList.add('active');
      }
    }
  };

  const logoutActionConfirm = () => {
    setShowLogoutModal(true);
  };

  const logoutAction = () => {
    dispatch(setCurrentLoggedInUser({}));
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SSO_OBJ);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PREFRENCES);
    router.push(ROUTES.AUTHENTICATION.BASE + ROUTES.AUTHENTICATION.LOGIN);
    setShowLogoutModal(false);
  };

  const handleSubMenu = (e = '') => {
    document.querySelectorAll('.subMenuTag.active').forEach((element) => {
      element.classList.remove('active');
    });
    e && e.target.classList.add('active');
    if (e && window.innerWidth < 850) {
      setMenuState(true);
    }
  };

  useEffect(() => {
    if (selectedRole && selectedRole.label) {
      setCurrentRoles(selectedRole.label);
    } else {
      setCurrentRoles('--');
    }
  }, [selectedRole]);

  return (
    <>
      {showLogoutModal && (
        <ModalLogout
          showLogoutModal={showLogoutModal}
          setShowLogoutModal={setShowLogoutModal}
          logoutAction={logoutAction}
          title="Logout"
          body="Are you sure? You want to logout!"
          closeBtnText="Logout"
          cancelBtnText="Cancel"
        />
      )}
      <div
        className={`sidebar-container d-flex flex-column  ${
          menuState ? '' : 'open'
        }`}
      >
        <div
          className="sidebarOverlay"
          onClick={() => {
            setMenuState(true);
          }}
        />
        <div className="logo primary1BG p-2 text-center header-height z-99">
          <Image src={logo} width="240" height="60" alt="logo" />
        </div>
        <div className="sidebarInner z-99">
          <div className="p-4">
            {MenuList.map((item) => (
              <PermissionWrapper key={item.id} name={item.menuPermissionName}>
                <div className="nav-item">
                  <div
                    className={`d-flex justify-content-between align-items-center nav-link ${
                      pathname.split('/')[1] === item.link.split('/')[1] ||
                      parentMenu === `${item.link}`
                        ? 'active'
                        : ''
                    }
                ${item.haveSubmenu ? 'haveSubmenu' : ''}
                  `}
                    id={item.id}
                    onClick={(e) => {
                      handleClick(
                        e,
                        item.link,
                        item.haveSubmenu,
                        item.primarySubmenu,
                      );
                    }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      {item.icon}
                      {item.name}
                    </div>
                    {item.haveSubmenu && (
                      <div className="chevronUp">
                        <BsChevronUp />
                      </div>
                    )}
                  </div>
                  {item.haveSubmenu && (
                    <div
                      className={`submenu  ${
                        pathname.includes(item.link) ? 'open' : ''
                      }`}
                    >
                      {item.submenu.map((sub) => (
                        <div
                          key={sub.id}
                          id={sub.id}
                          role="button"
                          tabIndex={0}
                          className={`ps-2 ms-3 d-flex gap-2 align-items-center subMenuTag ${
                            pathname.includes(sub.link) ? 'active' : ''
                          }`}
                          onClick={(e) => {
                            if (item.id === 'visits') {
                              if (sub.name !== 'All') {
                                router.push(
                                  `${sub.link}?${
                                    VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS
                                  }=${sub.name.toUpperCase()}`,
                                );
                              } else {
                                router.push(
                                  `${sub.link}?${
                                    VISIT_FILTER_QUERY_PARAMS_KEYS.VISIT_STATUS
                                  }=${sub.name.toUpperCase()}`,
                                );
                              }
                            } else {
                              router.push(sub.link);
                            }
                            handleSubMenu(e);
                          }}
                        >
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PermissionWrapper>
            ))}
          </div>

          <div className="d-flex flex-column gap-3 p-3 sidebar-logout">
            <hr />
            <div className="d-flex gap-2 align-items-center justify-content-start flex-grow-1">
              <div className="avatar rounded-circle text-center">
                {nameInitals || ''}
              </div>
              <div className="d-flex flex-column flex-grow-1">
                <div className="fw-bold">{userName || 'Loading...'}</div>
                {currentUserRoles.length > 1 ? (
                  <RoleList
                    currentUserRoles={currentUserRoles}
                    setShowRoleList={setShowRoleList}
                    showRoleList={showRoleList}
                    currentRole={currentRole}
                    setCurrentRoles={setCurrentRoles}
                  />
                ) : (
                  <div className="text-muted d-flex gap-1 align-items-center w-200 justify-content-between text-left ">
                    <span className="flex-grow-1">
                      {currentRole ? currentRole : '--'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <CustomButton
              variant="primary"
              onClick={logoutActionConfirm}
              isContentPosition="center"
            >
              <FiLogIn /> LOGOUT
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}

const RoleList = ({
  currentUserRoles,
  setShowRoleList,
  showRoleList,
  currentRole,
  setCurrentRoles,
}) => {
  const dispatch = useDispatch();
  return (
    <DropdownButton
      id={'dropdown-button-drop-up'}
      drop="up"
      className="roleListContainer"
      onClick={(e) => {
        e.preventDefault();
        return false;
      }}
      title={
        <div
          className="text-muted d-flex gap-1 align-items-center w-200 justify-content-between text-left cursor-pointer"
          onClick={() => {
            setShowRoleList(!showRoleList);
          }}
        >
          <span className="flex-grow-1">{currentRole || '-'}</span>
          <span
            className={`arrowPosition ${showRoleList ? ' open' : ' close'}`}
          >
            <BsChevronDown />
          </span>
        </div>
      }
    >
      {currentUserRoles?.length
        ? currentUserRoles.map((role, idx) => {
            if (role.label !== currentRole) {
              return (
                <PermissionWrapper key={role.value} name={'VIEW_ROLE_LIST'}>
                  <Dropdown.Item
                    eventKey={idx}
                    onClick={() => {
                      setCurrentRoles(role.label);
                      setLocalStorageData(
                        LOCAL_STORAGE_KEYS.CURRENT_ROLE,
                        role.value,
                      );
                      setShowRoleList(!showRoleList);
                      dispatch(setSelectedRole(role));
                    }}
                  >
                    {role.label}
                  </Dropdown.Item>
                </PermissionWrapper>
              );
            }
          })
        : null}
    </DropdownButton>
  );
};

const ModalLogout = ({
  showLogoutModal,
  setShowLogoutModal,
  logoutAction,
  title,
  body,
  closeBtnText,
  cancelBtnText,
}) => {
  const handleModalClose = () => setShowLogoutModal(false);
  return (
    <Modal show={showLogoutModal} onHide={handleModalClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <CustomButton variant="primary" onClick={logoutAction}>
          {closeBtnText}
        </CustomButton>
        <CustomButton variant="secondary" onClick={handleModalClose}>
          {cancelBtnText}
        </CustomButton>
      </Modal.Footer>
    </Modal>
  );
};
