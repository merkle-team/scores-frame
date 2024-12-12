import './globals.css';

import localFont from 'next/font/local';

const InterLocalFont = localFont({ src: './Inter.woff2', display: 'block' });

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
    title: 'Warpcast Rewards',
    openGraph: {
      title: 'Warpcast',
      description: 'Warpcast Rewards',
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
      <body
        className={`antialiased scrollbar-vert ${InterLocalFont.className}`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
