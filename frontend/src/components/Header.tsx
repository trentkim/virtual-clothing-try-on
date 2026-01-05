'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Banner */}
      <div className="gradient-primary text-white py-2 px-4 text-center text-xs sm:text-sm font-medium">
        ✨ AI로 옷을 입어보세요! 사진만 업로드하면 가상 피팅이 완성됩니다.
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-2xl sm:text-3xl">👗</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Virtual Try-On
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI 가상 피팅</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              홈
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              상의
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              하의
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              원피스
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              아우터
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <User className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 gradient-primary text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                0
              </span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 홈
            </Link>
            <Link
              href="#"
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              👕 상의
            </Link>
            <Link
              href="#"
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              👖 하의
            </Link>
            <Link
              href="#"
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              👗 원피스
            </Link>
            <Link
              href="#"
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              🧥 아우터
            </Link>
            <div className="border-t border-gray-200 pt-3 mt-2">
              <Link
                href="#"
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                마이페이지
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
