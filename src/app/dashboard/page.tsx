import React, { Suspense } from 'react';
import ProfilePage from './dashboard';

const page = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen"> 
        <div className="text-gray-500">Loading...</div>   
      </div>
    }>
    <ProfilePage>
      
    </ProfilePage>
    </Suspense>
  );
};

export default page;