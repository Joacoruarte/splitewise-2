'use client';

import { PlusCircle } from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger />
      <div className="flex-1" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Nuevo</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="grid gap-4 py-4">
            <Button onClick={() => setOpen(false)} className="w-full" asChild>
              <Link href="/nuevo-gasto">Agregar Gasto</Link>
            </Button>
            <Button onClick={() => setOpen(false)} className="w-full" variant="outline" asChild>
              <Link href="/registrar-pago">Registrar Pago</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>
    </header>
  );
}
