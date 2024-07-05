import Image from 'next/image'
import React from 'react'

export default function Logo() {
  return (
    <div className='flex items-center cursor-pointer'>
      <Image className='w-14' src="/images/crystal.gif" alt='award image' />
      <p className='px-3 text-xl text-purple-500 font-customFont'>FrogWars Lottery</p>
    </div>
  )
}
