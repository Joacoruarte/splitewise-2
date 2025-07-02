'use client';

import { getUserByExternalId } from '@/actions/users';
import { useUser } from '@clerk/nextjs';
import { User } from '@prisma/client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface SessionContextType {
  user: User | undefined;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) {
  const { isLoaded, isSignedIn = false, user: clerkUser } = useUser();
  const [user, setUser] = useState<User | undefined>(initialUser);

  useEffect(() => {
    if (isLoaded && isSignedIn && !user && clerkUser) {
      getUserByExternalId(clerkUser.id).then(receivedUser => {
        if (receivedUser) {
          setUser(receivedUser);
        }
      });
    }
  }, [isLoaded, isSignedIn, initialUser, clerkUser, user]);

  return (
    <SessionContext.Provider value={{ user, isLoaded, isSignedIn }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
