import React from "react";

import * as Drawer from "@/components/ui/drawer";
import { ApiCreatorRewardBoost } from "@/lib/api";
import { cn } from "@/lib/cn";

import { ShootingStarIcon } from "../core/icons";
import { Card } from "../ui/card";

function BoostedPill({ boosts }: { boosts: ApiCreatorRewardBoost[] }) {
  const claimedBoosts = React.useMemo(() => {
    return boosts.filter((boost) => boost.claimed);
  }, [boosts]);

  return (
    <Drawer.Drawer>
      <Drawer.DrawerTrigger className="flex flex-row outline-none">
        <div
          className={cn(
            "rounded-full h-6 items-center px-2 flex flex-row shrink-0 bg-[#454]",
          )}
        >
          <ShootingStarIcon />
          <div className="font-semibold text-xs pl-1 text-[#7CBE6F]">
            BOOSTED
          </div>
        </div>
      </Drawer.DrawerTrigger>
      <Drawer.DrawerContent aria-describedby={undefined}>
        <div className="w-full pb-4">
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
            {claimedBoosts.map((boost, index) => {
              switch (boost.type) {
                case "wallet-balance":
                  return (
                    <div
                      className={cn(
                        "flex flex-row p-3 justify-between",
                        index < claimedBoosts.length - 1 ? "border-b" : "",
                      )}
                      key={boost.type}
                    >
                      <div className="text-muted text-sm">
                        $25 balance in wallet
                      </div>
                      <div className="text-[#7CBE6F] font-semibold text-sm">
                        +{boost.boost}
                      </div>
                    </div>
                  );
                case "video-upload":
                  return (
                    <div
                      className={cn(
                        "flex flex-row p-3 justify-between",
                        index < claimedBoosts.length - 1 ? "border-b" : "",
                      )}
                      key={boost.type}
                    >
                      <div className="text-muted text-sm">
                        Weekly video uploads
                      </div>
                      <div className="text-[#7CBE6F] font-semibold text-sm">
                        +{boost.boost}
                      </div>
                    </div>
                  );
                case "video-upload":
                  return (
                    <div
                      className={cn(
                        "flex flex-row p-3 justify-between",
                        index < claimedBoosts.length - 1 ? "border-b" : "",
                      )}
                      key={boost.type}
                    >
                      <div className="text-muted text-sm">
                        Weekly video uploads
                      </div>
                      <div className="text-[#7CBE6F] font-semibold text-sm">
                        +{boost.boost}
                      </div>
                    </div>
                  );
                case "swap-transaction":
                  return (
                    <div
                      className={cn(
                        "flex flex-row p-3 justify-between",
                        index < claimedBoosts.length - 1 ? "border-b" : "",
                      )}
                      key={boost.type}
                    >
                      <div className="text-muted text-sm">
                        Weekly swap
                      </div>
                      <div className="text-[#7CBE6F] font-semibold text-sm">
                        +{boost.boost}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </Card>
        </div>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}

export { BoostedPill };
