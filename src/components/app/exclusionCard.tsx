import { Card } from "@/components/ui/card";
import { ApiCreatorRewardsExclusionType } from "@/lib/api";

function ExclusionCard({
  exclusion,
  isGeoRestricted = false,
  hasPhoneVerification = false,
}: {
  exclusion: ApiCreatorRewardsExclusionType | undefined;
  isGeoRestricted?: boolean;
  hasPhoneVerification?: boolean;
}) {
  if (exclusion === "missing-tax-docs") {
    return (
      <Card className="flex flex-row items-start p-3 bg-[#453529] gap-2 border border-[#8E5F24]">
        <div className="rounded-full w-8 h-8 items-center justify-center flex shrink-0 bg-[#5E4939]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M9.99984 1.33337H3.99984C3.64622 1.33337 3.30708 1.47385 3.05703 1.7239C2.80698 1.97395 2.6665 2.31309 2.6665 2.66671V13.3334C2.6665 13.687 2.80698 14.0261 3.05703 14.2762C3.30708 14.5262 3.64622 14.6667 3.99984 14.6667H11.9998C12.3535 14.6667 12.6926 14.5262 12.9426 14.2762C13.1927 14.0261 13.3332 13.687 13.3332 13.3334V4.66671L9.99984 1.33337Z"
              stroke="#EAB305"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.3335 1.33337V4.00004C9.3335 4.35366 9.47397 4.6928 9.72402 4.94285C9.97407 5.1929 10.3132 5.33337 10.6668 5.33337H13.3335"
              stroke="#EAB305"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.66683 6H5.3335"
              stroke="#EAB305"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6668 8.66663H5.3335"
              stroke="#EAB305"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6668 11.3334H5.3335"
              stroke="#EAB305"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-start justify-start w-full relative ">
          <div className="font-semibold text-sm py-0.5">
            Keep Earning Rewards
          </div>
          <div className="text-muted text-sm">
            Complete the tax forms we sent to continue receiving rewards.
          </div>
        </div>
      </Card>
    );
  } else if (
    (exclusion === "unsupported-region" || isGeoRestricted) &&
    hasPhoneVerification
  ) {
    return (
      <Card className="flex flex-row items-start p-3 gap-2 border">
        <div className="rounded-full w-8 h-8 items-center justify-center flex shrink-0 bg-[#3A3A3C]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M9.33337 4.45337L9.33337 6.6667C9.33337 7.72757 9.7548 8.74498 10.5049 9.49513C11.2551 10.2453 12.2725 10.6667 13.3334 10.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.6666 29.2666L14.6666 24C14.6666 23.2927 14.3857 22.6144 13.8856 22.1143C13.3855 21.6142 12.7072 21.3333 11.9999 21.3333C11.2927 21.3333 10.6144 21.0523 10.1143 20.5522C9.61423 20.0521 9.33328 19.3739 9.33328 18.6666L9.33328 17.3333C9.33328 16.626 9.05233 15.9478 8.55223 15.4477C8.05213 14.9476 7.37385 14.6666 6.66661 14.6666L2.73328 14.6666"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28.72 20L22.6667 20C21.9594 20 21.2811 20.281 20.781 20.781C20.281 21.2811 20 21.9594 20 22.6667L20 28.72"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 2.66663C13.5357 2.66678 11.1197 3.34986 9.02012 4.64005C6.92056 5.93023 5.21963 7.77704 4.10617 9.97543C2.9927 12.1738 2.51027 14.6378 2.71243 17.0938C2.91459 19.5498 3.79343 21.9017 5.25138 23.8884C6.70934 25.8751 8.68936 27.4189 10.9716 28.3484C13.2539 29.2779 15.7491 29.5568 18.1803 29.154C20.6114 28.7512 22.8834 27.6825 24.7439 26.0666C26.6044 24.4507 27.9807 22.3507 28.72 20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26.6667 7.99996L26.6667 5.33329C26.6667 4.62605 26.3858 3.94777 25.8857 3.44767C25.3856 2.94758 24.7073 2.66663 24 2.66663C23.2928 2.66663 22.6145 2.94758 22.1144 3.44767C21.6143 3.94777 21.3334 4.62605 21.3334 5.33329L21.3334 7.99996"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28 8L20 8C19.2636 8 18.6666 8.59695 18.6666 9.33333L18.6666 13.3333C18.6666 14.0697 19.2636 14.6667 20 14.6667L28 14.6667C28.7363 14.6667 29.3333 14.0697 29.3333 13.3333L29.3333 9.33333C29.3333 8.59695 28.7363 8 28 8Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-start justify-start w-full relative ">
          <div className="font-semibold text-sm py-0.5">Unsupported Region</div>
          <div className="text-muted text-sm">
            Rewards aren't available in your region at this time.
          </div>
        </div>
      </Card>
    );
  } else if (isGeoRestricted && !hasPhoneVerification) {
    return (
      <Card className="flex flex-row items-start p-3 gap-2 border bg-[#3F2F1B] border-[#EAB305]">
        <div className="rounded-full w-8 h-8 items-center justify-center flex shrink-0 bg-[#F8EFD150]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M9.33337 4.45337L9.33337 6.6667C9.33337 7.72757 9.7548 8.74498 10.5049 9.49513C11.2551 10.2453 12.2725 10.6667 13.3334 10.6667"
              stroke="#EAB305"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.6666 29.2666L14.6666 24C14.6666 23.2927 14.3857 22.6144 13.8856 22.1143C13.3855 21.6142 12.7072 21.3333 11.9999 21.3333C11.2927 21.3333 10.6144 21.0523 10.1143 20.5522C9.61423 20.0521 9.33328 19.3739 9.33328 18.6666L9.33328 17.3333C9.33328 16.626 9.05233 15.9478 8.55223 15.4477C8.05213 14.9476 7.37385 14.6666 6.66661 14.6666L2.73328 14.6666"
              stroke="#EAB305"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28.72 20L22.6667 20C21.9594 20 21.2811 20.281 20.781 20.781C20.281 21.2811 20 21.9594 20 22.6667L20 28.72"
              stroke="#EAB305"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 2.66663C13.5357 2.66678 11.1197 3.34986 9.02012 4.64005C6.92056 5.93023 5.21963 7.77704 4.10617 9.97543C2.9927 12.1738 2.51027 14.6378 2.71243 17.0938C2.91459 19.5498 3.79343 21.9017 5.25138 23.8884C6.70934 25.8751 8.68936 27.4189 10.9716 28.3484C13.2539 29.2779 15.7491 29.5568 18.1803 29.154C20.6114 28.7512 22.8834 27.6825 24.7439 26.0666C26.6044 24.4507 27.9807 22.3507 28.72 20"
              stroke="#EAB305"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26.6667 7.99996L26.6667 5.33329C26.6667 4.62605 26.3858 3.94777 25.8857 3.44767C25.3856 2.94758 24.7073 2.66663 24 2.66663C23.2928 2.66663 22.6145 2.94758 22.1144 3.44767C21.6143 3.94777 21.3334 4.62605 21.3334 5.33329L21.3334 7.99996"
              stroke="#EAB305"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28 8L20 8C19.2636 8 18.6666 8.59695 18.6666 9.33333L18.6666 13.3333C18.6666 14.0697 19.2636 14.6667 20 14.6667L28 14.6667C28.7363 14.6667 29.3333 14.0697 29.3333 13.3333L29.3333 9.33333C29.3333 8.59695 28.7363 8 28 8Z"
              stroke="#EAB305"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-start justify-start w-full relative">
          <div className="font-semibold text-sm py-0.5">
            You're in an unsupported region
          </div>
          <div className="text-muted text-sm">
            If you believe this is a mistake verify your phone number to keep
            receiving creator rewards.
          </div>
          <div className="mt-3 self-stretch h-[34px] px-[9px] bg-[#F8EFD150] rounded-[100px] inline-flex justify-center items-center gap-1 overflow-hidden font-semibold">
            {"On mobile, go to Settings > Verifications > Phone Number"}
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

export { ExclusionCard };
