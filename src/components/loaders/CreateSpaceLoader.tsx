import React from 'react'
import { Hearts } from 'react-loader-spinner'

function CreateSpaceLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
    <div className="block text-center">
      <h1 className="my-1 sm:text-4xl text-xl font-semibold text-[#D7EDE9]">Creating your space...</h1>
      <Hearts
        height="140"
        width="140"
        color="#4fa94d"
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass="flex items-center justify-center"
        visible={true}
      />
    </div>
  </div>
  )
}

export default CreateSpaceLoader