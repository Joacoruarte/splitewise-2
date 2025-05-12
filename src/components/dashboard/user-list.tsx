'use client';

import { getUsers } from '@/actions/users';
import { useSuspenseQuery } from '@tanstack/react-query';

import { UserListItem } from './user-list-item';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
