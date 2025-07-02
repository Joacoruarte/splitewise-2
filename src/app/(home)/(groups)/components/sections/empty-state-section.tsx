import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyStateSectionProps {
  onCreateGroup: () => void;
}

export function EmptyStateSection({ onCreateGroup }: EmptyStateSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No se encontraron grupos</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        No hemos encontrado grupos que coincidan con tu búsqueda. Intenta con otros términos o crea
        un nuevo grupo.
      </p>
      <Button className="mt-4" onClick={onCreateGroup}>
        <Plus className="mr-2 h-4 w-4" /> Crear Grupo
      </Button>
    </div>
  );
}
