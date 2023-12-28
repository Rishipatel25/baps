'use client';
import { useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import CustomButton from '@/components/Button';
import FilterCardTour from './FilterCardTour';
import Search from '@/components/SearchBox';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import { getLocalStorageData, setLocalStorageData } from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';

const TourPageHeader = ({
  filterObj,
  setFilterObj,
  searchData,
  setSearchData,
  isFilterBtnActive = true,
  setFetchData,
}) => {
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [isDisabledSelfAssigned, setISDisabledSelfAssigned] = useState(true);

  const handleSearchChange = (e) => {
    setSearchData(e.target.value);
  };

  const handleShowFilterCard = () => {
    setShowFilterCard(!showFilterCard);
  };
  return (
    <div className="page-header-container app-container">
      <div className="d-flex justify-content-between align-items-center pt-2 hideHeaderPrint">
        <div>
          <Search
            placeholder="Search Tour"
            value={searchData}
            showBorder={false}
            onChange={(e) => handleSearchChange(e)}
            showBottomBorder={false}
          />
        </div>

        <div className="d-flex gap-2 align-items-center">
          <PermissionWrapper
            name={'VIEW_PRE_BOOKED_VISIT_SELF_ASSIGN_LIST'}
            mode="2"
            callback={(event) => {
              setISDisabledSelfAssigned(!event);
            }}
          >
            <div className="pe-3">
              <input
                type="checkbox"
                className={`${
                  isDisabledSelfAssigned ? 'text-gray' : 'cursor-pointer'
                }`}
                id="tour-self-assigned"
                value={isDisabledSelfAssigned || filterObj.assigned}
                defaultChecked={filterObj.assigned}
                disabled={isDisabledSelfAssigned}
                onChange={(e) => {
                  const bool = e.target.checked;
                  // Get user preferences from local storage
                  const userPreferences =
                    getLocalStorageData(LOCAL_STORAGE_KEYS.USER_PREFRENCES) ||
                    {};
                  // Update preferences
                  const updatedPreferences = {
                    ...userPreferences,
                    t_self: bool,
                  };
                  // Update local storage
                  setLocalStorageData(
                    LOCAL_STORAGE_KEYS.USER_PREFERENCES,
                    updatedPreferences,
                  );
                  // Update state values
                  setFilterObj((prev) => ({ ...prev, assigned: bool }));
                  setFetchData(true);
                }}
              />{' '}
              <label htmlFor="tour-self-assigned" className="cursor-pointer">
                Self Assigned
              </label>
            </div>
          </PermissionWrapper>
          {isFilterBtnActive ? (
            <CustomButton variant="secondary" onClick={handleShowFilterCard}>
              <BiFilter size={20} /> FILTER
            </CustomButton>
          ) : null}
        </div>
      </div>

      <FilterCardTour
        filterObj={filterObj}
        setFilterObj={setFilterObj}
        showFilterCard={showFilterCard}
      />
    </div>
  );
};

export default TourPageHeader;
