'use client';

import React from 'react';

import {
  usePrefetchCreatorRewards,
  usePrefetchCreatorRewardsMetadata,
} from '@/lib/queries';

import { useViewer } from './FrameContextProvider';
import { useFrameSplash } from './FrameSplashProvider';

function AuthedPrefetchesProvider({ children }: React.PropsWithChildren) {
  const { fid } = useViewer();

  const { dismiss } = useFrameSplash();

  const prefetchCreatorRewards = usePrefetchCreatorRewards();
  const prefetchRewardsMetadata = usePrefetchCreatorRewardsMetadata();

  const [readyToLoad, setReadyToLoad] = React.useState<boolean>(false);

  const prefetch = React.useCallback(async () => {
    await Promise.all([
      prefetchRewardsMetadata(),
      prefetchCreatorRewards({ fid }),
    ]);

    dismiss();

    setReadyToLoad(true);
  }, [dismiss, fid, prefetchCreatorRewards, prefetchRewardsMetadata]);

  React.useEffect(() => {
    prefetch();
  }, [prefetch]);

  if (!readyToLoad) {
    return <div>Loading rewards context...</div>;
  }

  return children;
}

export { AuthedPrefetchesProvider };
