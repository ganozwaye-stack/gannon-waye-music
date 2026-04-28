import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import EmbedTimer from '@/pages/EmbedTimer';

// Public pages
import Home from '@/pages/Home';
import Music from '@/pages/Music';
import Store from '@/pages/Store.jsx';
import EmailPreferences from '@/pages/EmailPreferences';
import Community from '@/pages/Community';
import Videos from '@/pages/Videos';
import PublicLayout from '@/components/public/PublicLayout';

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Releases from '@/pages/admin/Releases';
import MerchManagement from '@/pages/admin/MerchManagement';
import Orders from '@/pages/admin/Orders';
import FanManagement from '@/pages/admin/FanManagement';
import SiteSettings from '@/pages/admin/SiteSettings';
import MerchPlatforms from '@/pages/admin/MerchPlatforms';
import VideoManagement from '@/pages/admin/VideoManagement';
import Newsletter from '@/pages/admin/Newsletter';
import MerchDesigns from '@/pages/admin/MerchDesigns';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/store" element={<Store />} />
        <Route path="/community" element={<Community />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/email-preferences" element={<EmailPreferences />} />
      </Route>

      {/* Embed timer (no layout) */}
      <Route path="/embed-timer" element={<EmbedTimer />} />

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/releases" element={<Releases />} />
        <Route path="/admin/merch" element={<MerchManagement />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/fans" element={<FanManagement />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
        <Route path="/admin/merch-platforms" element={<MerchPlatforms />} />
        <Route path="/admin/videos" element={<VideoManagement />} />
        <Route path="/admin/newsletter" element={<Newsletter />} />
        <Route path="/admin/merch-designs" element={<MerchDesigns />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App