import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Virtual Clothing Try-On | 가상 의류 피팅',
  description: 'AI 기반 가상 의류 피팅 서비스 - Azure OpenAI gpt-image-1.5',
  keywords: ['virtual try-on', '가상 피팅', 'AI', 'fashion', '패션'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
