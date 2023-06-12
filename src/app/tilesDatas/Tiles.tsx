"use client"

import useSWR from 'swr';
import { get_all_categories } from '@/Services/Common/category';
import { get_all_products } from '@/Services/Common/product';

export default function  GettingDatasLength() {
  const { data: catData } = useSWR('/gettingAllCategories', get_all_categories);
  const { data: prodData } = useSWR('/gettingAllProducts', get_all_products);

  return [
    {
      icon: "FaUserAlt",
      color: "text-green-600",
      title: "Total Users",
      count: 0,
    },
    {
      icon: "GiAbstract010",
      color: "text-blue-600",
      title: "Total Products",
      count: prodData?.length || 0
    },
    {
      icon: "CgMenuGridR",
      color: "text-purple-600",
      title: "Total Categories",
      count: catData?.length || 0
    },
    {
      icon: "AiOutlineClockCircle",
      color: "text-yellow-600",
      title: "Pending Orders",
      count: 0,
    },
    {
      icon: "BsClipboardCheck",
      color: "text-black",
      title: "Completed Orders",
      count: 0,
    },
    {
      icon: "TfiStatsUp",
      color: "text-orange-600",
      title: "Month Statistics",
      count: 0,
    },
  ]
}
