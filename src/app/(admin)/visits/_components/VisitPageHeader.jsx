'use client';
import { useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { MdAdd } from 'react-icons/md';
import FilterCard from './FilterCard';
import CustomButton from '@/components/Button';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';
import Search from '@/components/SearchBox';
import { getLocalStorageData, setLocalStorageData } from '@/utils/helper.utils';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/storage.constants';

const VisitPageHeader = ({
  filterObj,
  setFilterObj,
  handleShow,
  searchData,
  setSearchData,
  setFetchData,
}) => {
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [isDisabledSelfAssigned, setISDisabledSelfAssigned] = useState(true);

  const handleChange = (e) => {
    setSearchData(e.target.value);
  };

  const handleShowFilterCard = () => {
    setShowFilterCard(!showFilterCard);
  };
  return (
    <div className="page-header-container app-container ">
      <div className="d-flex justify-content-between align-items-center pt-2 hideHeaderPrint">
        <div>
          <Search
            placeholder="Search Visit"
            value={searchData}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="d-flex gap-2 align-items-center">
          <PermissionWrapper
            name={'VIEW_VISIT_ALL_LIST'}
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
                id="visit-self-assigned"
                value={isDisabledSelfAssigned || filterObj.assigned}
                defaultChecked={filterObj.assigned}
                disabled={isDisabledSelfAssigned}
                onChange={(e) => {
                  const bool = e.target.checked;
                  // Get user preferences from local storage
                  const userPreferences =
                    getLocalStorageData(LOCAL_STORAGE_KEYS.USER_PREFERENCES) ||
                    {};
                  // Update preferences
                  const updatedPreferences = {
                    ...userPreferences,
                    v_self: bool,
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
              <label
                htmlFor="visit-self-assigned"
                className={`${
                  isDisabledSelfAssigned ? 'text-gray' : 'cursor-pointer'
                }`}
              >
                Self Assigned
              </label>
            </div>
          </PermissionWrapper>
          <CustomButton variant="secondary" onClick={handleShowFilterCard}>
            <BiFilter size={20} />
            <span className="hide-sm">FILTER</span>
          </CustomButton>
          <PermissionWrapper name={'ADD_VISIT'}>
            <CustomButton onClick={handleShow} variant="primary">
              <MdAdd size={20} />
              <span className="hide-sm">Add new</span>
            </CustomButton>
          </PermissionWrapper>
        </div>
      </div>

      <FilterCard
        filterObj={filterObj}
        setFilterObj={setFilterObj}
        showFilterCard={showFilterCard}
      />
    </div>
  );
};

export default VisitPageHeader;
