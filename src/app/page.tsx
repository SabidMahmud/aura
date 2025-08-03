import React, { Suspense } from 'react';
import AuraLandingPage from './welcome/page';

const page = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen"> 
        <div className="text-gray-500">Aura</div>   
      </div>
    }>
    <AuraLandingPage />
    </Suspense>
  );
};

export default page;