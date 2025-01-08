'use client';

import React from 'react';

import { ApiCreatorRewardTier } from '@/lib/api';
// eslint-disable-next-line no-restricted-imports
import { useCreatorRewardsMetadata as useCreatorRewardsMetadataQuery } from '@/lib/queries';

type CreatorRewardsMetadataProviderContextValue = {
  currentCycleEndTimestamp: number;
  tiers: ApiCreatorRewardTier[];
  totalSize: number;
};

const CreatorRewardsMetadataProviderContext =
  React.createContext<CreatorRewardsMetadataProviderContextValue>({} as never);

function CreatorRewardsMetadataProvider({ children }: React.PropsWithChildren) {
  const { data } = useCreatorRewardsMetadataQuery();

  const currentCycleEndTimestamp = React.useMemo(() => {
    return data.result.metadata.currentPeriodEndTimestamp;
  }, [data.result.metadata.currentPeriodEndTimestamp]);

  const tiers = React.useMemo(() => {
    return data.result.metadata.tiers;
  }, [data.result.metadata.tiers]);

  const totalSize = React.useMemo(() => {
    return tiers.reduce((sum, tier) => sum + tier.size, 0);
  }, [tiers]);

  return (
    <CreatorRewardsMetadataProviderContext.Provider
      value={{ currentCycleEndTimestamp, tiers, totalSize }}
    >
      {children}
    </CreatorRewardsMetadataProviderContext.Provider>
  );
}

export const useCreatorRewardsMetadata = () => {
  return React.useContext(CreatorRewardsMetadataProviderContext);
};

export { CreatorRewardsMetadataProvider };
