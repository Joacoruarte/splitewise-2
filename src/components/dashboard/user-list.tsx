'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { UserListItem } from './user-list-item';
import { getUsers } from '@/actions/users';

export function UserList() {
  const { data: users } = useSuspenseQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
