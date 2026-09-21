import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import EmbedTimer from '@/pages/EmbedTimer';
import { initializeEventSystem } from '@/lib/eventAutomation';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '@/lib/posthog';
import ScrollToTop from '@/components/global/ScrollToTop';
import { FEATURE_FLAGS } from '@/lib/platformConfig';

// Initialize event-driven automation system
initializeEventSystem();

function PostHogPageTracker() {
  const location = useLocation();
  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [location.pathname]);
  return null;
}

// Public pages
import Home from '@/pages/Home';
import Music from '@/pages/Music';
import Store from '@/pages/Store';
import StoreCheckout from '@/pages/StoreCheckout';
import StoreCartDetails from '@/pages/StoreCartDetails';
import StoreCartPage from '@/pages/StoreCartPage.jsx';
import EmailPreferences from '@/pages/EmailPreferences';
import FanDashboard from '@/pages/FanDashboard';
import OrderHistory from '@/pages/OrderHistory';
import Videos from '@/pages/Videos';
import ContactGannon from '@/pages/ContactGannon.jsx';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import PublicLayout from '@/components/public/PublicLayout';
import LyricsPage from '@/pages/LyricsPage';
import Press from '@/pages/Press';
import ThisIsMyLife from '@/pages/ThisIsMyLife';
import FAQSection from '@/pages/FAQSection';
import Summary from '@/pages/Summary';
import CurrentSingle from '@/pages/CurrentSingle';
import MerchFeedback from '@/pages/MerchFeedback';
import FoundingSupporterPage from '@/pages/FoundingSupporter';
import MumTribute from '@/pages/MumTribute';
import MerchReelPage from '@/components/mum/MerchReelPage';
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import CheckoutCancel from '@/pages/CheckoutCancel';
import PreSave from '@/pages/PreSave';
import ReleaseDetail from '@/pages/ReleaseDetail';

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import DailyDashboardV2 from '@/pages/admin/DailyDashboardV2';
import HeroDesignStudio from '@/pages/admin/HeroDesignStudio';
import ReleaseControlDesk from '@/pages/admin/ReleaseControlDesk';
import FanManagement from '@/pages/admin/FanManagement';
import SiteSettings from '@/pages/admin/SiteSettings';
import MerchPlatforms from '@/pages/admin/MerchPlatforms';
import ReleaseEmailStudio from '@/pages/admin/ReleaseEmailStudio';
import MerchDesigns from '@/pages/admin/MerchDesigns';
import ThankYouCards from '@/pages/admin/ThankYouCards';
import FanMedia from '@/pages/admin/FanMedia';
import BackOfHouseReport from '@/pages/admin/BackOfHouseReport';
import RevealNewsletter from '@/pages/admin/RevealNewsletter';
import ProductInsights from '@/pages/admin/ProductInsights';
import Supporters from '@/pages/admin/Supporters';
import TunecoreIntegration from '@/pages/admin/TunecoreIntegration';
import HoodieOffer from '@/pages/admin/HoodieOffer';
import FinancialDashboard from '@/pages/admin/FinancialDashboard';
import GiftChecklistPage from '@/pages/GiftChecklistPage';
import SiteHealthDashboard from '@/pages/admin/SiteHealthDashboard';
import BirthdayDiscounts from '@/pages/admin/BirthdayDiscounts';
import CharityTracking from '@/pages/admin/CharityTracking';
import OperationalStatus from '@/pages/admin/OperationalStatus';
import OrderStatus from '@/pages/OrderStatus';
import CommandCentre from '@/pages/admin/CommandCentre';
import RiskAlertsPage from '@/pages/admin/RiskAlerts';
import LegalDashboard from '@/pages/admin/LegalDashboard';
import WealthDashboard from '@/pages/admin/WealthDashboard';
import SecurityCentre from '@/pages/admin/SecurityCentre';
import TrendMonitor from '@/pages/admin/TrendMonitor';
import ExecutiveFeed from '@/pages/admin/ExecutiveFeed';
import IdeasEngine from '@/pages/admin/IdeasEngine';
import EcommerceIntelligence from '@/pages/admin/EcommerceIntelligence';
import Distributors from '@/pages/admin/Distributors';
import LaunchPacketStudio from '@/pages/admin/LaunchPacketStudio';
import SelfHealing from '@/pages/admin/SelfHealing';
import CreatorInsights from '@/pages/admin/CreatorInsights';
import ApiSetup from '@/pages/admin/ApiSetup';
import GoLiveChecklist from '@/pages/admin/GoLiveChecklist';
import EcommerceCommand from '@/pages/admin/EcommerceCommand';
import StripeLiveReport from '@/pages/admin/StripeLiveReport';
import Notifications from '@/pages/admin/Notifications';
import TikTokAppReview from '@/pages/admin/TikTokAppReview';
import MusicCommandCentre from '@/pages/admin/MusicCommandCentre';
import GanozMixBridge from '@/pages/admin/GanozMixBridge';
import SalesTraining from '@/pages/admin/SalesTraining';
import ClientOnboarding from '@/pages/admin/ClientOnboarding';
import MonthlyMonitoring from '@/pages/admin/MonthlyMonitoring';
import TikTokScreenGuide from '@/pages/admin/TikTokScreenGuide';
import TikTokPlatformReview from '@/pages/TikTokPlatformReview';
import TikTokCallback from '@/pages/TikTokCallback.jsx';
import TooLostCallback from '@/pages/TooLostCallback.jsx';
import TikTokRecordingStudio from '@/pages/admin/TikTokRecordingStudio';
import OperationRegistry from '@/pages/admin/OperationRegistry';
import PaymentDiagnostics from '@/pages/admin/PaymentDiagnosticsNew';
import IntegrationCompletionCentre from '@/pages/admin/IntegrationCompletionCentre';
import SocialDistributionReadiness from '@/pages/admin/SocialDistributionReadiness';
import CoachingCommand from '@/pages/admin/CoachingCommand';
import CoachingLegal from '@/pages/admin/coaching/CoachingLegal';
import CoachingLaunchControl from '@/pages/admin/coaching/CoachingLaunchControl';
import CoachingROI from '@/pages/admin/coaching/CoachingROI';
import CoachingContentLibrary from '@/pages/admin/coaching/CoachingContentLibrary';
import CoachingClientManagement from '@/pages/admin/coaching/ClientManagement';
import AppointmentScheduler from '@/pages/admin/coaching/AppointmentScheduler';
import CoachingSalesFunnel from '@/pages/admin/coaching/CoachingSalesFunnel';
import IntelligenceToIncome from '@/pages/admin/IntelligenceToIncome';
import ArtistBusinessSetup from '@/pages/admin/ArtistBusinessSetup';
import SyncLicensingCommand from '@/pages/admin/SyncLicensingCommand';
import OrderProfitIntelligence from '@/pages/admin/OrderProfitIntelligence';
import WeeklyMoneyReport from '@/pages/admin/WeeklyMoneyReport';
import FanConversionEngine from '@/pages/admin/FanConversionEngine';
import AgentCapabilityMatrix from '@/pages/admin/AgentCapabilityMatrix';
import TodaysMoneymoves from '@/pages/admin/TodaysMoneymoves';
import WebsiteEvolution from '@/pages/admin/WebsiteEvolution';
import BusinessWorthCommand from '@/pages/admin/BusinessWorthCommand';
import OfferEngine from '@/pages/admin/OfferEngine';
import SocialPlatformParity from '@/pages/admin/SocialPlatformParity';
import SocialOAuthCommand from '@/pages/admin/SocialOAuthCommand';
import SocialReviewReadiness from '@/pages/admin/SocialReviewReadiness';
import SocialContentReadiness from '@/pages/admin/SocialContentReadiness';
import SocialAnalyticsCommand from '@/pages/admin/SocialAnalyticsCommand';
import QACommandCentre from '@/pages/admin/QACommandCentre';
import DeveloperHandoff from '@/pages/admin/DeveloperHandoff';
import AgentToolRegistry from '@/pages/admin/AgentToolRegistry';
import CodeAuditExport from '@/pages/admin/CodeAuditExport';
import QAFailureReport from '@/pages/admin/QAFailureReport';
import AICostControl from '@/pages/admin/AICostControl';
import ReleasePromoCommand from '@/pages/admin/ReleasePromoCommand';
import ContentQualityReview from '@/pages/admin/ContentQualityReview';
import SocialScheduleQueue from '@/pages/admin/SocialScheduleQueue';
import MetricoolCommand from '@/pages/admin/MetricoolCommand';
import SystemBlueprint from '@/pages/admin/SystemBlueprint';
import MetricoolApiSetup from '@/pages/admin/MetricoolApiSetup';
import MetricoolSchedulerQueue from '@/pages/admin/MetricoolSchedulerQueue';
import MetricoolPerformanceIntelligence from '@/pages/admin/MetricoolPerformanceIntelligence';
import GuidedSetupConcierge from '@/pages/admin/GuidedSetupConcierge';
import MetricoolDiagnostics from '@/pages/admin/MetricoolDiagnostics.jsx';
import SocialAgentOS from '@/pages/admin/SocialAgentOS.jsx';
import DailyPostEngine from '@/pages/admin/DailyPostEngine.jsx';
import AgentWorkbench from '@/pages/admin/AgentWorkbench';
import AgentTrustHub from '@/components/admin/security-family/AgentTrustHub';
import BusinessAttentionCentre from '@/pages/admin/BusinessAttentionCentre';
import StockFlowDashboard from '@/pages/admin/StockFlowDashboard';
import DeegoStockMarketPanel from '@/pages/admin/DeegoStockMarketPanel';
import MasterHandoverTimeline from '@/pages/admin/MasterHandoverTimeline';
import BusinessProcessCommand from '@/pages/admin/BusinessProcessCommand';
import ExternalEngineeringCommand from '@/pages/admin/ExternalEngineeringCommand';
import PromoDiscountCompliance from '@/pages/admin/PromoDiscountCompliance';
import CursorCloudAgentCommand from '@/pages/admin/CursorCloudAgentCommand';
import ContentCommand from '@/pages/admin/ContentCommand';
import AgentMessageBus from '@/pages/admin/AgentMessageBus';
import CodeAuditCommand from '@/pages/admin/CodeAuditCommand';
import StrategicExecutionPlan from '@/pages/admin/StrategicExecutionPlan';
import MerchVisualLab from '@/pages/admin/MerchVisualLab';
import MasterBlueprint from '@/pages/admin/MasterBlueprint';
import IntegrationActionCentre from '@/pages/admin/IntegrationActionCentre';
import AnnouncementStudio from '@/pages/admin/AnnouncementStudio';
import UpcomingMusic from '@/pages/UpcomingMusic';
import CarryTheMessage from '@/pages/CarryTheMessage';
import RememberMum from '@/pages/RememberMum';
import SiteUpgradeAudit from '@/pages/admin/SiteUpgradeAudit';
import Base44ExitPlan from '@/pages/admin/Base44ExitPlan';
import LegalDrafts from '@/pages/admin/LegalDrafts';
import LyricLibrary from '@/pages/LyricLibrary';
import Biography from '@/pages/Biography';
import MusicRecommender from '@/pages/MusicRecommender';
import FanReminders from '@/pages/FanReminders';
import Gallery from '@/pages/Gallery';
import MusicProduction from '@/pages/admin/MusicProduction';
import ProducerDirectory from '@/pages/admin/ProducerDirectory';
import BrandKit from '@/pages/admin/BrandKit';
import FanLeaderboard from '@/pages/FanLeaderboard';
import FanGuide from '@/pages/FanGuide';

