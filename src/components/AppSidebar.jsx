import { Home, Search, Bell, User, LogOut, Moon, Sun } from 'lucide-react';
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

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const [dark, setDark] = useState(() => {
    return localStorage.getItem('krmu_theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('krmu_theme', dark ? 'dark' : 'light');
  }, [dark]);

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
              tooltip={dark ? 'Light mode' : 'Dark mode'}
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {!collapsed && <span>{dark ? 'Light mode' : 'Dark mode'}</span>}
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
