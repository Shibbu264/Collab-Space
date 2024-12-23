import React from 'react'
import { Hearts } from 'react-loader-spinner'

function Loader() {
  return (
    <div className='flex items-center justify-center h-screen'>



    <div className='my-12 flex flex-col items-center text-xl sm:text-3xl text-[#D7EDE9] font-bold text-center'>
      <h1>Welcome Overthinker!</h1>
      <Hearts
        height="140"
        width="140"
        color="#4fa94d"
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      <h1 >Fetching your Thoughts.....</h1>

    </div>
  </div>
  )
}

export default Loader