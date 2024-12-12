'use client';

import sdk from '@farcaster/frame-sdk';
import React from 'react';

type FrameSplashProviderContextValue = {
  dismiss: () => void;
};

const FrameSplashProviderContext =
  React.createContext<FrameSplashProviderContextValue>([] as never);

function FrameSplashProvider({ children }: React.PropsWithChildren) {
  const dismiss = React.useCallback(async () => {
    // eslint-disable-next-line no-console
    console.warn('dismiss called');
    sdk.actions.ready({
      disableNativeGestures: false,
    });
  }, []);

  return (
    <FrameSplashProviderContext.Provider value={{ dismiss }}>
      {children}
    </FrameSplashProviderContext.Provider>
  );
}

export const useFrameSplash = () => {
  return React.useContext(FrameSplashProviderContext);
};

export { FrameSplashProvider };
