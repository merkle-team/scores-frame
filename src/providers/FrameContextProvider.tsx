import sdk, { FrameContext } from '@farcaster/frame-sdk';
import React from 'react';

import { Loading } from '@/components/ui/loading';

const FAKE_FRAME_CONTEXT: FrameContext | undefined =
  process.env.NODE_ENV === 'development'
    ? {
        user: {
          fid: 302,
          pfpUrl:
            'https://wrpcd.net/cdn-cgi/image/anim=false,fit=contain,f=auto,w=336/https%3A%2F%2Fi.imgur.com%2FYM5spql.jpg',
        },
        client: {
          clientFid: 9152,
          added: false,
        },
        // @ts-ignore-next-line
        fakePayload: true,
      }
    : undefined;

type FrameContextProviderContextValue = {
  fid: number;
  pfpUrl: string | undefined;
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

    if (
      typeof ctx !== 'undefined' &&
      ctx !== null &&
      typeof frameContext === 'undefined'
    ) {
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
      value={{ fid: frameContext.user.fid, pfpUrl: frameContext.user.pfpUrl }}
    >
      {children}
    </FrameContextProviderContext.Provider>
  );
}

export const useViewer = () => {
  return React.useContext(FrameContextProviderContext);
};

export { FrameContextProvider };
