import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { get_all_favorites } from '@/Services/Common/favorite';
import { setFavoriteData } from '@/utils/FavoriteDataSlice';

interface favoriteData {
  product: {
    _id: string
  }
};

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
};

const useFavorites = () => {
  const dispatch = useDispatch();

  const user: userData | null = JSON.parse(
    (typeof window !== 'undefined' && localStorage.getItem('user')) || '{}'
  );

  const { data } = useSWR('/getFavorites', () => get_all_favorites(user?._id));

  useEffect(() => {
    if (data && data.success) {
      let items: string[] = [];
      data.data.map((item: favoriteData) => items.push(item.product._id));

      dispatch(setFavoriteData(items));
    }
  }, [data, dispatch]);
}

export { useFavorites };
