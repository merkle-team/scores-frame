'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useCreatorRewards } from '@/lib/queries';
import { useViewer } from '@/providers/FrameContextProvider';

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const { fid } = useViewer();

  const { data } = useCreatorRewards({ fid });

  const scores = React.useMemo(() => {
    return data.result.scores;
  }, [data.result.scores]);

  return (
    <div className="w-full h-full overflow-y-scroll space-y-4 pb-16">
      <Card>
        <CardHeader>Warpcast</CardHeader>
        <CardContent>FID: {scores.user.fid}</CardContent>
        <CardContent>All Time: {scores.allTimeScore}</CardContent>
        <CardContent>Current: {scores.currentPeriodScore}</CardContent>
        <CardContent>Previous: {scores.previousPeriodScore}</CardContent>
        <CardFooter>
          <Button>Click me</Button>
        </CardFooter>
      </Card>
      <Card className="opacity-50">
        <CardHeader>Warpcast</CardHeader>
        <CardContent>FID: {scores.user.fid}</CardContent>
        <CardContent>All Time: {scores.allTimeScore}</CardContent>
        <CardContent>Current: {scores.currentPeriodScore}</CardContent>
        <CardContent>Previous: {scores.previousPeriodScore}</CardContent>
        <CardFooter>
          <Button>Click me</Button>
        </CardFooter>
      </Card>
      <Card className="opacity-50">
        <CardHeader>Warpcast</CardHeader>
        <CardContent>FID: {scores.user.fid}</CardContent>
        <CardContent>All Time: {scores.allTimeScore}</CardContent>
        <CardContent>Current: {scores.currentPeriodScore}</CardContent>
        <CardContent>Previous: {scores.previousPeriodScore}</CardContent>
        <CardFooter>
          <Button>Click me</Button>
        </CardFooter>
      </Card>
      <Card className="opacity-50">
        <CardHeader>Warpcast</CardHeader>
        <CardContent>FID: {scores.user.fid}</CardContent>
        <CardContent>All Time: {scores.allTimeScore}</CardContent>
        <CardContent>Current: {scores.currentPeriodScore}</CardContent>
        <CardContent>Previous: {scores.previousPeriodScore}</CardContent>
        <CardFooter>
          <Button>Click me</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
