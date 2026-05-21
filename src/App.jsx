import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import EmbedTimer from '@/pages/EmbedTimer';
import { initializeEventSystem } from '@/lib/eventAutomation';

// Initialize event-driven automation system
initializeEventSystem();

// Public pages
import Home from '@/pages/Home';
import Music from '@/pages/Music';
import Store from '@/pages/Store';
import EmailPreferences from '@/pages/EmailPreferences';
import FanProfile from '@/pages/FanProfile';
import OrderHistory from '@/pages/OrderHistory';
import BackThis from '@/pages/BackThis';
import Community from '@/pages/Community';
import Videos from '@/pages/Videos';
import ContactGannon from '@/pages/ContactGannon';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import PublicLayout from '@/components/public/PublicLayout';
import StickySupportBar from '@/components/global/StickySupportBar';
import LyricsPage from '@/pages/LyricsPage';
import ThisIsMyLife from '@/pages/ThisIsMyLife';
import FAQSection from '@/pages/FAQSection';
import RecentFanActivity from '@/pages/RecentFanActivity';
import Summary from '@/pages/Summary';
import MemberTiers from '@/pages/MemberTiers';
import PortraitGallery from '@/pages/PortraitGallery';
import Impact from '@/pages/Impact';
import Bookings from '@/pages/Bookings';
import SevenDayStandard from '@/pages/SevenDayStandard';

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Releases from '@/pages/admin/Releases';
import MerchManagement from '@/pages/admin/MerchManagement';
import Orders from '@/pages/admin/Orders';
import Subscribers from '@/pages/admin/Subscribers';
import FanManagement from '@/pages/admin/FanManagement';
import SiteSettings from '@/pages/admin/SiteSettings';
import MerchPlatforms from '@/pages/admin/MerchPlatforms';
import VideoManagement from '@/pages/admin/VideoManagement';
import FanNewsletterDashboard from '@/pages/admin/Newsletter';
import MerchDesigns from '@/pages/admin/MerchDesigns';
import ThankYouCards from '@/pages/admin/ThankYouCards';
import FanMedia from '@/pages/admin/FanMedia';
import PromoCodes from '@/pages/admin/PromoCodes';
import BackOfHouseReport from '@/pages/admin/BackOfHouseReport';
import RevealNewsletter from '@/pages/admin/RevealNewsletter';
import ProductInsights from '@/pages/admin/ProductInsights';
import Supporters from '@/pages/admin/Supporters';
import GiftClaims from '@/pages/admin/GiftClaims';
import TunecoreIntegration from '@/pages/admin/TunecoreIntegration';
import HoodieOffer from '@/pages/admin/HoodieOffer';
import FinancialDashboard from '@/pages/admin/FinancialDashboard';
import GiftVerification from '@/pages/admin/GiftVerification';
import GiftChecklistPage from '@/pages/GiftChecklistPage';
import MerchFinancials from '@/pages/admin/MerchFinancials';
import ImageEditor from '@/pages/admin/ImageEditor';
import SiteHealthDashboard from '@/pages/admin/SiteHealthDashboard';
import GiftProgressAdmin from '@/pages/admin/GiftProgressAdmin';
import ReleaseCountdown from '@/pages/admin/ReleaseCountdown';
import BirthdayDiscounts from '@/pages/admin/BirthdayDiscounts';
import CharityTracking from '@/pages/admin/CharityTracking';
import TrainingHub from '@/pages/admin/TrainingHub';
import AuditLog from '@/pages/admin/AuditLog';
import OperationalStatus from '@/pages/admin/OperationalStatus';
import Mastering from '@/pages/Mastering';
import OrderStatus from '@/pages/OrderStatus';
import MasteringAdmin from '@/pages/admin/MasteringAdmin';
import Blueprint from '@/pages/admin/Blueprint';
import SocialContentGenerator from '@/pages/admin/SocialContentGenerator';
import CommandCentre from '@/pages/admin/CommandCentre';
import AgentRegistryPage from '@/pages/admin/AgentRegistry';
import ApprovalQueuePage from '@/pages/admin/ApprovalQueue';
import KnowledgeVaultPage from '@/pages/admin/KnowledgeVault';
import RiskAlertsPage from '@/pages/admin/RiskAlerts';
import OrchestratorChat from '@/pages/admin/OrchestratorChat';
import LegalDashboard from '@/pages/admin/LegalDashboard';
import WealthDashboard from '@/pages/admin/WealthDashboard';
import ResearchHub from '@/pages/admin/ResearchHub';
import CreativeStudio from '@/pages/admin/CreativeStudio';
import MarketingCentre from '@/pages/admin/MarketingCentre';
import SocialCommand from '@/pages/admin/SocialCommand';
import SecurityCentre from '@/pages/admin/SecurityCentre';
import AgentTaskLogPage from '@/pages/admin/AgentTaskLog';
import TrendMonitor from '@/pages/admin/TrendMonitor';
import WebsiteOps from '@/pages/admin/WebsiteOps';
import SocialMonitor from '@/pages/admin/SocialMonitor';
import ContentDashboard from '@/pages/admin/ContentDashboard';
import ExecutiveFeed from '@/pages/admin/ExecutiveFeed';
import IdeasEngine from '@/pages/admin/IdeasEngine';
import EcommerceIntelligence from '@/pages/admin/EcommerceIntelligence';
import PremiumUX from '@/pages/admin/PremiumUX';
import BlueprintBuilder from '@/pages/admin/BlueprintBuilder';
import ClientInstalls from '@/pages/admin/ClientInstalls';
import Distributors from '@/pages/admin/Distributors';
import AgentLearning from '@/pages/admin/AgentLearning';
import MemoryGraph from '@/pages/admin/MemoryGraph';
import SelfHealing from '@/pages/admin/SelfHealing';
import SocialIntelligence from '@/pages/admin/SocialIntelligence';
import CreatorInsights from '@/pages/admin/CreatorInsights';
import ApiSetup from '@/pages/admin/ApiSetup';
import GoLiveChecklist from '@/pages/admin/GoLiveChecklist';
import AgentIntelligence from '@/pages/admin/AgentIntelligence';
import EcommerceCommand from '@/pages/admin/EcommerceCommand';
import ResearchGrid from '@/pages/admin/ResearchGrid';
import AutonomousOps from '@/pages/admin/AutonomousOps';
import StripeLiveReport from '@/pages/admin/StripeLiveReport';
import ContentAutomate from '@/pages/admin/ContentAutomate';
import GrowthEngine from '@/pages/admin/GrowthEngine';
import Notifications from '@/pages/admin/Notifications';
import ShippingRates from '@/pages/admin/ShippingRates';
import TikTokAppReview from '@/pages/admin/TikTokAppReview';
import RevenueCommandCentre from '@/pages/admin/RevenueCommandCentre';
import MusicCommandCentre from '@/pages/admin/MusicCommandCentre';
import GanozMixBridge from '@/pages/admin/GanozMixBridge';


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
    <>
    <StickySupportBar />
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/store" element={<Store />} />
        <Route path="/community" element={<Community />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/email-preferences" element={<EmailPreferences />} />
        <Route path="/fan-profile" element={<FanProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/back-this" element={<BackThis />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/about" element={<Navigate to="/this-is-my-life" replace />} />
        <Route path="/contact" element={<ContactGannon />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/lyrics" element={<LyricsPage />} />
        <Route path="/this-is-my-life" element={<ThisIsMyLife />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/supporter-activity" element={<RecentFanActivity />} />
        <Route path="/fan-activity" element={<RecentFanActivity />} />
        <Route path="/member-tiers" element={<MemberTiers />} />
        <Route path="/portrait-gallery" element={<PortraitGallery />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/7-day-standard" element={<SevenDayStandard />} />
        <Route path="/mastering" element={<Mastering />} />
        <Route path="/order-status" element={<OrderStatus />} />
      </Route>

      {/* Embed timer (no layout) */}
      <Route path="/embed-timer" element={<EmbedTimer />} />
      <Route path="/gift-checklist" element={<GiftChecklistPage />} />

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/releases" element={<Releases />} />
        <Route path="/admin/merch" element={<MerchManagement />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/subscribers" element={<Subscribers />} />
        <Route path="/admin/fans" element={<FanManagement />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
        <Route path="/admin/merch-platforms" element={<MerchPlatforms />} />
        <Route path="/admin/videos" element={<VideoManagement />} />
        <Route path="/admin/newsletter" element={<FanNewsletterDashboard />} />
        <Route path="/admin/merch-designs" element={<MerchDesigns />} />
        <Route path="/admin/thank-you-cards" element={<ThankYouCards />} />
        <Route path="/admin/fan-media" element={<FanMedia />} />
        <Route path="/admin/promo-codes" element={<PromoCodes />} />
        <Route path="/admin/report" element={<BackOfHouseReport />} />
        <Route path="/admin/reveal-newsletter" element={<RevealNewsletter />} />
        <Route path="/admin/product-insights" element={<ProductInsights />} />
        <Route path="/admin/supporters" element={<Supporters />} />
        <Route path="/admin/gift-claims" element={<GiftClaims />} />
        <Route path="/admin/tunecore" element={<TunecoreIntegration />} />
        <Route path="/admin/hoodie-offer" element={<HoodieOffer />} />
        <Route path="/admin/financials" element={<FinancialDashboard />} />
        <Route path="/admin/gift-verification" element={<GiftVerification />} />
        <Route path="/admin/merch-financials" element={<MerchFinancials />} />
        <Route path="/admin/image-editor" element={<ImageEditor />} />
        <Route path="/admin/site-health" element={<SiteHealthDashboard />} />
        <Route path="/admin/gift-progress" element={<GiftProgressAdmin />} />
        <Route path="/admin/release-countdown" element={<ReleaseCountdown />} />
        <Route path="/admin/birthdays" element={<BirthdayDiscounts />} />
        <Route path="/admin/charity-tracking" element={<CharityTracking />} />
        <Route path="/admin/training" element={<TrainingHub />} />
        <Route path="/admin/audit-log" element={<AuditLog />} />
        <Route path="/admin/operational-status" element={<OperationalStatus />} />
        <Route path="/admin/mastering" element={<MasteringAdmin />} />
        <Route path="/admin/blueprint" element={<Blueprint />} />
        <Route path="/admin/social-content" element={<SocialContentGenerator />} />
        <Route path="/admin/command-centre" element={<CommandCentre />} />
        <Route path="/admin/agent-registry" element={<AgentRegistryPage />} />
        <Route path="/admin/approval-queue" element={<ApprovalQueuePage />} />
        <Route path="/admin/knowledge-vault" element={<KnowledgeVaultPage />} />
        <Route path="/admin/risk-alerts" element={<RiskAlertsPage />} />
        <Route path="/admin/orchestrator-chat" element={<OrchestratorChat />} />
        <Route path="/admin/legal-dashboard" element={<LegalDashboard />} />
        <Route path="/admin/wealth-dashboard" element={<WealthDashboard />} />
        <Route path="/admin/research-hub" element={<ResearchHub />} />
        <Route path="/admin/creative-studio" element={<CreativeStudio />} />
        <Route path="/admin/marketing-centre" element={<MarketingCentre />} />
        <Route path="/admin/social-command" element={<SocialCommand />} />
        <Route path="/admin/security-centre" element={<SecurityCentre />} />
        <Route path="/admin/agent-task-log" element={<AgentTaskLogPage />} />
        <Route path="/admin/trend-monitor" element={<TrendMonitor />} />
        <Route path="/admin/website-ops" element={<WebsiteOps />} />
        <Route path="/admin/social-monitor" element={<SocialMonitor />} />
        <Route path="/admin/content-dashboard" element={<ContentDashboard />} />
        <Route path="/admin/executive-feed" element={<ExecutiveFeed />} />
        <Route path="/admin/ideas-engine" element={<IdeasEngine />} />
        <Route path="/admin/ecommerce-intelligence" element={<EcommerceIntelligence />} />
        <Route path="/admin/premium-ux" element={<PremiumUX />} />
        <Route path="/admin/blueprint-builder" element={<BlueprintBuilder />} />
        <Route path="/admin/client-installs" element={<ClientInstalls />} />
        <Route path="/admin/distributors" element={<Distributors />} />
        <Route path="/admin/agent-learning" element={<AgentLearning />} />
        <Route path="/admin/memory-graph" element={<MemoryGraph />} />
        <Route path="/admin/self-healing" element={<SelfHealing />} />
        <Route path="/admin/social-intelligence" element={<SocialIntelligence />} />
        <Route path="/admin/creator-insights" element={<CreatorInsights />} />
        <Route path="/admin/api-setup" element={<ApiSetup />} />
        <Route path="/admin/go-live" element={<GoLiveChecklist />} />
        <Route path="/admin/agent-intelligence" element={<AgentIntelligence />} />
        <Route path="/admin/ecommerce-command" element={<EcommerceCommand />} />
        <Route path="/admin/research-grid" element={<ResearchGrid />} />
        <Route path="/admin/autonomous-ops" element={<AutonomousOps />} />
        <Route path="/admin/stripe-live-report" element={<StripeLiveReport />} />
        <Route path="/admin/content-automate" element={<ContentAutomate />} />
        <Route path="/admin/growth-engine" element={<GrowthEngine />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/shipping-rates" element={<ShippingRates />} />
        <Route path="/admin/tiktok-review" element={<TikTokAppReview />} />
        <Route path="/admin/revenue-command" element={<RevenueCommandCentre />} />
        <Route path="/admin/music-command" element={<MusicCommandCentre />} />
        <Route path="/admin/ganozmix" element={<GanozMixBridge />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
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