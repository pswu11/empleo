import React from 'react';
import Link from 'next/link';
import { HiArrowNarrowRight } from 'react-icons/hi';

type HeaderProps = {
  underline: boolean;
};

export function Header({ underline }: HeaderProps) {
  return (
    <header
      className={`flex justify-between w-[1300px] 2xl:max-w-7xl py-m ${
        underline ? 'border-x-0 border-b border-basicColors-light' : ''
      }`}
    >
      <Link href="/" className="font-500 text-xxl">
        EMPLEO.
      </Link>
      <nav className="space-x-s flex items-center">
        <HiArrowNarrowRight className="text-xl" />
        <Link href="/login">
          <button className="border border-basicColors-light rounded-full px-s py-xxs hover:cursor-pointer">
            Login
          </button>
        </Link>
        <Link href="/registration">
          <button className="border border-basicColors-light rounded-full px-s py-xxs hover:cursor-pointer">
            Register
          </button>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
