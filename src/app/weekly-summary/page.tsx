'use client';

import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatScore } from '@/lib/formatters';
import { useCreatorRewardsPeriodSummary } from '@/lib/queries';
import { useViewer } from '@/providers/FrameContextProvider';

// eslint-disable-next-line import/no-default-export
export default function WeeklySummary() {
  const { fid, pfpUrl } = useViewer();

  const { data } = useCreatorRewardsPeriodSummary({ fid });

  const weeklySummary = React.useMemo(() => {
    return data.result.summary;
  }, [data.result.summary]);

  return (
    <div className="w-full h-full space-y-4 pt-16 px-4 grow">
      <Card className="flex flex-col items-center p-4">
        <Avatar className="h-[68px] w-[68px]">
          <AvatarImage
            className="object-cover"
            src={pfpUrl}
            alt={`Avatar for ${fid}`}
            loading="eager"
            width={68}
          />
        </Avatar>
        <div className="gap-2 flex flex-col items-center justify-center w-full relative my-4">
          <div className="text-muted text-sm">This week you scored</div>
          <div className="font-semibold text-4xl text-center">
            {formatScore({ score: weeklySummary.score })}
          </div>
        </div>
        <div className="gap-2 flex flex-col items-center justify-center w-full relative">
          <div className="flex flex-row items-center py-2 w-full justify-between">
            <div className="text-muted text-sm">Ranking</div>
            <div className="text-right font-semibold [font-variant-numeric:tabular-nums]">
              {weeklySummary.rank}
            </div>
          </div>
          <div className="flex flex-row items-center py-2 border-t w-full justify-between">
            <div className="text-muted text-sm">Week</div>
            <div className="text-right font-semibold">{weeklySummary.rank}</div>
          </div>
          {weeklySummary.rewardCents > 0 && (
            <div className="flex flex-row items-center py-2 border-t w-full justify-between">
              <div className="text-muted text-sm">Reward</div>
              <div className="text-right font-semibold [font-variant-numeric:tabular-nums] text-[#43B748]">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(weeklySummary.rewardCents / 100)}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
