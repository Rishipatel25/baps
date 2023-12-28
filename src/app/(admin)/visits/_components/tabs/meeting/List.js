import CustomButton from '@/components/Button';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import {
  MdCall,
  MdInfoOutline,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
import { PiEnvelopeSimpleLight } from 'react-icons/pi';
import { RxCross1 } from 'react-icons/rx';
const TabMeetingList = () => {
  return (
    <div className="table-container text-nowrap">
      <table className="table mt-3">
        <thead>
          <tr>
            <th>TASK TITLE</th>
            <th>VOLUNTEER</th>
            <th>DUE DATE TIME</th>
            <th>COMMENT</th>
            <th>STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="d-flex align-items-center">
              <div className="name-plate"></div>Setup welcome center reception
            </td>
            <td>
              Shuresh Singh{' '}
              <span className="mr-2">
                <MdCall className="text-gray" />
              </span>
              <span className="mr-2">
                <PiEnvelopeSimpleLight className="text-gray" />
              </span>
            </td>
            <td>09-08-2023 2:00PM</td>
            <td>
              The volunteer will be helping with tasks ...{' '}
              <MdInfoOutline size={20} className="text-gray" />
            </td>
            <td className="visit-status">
              <span className="bg-gray showStatusbg text-gray">Pending</span>
            </td>
            <td>
              {' '}
              <div className="position-relative">
                <BoxListServiceCrud />
              </div>
            </td>
          </tr>
          <tr>
            <td className="d-flex align-items-center">
              <div className="name-plate"></div>Setup welcome center reception
            </td>
            <td>
              Shuresh Singh{' '}
              <span className="mr-2">
                <MdCall className="text-gray" />
              </span>
              <span className="mr-2">
                <PiEnvelopeSimpleLight className="text-gray" />
              </span>
            </td>
            <td>09-08-2023 2:00PM</td>
            <td>
              The volunteer will be helping with tasks ...{' '}
              <MdInfoOutline size={20} className="text-gray" />
            </td>
            <td className="visit-status">
              <span className="bg-gray showStatusbg text-gray">Pending</span>
            </td>
            <td>
              <div className="position-relative">
                <BoxListServiceCrud />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TabMeetingList;

const BoxListServiceCrud = () => {
  const [listCrudBox, setListCrudBox] = useState(false);

  return (
    <>
      <BsThreeDots role="button" onClick={() => setListCrudBox(!listCrudBox)} />
      {listCrudBox && (
        <div className="card-ele-list">
          <CustomButton>
            <MdOutlineModeEditOutline size={18} className="mr-2" />
            <span>Edit</span>
          </CustomButton>
          <CustomButton>
            <RxCross1 size={18} className="mr-2" />
            <span>Remove</span>
          </CustomButton>
        </div>
      )}
    </>
  );
};
