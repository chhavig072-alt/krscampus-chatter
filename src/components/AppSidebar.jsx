import { Home, Search, Bell, User, LogOut, Moon, Sun, Sparkles, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { clearUser } from '../utils/storage';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Explore', path: '/explore', icon: Search },
  { title: 'Alerts', path: '/notifications', icon: Bell },
  { title: 'Profile', path: '/profile', icon: User },
];

const themes = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'gradient', label: 'Gradient', icon: Sparkles },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const [theme, setTheme] = useState(() => localStorage.getItem('krmu_theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'gradient');
    if (theme !== 'light') root.classList.add(theme);
    localStorage.setItem('krmu_theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const idx = themes.findIndex((t) => t.key === theme);
    setTheme(themes[(idx + 1) % themes.length].key);
  };

  const currentTheme = themes.find((t) => t.key === theme) || themes[0];
  const ThemeIcon = currentTheme.icon;

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <h1 className="text-lg font-bold text-primary tracking-tight">KRMU TALKS</h1>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-primary">K</span>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={`Theme: ${currentTheme.label}`}
              onClick={cycleTheme}
            >
              <ThemeIcon className="h-4 w-4" />
              {!collapsed && <span>{currentTheme.label} mode</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
