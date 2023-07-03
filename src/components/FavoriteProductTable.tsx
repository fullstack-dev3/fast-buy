"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { get_all_favorites, remove_favorite_item } from '@/Services/Common/favorite';
import { RootState } from '@/Store/store';
import { setFavoriteData } from '@/utils/FavoriteDataSlice';
import Loading from '@/app/loading';

interface Product {
  name: string;
  price: string;
  image: string;
  quantity: number;
  _id: string;
}

interface User {
  email: string;
  _id: string;
}

interface FavoriteItem {
  product: Product;
  user: User;
  _id: string;
}

interface userData {
  name: String
  email: String,
  role: String,
  _id: String,
}

export default function FavouriteProductTable() {
  const Router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.User.userData) as userData | null;
  const favorites = useSelector((state: RootState) => state.Favorite.favoriteData) as string[];

  const { data, isLoading } = useSWR('/getFavorites', () => get_all_favorites(user?._id));

  const [search, setSearch] = useState('');
  const [favoriteProduct, setFavoriteProduct] = useState<FavoriteItem[] | []>([]);

  useEffect(() => {
    if (data && data.success) {
      setFavoriteProduct(
        data.data.filter((item: FavoriteItem) => favorites.includes(item.product._id))
      );
    }
  }, [favorites, data]);

  const columns = [
    {
      name: 'Name',
      selector: (row: FavoriteItem) => row?.product?.name,
      cell: (row: FavoriteItem) =>
        <a
          className="text-lg cursor-pointer hover:text-blue-500 hover:underline"
          onClick={() => Router.push(`/products/product-detail/${row?.product?._id}`)}
        >
          {row?.product?.name}
        </a>,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row: FavoriteItem) => row?.product?.price,
      cell: (row: FavoriteItem) => <span className="text-lg">$ {row?.product?.price}</span>,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row: FavoriteItem) =>
        <Image src={row?.product?.image} alt='No Image Found' className='py-2' width={100} height={100} />
    },
    {
      name: 'Action',
      cell: (row: FavoriteItem) => (
        <div className='flex items-center justify-center px-2 h-20'>
          <button
            className='w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'
            onClick={() => handleRemoveProduct(row?._id, row?.product._id)}
          >
            Remove
          </button>
        </div>
      )
    },
  ];

  const handleSearch = async (search: string) => {
    setSearch(search);

    if (search == '') {
      setFavoriteProduct(data.data);
    } else {
      const filteredData = data.data.filter((item: FavoriteItem) => {
        const itemName = item?.product.name.toLowerCase();
        const text = search.toLowerCase();

        return itemName.indexOf(text) > -1;
      });

      setFavoriteProduct(filteredData);
    }
  }

  const handleRemoveProduct = async (id: string, product: string) => {
    const res = await remove_favorite_item(id);
    if (res?.success) {
      dispatch(setFavoriteData(favorites.filter(item => item != product)));
      toast.success(res?.message);
    }
    else {
      toast.error(res?.message);
    }
  }

  return (
    <div className='w-full h-full'>
      {isLoading
        ? <Loading />
        :
          <DataTable
            columns={columns}
            data={favoriteProduct}
            pagination
            fixedHeader
            fixedHeaderScrollHeight='100%'
            selectableRows
            selectableRowsHighlight
            persistTableHead
            progressPending={isLoading}
            subHeader
            subHeaderComponent={
              <input
                type="search"
                className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600'
                value={search}
                placeholder="Product Name"
                onChange={(e) => handleSearch(e.target.value)}
              />
            }
          />
      }
      <ToastContainer />
    </div>
  )
}
