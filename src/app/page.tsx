'use client';

import sdk, { FrameContext } from '@farcaster/frame-sdk';
import React from 'react';

import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../components/ui/card';

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = React.useState(false);
  const [context, setContext] = React.useState<FrameContext>();

  React.useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({
        disableNativeGestures: false,
      });
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
      <CardFooter>
        <Button>Click me</Button>
      </CardFooter>
    </Card>
  );
}
