'use client';
import {
  getAllCountriesAction,
  getAllMastersAction,
  getAllStateAction,
} from '@/redux/masters/action.masters';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const InitialApiCall = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMastersAction());
    dispatch(getAllStateAction());
    dispatch(getAllCountriesAction());
  }, []);
};

export default InitialApiCall;
