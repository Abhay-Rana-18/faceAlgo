import React from 'react';

const Loader = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex items-center'>
        FaceAlg
        <img src="/images/Velocity.gif" alt="Loading" className='w-5 h-5 ml-1' />
      </div>
    </div>
  );
}

export default Loader;
