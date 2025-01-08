import React from 'react';

import * as Drawer from '@/components/ui/drawer';
import { cn } from '@/lib/cn';
import { useCreatorRewardsMetadata } from '@/providers/CreatorRewardsMetadataProvider';

import { BottomSheetTriggerPill } from '../core/pill';
import { Card } from '../ui/card';

function RewardTiersPill() {
  const { tiers } = useCreatorRewardsMetadata();

  return (
    <Drawer.Drawer>
      <Drawer.DrawerTrigger className="w-full outline-none">
        <BottomSheetTriggerPill icon="cup" actionText="Reward Tiers" />
      </Drawer.DrawerTrigger>
      <Drawer.DrawerContent aria-describedby={undefined}>
        <div className="w-full">
          <Drawer.DrawerHeader className="mx-4">
            <Drawer.DrawerTitle>Reward Tiers</Drawer.DrawerTitle>
          </Drawer.DrawerHeader>
          <Card className="flex flex-col mb-4 mx-4">
            {tiers.map((tier, index) => {
              return (
                <div
                  key={index}
                  className={cn('flex flex-row p-3', index !== 0 && 'border-t')}
                >
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      Tier {index + 1} – ${tier.rewardCents / 100} Prize
                    </div>
                    <div className="text-muted text-sm">
                      {index === 0 ? 'Top' : 'Next'} {tier.size} winners
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}

export { RewardTiersPill };
