import React from "react";

import * as Drawer from "@/components/ui/drawer";
import { ApiCreatorRewardBoost } from "@/lib/api";
import { cn } from "@/lib/cn";

import { ShootingStarIcon } from "../core/icons";
import { Card } from "../ui/card";

function BoostedPill({ boosts }: { boosts: ApiCreatorRewardBoost[] }) {
  return (
    <Drawer.Drawer>
      <Drawer.DrawerTrigger className="flex flex-row">
        <div
          className={cn(
            "rounded-full h-8 items-center px-2 flex flex-row shrink-0 bg-[#454]",
          )}
        >
          <ShootingStarIcon />
          <div className="font-semibold text-xs pl-1 text-[#7CBE6F]">
            BOOSTED
          </div>
        </div>
      </Drawer.DrawerTrigger>
      <Drawer.DrawerContent aria-describedby={undefined}>
        <div className="w-full">
          <Drawer.DrawerHeader className="mx-4 flex flex-row items-center">
            <div
              className={cn(
                "rounded-full w-8 h-8 mr-1 items-center justify-center flex shrink-0  text-xs bg-[#454]",
              )}
            >
              <ShootingStarIcon filled />
            </div>
            <Drawer.DrawerTitle>Your score is boosted</Drawer.DrawerTitle>
          </Drawer.DrawerHeader>
          <Card className="flex flex-col mb-4 mx-4">
            {boosts.map((boost) => (
              <div
                className="flex flex-row border-b p-3 justify-between"
                key={boost.type}
              >
                <div className="text-muted text-sm">
                  {boost.type === "wallet-balance"
                    ? "$25 balance in wallet"
                    : "Weekly video uploads"}
                </div>
                <div className="text-[#7CBE6F] font-semibold text-sm">
                  +${boost.boost}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}

export { BoostedPill };
