import sdk, { FrameContext } from '@farcaster/frame-sdk';
import React from 'react';

import { Loading } from '@/components/ui/loading';

const FAKE_FRAME_CONTEXT = {
  user: {
    fid: 302,
  },
};

type FrameContextProviderContextValue = {
  fid: number;
};

const FrameContextProviderContext =
  React.createContext<FrameContextProviderContextValue>([] as never);

function FrameContextProvider({ children }: React.PropsWithChildren) {
  const [noFrameContextFound, setNoFrameContextFound] =
    React.useState<boolean>(false);

  const [frameContext, setFrameContext] = React.useState<
    FrameContext | undefined
  >(FAKE_FRAME_CONTEXT);

  const checkFrameContext = React.useCallback(async () => {
    const ctx: FrameContext = await sdk.context;

    if (typeof frameContext !== 'undefined' && frameContext !== null) {
      setFrameContext(ctx);
    } else {
      setNoFrameContextFound(true);
    }
  }, [frameContext]);

  React.useEffect(() => {
    if (typeof frameContext === 'undefined') {
      checkFrameContext();
    }
  }, [checkFrameContext, frameContext]);

  if (noFrameContextFound) {
    return <Loading />;
  }

  if (typeof frameContext === 'undefined') {
    return <Loading />;
  }

  return (
    <FrameContextProviderContext.Provider
      value={{ fid: frameContext.user.fid }}
    >
      {children}
    </FrameContextProviderContext.Provider>
  );
}

export const useViewer = () => {
  return React.useContext(FrameContextProviderContext);
};

export { FrameContextProvider };
