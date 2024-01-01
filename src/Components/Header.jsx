import React from 'react'

const Header = ({username, walletId, balance}) => {
  return (
    <>
       <div className=' absolute top-0 w-full h-[100px] bg-black glassmorphism flex justify-between  items-center p-5 gap-5'>
            <h1 className='text-white text-2xl font-bold'>Welcome <span className=' text-blue-700'> {username}</span></h1>
            <h2 className='text-blue-300 text-2xl font-bold'>{walletId}</h2>
            <h1 className='text-white text-2xl font-bold'>Balance:<span className=' text-green-500'> {balance}</span></h1>
       </div>

    </>
  )
}

export default Header