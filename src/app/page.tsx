'use client';

import React from 'react';

import { Pill } from '@/components/core/pill';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import * as Drawer from '@/components/ui/drawer';
import { List } from '@/components/ui/list';
import { ApiCreatorRewardsLeaderboardUser } from '@/lib/api';
import { cn } from '@/lib/cn';
import {
  useCreatorRewards,
  useCreatorRewardsLeaderboard,
  useCreatorRewardsMetadata,
} from '@/lib/queries';
import { useViewer } from '@/providers/FrameContextProvider';
import {
  CastAndEngageIcon,
  GetRankedIcon,
  ReceiveUSDCIcon,
} from '@/components/core/icons';

const MIN_SCORE_FORMATTER_TARGET = 1e3;

function formatScore(score: number) {
  return score < MIN_SCORE_FORMATTER_TARGET
    ? `< ${MIN_SCORE_FORMATTER_TARGET.toLocaleString()}`
    : score.toLocaleString();
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function RewardsTimeRemainingFormatted({ timestamp }: { timestamp: number }) {
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

  return formatTime(time);
}

function ScoreSummaryRow({
  user,
  score,
  rank,
  className,
}: {
  user: ApiCreatorRewardsLeaderboardUser['user'];
  score: number;
  rank: number;
  className: string | undefined;
}) {
  const { fid } = useViewer();

  const viewerRow = React.useMemo(() => {
    return user.fid === fid;
  }, [fid, user.fid]);

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between py-2 px-3',
        className,
      )}
    >
      <div className="flex flex-row items-center">
        <Avatar className="h-[30px] w-[30px]">
          <AvatarImage
            className="object-cover"
            src={user.pfp?.url}
            alt={`Avatar for ${user.fid}`}
            loading="eager"
            width={30}
          />
        </Avatar>
        <div className="flex flex-col items-start justify-center pl-3 space-y-0.5">
          <div className="text-sm font-semibold">
            {user.username || `!${user.fid}`}
            {viewerRow && <span className="text-muted ml-1"> ⋅ You</span>}
          </div>
          <div className="text-muted text-sm">{formatScore(score)}</div>
        </div>
      </div>
      <div
        className={cn(
          'w-8 text-center font-semibold [font-variant-numeric:tabular-nums]',
          rank >= 100 && 'text-xs',
        )}
      >
        #{rank}
      </div>
    </div>
  );
}

