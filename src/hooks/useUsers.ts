import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '@/utils/UserDataSlice';
import { RootState } from '@/Store/store';

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
};

const useUsers = () => {
  const dispatch = useDispatch();

  const user: userData | null = JSON.parse(
    (typeof window !== 'undefined' && localStorage.getItem('user')) || '{}'
  );

  const userState = useSelector((state: RootState) => state.User.userData) as userData | null;

  useEffect(() => {
    if (userState?._id != user?._id) {
      dispatch(setUserData(user));
    }
  }, [user, userState, dispatch]);
};

export { useUsers };
