import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Gavel, 
  Settings, 
  LogOut,
  GraduationCap,
  ShieldCheck,
  type LucideIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard Control" },
  { to: "/analytics", icon: BarChart3, label: "Intelligence Hub" },
  { to: "/alumni", icon: Users, label: "Graduate Explorer" },
  { to: "/bidding", icon: Gavel, label: "Bidding Engine" },
  { to: "/settings", icon: Settings, label: "System Config" },
];

export default function Sidebar({ onLogout, isAuthenticated }: SidebarProps) {
  const visibleItems = isAuthenticated 
    ? navItems 
    : navItems.filter(item => item.to === "/analytics");

  return (
    <div className="sidebar shadow-2xl shadow-slate-200/50">
      <div className="flex items-center gap-4 mb-12 px-2 overflow-hidden group cursor-pointer">
        <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl shadow-slate-200 transition-transform group-hover:scale-110 duration-500">
            <GraduationCap className="text-white" size={32} />
        </div>
        <div>
            <h2 className="text-xl font-black tracking-tighter leading-none text-slate-900">Nexus AI</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Intelligence Core</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Main Navigation</p>
        {visibleItems.map((item) => (
            <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `nav-item group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />}
                  </>
                )}
            </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-100 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <ShieldCheck className="text-emerald-500" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-slate-900 uppercase">System Status</p>
                  <p className="text-[10px] text-slate-400 font-bold truncate">Protocols: Validated</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black px-1.5 h-4">OK</Badge>
          </div>

          {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-14 rounded-2xl transition-all px-4 group"
                onClick={onLogout}
              >
                <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-rose-100 transition-colors">
                    <LogOut size={18} />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Terminate Session</span>
              </Button>
          ) : (
              <NavLink to="/login" className="block">
                  <Button 
                    className="w-full h-14 rounded-2xl font-bold gap-2 text-sm shadow-md"
                  >
                    Sign In
                  </Button>
              </NavLink>
          )}
      </div>
    </div>
  );
}


