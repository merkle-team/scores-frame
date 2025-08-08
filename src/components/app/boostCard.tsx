import { ShootingStarIcon } from "@/components/core/icons";
import { Card } from "@/components/ui/card";
import { ApiCreatorRewardBoost } from "@/lib/api";
import { cn } from "@/lib/cn";

function BoostCard({ boost }: { boost: ApiCreatorRewardBoost }) {
  if (boost.type === "video-upload") {
    return (
      <Card
        className={cn(
          "flex flex-row items-start p-3  gap-2 border",
          boost.claimed
            ? "bg-[#323832] border-[#7CBE6F]"
            : "bg-[#303330] !border-0",
        )}
      >
        <div
          className={cn(
            "rounded-full w-8 h-8 items-center justify-center flex shrink-0  text-xs",
            boost.claimed ? "bg-[#454]" : "bg-[#454]",
          )}
        >
          {boost.claimed ? <ShootingStarIcon filled /> : <ShootingStarIcon />}
        </div>
        <div className="flex flex-col items-start justify-start w-full relative">
          <div className="font-semibold text-sm py-0.5">
            {boost.claimed
              ? "Boost unlocked!"
              : "Get an extra boost for sharing videos"}
          </div>
          <div className="text-muted text-sm">
            {boost.claimed
              ? `You’re getting +${boost.boost} points for posting videos this week`
              : `Post a video on Farcaster to earn +${boost.boost} bonus points this week`}
          </div>
        </div>
      </Card>
    );
  } else if (boost.type === "swap-transaction") {
    return (
      <Card
        className={cn(
          "flex flex-row items-start p-3  gap-2 border",
          boost.claimed
            ? "bg-[#323832] border-[#7CBE6F]"
            : "bg-[#303330] !border-0",
        )}
      >
        <div
          className={cn(
            "rounded-full w-8 h-8 items-center justify-center flex shrink-0  text-xs",
            boost.claimed ? "bg-[#454]" : "bg-[#454]",
          )}
        >
          {boost.claimed ? <ShootingStarIcon filled /> : <ShootingStarIcon />}
        </div>
        <div className="flex flex-col items-start justify-start w-full relative">
          <div className="font-semibold text-sm py-0.5">
            {boost.claimed
              ? "Boost unlocked!"
              : "Get an extra boost for swapping"}
          </div>
          <div className="text-muted text-sm">
            {boost.claimed
              ? `You’re getting +${boost.boost} points for swapping this week`
              : `Swap with your Farcaster wallet to earn a boost`}
          </div>
        </div>
      </Card>
    );
  }
  return null;
}

export { BoostCard };
