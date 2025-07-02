'use client';

import { searchNotGroupMemberUsers, searchUsers } from '@/actions/users';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface UseSearchUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useSearchUsers = (groupId?: string): UseSearchUsersReturn => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce de la query para evitar múltiples llamadas
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  // Query para buscar usuarios usando TanStack Query
  const {
    data: searchedUsers = [],
    isLoading: isSearchingUsers,
    error: searchError,
  } = useQuery({
    queryKey: [groupId ? 'searchNotGroupMemberUsers' : 'searchUsers', debouncedQuery, groupId],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return [];
      }

      if (!groupId) {
        return await searchUsers(debouncedQuery);
      }

      return await searchNotGroupMemberUsers(debouncedQuery, groupId);
    },
    enabled: !!debouncedQuery.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Determinar qué usuarios mostrar
  const users = debouncedQuery.trim() ? searchedUsers : [];
  const isLoading = isSearchingUsers;
  const error = searchError?.message || null;

  return {
    users,
    isLoading,
    error,
    searchQuery,
    handleSearch,
  };
};
