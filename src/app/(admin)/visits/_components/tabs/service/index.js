import { useEffect, useState } from 'react';
import Accordian from './Accordian';
import { MdAdd } from 'react-icons/md';
import TabServiceForm from './form';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceAction } from '@/redux/visits/action.visits';
import { visitState } from '@/redux/visits/reducer.visits';
import { getDateTimeSplitter } from '@/utils/helper.utils';
import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import CustomButton from '@/components/Button';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { toast } from 'react-toastify';
import { TOAST_SUCCESS } from '@/utils/constants/default.constants';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import PageProgressIcon from '@/components/page-progress';

const TabService = ({ currentVisitId, tabStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const [selectedTabData, setSelectedTabData] = useState(null);
  const [fromMode, setFromMode] = useState('ADD');

  const dispatch = useDispatch();
  const { isServicesLoader } = useSelector(visitState);

  const handleShowForm = () => {
    setFromMode('ADD');
    setShowForm(true);
  };

  //Select Tab Action
  const setServiceTabsAndData = (response) => {
    const allTabs = response.map((value, idx) => {
      return { id: idx, title: value.serviceTemplateName, tabData: value };
    });
    setTabList(allTabs);
    allTabs.length > 0 && setSelectedTabData(allTabs[currentActiveTab].tabData);
  };

  //Get Tabs List
  const getServicesTabList = () => {
    dispatch(
      getAllServiceAction({ visitId: currentVisitId }, setServiceTabsAndData),
    );
  };

  //Call Tabs List
  useEffect(() => {
    getServicesTabList();
  }, []);

  if (isServicesLoader) {
    return <SpinnerLoader variant="primary" />;
  }

  if (!tabList?.length && !showForm) {
    return (
      <PageProgressIcon
        icon={DashboardProgressIcon}
        title="No Data Available"
        description="There is no data to show you right now"
        buttonText="+ ADD SERVICE"
        buttonAction={() => setShowForm(true)}
        name={'ADD_VISIT_SERVICE'}
      />
    );
  }
  return (
    <>
      {showForm ? (
        <TabServiceForm
          setShowForm={setShowForm}
          currentVisitId={currentVisitId}
          getServicesTabList={getServicesTabList}
          fromMode={fromMode}
          tabStatus={tabStatus}
        />
      ) : (
        <>
          <div className="d-flex service-tab-wrapper gap-2 mt-3">
            <div className="service-add-tab">
              <PermissionWrapper name={'ADD_VISIT_SERVICE'}>
                <CustomButton
                  variant="outline-primary"
                  onClick={handleShowForm}
                >
                  <MdAdd size={18} className="mr-2" />
                  Add
                </CustomButton>
              </PermissionWrapper>
            </div>
            {tabList.map((tab, idx) => {
              return (
                <button
                  key={idx}
                  className={`border-raduis-none mb-0 ${currentActiveTab === tab.id
                      ? 'bg-dark-gray text-light border-bottom-dark'
                      : 'bg-light-gray text-dark'
                    }`}
                  onClick={() => {
                    setCurrentActiveTab(tab.id);
                    setSelectedTabData(tab.tabData);
                  }}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
          <div>
            {tabList?.length ? (
              <TabContentRender
                selectedTabData={selectedTabData}
                getServicesTabList={getServicesTabList}
                setShowForm={setShowForm}
                setFromMode={setFromMode}
                visitId={currentVisitId}
              />
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

//Tabs
const TabContentRender = ({
  selectedTabData,
  getServicesTabList,
  setShowForm,
  setFromMode,
  visitId,
}) => {
  return (
    <>
      {selectedTabData?.visitServiceModelList?.length
        ? selectedTabData?.visitServiceModelList?.map((tab, idx) => {
          const tabContent = {};
          const { time: endTime } = getDateTimeSplitter(tab, 'endDateTime');
          const { time: startTime } = getDateTimeSplitter(
            tab,
            'startDateTime',
          );
          tabContent.endTime = endTime || '-';
          tabContent.startTime = startTime || '-';
          tabContent.personnelName = tab?.coordinator?.personnelName || '-';
          tabContent.phoneNumber = tab?.coordinator?.phoneNumber || '-';
          tabContent.email = tab?.coordinator?.email || '-';
          tabContent.formTemplate = tab?.metadata || {};
          tabContent.location = (tab?.visitLocationModelList && tab?.visitLocationModelList.length > 0) ? tab?.visitLocationModelList[0].locationName : '-';
          return (
            <Accordian
              key={idx}
              tabContent={tabContent}
              visitServiceId={tab.visitServiceId}
              visitId={visitId}
              cb={(action) => {
                if (action === 'REMOVE') {
                  toast.success(
                    TOAST_SUCCESS.SERVICE_TEMPLATE_DELETED.MESSAGE,
                    {
                      toastId: TOAST_SUCCESS.SERVICE_TEMPLATE_DELETED.ID,
                    },
                  );
                  getServicesTabList();
                } else {
                  setFromMode('EDIT');
                  setShowForm(true);
                }
              }}
            />
          );
        })
        : null}
    </>
  );
};
export default TabService;
