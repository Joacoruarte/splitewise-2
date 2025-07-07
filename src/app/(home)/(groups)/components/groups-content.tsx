'use client';

import { useState } from 'react';

import { Modal } from '@/components/ui/modal';

import { useGetGroups } from '../hooks/useGetGroups';
import { CreateGroupDialog } from './dialog/create-group-dialog';
import { GroupsControlPanel } from './sections/groups-control-panel.section';
import { GroupsListSection } from './sections/groups-list.section';

export function GroupsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; label: string } | null>(
    null
  );
  const [showCreateContentDialog, setShowCreateContentDialog] = useState(false);
  const { data: groups = [], isLoading } = useGetGroups({
    categoryId: selectedCategory?.id,
    searchQuery,
  });

  const handleSelectCategory = (category: { id: string; label: string } | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <GroupsControlPanel
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        setShowCreateDialog={setShowCreateContentDialog}
      />

      <GroupsListSection
        groups={groups}
        isLoadingGroups={isLoading}
        setShowCreateDialog={setShowCreateContentDialog}
      />

      <Modal isOpen={showCreateContentDialog} onClose={() => setShowCreateContentDialog(false)}>
        <CreateGroupDialog onOpenChange={setShowCreateContentDialog} />
      </Modal>
    </div>
  );
}
