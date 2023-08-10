"use client"

import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';

type adminData = {
  users: number,
  products: number,
  categories: number,
  pendingOrders: number,
  completedOrders: number,
  monthOrders: number,
}

export default function  GettingDatasLength() {
  const data = useSelector((state: RootState) => state.AdminData.adminData) as adminData | null;

  return [
    {
      icon: "FaUserAlt",
      color: "text-green-600",
      title: "Total Users",
      count: data?.users || 0,
    },
    {
      icon: "GiAbstract010",
      color: "text-blue-600",
      title: "Total Products",
      count: data?.products || 0,
    },
    {
      icon: "CgMenuGridR",
      color: "text-purple-600",
      title: "Total Categories",
      count: data?.categories || 0,
    },
    {
      icon: "AiOutlineClockCircle",
      color: "text-yellow-600",
      title: "Pending Orders",
      count: data?.pendingOrders || 0,
    },
    {
      icon: "BsClipboardCheck",
      color: "text-black",
      title: "Completed Orders",
      count: data?.completedOrders || 0,
    },
    {
      icon: "TfiStatsUp",
      color: "text-orange-600",
      title: "Month Statistics",
      count: data?.monthOrders || 0,
    },
  ]
}
