'use client';

import { SignedIn, UserButton, useUser } from '@clerk/nextjs';

import { useState } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const isAdmin = user?.emailAddresses[0].emailAddress === 'ruartejoaquin@gmail.com';

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-800">Ducky App</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {!isLoaded ? (
              Array.from({ length: 5 }).map((_, index, array) => (
                <div
                  key={index}
                  className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <div
                    className={cn('h-3 w-10 bg-gray-400 rounded-full animate-pulse', {
                      'h-6 w-6': index === array.length - 1,
                    })}
                  ></div>
                </div>
              ))
            ) : (
              <>
                <Link
                  href="/home"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/expenses"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Expenses
                </Link>
                <Link
                  href="/groups"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Groups
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                {!isLoaded ? (
                  <div className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <div className="h-6 w-6 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                ) : !isSignedIn ? (
                  <Link
                    href="/auth/login"
                    className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                ) : (
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/home"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/expenses"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Expenses
            </Link>
            <Link
              href="/groups"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Groups
            </Link>
            <Link
              href="/profile"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Profile
            </Link>
            <Link
              href="/auth/login"
              className="block px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-900 hover:bg-gray-50"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
