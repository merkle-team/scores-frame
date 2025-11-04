import sdk from '@farcaster/miniapp-sdk';
import React from 'react';

import { Loading } from '@/components/ui/loading';
import type { FrameContext, SafeAreaInsets } from '@/lib/types';

import { useFrameSplash } from './FrameSplashProvider';

const FAKE_FRAME_CONTEXT: FrameContext | undefined =
  process.env.NODE_ENV === 'development'
    ? {
        user: {
          fid: 1287,
          pfpUrl:
            'https://i.seadn.io/gcs/files/ed56e6b9a1b22720ce7490524db333e0.jpg?w=500&auto=format',
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
  safeAreaInsets?: SafeAreaInsets;
  triggerViewProfile: ({ fid }: { fid: number }) => void;
  triggerViewCast: ({ hash }: { hash: string }) => void;
};

const FrameContextProviderContext =
  React.createContext<FrameContextProviderContextValue>({} as never);

function FrameContextProvider({ children }: React.PropsWithChildren) {
  const [noFrameContextFound, setNoFrameContextFound] =
    React.useState<boolean>(false);

  const { dismiss } = useFrameSplash();

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

    dismiss();
  }, [dismiss, frameContext]);

  const triggerViewProfile = React.useCallback(
    ({ fid }: { fid: number }) => {
      if (
        typeof frameContext !== 'undefined' &&
        typeof sdk.actions.viewProfile === 'function'
      ) {
        sdk.actions.viewProfile({ fid });
      }
    },
    [frameContext],
  );

  const triggerViewCast = React.useCallback(
    ({ hash }: { hash: string }) => {
      if (
        typeof frameContext !== 'undefined' &&
        typeof sdk.actions.viewCast === 'function'
      ) {
        sdk.actions.viewCast({ hash });
      }
    },
    [frameContext],
  );

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
      value={{
        fid: frameContext.user.fid,
        pfpUrl: frameContext.user.pfpUrl,
        safeAreaInsets: frameContext.client.safeAreaInsets,
        triggerViewProfile: triggerViewProfile,
        triggerViewCast: triggerViewCast,
      }}
    >
      {children}
    </FrameContextProviderContext.Provider>
  );
}

export const useFrameContext = () => {
  return React.useContext(FrameContextProviderContext);
};

export { FrameContextProvider };
