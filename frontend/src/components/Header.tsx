'use client';

import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👗</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Virtual Try-On</h1>
              <p className="text-xs text-gray-500">AI 가상 피팅</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              홈
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              상의
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              하의
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              원피스
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              아우터
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 text-center text-sm">
        🎉 AI로 옷을 입어보세요! 사진만 업로드하면 가상 피팅이 완성됩니다.
      </div>
    </header>
  );
}
