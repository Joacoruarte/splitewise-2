import { User } from '@prisma/client';
import { Clock, CreditCard, Home, PieChart, Settings, Users } from 'lucide-react';
import Link from 'next/link';
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
      className="border-r flex-shrink-0 transition-width duration-150 bg-background"
      style={{ width: sidebarWidth }}
    >
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
            <ProfilePicture user={user} className="h-8 w-8 mr-2" align="start" />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground text-ellipsis overflow-x-hidden max-w-[150px]">
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
