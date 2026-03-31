import { Clock, CreditCard, Home, PieChart, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { User } from '@prisma/generated/prisma/client';
import { ModeToggle } from '@/components/mode-toggle';
import { ProfilePicture } from '@/components/ui/profile-picture';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function Sidebar({ user, sidebarWidth }: { user: User; sidebarWidth: number }) {
  return (
    <SidebarComponent
      variant="floating"
      className="transition-width bg-background flex-shrink-0 border-r duration-150"
      style={{ width: sidebarWidth }}
    >
      <SidebarHeader className="flex flex-col items-start px-4 py-4">
        <div className="flex items-center">
          <CreditCard className="text-primary mr-2 h-6 w-6" />
          <h1 className="text-xl font-bold">GastoGrupal</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/categorias">
                <PieChart className="mr-2 h-4 w-4" />
                <span>Por Categorías</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/cronologico">
                <Clock className="mr-2 h-4 w-4" />
                <span>Cronológico</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/amigos">
                <Users className="mr-2 h-4 w-4" />
                <span>Amigos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/configuracion">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ProfilePicture user={user} className="mr-2 h-8 w-8" align="start" />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground max-w-[150px] overflow-x-hidden text-xs text-ellipsis">
                {user.email}
              </p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
}
