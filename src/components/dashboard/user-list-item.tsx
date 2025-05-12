'use client';

import { deleteUser } from '@/actions/users';
import { User } from '@prisma/client';
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
    <div key={user.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Created: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => mutate(user.id)}
          disabled={isDeleting}
          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
