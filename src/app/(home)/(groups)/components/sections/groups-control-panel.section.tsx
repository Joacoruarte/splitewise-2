import { Filter, Plus, Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { capitalize } from '@/lib/utils';

import { useGetGroupCategories } from '../../hooks/useGetGroupCategories';

interface GroupsControlPanelProps {
  setSearchQuery: (query: string) => void;
  selectedCategory: { id: string; label: string } | null;
  onSelectCategory: (category: { id: string; label: string } | null) => void;
  setShowCreateDialog: (show: boolean) => void;
  // TODO: Add sorting functionality
  // sortBy: string;
  // setSortBy: (sort: string) => void;
}

export function GroupsControlPanel({
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  setShowCreateDialog,
}: GroupsControlPanelProps) {
  const { data: categories = [], isLoading: isLoadingCategories } = useGetGroupCategories();
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grupos Disponibles</h1>
          <p className="text-muted-foreground">Encuentra grupos para unirte o crea uno nuevo</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Grupo
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos..."
            className="pl-8"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={selectedCategory !== null ? 'default' : 'outline'}
              className="w-full md:w-auto"
            >
              <Filter className="h-4 w-4 z-20" />
              Filtrar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {isLoadingCategories ? (
              Array.from({ length: 8 }).map((_, index) => (
                <DropdownMenuItem key={index}>
                  <Skeleton className="h-6 w-full" />
                </DropdownMenuItem>
              ))
            ) : (
              <>
                <DropdownMenuItem
                  onClick={() => onSelectCategory(null)}
                  className={selectedCategory === null ? 'bg-accent font-medium' : ''}
                >
                  Todos
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => onSelectCategory({ id: category.id, label: category.name })}
                    className={selectedCategory?.id === category.id ? 'bg-accent font-medium' : ''}
                  >
                    {capitalize(category.name)}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/*
                    TODO: Add sorting functionality
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            Ordenar
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem
                            onClick={() => setSortBy('recent')}
                            className={sortBy === 'recent' ? 'bg-accent font-medium' : ''}
                        >
                            Actividad reciente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setSortBy('members')}
                            className={sortBy === 'members' ? 'bg-accent font-medium' : ''}
                        >
                            Número de miembros
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
      </div>
    </>
  );
}
