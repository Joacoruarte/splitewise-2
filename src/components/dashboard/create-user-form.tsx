'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { createRandomUser } from '@/actions/users';

export function CreateUserForm() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => createRandomUser(formData, '/dashboard'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      setError('Failed to create user. Please try again.');
      console.error(error);
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    mutate(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          required
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter username"
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className={`inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
          isPending ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
