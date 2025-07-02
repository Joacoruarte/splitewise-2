import { GroupWithRelations } from '@/models/group';

import { GroupCard } from '../group-card';
import { GroupsLoadingSkeleton } from '../groups-loading.skeleton';
import { EmptyStateSection } from './empty-state-section';

interface GroupsListSectionProps {
  groups: GroupWithRelations[];
  setShowCreateDialog: (show: boolean) => void;
  isLoadingGroups: boolean;
}

export function GroupsListSection({
  groups,
  setShowCreateDialog,
  isLoadingGroups,
}: GroupsListSectionProps) {
  return (
    <div className="w-full">
      {isLoadingGroups ? (
        <GroupsLoadingSkeleton type="list" />
      ) : groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <EmptyStateSection onCreateGroup={() => setShowCreateDialog(true)} />
      )}
    </div>
  );
}
