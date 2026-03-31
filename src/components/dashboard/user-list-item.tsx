'use client';

import { deleteUser } from '@/actions/users';
import { User } from '@prisma/generated/prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function UserListItem({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: (userId: string) => deleteUser(userId, '/dashboard'),
    onSuccess: (_, userId) => {
      queryClient.setQueryData<User[]>(
        ['users'],
        old => old?.filter(user => user.id !== userId) ?? []
      );
    },
    onError: error => {
      console.error(error);
      toast.error('Failed to delete user. Please try again.');
    },
  });

  return (
    <div key={user.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="mt-1 text-xs text-gray-400">
            Created: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => mutate(user.id)}
          disabled={isDeleting}
          className={`inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none ${
            isDeleting ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
