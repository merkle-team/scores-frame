'use client';

import React from 'react';

import { BoostCard } from '@/components/app/boostCard';
import { BoostedPill } from '@/components/app/boostedPill';
import { ExclusionCard } from '@/components/app/exclusionCard';
import { HowToEarnPill } from '@/components/app/howToEarnPill';
import { LastWeeksRankPill } from '@/components/app/lastWeeksRankPill';
import { RewardsLeaderboard } from '@/components/app/rewardsLeaderboard';
import { RewardTiersPill } from '@/components/app/rewardTiersPill';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatScore } from '@/lib/formatters';
import {
  useCreatorRewards,
  useCreatorRewardsPayoutEligibilityForUser,
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
  const { fid, safeAreaInsets, triggerViewCast } = useFrameContext();

  const { currentCycleEndTimestamp } = useCreatorRewardsMetadata();

  const { data } = useCreatorRewards({ fid });

  const { data: creatorRewardsPeriodSummary } = useCreatorRewardsPeriodSummary({
    fid,
  });

  const { data: creatorRewardsPayoutEligibility } =
    useCreatorRewardsPayoutEligibilityForUser({ fid });

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

  const boosts = React.useMemo(() => {
    return lastWeeksSummary.boosts || [];
  }, [lastWeeksSummary.boosts]);

  const isGeoRestricted = React.useMemo(() => {
    return creatorRewardsPayoutEligibility.result.eligibility.isGeoRestricted;
  }, [creatorRewardsPayoutEligibility.result.eligibility.isGeoRestricted]);

  const hasPhoneVerification = React.useMemo(() => {
    return creatorRewardsPayoutEligibility.result.eligibility
      .hasPhoneVerification;
  }, [creatorRewardsPayoutEligibility.result.eligibility.hasPhoneVerification]);

  const onCreatorRewardsChangingClick = React.useCallback(() => {
    triggerViewCast({ hash: '0x27680551651b2be69a7decf928c623c27ec83151' });
  }, [triggerViewCast]);

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
      <Card
        className={cn(
          'flex flex-row items-start p-3  gap-2 border bg-[#323832] border-[#7CBE6F]',
        )}
        onClick={onCreatorRewardsChangingClick}
      >
        <div
          className={cn(
            'rounded-full w-8 h-8 items-center justify-center flex shrink-0 text-xs bg-[#454]',
          )}
        >
          Creator rewards are changing!
        </div>
        <div className="flex flex-col items-start justify-start w-full relative">
          Tap here to learn more.
        </div>
      </Card>
      {(typeof exclusion !== 'undefined' || isGeoRestricted) && (
        <ExclusionCard
          exclusion={exclusion}
          isGeoRestricted={isGeoRestricted}
          hasPhoneVerification={hasPhoneVerification}
        />
      )}
      {typeof exclusion === 'undefined' && boosts.length !== 0 && (
        <BoostCard key={boosts[0].type} boost={boosts[0]} />
      )}
      {exclusion !== 'unsupported-region' && !isGeoRestricted && (
        <>
          <Card className="flex flex-col items-center px-4">
            <div className="p-4 gap-2 flex flex-col items-center justify-center w-full relative">
              <div className="text-muted font-semibold text-sm">Your score</div>
              <div className="font-semibold text-4xl text-center">
                {formatScore({ score: scores.currentPeriodScore })}
              </div>
              {boosts.filter((x) => x.claimed).length > 0 && (
                <BoostedPill boosts={boosts} />
              )}
            </div>
            <div className="flex flex-row items-center justify-evenly w-full mb-4 border-t pt-4">
              {typeof scores.currentPeriodRank !== 'undefined' && (
                <div className="flex flex-col items-center justify-center w-full border-r">
                  <div className="text-muted font-semibold text-xs">
                    Your rank
                  </div>
                  <div className="text-default font-semibold [font-variant-numeric:tabular-nums]">
                    #{scores.currentPeriodRank}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="text-muted font-semibold text-xs">
                  Round ends
                </div>
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
              className={cn(
                lastWeeksSummaryPillVisible ? 'flex-none' : 'flex-1',
              )}
            >
              <RewardTiersPill />
            </div>
            <div
              className={cn(
                lastWeeksSummaryPillVisible ? 'flex-none' : 'flex-1',
              )}
            >
              <HowToEarnPill />
            </div>
          </div>
        </>
      )}
      <div className="text-xl font-semibold">Leaderboard</div>
      <RewardsLeaderboard />
    </div>
  );
}
