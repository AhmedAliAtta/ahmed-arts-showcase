import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Image, 
  Star, 
  Mail, 
  User, 
  LogOut,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/portfolio', icon: Image, label: 'الأعمال' },
    { path: '/admin/testimonials', icon: Star, label: 'الشهادات' },
    { path: '/admin/messages', icon: Mail, label: 'الرسائل' },
    { path: '/admin/profile', icon: User, label: 'البروفايل' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 ml-2" />
                الصفحة الرئيسية
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="w-4 h-4 ml-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </aside>

          {/* Main Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
