import { Clock, CreditCard, Home, PieChart, Settings, Users } from 'lucide-react';

import Link from 'next/link';

import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// import { User } from "@prisma/client"

export function Sidebar() {
  return (
    <SidebarComponent variant="floating" className="border-r">
      <SidebarHeader className="flex flex-col items-start px-4 py-4">
        <div className="flex items-center">
          <CreditCard className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold">GastoGrupal</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/categorias">
                <PieChart className="h-4 w-4 mr-2" />
                <span>Por Categorías</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/cronologico">
                <Clock className="h-4 w-4 mr-2" />
                <span>Cronológico</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/amigos">
                <Users className="h-4 w-4 mr-2" />
                <span>Amigos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/configuracion">
                <Settings className="h-4 w-4 mr-2" />
                <span>Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Juan Pérez</p>
              <p className="text-xs text-muted-foreground">juan@ejemplo.com</p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
}
