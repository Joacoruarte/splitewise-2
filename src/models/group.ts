import { Group, GroupCategories, GroupMember, User } from '@prisma/client';
import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string(),
  category: z.string().min(1, 'Debes seleccionar una categoría'),
  selectedFriends: z.array(z.string()),
  isPublic: z.boolean(),
});

export type CreateGroupData = z.infer<typeof createGroupSchema>;

export interface GroupMemberWithUser extends GroupMember {
  user: Pick<User, 'id' | 'name' | 'email' | 'picture'>;
}

export interface GroupFieldsCount {
  members: number;
  expenses?: number;
}

// Tipo para la respuesta con datos relacionados
export interface GroupWithRelations extends Group {
  members: GroupMemberWithUser[];
  tags: GroupCategories[];
  isCurrentUserMember?: boolean;
  _count?: GroupFieldsCount;
}

export interface GetGroupsProps {
  categoryId?: string | null;
  searchQuery?: string;
}
