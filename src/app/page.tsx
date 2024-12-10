'use client';

import sdk, { FrameContext } from '@farcaster/frame-sdk';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { api } from '@/lib/api';

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = React.useState(false);
  const [context, setContext] = React.useState<FrameContext>();
  const [rewards, setRewards] = React.useState<unknown>();

  React.useEffect(() => {
    const load = async () => {
      const ctx: FrameContext = await sdk.context;
      setContext(ctx);
      sdk.actions.ready({
        disableNativeGestures: false,
      });

      if (typeof ctx !== 'undefined') {
        setRewards(await api.getCreatorRewardsForUser({ fid: 302 }));
      }
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>Warpcast</CardHeader>
      <CardContent>
        {typeof context === 'undefined'
          ? 'No frame context'
          : JSON.stringify(context.user)}
      </CardContent>
      <CardContent>
        {typeof rewards === 'undefined'
          ? 'No frame rewards'
          : JSON.stringify(rewards)}
      </CardContent>
      <CardFooter>
        <Button>Click me</Button>
      </CardFooter>
    </Card>
  );
}
