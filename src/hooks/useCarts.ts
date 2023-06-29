import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { get_all_cart_Items } from '@/Services/Common/cart';
import { setCartData } from '@/utils/CartDataSlice';
import { setUserData } from '@/utils/UserDataSlice';

type cartData = {
  product: {
    name: string,
    price: string,
    image: string,
    quantity: number,
    _id: string,
  },
  quantity: number,
  _id: string,
}

interface userData {
  _id: String,
  name: String,
  email: String,
  role: String,
};

const useCarts = () => {
  const dispatch = useDispatch();

  const user: userData | null = JSON.parse(
    (typeof window !== 'undefined' && localStorage.getItem('user')) || '{}'
  );

  const { data } = useSWR('/getCartItems', () => get_all_cart_Items(user?._id));

  useEffect(() => {
    if (data && data.success) {
      let counts = 0;
      data.data.map((item: cartData) => counts += item.quantity);
  
      let total = 0;
      data.data.map((item: cartData) =>
        total += parseFloat(item.product.price) * item.quantity
      );

      dispatch(setCartData({ counts, total }));
      dispatch(setUserData(user));
    }
  }, [user, data, dispatch]);
};

export { useCarts };
