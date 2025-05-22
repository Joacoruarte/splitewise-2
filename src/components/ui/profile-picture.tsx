'use client';

import { useAuth } from '@clerk/clerk-react';
import { SignOutButton } from '@clerk/nextjs';
import { User } from '@prisma/client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfilePictureProps {
  user: User;
  className?: string;
  align?: 'start' | 'end';
}

export function ProfilePicture({ user, className, align = 'end' }: ProfilePictureProps) {
  const { sessionId } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={`cursor-pointer ${className}`}>
          <AvatarImage src={user.picture} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <SignOutButton signOutOptions={{ sessionId: sessionId ?? undefined }}>
          <DropdownMenuItem className="cursor-pointer">Cerrar sesión</DropdownMenuItem>
        </SignOutButton>
        {user.email === 'ruartejoaquin@gmail.com' && (
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/dashboard">Dashboard (Admin)</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
