'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { JapaGenieLogo } from '@/components/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Map,
  CheckCircle2,
  Bot,
  Rocket,
  Star,
  DollarSign,
  MessageCircleQuestion,
  Repeat,
} from 'lucide-react';

const menuItems = [
  { href: '/progress-map', label: 'Progress Map', icon: LayoutDashboard },
  { href: '/interview', label: 'Mock Interview', icon: MessageCircleQuestion },
  { href: '/progress', label: 'Visa Journey', icon: Map },
  { href: '/document-check', label: 'Document Checker', icon: CheckCircle2 },
  { href: '/rejection-reversal', label: 'Rejection Reversal', icon: Repeat },
  { href: '/chat', label: 'AI Assistant', icon: Bot },
  { href: '/how-it-works', label: 'How It Works', icon: Rocket },
  { href: '/features', label: 'Features', icon: Star },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <JapaGenieLogo className="w-8 h-8 text-accent" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Japa Genie</h2>
            <p className="text-xs text-sidebar-foreground/70">Your Visa Guide</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className={item.href === '/progress-map' ? 'text-primary font-bold' : ''}>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-center text-xs text-sidebar-foreground/50">
          <p>&copy; {new Date().getFullYear()} Japa Genie</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
