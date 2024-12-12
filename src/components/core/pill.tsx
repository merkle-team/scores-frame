'use client';

import React from 'react';

import { Card } from '../ui/card';
import { BulbPillIcon, CupPillIcon } from './icons';

function Pill({
  icon,
  titleText,
  actionText,
}: {
  icon: 'bulb' | 'cup';
  titleText: string;
  actionText: string;
}) {
  return (
    <Card className="flex flex-row space-x-2 items-center p-3 w-full">
      <div className="rounded-full border border-[#402750] bg-action h-[32px] w-[32px] flex items-center justify-center">
        {icon === 'bulb' && <BulbPillIcon />}
        {icon === 'cup' && <CupPillIcon />}
      </div>
      <div className="flex flex-col items-start">
        <div className="text-sm">{titleText}</div>
        <div className="text-sm text-action-foreground">{actionText}</div>
      </div>
    </Card>
  );
}

export { Pill };
