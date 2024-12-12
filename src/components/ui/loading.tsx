import React from 'react';

import SplashImage from '../../../public/splash.png';

function Loading() {
  return (
    <div className="animate-pulse w-full items-center justify-center flex flex-col flex-grow h-[calc(100vh-6rem)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SplashImage.src}
        alt="Warpcast Rewards splash screen image"
        width={80}
        height={80}
      />
    </div>
  );
}

export { Loading };
