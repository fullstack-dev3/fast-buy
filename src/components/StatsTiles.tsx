import React from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { GiAbstract010 } from 'react-icons/gi';
import { BsClipboardCheck } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { CgMenuGridR } from 'react-icons/cg';
import { TfiStatsUp } from 'react-icons/tfi';

interface Props {
  key: number;
  Icon: any;
  color: string;
  title: string;
  count: number;
}

export default function StatsTiles({ Icon, color, title, count }: Props) {
  return (
    <div className='m-2 py-6 dark:text-black cursor-pointer hover:shadow-xl transition-all duration-500 bg-white rounded flex flex-col items-center justify-center'>
      {Icon === 'BsClipboardCheck' && <BsClipboardCheck className={'text-3xl ' + color} />}
      {Icon === 'GiAbstract010' && <GiAbstract010 className={'text-3xl ' + color} />}
      {Icon === 'AiOutlineClockCircle' && <AiOutlineClockCircle className={'text-3xl ' + color} />}
      {Icon === 'FaUserAlt' && <FaUserAlt className={'text-3xl ' + color} />}
      {Icon === 'CgMenuGridR' && <CgMenuGridR className={'text-3xl ' + color} />}
      {Icon === 'TfiStatsUp' && <TfiStatsUp className={'text-3xl ' + color} />}
      <p className="text-sm mt-1">{title}</p>
      <p className="text-2xl mt-2 font-bold">{count}</p>
    </div>
  )
}
