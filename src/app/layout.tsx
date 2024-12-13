import './globals.css';

import type { Metadata } from 'next';

import { Header } from '@/components/ui/header';
import { Providers } from '@/providers/Providers';

const frame = {
  version: 'next',
  imageUrl: `https://scores-frame.vercel.app/opengraph-image`,
  button: {
    title: 'Warpcast Rewards',
    action: {
      type: 'launch_frame',
      name: 'Warpcast Rewards',
      url: 'https://scores-frame.vercel.app',
      iconImageUrl: `https://scores-frame.vercel.app/splash.png`,
      splashImageUrl: `https://scores-frame.vercel.app/splash.png`,
      splashBackgroundColor: '#000000',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://scores-frame.vercel.app'),
    title: 'Warpcast Rewards',
    openGraph: {
      title: 'Warpcast',
      description: 'Warpcast Rewards',
      images: `https://scores-frame.vercel.app/opengraph-image`,
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased scrollbar-vert">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