// New Hub & Mission Control pages
import SystemsQaHub from '@/pages/admin/SystemsQaHub';
import PrintFulfilment from '@/pages/admin/PrintFulfilment';
import Memorial from '@/pages/Memorial';
import PriorityCommander from '@/pages/admin/PriorityCommander';
import ReleasesRedirect from '@/pages/Releases';
import About from '@/pages/About';
import DomesticViolenceSupport from '@/pages/DomesticViolenceSupport';
import MusicOpportunityBulletin from '@/pages/admin/MusicOpportunityBulletin';
import MerchContentBriefs from '@/pages/admin/MerchContentBriefs';
import PricingMarginCalculator from '@/pages/admin/PricingMarginCalculator';
import Coaching from '@/pages/Coaching';
import CoachingSelfWorthReset from '@/pages/CoachingSelfWorthReset';
import CoachingBoundaries from '@/pages/CoachingBoundaries';
import CoachingCreativeConfidence from '@/pages/CoachingCreativeConfidence';
import CoachingWorkbooks from '@/pages/CoachingWorkbooks';
import CoachingIntakePage from '@/pages/CoachingIntakePage';
import CoachingClientResources from '@/pages/CoachingClientResources';
import CoachingHub from '@/pages/admin/CoachingHub';
import CoachingOverview from '@/pages/admin/CoachingOverview';
import CoachingIntakes from '@/pages/admin/CoachingIntakes';
import CoachingContentEngine from '@/pages/admin/CoachingContentEngine';
import CoachingSocialDrafts from '@/pages/admin/CoachingSocialDrafts';
import WorkbookBuilder from '@/pages/admin/WorkbookBuilder';
import ClientResourceLibrary from '@/pages/admin/ClientResourceLibrary';
import PhoneSystem from '@/pages/admin/PhoneSystem';
import PressKit from '@/pages/PressKit';
import ContentStudio from '@/pages/admin/ContentStudio';
import ManyChatDrafts from '@/pages/admin/ManyChatDrafts';
import CommunicationsHub from '@/pages/admin/CommunicationsHub';
import MerchVotes from '@/pages/admin/MerchVotes';
import Login from '@/pages/Login';

