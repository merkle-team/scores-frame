'use client';

import React from 'react';

import { HowToEarnPill } from '@/components/app/howToEarnPill';
import { LastWeeksRankPill } from '@/components/app/lastWeeksRankPill';
import { RewardsLeaderboard } from '@/components/app/rewardsLeaderboard';
import { RewardTiersPill } from '@/components/app/rewardTiersPill';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatScore } from '@/lib/formatters';
import {
  useCreatorRewards,
  useCreatorRewardsPeriodSummary,
} from '@/lib/queries';
import { useCreatorRewardsMetadata } from '@/providers/CreatorRewardsMetadataProvider';
import { useFrameContext } from '@/providers/FrameContextProvider';

function FormattedTimeWithCountdown({ timestamp }: { timestamp: number }) {
  const [time, setTime] = React.useState(timestamp - Date.now());

  React.useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (time < 86400000) {
      interval = setInterval(() => setTime(timestamp - Date.now()), 1000);
    }
    return () => clearInterval(interval);
  }, [time, timestamp]);

  if (time < 0) {
    return 'N/A';
  }

  const s = Math.floor(time / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const { fid, safeAreaInsets } = useFrameContext();

  const { currentCycleEndTimestamp } = useCreatorRewardsMetadata();

  const { data } = useCreatorRewards({ fid });

  const { data: creatorRewardsPeriodSummary } = useCreatorRewardsPeriodSummary({
    fid,
  });

  const scores = React.useMemo(() => {
    return data.result.scores;
  }, [data.result.scores]);

  const lastWeeksSummary = React.useMemo(() => {
    return creatorRewardsPeriodSummary.result.summary;
  }, [creatorRewardsPeriodSummary.result.summary]);

  const lastWeeksSummaryPillVisible = React.useMemo(() => {
    return (
      typeof lastWeeksSummary.score !== 'undefined' &&
      lastWeeksSummary.score > 0
    );
  }, [lastWeeksSummary.score]);

  const exclusion = React.useMemo(() => {
    return lastWeeksSummary.exclusion;
  }, [lastWeeksSummary.exclusion]);

  return (
    <div
      className="w-full h-full space-y-4 pb-4 px-4"
      style={
        // FIXME: Don't like we have to do this and would've preferred the general wrapper
        // of the safe area is sufficient enough but have to go with this for now for the
        // design we have on this page.
        typeof safeAreaInsets === 'undefined'
          ? undefined
          : { paddingBottom: safeAreaInsets.bottom * 2.25 }
      }
    >
      {typeof exclusion !== 'undefined' && exclusion === 'missing-tax-docs' && (
        <Card className="flex flex-row items-start p-3 bg-[#322C49] gap-2 border border-[#7C65C1]">
          <div className="rounded-full p-1.5 bg-[#5C527F]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10.0001 1.33337H4.00008C3.64646 1.33337 3.30732 1.47385 3.05727 1.7239C2.80722 1.97395 2.66675 2.31309 2.66675 2.66671V13.3334C2.66675 13.687 2.80722 14.0261 3.05727 14.2762C3.30732 14.5262 3.64646 14.6667 4.00008 14.6667H12.0001C12.3537 14.6667 12.6928 14.5262 12.9429 14.2762C13.1929 14.0261 13.3334 13.687 13.3334 13.3334V4.66671L10.0001 1.33337Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.33325 1.33337V4.00004C9.33325 4.35366 9.47373 4.6928 9.72378 4.94285C9.97383 5.1929 10.313 5.33337 10.6666 5.33337H13.3333"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66659 6H5.33325"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6666 8.66663H5.33325"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6666 11.3334H5.33325"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start justify-start w-full relative ">
            <div className="font-semibold text-sm py-0.5">
              Keep Earning Rewards
            </div>
            <div className="text-muted text-sm">
              Complete tax documents sent to your email to continue earning
              rewards.
            </div>
          </div>
        </Card>
      )}
      <Card className="flex flex-col items-center px-4">
        <div className="p-4 gap-2 flex flex-col items-center justify-center w-full relative">
          <div className="text-muted font-semibold text-sm">Your score</div>
          <div className="font-semibold text-4xl text-center">
            {formatScore({ score: scores.currentPeriodScore })}
          </div>
        </div>
        <div className="flex flex-row items-center justify-evenly w-full mb-4 border-t pt-4">
          {typeof scores.currentPeriodRank !== 'undefined' && (
            <div className="flex flex-col items-center justify-center w-full border-r">
              <div className="text-muted font-semibold text-xs">Your rank</div>
              <div className="text-default font-semibold [font-variant-numeric:tabular-nums]">
                #{scores.currentPeriodRank}
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-muted font-semibold text-xs">Round ends</div>
            <div className="text-default font-semibold [font-variant-numeric:tabular-nums]">
              <FormattedTimeWithCountdown
                timestamp={currentCycleEndTimestamp}
              />
            </div>
          </div>
        </div>
      </Card>
      <div className="flex flex-row flex-nowrap overflow-x-auto space-x-2 hide-scrollbar">
        {lastWeeksSummaryPillVisible && (
          <div className="flex-none">
            <LastWeeksRankPill score={lastWeeksSummary.score} />
          </div>
        )}
        <div
          className={cn(lastWeeksSummaryPillVisible ? 'flex-none' : 'flex-1')}
        >
          <RewardTiersPill />
        </div>
        <div
          className={cn(lastWeeksSummaryPillVisible ? 'flex-none' : 'flex-1')}
        >
          <HowToEarnPill />
        </div>
      </div>
      <div className="text-xl font-semibold">Leaderboard</div>
      <RewardsLeaderboard />
    </div>
  );
}
