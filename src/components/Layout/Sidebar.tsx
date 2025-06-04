
import React from 'react';
import { 
  Home, 
  Ticket, 
  Plus, 
  Users, 
  BarChart3, 
  Settings,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { user } = useAuth();
  
  const clientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-tickets', label: 'My Tickets', icon: Ticket },
    { id: 'create-ticket', label: 'Create Ticket', icon: Plus },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'all-tickets', label: 'All Tickets', icon: Ticket },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div className="w-64 bg-slate-900 text-white h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">IT Desk</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
