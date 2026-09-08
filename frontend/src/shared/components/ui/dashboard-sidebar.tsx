import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  LogOut,
  ChevronLeft,
  Activity,
  CreditCard,
  Blocks,
  Command,
  ScanLine
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/shared/lib/utils";
import { supabase } from "@/lib/auth/supabase";

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

const finusaNavItems: NavItemData[] = [
  { id: 'home', title: 'Home', icon: LayoutDashboard, href: "/home" },
  { id: 'receipt-scanner', title: 'Scan', icon: ScanLine, href: "/receipt-scanner", badge: 'AI' },
  { id: 'monitor', title: 'Monitor', icon: Activity, href: "/monitor" },
  { id: 'nabung', title: 'Nabung', icon: CreditCard, href: "/nabung" },
  { id: 'pembukuan', title: 'Catat', icon: FolderKanban, href: "/pembukuan" },
  { id: 'sheets', title: 'Sheets', icon: Blocks, href: "/sheets" },
];

const finusaBottomItems: NavItemData[] = [
  { id: 'settings', title: 'Pengaturan', icon: Settings, href: "/settings" },
  { id: 'help', title: 'Bantuan', icon: Command, href: "/help" },
];

function NavItem({ 
  item, 
  activeId, 
  onSelect, 
  isCollapsed 
}: { 
  item: NavItemData; 
  activeId: string; 
  onSelect: (id: string) => void; 
  isCollapsed: boolean; 
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) setIsOpen(!isOpen);
    else onSelect(item.id);
  };

  const NavContent = (
    <div 
      className={cn(
        "group relative flex items-center px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-200 select-none",
        isActive 
          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-medium shadow-sm' 
          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
      )}
      onClick={handleClick}
    >
      {/* Fixed 28px icon slot - stays exactly at 36px center in both expanded and collapsed modes */}
      <div className="w-7 h-7 shrink-0 flex items-center justify-center">
        <item.icon 
          className={cn("w-4 h-4 transition-colors duration-200", isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white')} 
          strokeWidth={isActive ? 2 : 1.75} 
        />
      </div>

      {/* Smooth title transition: CSS grid-template-columns 0fr -> 1fr + opacity, 0 layout thrash */}
      <div 
        className={cn(
          "grid transition-[grid-template-columns,opacity] duration-300 ease-in-out flex-1",
          isCollapsed ? "grid-cols-[0fr] opacity-0 pointer-events-none" : "grid-cols-[1fr] opacity-100 ml-2.5"
        )}
      >
        <div className="overflow-hidden whitespace-nowrap flex items-center justify-between min-w-0">
          <span className="text-sm tracking-wide truncate">{item.title}</span>
          {item.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0 ml-1.5">
              {item.badge}
            </span>
          )}
        </div>
      </div>

      {/* Hover tooltip for collapsed sidebar */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1f2e] border border-slate-700/80 text-slate-200 text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {item.title}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      {item.href ? <Link href={item.href} passHref>{NavContent}</Link> : NavContent}
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  onSelect,
  isCollapsed = false,
  onCollapseToggle,
  onLogout
}: { 
  className?: string,
  onSelect?: (id: string) => void,
  isCollapsed?: boolean,
  onCollapseToggle?: () => void,
  onLogout?: () => void
}) {
  const handleSelect = onSelect || (() => {});

  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
    if (onLogout) onLogout();
  };

  return (
    <div className={cn("flex flex-col h-full bg-[#0F1419] border-r border-slate-800 text-slate-200 select-none", className)}>
      {/* Brand Header */}
      <div className="flex items-center px-3 py-5 h-[68px] overflow-hidden">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 ml-1.5">
          <img 
            src="/Assets/LogoIcon.png" 
            alt="FINUSA Icon" 
            className="w-7 h-7 object-contain drop-shadow-[0_2px_8px_rgba(0,193,255,0.4)]" 
          />
        </div>
        <div 
          className={cn(
            "grid transition-[grid-template-columns,opacity] duration-300 ease-in-out",
            isCollapsed ? "grid-cols-[0fr] opacity-0 pointer-events-none" : "grid-cols-[1fr] opacity-100 ml-2.5"
          )}
        >
          <div className="overflow-hidden whitespace-nowrap min-w-0">
            <h1 className="text-white font-bold text-sm leading-none tracking-tight">FINUSA</h1>
            <p className="text-[10px] text-slate-400 mt-1">Finance Nusantara</p>
          </div>
        </div>
      </div>

      <div className="mx-3 border-t border-slate-800/80 mb-3" />
      
      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-1 px-3">
        <div 
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out text-[11px] font-semibold text-slate-500 uppercase tracking-wider",
            isCollapsed ? "grid-rows-[0fr] opacity-0 pointer-events-none mb-0" : "grid-rows-[1fr] opacity-100 px-2 pb-1.5 mb-1"
          )}
        >
          <div className="overflow-hidden min-h-0">
            Menu Utama
          </div>
        </div>
        {finusaNavItems.map((item) => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={pathname.includes('/receipt-scanner') ? 'receipt-scanner' : pathname.split('/')[1] || 'home'}
            onSelect={(id) => handleSelect(id)} 
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Bottom Nav Items */}
      <div className="mt-auto pt-3 pb-4 border-t border-slate-800/80 flex flex-col gap-1 px-3">
        {finusaBottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={pathname.includes('/receipt-scanner') ? 'receipt-scanner' : pathname.split('/')[1] || 'home'}
            onSelect={(id) => handleSelect(id)} 
            isCollapsed={isCollapsed}
          />
        ))}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group relative flex items-center px-2.5 py-2 rounded-xl text-rose-400/80 hover:text-rose-200 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 transition-all duration-200 w-full disabled:opacity-50 cursor-pointer"
        >
          <div className="w-7 h-7 shrink-0 flex items-center justify-center">
            {isLoggingOut ? (
              <svg className="h-4 w-4 animate-spin text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <LogOut className="w-4 h-4 text-rose-400/80 group-hover:text-rose-200 transition-colors" strokeWidth={1.75} />
            )}
          </div>
          <div
            className={cn(
              "grid transition-[grid-template-columns,opacity] duration-300 ease-in-out flex-1 text-left",
              isCollapsed ? "grid-cols-[0fr] opacity-0 pointer-events-none" : "grid-cols-[1fr] opacity-100 ml-2.5"
            )}
          >
            <div className="overflow-hidden whitespace-nowrap min-w-0">
              <span className="text-sm tracking-wide truncate group-hover:text-rose-200">{isLoggingOut ? "Keluar..." : "Logout"}</span>
            </div>
          </div>
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1f2e] border border-slate-700/80 text-rose-300 text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onCollapseToggle}
        aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1a1f2e] border border-slate-700 items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all shadow-sm z-10 cursor-pointer"
      >
        <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform duration-300", isCollapsed && "rotate-180")} />
      </button>
    </div>
  );
}
