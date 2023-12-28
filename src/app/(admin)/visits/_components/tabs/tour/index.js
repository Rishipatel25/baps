import { useEffect, useState } from 'react';
import { masterState } from '@/redux/masters/reducer.masters';
import { useDispatch, useSelector } from 'react-redux';
import { personnelState } from '@/redux/personnel/reducer.personnel';
import {
  getAvailablePersonnelAction,
  resetCoordinatorOptions,
} from '@/redux/personnel/action.personnel';
import { getTourAction, updateTourAction } from '@/redux/tour/action.tour';
import { visitState } from '@/redux/visits/reducer.visits';
import { getRolesAction } from '@/redux/roles/action.roles';
import { searchServiceAction } from '@/redux/visits/action.visits';
import { tourState } from '@/redux/tour/reducer.tour';
import { toast } from 'react-toastify';
import { getAllLocationAction } from '@/redux/masters/action.masters';
import {
  MODAL_MESSAGES,
  SYSTEM_ROLES,
  TOAST_SUCCESS,
} from '@/utils/constants/default.constants';
import { rolesState } from '@/redux/roles/reducer.roles';
import moment from 'moment';
import PrimaryForm from './forms/PrimaryForm';
import LocationForm from './forms/LocationForm';
import { formateDate, generateOptions } from '@/utils/helper.utils';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import CustomModal from '../../modals/CustomModal';

const tourTabInitalValues = {
  pickupLocation: '',
  endLocation: '',
  startDateTime: '',
  endDateTime: '',
  tourCoordinator: '',
  tourGuide: [],
  isEditForm: false,
  locationList: [
    {
      location: '',
      startDateTime: '',
      endDateTime: '',
      actualDuration: '',
    },
  ],
  formPickupLocation: '',
  formActualDuration: '',
  formStartDateTime: '',
  formEndDateTime: '',
};

