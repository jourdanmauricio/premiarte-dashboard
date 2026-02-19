"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { IconHome2, IconInnerShadowTop } from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { menuItems } from "@/shared/constanst";
import { NavUser } from "@/components/dashboardPage/nav-user";
import { NavMain } from "@/components/dashboardPage/nav-main";
import { NavDocuments } from "@/components/dashboardPage/nav-documents";
import { NavSecondary } from "@/components/dashboardPage/nav-secondary";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  const user = session?.user as {
    name: string;
    email: string;
    avatar: string;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconHome2 className="text-primary !size-5" />
                <span className="text-base font-semibold">Premiarte</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems.navMain} />
        <NavDocuments items={menuItems.documents} />
        <NavSecondary items={menuItems.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {status === "loading" ? (
          <div className="flex items-center justify-center">
            <Skeleton className="h-6 w-full" />
          </div>
        ) : session ? (
          <NavUser user={user} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
