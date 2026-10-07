import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Campus Café | Self-Service', description: 'A friendly campus café ordering kiosk.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