const TabTour = ({ currentVisitId, tabStatus }) => {
  const [formData, setFormData] = useState(tourTabInitalValues);
  const [isEditTour, setIsEditTour] = useState(false);
  const [locationOpt, setLocationOpt] = useState([]);
  const [coordinatorOpt, setCoordinatorOpt] = useState([]);
  const [tourGuideOptions, setTourGuideOptions] = useState([]);
  const [showSubForm, setShowSubForm] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [coordinatorRoleId, setCoordinatorRoleId] = useState(null);
  const [guideRoleId, setGuideRoleId] = useState(null);
  const [editModalShow, setEditModalShow] = useState(false);
  const [partialLoader, setPartialLoader] = useState({});
  const [updateLocation, setUpdateLocation] = useState('new');

  const { locationOption } = useSelector(masterState);
  const { coordinatorOptions } = useSelector(personnelState);
  const { isTourLoader, tourFormData } = useSelector(tourState);
  const {
    currentVisitRes: { visitRes },
    servicesList,
  } = useSelector(visitState);
  const { tourCooridnatorsRoles, tourGuideCooridnatorsRoles } =
    useSelector(rolesState);
  const dispatch = useDispatch();

  const getTourGuides = (values) => {
    const date = formateDate(visitRes?.dateOfVisit).resDate;
    dispatch(
      getAvailablePersonnelAction(
        {
          startDateTime: `${date} ${values.startDateTime}`,
          endDateTime: `${date} ${values.endDateTime}`,
        },
        ({ options }) => {
          setTourGuideOptions(options);
        },
      ),
    );
  };

  const getTourCoordinator = (values) => {
    const date = formateDate(visitRes?.dateOfVisit).resDate;
    dispatch(
      getAvailablePersonnelAction(
        {
          startDateTime: `${date} ${values.startDateTime}`,
          endDateTime: `${date} ${values.endDateTime}`,
        },
        ({ options }) => {
          setCoordinatorOpt(options);
        },
      ),
    );
  };

  const setResponseValues = ({ formData: res }) => {
    setIsEditTour(true);
    setShowSubForm(true);
    setFormData({
      ...res,
      formPickupLocation: '',
      formActualDuration: '',
      formStartDateTime: '',
      formEndDateTime: '',
    });
    setIsDisabled(true);
    getTourGuides(res);
    getTourCoordinator(res);
  };

  const getTourById = () => {
    dispatch(getTourAction(currentVisitId, setResponseValues));
  };

  function handleSubmitTourGuide(key, newValue, cb) {
    let updatedData = {};
    updatedData = { ...tourFormData };

    if (key == 'tourGuideList') {
      const guides = newValue.map((guide) => ({
        personnelId: guide.value,
        roleId: guideRoleId,
      }));
      updatedData.tourGuideList = guides;
    } else if (key == 'addLocation') {
      updatedData.visitLocationModelList = newValue;
    } else if (key == 'editLocation') {
      const filteredLocation = [];
      newValue.forEach((location, index) => {
        location.endDateTime = location.endDateTime
          ? location.endDateTime
          : location.startDateTime;
        let locationTagEnum = 'NONE';
        if (index < 1) {
          locationTagEnum = 'PICKUP';
        }
        if (index == newValue.length - 1) {
          locationTagEnum = 'DROP';
        }
        const date = formateDate(visitRes?.dateOfVisit).resDate;
        filteredLocation.push({
          startDateTime: `${date} ${moment(
            location.startDateTime,
            'hh:mm A',
          ).format('HH:mm:ss')}`,
          endDateTime: `${date} ${moment(
            location.endDateTime,
            'hh:mm A',
          ).format('HH:mm:ss')}`,
          actualDuration: location.actualDuration,
          locationId: location.location.value,
          locationTagEnum: locationTagEnum,
          locationName: location.location.label,
        });
      });
      updatedData.visitLocationModelList = filteredLocation;
    }

    dispatch(
      updateTourAction(
        { visitId: currentVisitId, tourData: updatedData },
        (res) => {
          cb && cb();
          const newLocations = res?.visitLocationModelList?.map((location) => ({
            location: {
              value: location.locationId,
              label: location.locationName,
            },
            actualDuration: moment(location.endDateTime).diff(
              moment(location.startDateTime),
              'minutes',
            ),
            startDateTime: moment(location.startDateTime).format('hh:mm A'),
            endDateTime: moment(location.endDateTime).format('hh:mm A'),
          }));

          const guides = generateOptions({
            arrayList: res?.tourGuideList || [],
            label: 'personnelName',
            value: 'personnelId',
          });

          //to set response values
          setFormData({
            ...formData,
            locationList: newLocations,
            tourGuide: guides,
          });

          toast.success(TOAST_SUCCESS.TOUR_UPDATED.MESSAGE, {
            toastId: TOAST_SUCCESS.TOUR_UPDATED.ID,
          });
        },
      ),
    );
  }

  useEffect(() => {
    dispatch(resetCoordinatorOptions());
    dispatch(getRolesAction('', () => {}));
    getTourById();
    dispatch(searchServiceAction("serviceTypeEnum=='TOUR'"));
    dispatch(getAllLocationAction());
  }, []);

  useEffect(() => {
    if (tourCooridnatorsRoles?.length) {
      //Change this later when backend tell so
      const filterRole = tourCooridnatorsRoles.filter(
        (role) => role === SYSTEM_ROLES.TOUR_COORDINATOR,
      );
      setCoordinatorRoleId(
        filterRole?.length
          ? filterRole[0].value
          : tourCooridnatorsRoles[0].value,
      );
    }
  }, [tourCooridnatorsRoles]);

  useEffect(() => {
    if (tourGuideCooridnatorsRoles?.length) {
      // Change this later when backend tell so
      const filterRole = tourCooridnatorsRoles.filter(
        (role) => role === 'Tour Guide',
      );
      setGuideRoleId(
        filterRole?.length
          ? filterRole[0].value
          : tourGuideCooridnatorsRoles[0].value,
      );
    }
  }, [tourGuideCooridnatorsRoles]);

  useEffect(() => {
    if (locationOption?.length) {
      setLocationOpt(locationOption);
    }
  }, [locationOption]);

  useEffect(() => {
    if (Array.isArray(coordinatorOptions)) {
      setCoordinatorOpt(coordinatorOptions);
    }
  }, [coordinatorOptions]);

  return isTourLoader ? (
    <SpinnerLoader variant="primary" />
  ) : (
    <div>
      <div>
        <PrimaryForm
          formData={formData}
          setFormData={setFormData}
          locationOpt={locationOpt}
          coordinatorOpt={coordinatorOpt}
          tourGuideOptions={tourGuideOptions}
          setCoordinatorOpt={setCoordinatorOpt}
          isEditTour={isEditTour}
          setIsEditTour={setIsEditTour}
          showSubForm={showSubForm}
          setShowSubForm={setShowSubForm}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
          getTourById={getTourById}
          handleSubmitTourGuide={handleSubmitTourGuide}
          partialLoader={partialLoader}
          setPartialLoader={setPartialLoader}
          tourFormData={tourFormData}
          visitRes={visitRes}
          servicesList={servicesList}
          coordinatorRoleId={coordinatorRoleId}
          currentVisitId={currentVisitId}
          getTourGuides={getTourGuides}
          tabStatus={tabStatus}
        />
        {showSubForm && (
          <LocationForm
            formData={formData}
            setFormData={setFormData}
            locationOpt={locationOpt}
            setCoordinatorOpt={setCoordinatorOpt}
            isDisabled={isDisabled}
            handleSubmitTourGuide={handleSubmitTourGuide}
            setPartialLoader={setPartialLoader}
            updateLocation={updateLocation}
            setUpdateLocation={setUpdateLocation}
            visitRes={visitRes}
            tourFormData={tourFormData}
          />
        )}
      </div>

      {editModalShow ? (
        <CustomModal
          title={MODAL_MESSAGES.EDIT_FEEDBACK.TITLE}
          content={MODAL_MESSAGES.EDIT_FEEDBACK.CONTENT}
          closeAction={() => setEditModalShow(false)}
          cancelBtnText={MODAL_MESSAGES.EDIT_FEEDBACK.CANCEL_BUTTON_TEXT}
          submitBtnText={MODAL_MESSAGES.EDIT_FEEDBACK.SUBMIT_BUTTON_TEXT}
          submitAction={() => {
            setIsDisabled(false);
            setEditModalShow(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default TabTour;