function RewardsLeaderboard() {
  const { fid } = useViewer();

  const { data: creatorRewardsData } = useCreatorRewards({ fid });

  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    useCreatorRewardsLeaderboard();

  const viewerScores = React.useMemo(() => {
    return creatorRewardsData.result.scores;
  }, [creatorRewardsData.result.scores]);

  const leaderboard = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.result.leaderboard.users) || [];
  }, [data?.pages]);

  const renderItem = React.useCallback(
    ({ item }: { index: number; item: ApiCreatorRewardsLeaderboardUser }) => {
      return (
        <ScoreSummaryRow
          user={item.user}
          rank={item.rank}
          score={item.score}
          className={cn(item.rank !== 1 && 'border-t')}
        />
      );
    },
    [],
  );

  const keyExtractor = React.useCallback(
    (item: ApiCreatorRewardsLeaderboardUser) => {
      return item.user.fid.toString();
    },
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      {typeof viewerScores.currentPeriodRank !== 'undefined' && (
        <Card className="border">
          <ScoreSummaryRow
            user={viewerScores.user}
            rank={viewerScores.currentPeriodRank}
            score={viewerScores.currentPeriodScore}
            className={undefined}
          />
        </Card>
      )}
      <Card className="max-h-128">
        <List
          data={leaderboard}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          emptyView={<></>}
          isFetchingNextPage={isLoading || isFetchingNextPage}
          onEndReached={fetchNextPage}
        />
      </Card>
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const { fid } = useViewer();

  const { data: rewardsMetadata } = useCreatorRewardsMetadata();

  const { data } = useCreatorRewards({ fid });

  const scores = React.useMemo(() => {
    return data.result.scores;
  }, [data.result.scores]);

  const currentCycleEndTimestamp = React.useMemo(() => {
    return rewardsMetadata.result.metadata.currentPeriodEndTimestamp;
  }, [rewardsMetadata.result.metadata.currentPeriodEndTimestamp]);

  return (
    <div className="w-full h-full space-y-4 py-4 px-4">
      <Card className="flex flex-col items-center px-4">
        <div className="p-4 gap-2 flex flex-col items-center justify-center w-full relative">
          <div className="text-muted font-semibold text-sm">Your score</div>
          <div className="font-semibold text-4xl text-center">
            {formatScore(scores.currentPeriodScore)}
          </div>
        </div>
        {typeof scores.currentPeriodRank !== 'undefined' && (
          <div className="flex flex-row items-center justify-evenly w-full mb-4 border-t pt-4">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-muted font-semibold text-xs">Your rank</div>
              <div className="text-default font-semibold [font-variant-numeric:tabular-nums]">
                {scores.currentPeriodRank}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-l w-full">
              <div className="text-muted font-semibold text-xs">
                Next drop in
              </div>
              <div className="text-default font-semibold [font-variant-numeric:tabular-nums]">
                <RewardsTimeRemainingFormatted
                  timestamp={currentCycleEndTimestamp}
                />
              </div>
            </div>
          </div>
        )}
      </Card>
      <div className="flex flex-row items-center justify-evenly space-x-2">
        <Drawer.Drawer>
          <Drawer.DrawerTrigger className="w-full">
            <Pill icon="bulb" titleText="How to Earn" actionText="Learn more" />
          </Drawer.DrawerTrigger>
          <Drawer.DrawerContent aria-describedby={undefined}>
            <div className="mx-auto w-full max-w-sm">
              <Drawer.DrawerHeader>
                <Drawer.DrawerTitle>How to Earn</Drawer.DrawerTitle>
              </Drawer.DrawerHeader>
              <Card className="flex flex-col mb-4">
                <div className="flex flex-row border-b p-3">
                  <CastAndEngageIcon />
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">Cast and Engage</div>
                    <div className="text-muted text-sm">
                      Your score is based on the engagement your casts receive,
                      adjusted by the number of followers.
                    </div>
                  </div>
                </div>
                <div className="flex flex-row border-b py-2 px-3">
                  <GetRankedIcon />
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      {'Get Ranked -> Top 400'}
                    </div>
                    <div className="text-muted text-sm">
                      Each week, the top 400 accounts with the highest scores
                      receive USDC rewards.
                    </div>
                  </div>
                </div>
                <div className="flex flex-row py-2 px-3">
                  <ReceiveUSDCIcon />
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">Receive USDC</div>
                    <div className="text-muted text-sm">
                      Rewards are sent to your connected Ethereum address on
                      Base.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Drawer.DrawerContent>
        </Drawer.Drawer>
        <Drawer.Drawer>
          <Drawer.DrawerTrigger className="w-full">
            <Pill icon="cup" titleText="Reward Tiers" actionText="View" />
          </Drawer.DrawerTrigger>
          <Drawer.DrawerContent aria-describedby={undefined}>
            <div className="mx-auto w-full max-w-sm">
              <Drawer.DrawerHeader>
                <Drawer.DrawerTitle>Reward Tiers</Drawer.DrawerTitle>
              </Drawer.DrawerHeader>
              <Card className="flex flex-col mb-4">
                <div className="flex flex-row border-b p-3">
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      Tier 1 – $200 Prize
                    </div>
                    <div className="text-muted text-sm">Top 5 winners</div>
                  </div>
                </div>
                <div className="flex flex-row border-b p-3">
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      Tier 2 – $50 Prize
                    </div>
                    <div className="text-muted text-sm">Next 20 winners</div>
                  </div>
                </div>
                <div className="flex flex-row border-b p-3">
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      Tier 3 – $20 Prize
                    </div>
                    <div className="text-muted text-sm">Next 75 winners</div>
                  </div>
                </div>
                <div className="flex flex-row border-b p-3">
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      Tier 4 – $15 Prize
                    </div>
                    <div className="text-muted text-sm">Next 100 winners</div>
                  </div>
                </div>
                <div className="flex flex-row p-3">
                  <div className="flex flex-col ml-2 space-y-0.5">
                    <div className="font-semibold text-sm">
                      Tier 5 – $10 Prize
                    </div>
                    <div className="text-muted text-sm">Next 200 winners</div>
                  </div>
                </div>
              </Card>
            </div>
          </Drawer.DrawerContent>
        </Drawer.Drawer>
      </div>
      <div className="text-xl font-semibold">Leaderboard</div>
      <RewardsLeaderboard />
    </div>
  );
}