const AUTH_REQUIRED_PATH_PREFIXES = ['/admin', '/fan-profile', '/orders', '/mum', '/without-you-here'];

const routeRequiresAuth = (pathname) => AUTH_REQUIRED_PATH_PREFIXES.some(prefix => (
  pathname === prefix || pathname.startsWith(`${prefix}/`)
));

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const requiresAuth = routeRequiresAuth(location.pathname);

  useEffect(() => {
    if (requiresAuth && authError?.type === 'auth_required') {
      navigateToLogin();
    }
  }, [requiresAuth, authError, navigateToLogin]);

  if (requiresAuth && (isLoadingPublicSettings || isLoadingAuth)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background" role="status" aria-live="polite">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (requiresAuth && authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  if (requiresAuth && authError?.type === 'auth_required') {
    return null;
  }

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/all" element={<Navigate to="/store" replace />} />
        <Route path="/store-world" element={<Navigate to="/store" replace />} />
        <Route path="/store/cart" element={<StoreCartPage />} />
        <Route path="/store/customer-details" element={<Navigate to="/store/cart-details" replace />} />
        <Route path="/store/cart-details" element={<StoreCartDetails />} />
        <Route path="/store/checkout" element={<StoreCheckout />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/email-preferences" element={<EmailPreferences />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/back-this" element={<Navigate to="/store" replace />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/contact" element={<ContactGannon />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/lyrics" element={<LyricsPage />} />
        {/* /without-you-here was a 404. It is the song written for Sonia, and the
            title comes from Gannon's own eulogy at her funeral. It routes to the
            lyric page, where the Lyric record (slug: without-you-here) carries the
            full story in its `inspiration` field — drafted from the verified funeral
            transcript and held behind the publication gate until Gannon clears it. */}
        <Route path="/without-you-here" element={<Navigate to="/lyrics?song=without-you-here" replace />} />
        <Route path="/withoutyouhere" element={<Navigate to="/lyrics?song=without-you-here" replace />} />
        <Route path="/press" element={<Press />} />
        <Route path="/this-is-my-life" element={<ThisIsMyLife />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/current-single" element={<CurrentSingle />} />
        <Route path="/merch-feedback" element={<MerchFeedback />} />
        <Route path="/founding-supporter" element={<FoundingSupporterPage />} />
        <Route path="/upcoming-music" element={<UpcomingMusic />} />
        <Route path="/carry-the-message" element={<CarryTheMessage />} />
        <Route path="/remember-mum" element={<RememberMum />} />
        {/* Mum's Garden and Sonia's Garden were archived and locked at the owner's
            request on 16 September 2026. These redirects keep old links safe. Do not
            restore the pages unless the owner explicitly asks to unlock and make
            Mum's Garden public again. See src/pages/archive/mums-garden/ARCHIVE_LOCK.md */}
        <Route path="/mums-garden" element={<Navigate to="/" replace />} />
        <Route path="/sonias-garden" element={<Navigate to="/" replace />} />
        {/* /mum was a 404. It is the most guessable URL for the memorial page and
            the one the test suite has always used, so anyone following an old link
            or typing the obvious thing hit a dead 404 on the page that matters most
            on this site. Redirected, not left to the catch-all. */}
        <Route path="/mum" element={<Navigate to="/" replace />} />
        <Route path="/mums" element={<Navigate to="/" replace />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/store/checkout-success" element={<Navigate to="/checkout-success" replace />} />
        <Route path="/payment-success" element={<Navigate to="/checkout-success" replace />} />
        <Route path="/order-success" element={<Navigate to="/checkout-success" replace />} />
        <Route path="/checkout-cancel" element={<CheckoutCancel />} />
        <Route path="/store/checkout-cancel" element={<Navigate to="/checkout-cancel" replace />} />
        <Route path="/presave" element={<PreSave />} />
        <Route path="/release/:id" element={<ReleaseDetail />} />
        <Route path="/store/product/:slug" element={<Navigate to="/store" replace />} />
        <Route path="/releases" element={<ReleasesRedirect />} />
        {/* Gannon is not touring and does not take bookings. Both routes used to be
            dead ends: /tour rendered a tour page for an artist with no dates, and
            /bookings had no route at all so it fell through to the 404. Anyone
            arriving from an old link or a search result hit a wall. Both now send
            them to the homepage. Covered by public-routes.spec.js. */}
        <Route path="/tour" element={<Navigate to="/" replace />} />
        <Route path="/tours" element={<Navigate to="/" replace />} />
        <Route path="/bookings" element={<Navigate to="/" replace />} />
        <Route path="/booking" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Navigate to="/contact" replace />} />
        <Route path="/support/domestic-violence" element={<DomesticViolenceSupport />} />
        <Route path="/community" element={<Navigate to="/contact" replace />} />
        <Route path="/supporters" element={<Navigate to="/store" replace />} />
        <Route path="/impact" element={<Navigate to="/support/domestic-violence" replace />} />
        <Route path="/portrait-gallery" element={<Navigate to="/gallery" replace />} />
        {/* Coaching stays private until the single launch flag is explicitly enabled. */}
        {FEATURE_FLAGS.COACHING_PUBLIC_LAUNCH_ENABLED ? (
          <>
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/coaching/self-worth-reset" element={<CoachingSelfWorthReset />} />
            <Route path="/coaching/boundaries" element={<CoachingBoundaries />} />
            <Route path="/coaching/creative-confidence" element={<CoachingCreativeConfidence />} />
            <Route path="/coaching/workbooks" element={<CoachingWorkbooks />} />
            <Route path="/coaching/intake" element={<CoachingIntakePage />} />
            <Route path="/coaching/client-resources" element={<CoachingClientResources />} />
          </>
        ) : (
          <Route path="/coaching/*" element={<Navigate to="/contact" replace />} />
        )}

        {/* Systems services and case studies stay private until pricing and proof are approved. */}
        <Route path="/systems-manager" element={<Navigate to="/contact" replace />} />
        <Route path="/systems/cinematic-websites" element={<Navigate to="/contact" replace />} />
        <Route path="/systems/case-studies/gannon-waye-music-os" element={<Navigate to="/contact" replace />} />
        <Route path="/systems/case-studies/ganozmix-direct" element={<Navigate to="/contact" replace />} />
        <Route path="/systems/*" element={<Navigate to="/contact" replace />} />
        <Route path="/lyric-library" element={<LyricLibrary />} />
        <Route path="/gift-cards" element={<Navigate to="/store" replace />} />
        <Route path="/mixing-services" element={<Navigate to="/contact" replace />} />
        <Route path="/biography" element={<Biography />} />
        <Route path="/discover" element={<MusicRecommender />} />
        <Route path="/fan-reminders" element={<FanReminders />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/press-kit" element={<PressKit />} />
        <Route path="/fan-leaderboard" element={<FanLeaderboard />} />
        <Route path="/fan-guide" element={<FanGuide />} />
        <Route path="/fan-profile" element={<FanDashboard />} />
        {/* Legacy and intentionally unpublished public links resolve to a safe current journey. */}
        <Route path="/fan-activity" element={<Navigate to="/contact" replace />} />
        <Route path="/supporter-activity" element={<Navigate to="/contact" replace />} />
        <Route path="/member-tiers" element={<Navigate to="/contact" replace />} />
        <Route path="/mastering" element={<Navigate to="/contact" replace />} />
        <Route path="/coaching-programs" element={<Navigate to="/contact" replace />} />
        <Route path="/mindset-coaching" element={<Navigate to="/contact" replace />} />
        <Route path="/life-coaching" element={<Navigate to="/contact" replace />} />
        <Route path="/book-coaching" element={<Navigate to="/contact" replace />} />
      </Route>

      {/* Embed timer (no layout) */}
      <Route path="/embed-timer" element={<EmbedTimer />} />
      <Route path="/tiktok-platform-review" element={<TikTokPlatformReview />} />
      <Route path="/tiktok-callback" element={<TikTokCallback />} />
      <Route path="/toolost-callback" element={<TooLostCallback />} />
      <Route path="/gift-checklist" element={<GiftChecklistPage />} />
      <Route path="/live" element={<Navigate to="/" replace />} />

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Stable aliases for legacy dashboard cards and renamed tools. */}
        <Route path="/admin/fan-management" element={<Navigate to="/admin/fans" replace />} />
        <Route path="/admin/community" element={<Navigate to="/admin/fans" replace />} />
        <Route path="/admin/blueprint" element={<Navigate to="/admin/master-blueprint" replace />} />
        <Route path="/admin/bookings" element={<Navigate to="/admin/appointment-scheduler" replace />} />
        <Route path="/admin/coaching-sessions" element={<Navigate to="/admin/appointment-scheduler" replace />} />
        <Route path="/admin/purchase-orders" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/supplier-products" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/inventory-batches" element={<Navigate to="/admin/stock-flow-dashboard" replace />} />
        <Route path="/admin/release-sprint" element={<Navigate to="/admin/release-promo-command" replace />} />
        <Route path="/admin/thankyou-6-day-campaign" element={<Navigate to="/admin/release-promo-command" replace />} />
        <Route path="/admin/ai-tool-budget-control" element={<Navigate to="/admin/ai-cost-control" replace />} />
        <Route path="/admin/route-registry" element={<Navigate to="/admin/operation-registry" replace />} />
        <Route path="/admin/component-registry" element={<Navigate to="/admin/operation-registry" replace />} />
        <Route path="/admin/function-registry" element={<Navigate to="/admin/operation-registry" replace />} />
        <Route path="/admin/entity-registry" element={<Navigate to="/admin/operation-registry" replace />} />
        <Route path="/admin/security-secret-registry" element={<Navigate to="/admin/security-centre" replace />} />
        <Route path="/admin/services/cinematic-websites" element={<Navigate to="/systems/cinematic-websites" replace />} />
        <Route path="/admin/publishing-deal-readiness" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/music-supervisor-pitching" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/apple-playlist-pitching" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/catalogue-growth-command" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/ad-agency-writing-command" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/session-opportunity-command" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/licensing-request-centre" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/catalogue-readiness" element={<Navigate to="/admin/sync-licensing-command" replace />} />
        <Route path="/admin/artist-management-command" element={<Navigate to="/admin/artist-business-setup" replace />} />
        <Route path="/admin/income-stream-planner" element={<Navigate to="/admin/artist-business-setup" replace />} />
        <Route path="/admin/social-platform-security" element={<Navigate to="/admin/artist-business-setup" replace />} />
        <Route path="/admin/june-4-recording-plan" element={<Navigate to="/admin/artist-business-setup" replace />} />
        <Route path="/admin/negotiation-rights-tracker" element={<Navigate to="/admin/artist-business-setup" replace />} />
        <Route path="/admin/creative-tools-stack" element={<Navigate to="/admin/artist-business-setup" replace />} />

        {/* /admin/dashboard is Deego's Desk (Dashboard.jsx) — the canonical Command/Dashboards
            hub. The old Daily Dashboard stays as a file for a later retirement wave. */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard-v2" element={<DailyDashboardV2 />} />
        {/* Orders lives in the Merch Designs hub (orders tab) since 21 Sep 2026.
            store-orders keeps redirecting so old links still work. */}
        <Route path="/admin/store-orders" element={<Navigate to="/admin/merch-designs" replace />} />
        <Route path="/admin/systems-qa" element={<SystemsQaHub />} />
        {/* Mission Control merged into the single Command Centre (15 Sep 2026):
            status strip, actions required and the to-do list all live there now.
            To undo: restore element={<MissionControl />}. */}
        <Route path="/admin/mission-control" element={<Navigate to="/admin/command-centre" replace />} />
        <Route path="/admin/hero-design-studio" element={<HeroDesignStudio />} />
        <Route path="/admin/release-control" element={<ReleaseControlDesk />} />
        <Route path="/admin/fans" element={<FanManagement />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
        <Route path="/admin/merch-platforms" element={<MerchPlatforms />} />
        <Route path="/admin/release-email-studio" element={<ReleaseEmailStudio />} />
        <Route path="/admin/merch-designs" element={<MerchDesigns />} />
        <Route path="/admin/thank-you-cards" element={<ThankYouCards />} />
        <Route path="/admin/fan-media" element={<FanMedia />} />
        <Route path="/admin/report" element={<BackOfHouseReport />} />
        <Route path="/admin/reveal-newsletter" element={<RevealNewsletter />} />
        <Route path="/admin/product-insights" element={<ProductInsights />} />
        <Route path="/admin/supporters" element={<Supporters />} />
        <Route path="/admin/tunecore" element={<TunecoreIntegration />} />
        <Route path="/admin/hoodie-offer" element={<HoodieOffer />} />
        <Route path="/admin/financials" element={<FinancialDashboard />} />
        <Route path="/admin/site-health" element={<SiteHealthDashboard />} />
        <Route path="/admin/system-health" element={<Navigate to="/admin/site-health" replace />} />
        <Route path="/admin/birthdays" element={<BirthdayDiscounts />} />
        <Route path="/admin/charity-tracking" element={<CharityTracking />} />
        <Route path="/admin/operational-status" element={<OperationalStatus />} />
        <Route path="/admin/command-centre" element={<CommandCentre />} />
        <Route path="/admin/risk-alerts" element={<RiskAlertsPage />} />
        <Route path="/admin/legal-dashboard" element={<LegalDashboard />} />
        <Route path="/admin/wealth-dashboard" element={<WealthDashboard />} />
        <Route path="/admin/security-centre" element={<SecurityCentre />} />
        <Route path="/admin/trend-monitor" element={<TrendMonitor />} />
        <Route path="/admin/executive-feed" element={<ExecutiveFeed />} />
        <Route path="/admin/ideas-engine" element={<IdeasEngine />} />
        <Route path="/admin/ecommerce-intelligence" element={<EcommerceIntelligence />} />
        <Route path="/admin/distributors" element={<Distributors />} />
        <Route path="/admin/launch-packet-studio" element={<LaunchPacketStudio />} />
        <Route path="/admin/self-healing" element={<SelfHealing />} />
        <Route path="/admin/creator-insights" element={<CreatorInsights />} />
        <Route path="/admin/api-setup" element={<ApiSetup />} />
        <Route path="/admin/integration-action-centre" element={<IntegrationActionCentre />} />
        <Route path="/admin/go-live" element={<GoLiveChecklist />} />
        <Route path="/admin/ecommerce-command" element={<EcommerceCommand />} />
        <Route path="/admin/stripe-live-report" element={<StripeLiveReport />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/tiktok-review" element={<TikTokAppReview />} />
        <Route path="/admin/music-command" element={<MusicCommandCentre />} />
        <Route path="/admin/ganozmix" element={<GanozMixBridge />} />
        <Route path="/admin/sales-training" element={<SalesTraining />} />
        <Route path="/admin/client-onboarding" element={<ClientOnboarding />} />
        <Route path="/admin/monthly-monitoring" element={<MonthlyMonitoring />} />
        <Route path="/admin/tiktok-screen-guide" element={<TikTokScreenGuide />} />
        <Route path="/admin/tiktok-recording-studio" element={<TikTokRecordingStudio />} />
        <Route path="/admin/operation-registry" element={<OperationRegistry />} />
        <Route path="/admin/payment-diagnostics" element={<PaymentDiagnostics />} />
        <Route path="/admin/integration-completion-centre" element={<IntegrationCompletionCentre />} />
        <Route path="/admin/social-distribution-readiness" element={<SocialDistributionReadiness />} />
        <Route path="/admin/coaching-command" element={<CoachingCommand />} />
        <Route path="/admin/coaching-launch-control" element={<CoachingLaunchControl />} />
        <Route path="/music-production" element={<MusicProduction />} />
        <Route path="/producer-directory" element={<ProducerDirectory />} />
        <Route path="/admin/brand-kit" element={<BrandKit />} />
        <Route path="/admin/coaching-legal" element={<CoachingLegal />} />
        <Route path="/admin/coaching-content-library" element={<CoachingContentLibrary />} />
        <Route path="/admin/client-management" element={<CoachingClientManagement />} />
        <Route path="/admin/appointment-scheduler" element={<AppointmentScheduler />} />
        <Route path="/admin/coaching-roi" element={<CoachingROI />} />
        <Route path="/admin/coaching-sales-funnel" element={<CoachingSalesFunnel />} />
        <Route path="/admin/intelligence-to-income" element={<IntelligenceToIncome />} />
        <Route path="/admin/weekly-money-report" element={<WeeklyMoneyReport />} />
        <Route path="/admin/fan-conversion-engine" element={<FanConversionEngine />} />
        <Route path="/admin/artist-business-setup" element={<ArtistBusinessSetup />} />
        <Route path="/admin/sync-licensing-command" element={<SyncLicensingCommand />} />
        <Route path="/admin/order-profit-intelligence" element={<OrderProfitIntelligence />} />
        <Route path="/admin/offer-engine" element={<OfferEngine />} />
        <Route path="/admin/todays-money-moves" element={<TodaysMoneymoves />} />
        <Route path="/admin/website-evolution" element={<WebsiteEvolution />} />
        <Route path="/admin/business-worth-command" element={<BusinessWorthCommand />} />
        <Route path="/admin/agent-capability-matrix" element={<AgentCapabilityMatrix />} />
        <Route path="/admin/social-platform-parity" element={<SocialPlatformParity />} />
        <Route path="/admin/social-oauth-command" element={<SocialOAuthCommand />} />
        <Route path="/admin/social-review-readiness" element={<SocialReviewReadiness />} />
        <Route path="/admin/social-content-readiness" element={<SocialContentReadiness />} />
        <Route path="/admin/social-analytics-command" element={<SocialAnalyticsCommand />} />
        <Route path="/admin/qa-command-centre" element={<QACommandCentre />} />
        <Route path="/admin/developer-handoff" element={<DeveloperHandoff />} />
        <Route path="/admin/agent-tool-registry" element={<AgentToolRegistry />} />
        <Route path="/admin/code-audit-export" element={<CodeAuditExport />} />
        <Route path="/admin/qa-failure-report" element={<QAFailureReport />} />
        <Route path="/admin/ai-cost-control" element={<AICostControl />} />
        <Route path="/admin/release-promo-command" element={<ReleasePromoCommand />} />

        <Route path="/admin/content-quality-review" element={<ContentQualityReview />} />
        <Route path="/admin/social-schedule-queue" element={<SocialScheduleQueue />} />
        <Route path="/admin/metricool-command" element={<MetricoolCommand />} />
        <Route path="/admin/system-blueprint" element={<SystemBlueprint />} />
        <Route path="/admin/metricool-api-setup" element={<MetricoolApiSetup />} />
        <Route path="/admin/metricool-scheduler-queue" element={<MetricoolSchedulerQueue />} />
        <Route path="/admin/metricool-performance-intelligence" element={<MetricoolPerformanceIntelligence />} />
        <Route path="/admin/guided-setup-concierge" element={<GuidedSetupConcierge />} />
        <Route path="/admin/metricool-diagnostics" element={<MetricoolDiagnostics />} />
        <Route path="/admin/social-agent-os" element={<SocialAgentOS />} />
        <Route path="/admin/daily-post-engine" element={<DailyPostEngine />} />
        <Route path="/admin/agent-workbench" element={<AgentWorkbench />} />
        <Route path="/admin/business-attention-centre" element={<BusinessAttentionCentre />} />
        <Route path="/admin/stock-flow-dashboard" element={<StockFlowDashboard />} />
        <Route path="/admin/deego-stock-market" element={<DeegoStockMarketPanel />} />
        <Route path="/admin/master-handover" element={<MasterHandoverTimeline />} />
        <Route path="/admin/business-process-command" element={<BusinessProcessCommand />} />
        <Route path="/admin/agent-trust-hub" element={<AgentTrustHub />} />
        <Route path="/admin/external-engineering-command" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/norton-safe-web-guide" element={<PromoDiscountCompliance />} />
        <Route path="/admin/promo-discount-compliance" element={<PromoDiscountCompliance />} />
        <Route path="/admin/cursor-cloud-agent-command" element={<CursorCloudAgentCommand />} />
        <Route path="/admin/content-command" element={<ContentCommand />} />
        <Route path="/admin/agent-message-bus" element={<AgentMessageBus />} />
        <Route path="/admin/code-audit-command" element={<CodeAuditCommand />} />
        <Route path="/admin/strategic-execution-plan" element={<StrategicExecutionPlan />} />
        <Route path="/admin/merch-visual-lab" element={<MerchVisualLab />} />
        {/* Training Centre merged into the Education Hub, which itself merged into
            /admin/dashboard (creative-ux tab) on 21 Sep 2026. */}
        <Route path="/admin/training-centre" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/announcement-studio" element={<AnnouncementStudio />} />
        <Route path="/admin/master-blueprint" element={<MasterBlueprint />} />
        <Route path="/admin/priority-commander" element={<PriorityCommander />} />
        <Route path="/admin/site-upgrade-audit" element={<SiteUpgradeAudit />} />
        <Route path="/admin/base44-exit-plan" element={<Base44ExitPlan />} />
        <Route path="/admin/legal-drafts" element={<LegalDrafts />} />
        <Route path="/admin/ganozmix-direct/legal" element={<LegalDrafts />} />
        <Route path="/admin/music-opportunity-bulletin" element={<MusicOpportunityBulletin />} />
        <Route path="/admin/print-fulfilment" element={<PrintFulfilment />} />
        <Route path="/admin/merch-content-briefs" element={<MerchContentBriefs />} />
        <Route path="/admin/pricing-margin-calculator" element={<PricingMarginCalculator />} />
        <Route path="/admin/coaching-hub" element={<CoachingHub />} />
        <Route path="/admin/coaching-overview" element={<CoachingOverview />} />
        <Route path="/admin/coaching-intakes" element={<CoachingIntakes />} />
        <Route path="/admin/coaching-content-engine" element={<CoachingContentEngine />} />
        <Route path="/admin/social-drafts" element={<CoachingSocialDrafts />} />
        <Route path="/admin/workbook-builder" element={<WorkbookBuilder />} />
        <Route path="/admin/client-resource-library" element={<ClientResourceLibrary />} />
        <Route path="/admin/phone-system" element={<PhoneSystem />} />
        <Route path="/admin/mums-garden" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/mum" element={<MumTribute />} />
        <Route path="/admin/without-you-here" element={<MumTribute />} />
        <Route path="/admin/memorial" element={<Memorial />} />
        <Route path="/admin/merch-reel" element={<MerchReelPage />} />
        <Route path="/admin/coaching" element={<Coaching />} />
        <Route path="/admin/coaching/self-worth-reset" element={<CoachingSelfWorthReset />} />
        <Route path="/admin/coaching/boundaries" element={<CoachingBoundaries />} />
        <Route path="/admin/coaching/creative-confidence" element={<CoachingCreativeConfidence />} />
        <Route path="/admin/coaching/intake" element={<CoachingIntakePage />} />
        <Route path="/admin/press-kit" element={<PressKit />} />
        <Route path="/admin/content-studio" element={<ContentStudio />} />
        <Route path="/admin/manychat-drafts" element={<ManyChatDrafts />} />
        <Route path="/admin/communications-hub" element={<CommunicationsHub />} />
        <Route path="/admin/merch-votes" element={<MerchVotes />} />
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
          <ScrollToTop />
          <PostHogPageTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App