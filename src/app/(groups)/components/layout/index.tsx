'use client';

import { User } from '@prisma/client';

import { useState } from 'react';

import { SIDEBAR_WIDTH, SidebarProvider, useSidebar } from '@/components/ui/sidebar';

import { Header } from './header';
import { Sidebar } from './sidebar';

const SIDEBAR_WIDTH_PX = Number(SIDEBAR_WIDTH.replace('rem', '')) * 16;
const MIN_SIDEBAR_WIDTH_PX = SIDEBAR_WIDTH_PX;
const MAX_SIDEBAR_WIDTH_PX = 400;

export default function HomeLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  return (
    <SidebarProvider>
      <Layout user={user}>{children}</Layout>
    </SidebarProvider>
  );
}

export function Layout({ children, user }: { children: React.ReactNode; user: User }) {
  const { isMobile, state } = useSidebar();
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_WIDTH_PX);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = Math.max(MIN_SIDEBAR_WIDTH_PX, Math.min(MAX_SIDEBAR_WIDTH_PX, e.clientX));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div
        style={{ width: !isMobile && state == 'expanded' ? sidebarWidth : 0 }}
        className="flex-shrink-0 transition-width duration-150"
      >
        <Sidebar user={user} sidebarWidth={!isMobile && state == 'expanded' ? sidebarWidth : 0} />
      </div>
      <div
        className="w-0.5 cursor-col-resize hover:bg-gray-400 transition-colors"
        onMouseDown={handleMouseDown}
      />
      <div className="flex-1">
        <Header user={user} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
