import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { get_admin_data } from '@/Services/Admin';
import { setAdminData } from '@/utils/AdminDataSlice';

const useAdmin = () => {
  const dispatch = useDispatch();

  const { data } = useSWR('/getAdminData', () => get_admin_data());

  useEffect(() => {
    if (data && data.status === 200) {
      dispatch(setAdminData({
        users: data.data.users,
        products: data.data.products,
        categories: data.data.categories,
        pendingOrders: data.data.pendingOrders,
        completedOrders: data.data.completedOrders,
        monthOrders: data.data.monthOrders,
      }));
    }
  }, [data, dispatch]);
};

export { useAdmin };
