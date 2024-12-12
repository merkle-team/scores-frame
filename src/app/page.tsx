'use client';

import React from 'react';

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

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clipPath="url(#clip0_12381_22013)">
        <path
          d="M8.00004 14.6663C11.6819 14.6663 14.6667 11.6816 14.6667 7.99967C14.6667 4.31778 11.6819 1.33301 8.00004 1.33301C4.31814 1.33301 1.33337 4.31778 1.33337 7.99967C1.33337 11.6816 4.31814 14.6663 8.00004 14.6663Z"
          stroke="#7C8293"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10.6667V8"
          stroke="#7C8293"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5.33301H8.00667"
          stroke="#7C8293"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_12381_22013">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
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
          <Drawer.Drawer>
            <Drawer.DrawerTrigger asChild>
              <div className="right-0 top-4 absolute">
                <InfoIcon />
              </div>
            </Drawer.DrawerTrigger>
            <Drawer.DrawerContent aria-describedby="Rewards details">
              <div className="mx-auto w-full max-w-sm">
                <Drawer.DrawerHeader>
                  <Drawer.DrawerTitle>How to Earn</Drawer.DrawerTitle>
                </Drawer.DrawerHeader>
                <Card className="flex flex-col mb-4">
                  <div className="flex flex-row border-b p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M10 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V10"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.3125 2.18769C15.644 1.85617 16.0937 1.66992 16.5625 1.66992C17.0313 1.66992 17.481 1.85617 17.8125 2.18769C18.144 2.51921 18.3303 2.96885 18.3303 3.43769C18.3303 3.90653 18.144 4.35617 17.8125 4.68769L10.3017 12.1994C10.1038 12.3971 9.85933 12.5418 9.59083 12.6202L7.19666 13.3202C7.12496 13.3411 7.04895 13.3424 6.97659 13.3238C6.90423 13.3053 6.83819 13.2676 6.78537 13.2148C6.73255 13.162 6.6949 13.096 6.67637 13.0236C6.65783 12.9512 6.65908 12.8752 6.68 12.8035L7.38 10.4094C7.45877 10.1411 7.60378 9.8969 7.80166 9.69936L15.3125 2.18769Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex flex-col ml-2 space-y-0.5">
                      <div className="font-semibold text-sm">
                        Cast and Engage
                      </div>
                      <div className="text-muted text-sm">
                        Your score is based on the engagement your casts
                        receive, adjusted by the number of followers.
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row border-b py-2 px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <g clipPath="url(#clip0_12337_23285)">
                        <path
                          d="M4.99996 7.49967H3.74996C3.19742 7.49967 2.66752 7.28018 2.27682 6.88948C1.88612 6.49878 1.66663 5.96888 1.66663 5.41634C1.66663 4.86381 1.88612 4.3339 2.27682 3.9432C2.66752 3.5525 3.19742 3.33301 3.74996 3.33301H4.99996"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 7.49967H16.25C16.8025 7.49967 17.3324 7.28018 17.7231 6.88948C18.1138 6.49878 18.3333 5.96888 18.3333 5.41634C18.3333 4.86381 18.1138 4.3339 17.7231 3.9432C17.3324 3.5525 16.8025 3.33301 16.25 3.33301H15"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33337 18.333H16.6667"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.33337 12.2168V14.1668C8.33337 14.6251 7.94171 14.9835 7.52504 15.1751C6.54171 15.6251 5.83337 16.8668 5.83337 18.3335"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.6666 12.2168V14.1668C11.6666 14.6251 12.0583 14.9835 12.475 15.1751C13.4583 15.6251 14.1666 16.8668 14.1666 18.3335"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 1.66699H5V7.50033C5 8.82641 5.52678 10.0982 6.46447 11.0359C7.40215 11.9735 8.67392 12.5003 10 12.5003C11.3261 12.5003 12.5979 11.9735 13.5355 11.0359C14.4732 10.0982 15 8.82641 15 7.50033V1.66699Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_12337_23285">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <g clipPath="url(#clip0_12337_23296)">
                        <path
                          d="M9.16667 12.5003H10.8333C11.2754 12.5003 11.6993 12.3247 12.0118 12.0122C12.3244 11.6996 12.5 11.2757 12.5 10.8337C12.5 10.3916 12.3244 9.96771 12.0118 9.65515C11.6993 9.34259 11.2754 9.16699 10.8333 9.16699H8.33333C7.83333 9.16699 7.41667 9.33366 7.16667 9.66699L2.5 14.167"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.83337 17.5002L7.16671 16.3336C7.41671 16.0002 7.83337 15.8336 8.33337 15.8336H11.6667C12.5834 15.8336 13.4167 15.5002 14 14.8336L17.8334 11.1669C18.1549 10.863 18.3426 10.4438 18.3551 10.0015C18.3676 9.55926 18.2039 9.13013 17.9 8.80856C17.5961 8.48698 17.177 8.2993 16.7347 8.2868C16.2924 8.2743 15.8633 8.438 15.5417 8.74189L12.0417 11.9919"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.66663 13.333L6.66663 18.333"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3333 9.91634C14.668 9.91634 15.75 8.83436 15.75 7.49967C15.75 6.16499 14.668 5.08301 13.3333 5.08301C11.9986 5.08301 10.9166 6.16499 10.9166 7.49967C10.9166 8.83436 11.9986 9.91634 13.3333 9.91634Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 6.66699C6.38071 6.66699 7.5 5.5477 7.5 4.16699C7.5 2.78628 6.38071 1.66699 5 1.66699C3.61929 1.66699 2.5 2.78628 2.5 4.16699C2.5 5.5477 3.61929 6.66699 5 6.66699Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_12337_23296">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="flex flex-col ml-2 space-y-0.5">
                      <div className="font-semibold text-sm">Receive USDC</div>
                      <div className="text-muted text-sm">
                        Rewards are sent to your connected Ethereum address on
                        Base.
                      </div>
                    </div>
                  </div>
                </Card>
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
      <div className="text-xl font-semibold">Leaderboard</div>
      <RewardsLeaderboard />
    </div>
  );
}
