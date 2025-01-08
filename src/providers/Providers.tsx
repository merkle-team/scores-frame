'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthedPrefetchesProvider } from './AuthedPrefetchesProvider';
import { CreatorRewardsMetadataProvider } from './CreatorRewardsMetadataProvider';
import { FrameContextProvider } from './FrameContextProvider';
import { FrameSplashProvider } from './FrameSplashProvider';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 60,
    },
  },
});

function Providers({ children }: React.PropsWithChildren) {
  return (
    <FrameSplashProvider>
      <FrameContextProvider>
        <QueryClientProvider client={client}>
          <AuthedPrefetchesProvider>
            <CreatorRewardsMetadataProvider>
              {/* */}
              {children}
              {/* */}
            </CreatorRewardsMetadataProvider>
          </AuthedPrefetchesProvider>
        </QueryClientProvider>
      </FrameContextProvider>
    </FrameSplashProvider>
  );
}

export { Providers };
