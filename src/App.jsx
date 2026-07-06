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
import StoreCustomerDetails from '@/pages/StoreCustomerDetails.jsx';
import EmailPreferences from '@/pages/EmailPreferences';
import FanProfile from '@/pages/FanProfile';
import OrderHistory from '@/pages/OrderHistory';
import BackThis from '@/pages/BackThis';
import Community from '@/pages/Community';
import Videos from '@/pages/Videos';
import ContactGannon from '@/pages/ContactGannon.jsx';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import PublicLayout from '@/components/public/PublicLayout';
import StickySupportBar from '@/components/global/StickySupportBar';
import LyricsPage from '@/pages/LyricsPage';
import Press from '@/pages/Press';
import ThisIsMyLife from '@/pages/ThisIsMyLife';
import FAQSection from '@/pages/FAQSection';
import RecentFanActivity from '@/pages/RecentFanActivity';
import Summary from '@/pages/Summary';
import MemberTiers from '@/pages/MemberTiers';
import PortraitGallery from '@/pages/PortraitGallery';
import Impact from '@/pages/Impact';
import Bookings from '@/pages/Bookings';
import SevenDayStandard from '@/pages/SevenDayStandard';
import CurrentSingle from '@/pages/CurrentSingle';
import MerchFeedback from '@/pages/MerchFeedback';
import Tour from '@/pages/Tour';
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
import OwnerDashboard from '@/pages/admin/OwnerDashboard';
import DailyDashboard from '@/pages/admin/DailyDashboard';
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
import SalesTraining from '@/pages/admin/SalesTraining';
import ClientOnboarding from '@/pages/admin/ClientOnboarding';
import MonthlyMonitoring from '@/pages/admin/MonthlyMonitoring';
import TikTokScreenGuide from '@/pages/admin/TikTokScreenGuide';
import TikTokPlatformReview from '@/pages/TikTokPlatformReview';
import TikTokCallback from '@/pages/TikTokCallback.jsx';
import TikTokPlatformReviewAdmin from '@/pages/admin/TikTokPlatformReviewAdmin';
import TikTokRecordingStudio from '@/pages/admin/TikTokRecordingStudio';
import RevenueActions from '@/pages/admin/RevenueActions';
import MerchFeedbackAdmin from '@/pages/admin/MerchFeedbackAdmin';
import OperationRegistry from '@/pages/admin/OperationRegistry';
import SiteFunctionAudit from '@/pages/admin/SiteFunctionAudit';
import PaymentDiagnostics from '@/pages/admin/PaymentDiagnosticsNew';
import IntegrationCompletionCentre from '@/pages/admin/IntegrationCompletionCentre';
import StripeCommandCentre from '@/pages/admin/StripeCommandCentreNew';
import WebhookHealth from '@/pages/admin/WebhookHealthNew';
import SocialDistributionReadiness from '@/pages/admin/SocialDistributionReadiness';
import CoachingCommand from '@/pages/admin/CoachingCommand';
import CoachingPrograms from '@/pages/admin/coaching/CoachingPrograms';
import CoachingLegal from '@/pages/admin/coaching/CoachingLegal';
import CoachingLaunchControl from '@/pages/admin/coaching/CoachingLaunchControl';
import CoachingROI from '@/pages/admin/coaching/CoachingROI';
import CoachingContentLibrary from '@/pages/admin/coaching/CoachingContentLibrary';
import CoachingMeditationLibrary from '@/pages/admin/coaching/MeditationLibrary';
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
import BundleProposalStudio from '@/pages/admin/BundleProposalStudio';
import TodaysMoneymoves from '@/pages/admin/TodaysMoneymoves';
import ContentToCash from '@/pages/admin/ContentToCash';
import WebsiteEvolution from '@/pages/admin/WebsiteEvolution';
import BusinessWorthCommand from '@/pages/admin/BusinessWorthCommand';
import OfferEngine from '@/pages/admin/OfferEngine';
import AtoZIndex from '@/pages/admin/AtoZIndex';
import SocialPlatformParity from '@/pages/admin/SocialPlatformParity';
import SocialOAuthCommand from '@/pages/admin/SocialOAuthCommand';
import SocialReviewReadiness from '@/pages/admin/SocialReviewReadiness';
import SocialContentReadiness from '@/pages/admin/SocialContentReadiness';
import SocialAnalyticsCommand from '@/pages/admin/SocialAnalyticsCommand';
import QACommandCentre from '@/pages/admin/QACommandCentre';
import PlaywrightTestCentre from '@/pages/admin/PlaywrightTestCentre';
import DeveloperHandoff from '@/pages/admin/DeveloperHandoff';
import AgentToolRegistry from '@/pages/admin/AgentToolRegistry';
import CodeAuditExport from '@/pages/admin/CodeAuditExport';
import ChatGPTCodeReviewExport from '@/pages/admin/ChatGPTCodeReviewExport';
import QAFailureReport from '@/pages/admin/QAFailureReport';
import VoiceInputTestPage from '@/pages/admin/VoiceInputTestPage';
import PromoCodeAudit from '@/pages/admin/PromoCodeAudit';
import AICostControl from '@/pages/admin/AICostControl';
import ReleasePromoCommand from '@/pages/admin/ReleasePromoCommand';
import ReleaseSprint from '@/pages/admin/ReleaseSprint';
import SocialAssetLibrary from '@/pages/admin/SocialAssetLibrary';
import SocialPostFactory from '@/pages/admin/SocialPostFactory';
import ContentQualityReview from '@/pages/admin/ContentQualityReview';
import SocialScheduleQueue from '@/pages/admin/SocialScheduleQueue';
import ContentPerformance from '@/pages/admin/ContentPerformance';
import MetricoolCommand from '@/pages/admin/MetricoolCommand';
import SystemBlueprint from '@/pages/admin/SystemBlueprint';
import MetricoolApiSetup from '@/pages/admin/MetricoolApiSetup';
import MetricoolMediaPipeline from '@/pages/admin/MetricoolMediaPipeline';
import MetricoolSchedulerQueue from '@/pages/admin/MetricoolSchedulerQueue';
import MetricoolPerformanceIntelligence from '@/pages/admin/MetricoolPerformanceIntelligence';
import AgentRevenueStatus from '@/pages/admin/AgentRevenueStatus';
import FinalSystemStatus from '@/pages/admin/FinalSystemStatus';
import GuidedSetupConcierge from '@/pages/admin/GuidedSetupConcierge';
import MetricoolDiagnostics from '@/pages/admin/MetricoolDiagnostics.jsx';
import SocialAgentOS from '@/pages/admin/SocialAgentOS.jsx';
import DailyPostEngine from '@/pages/admin/DailyPostEngine.jsx';
import AgentWorkbench from '@/pages/admin/AgentWorkbench';
import BusinessAttentionCentre from '@/pages/admin/BusinessAttentionCentre';
import InstagramAutoDMCommand from '@/pages/admin/InstagramAutoDMCommand';
import DiscountGuardAdmin from '@/pages/admin/DiscountGuardAdmin';
import ProcurementCommand from '@/pages/admin/ProcurementCommand';
import LandedCostCalculator from '@/pages/admin/LandedCostCalculator';
import StockFlowDashboard from '@/pages/admin/StockFlowDashboard';
import BusinessProcessCommand from '@/pages/admin/BusinessProcessCommand';
import AgentTrustHub from '@/pages/admin/AgentTrustHub';
import ExternalEngineeringCommand from '@/pages/admin/ExternalEngineeringCommand';
import PromoDiscountCompliance from '@/pages/admin/PromoDiscountCompliance';
import CursorCloudAgentCommand from '@/pages/admin/CursorCloudAgentCommand';
import AutonomousRepairLoop from '@/pages/admin/AutonomousRepairLoop';
import ContentCommandCentre from '@/pages/admin/ContentCommandCentre';
import ContentCommand from '@/pages/admin/ContentCommand';
import OpenAICommandCentre from '@/pages/admin/OpenAICommandCentre';
import AgentMessageBus from '@/pages/admin/AgentMessageBus';
import VideoAgentCommand from '@/pages/admin/VideoAgentCommand';
import CodeAuditCommand from '@/pages/admin/CodeAuditCommand';
import StrategicExecutionPlan from '@/pages/admin/StrategicExecutionPlan';
import MerchVisualLab from '@/pages/admin/MerchVisualLab';
import BusinessProfileSettingsPage from '@/pages/admin/BusinessProfileSettings';
import CampaignImageApproval from '@/pages/admin/CampaignImageApproval';
import MasterBlueprint from '@/pages/admin/MasterBlueprint';
import Live from '@/pages/Live';
import LivestreamCommand from '@/pages/admin/LivestreamCommand';
import QuickUpload from '@/pages/admin/QuickUpload';
import LinkIntegrityAudit from '@/pages/admin/LinkIntegrityAudit';
import EducationHub from '@/pages/admin/EducationHub';
import IntegrationActionCentre from '@/pages/admin/IntegrationActionCentre';
import InstagramStoryStudio from '@/pages/admin/InstagramStoryStudio';
import TrainingCentre from '@/pages/admin/TrainingCentre';
import AnnouncementStudio from '@/pages/admin/AnnouncementStudio';
import UpcomingMusic from '@/pages/UpcomingMusic';
import RememberMum from '@/pages/RememberMum';
import SiteUpgradeAudit from '@/pages/admin/SiteUpgradeAudit';
import Base44ExitPlan from '@/pages/admin/Base44ExitPlan';
import LegalDrafts from '@/pages/admin/LegalDrafts';
import CinematicWebsites from '@/pages/systems/CinematicWebsites';
import CaseStudyGannonWaye from '@/pages/systems/CaseStudyGannonWaye';
import CaseStudyGanozMix from '@/pages/systems/CaseStudyGanozMix';

// New Hub & Mission Control pages
import LaunchContentHub from '@/pages/admin/LaunchContentHub';
import MusicFanHub from '@/pages/admin/MusicFanHub';
import StoreOrdersHub from '@/pages/admin/StoreOrdersHub';
import AutomationAgentsHub from '@/pages/admin/AutomationAgentsHub';
import SystemsQaHub from '@/pages/admin/SystemsQaHub';
import OwnerBusinessHub from '@/pages/admin/OwnerBusinessHub';
import MissionControl from '@/pages/admin/MissionControl';
import SystemsManagerOffer from '@/pages/SystemsManagerOffer';
import StoreWorld from '@/pages/StoreWorld';
import PrintFulfilment from '@/pages/admin/PrintFulfilment';
import MumsGarden from '@/pages/MumsGarden';
import Memorial from '@/pages/Memorial';
import StoreProductDetail from '@/pages/StoreProductDetail';
import PriorityCommander from '@/pages/admin/PriorityCommander';
import ClickAudit from '@/pages/admin/ClickAudit';
import ReleasesRedirect from '@/pages/Releases';
import About from '@/pages/About';
import FanWall from '@/pages/FanWall';
import Support from '@/pages/Support';
import GiftTracker from '@/pages/GiftTracker';
import DomesticViolenceSupport from '@/pages/DomesticViolenceSupport';
import MusicOpportunityBulletin from '@/pages/admin/MusicOpportunityBulletin';
import HumanActionRequired from '@/pages/admin/HumanActionRequired';
import MerchContentBriefs from '@/pages/admin/MerchContentBriefs';
import PricingMarginCalculator from '@/pages/admin/PricingMarginCalculator';
import FinalSystemReport from '@/pages/admin/FinalSystemReport';
import GoogleDriveCommand from '@/pages/admin/GoogleDriveCommand';
import Coaching from '@/pages/Coaching';
import CoachingSelfWorthReset from '@/pages/CoachingSelfWorthReset';
import CoachingBoundaries from '@/pages/CoachingBoundaries';
import CoachingCreativeConfidence from '@/pages/CoachingCreativeConfidence';
import CoachingWorkbooks from '@/pages/CoachingWorkbooks';
import CoachingIntakePage from '@/pages/CoachingIntakePage';
import CoachingClientResources from '@/pages/CoachingClientResources';
import CoachingHub from '@/pages/admin/CoachingHub';
import CoachingOverview from '@/pages/admin/CoachingOverview';
import CoachingLeads from '@/pages/admin/CoachingLeads';
import CoachingIntakes from '@/pages/admin/CoachingIntakes';
import CoachingClients from '@/pages/admin/CoachingClients';
import CoachingContentEngine from '@/pages/admin/CoachingContentEngine';
import CoachingSocialDrafts from '@/pages/admin/CoachingSocialDrafts';
import WorkbookBuilder from '@/pages/admin/WorkbookBuilder';
import ClientResourceLibrary from '@/pages/admin/ClientResourceLibrary';
import PhoneSystem from '@/pages/admin/PhoneSystem';
import PressKit from '@/pages/PressKit';
import LyricsArchive from '@/pages/admin/LyricsArchive';
import ContentStudio from '@/pages/admin/ContentStudio';
import ManyChatDrafts from '@/pages/admin/ManyChatDrafts';
import InstagramSync from '@/pages/admin/InstagramSync';

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
        <Route path="/store" element={<StoreWorld />} />
        <Route path="/store/all" element={<Store />} />
        <Route path="/store/cart" element={<StoreCartPage />} />
        <Route path="/store/customer-details" element={<StoreCustomerDetails />} />
        <Route path="/store/cart-details" element={<StoreCartDetails />} />
        <Route path="/store/checkout" element={<StoreCheckout />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/email-preferences" element={<EmailPreferences />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/back-this" element={<BackThis />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/contact" element={<ContactGannon />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/lyrics" element={<LyricsPage />} />
        <Route path="/press" element={<Press />} />
        <Route path="/this-is-my-life" element={<ThisIsMyLife />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/current-single" element={<CurrentSingle />} />
        <Route path="/merch-feedback" element={<MerchFeedback />} />
        <Route path="/founding-supporter" element={<FoundingSupporterPage />} />
        <Route path="/upcoming-music" element={<UpcomingMusic />} />
        <Route path="/remember-mum" element={<RememberMum />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-cancel" element={<CheckoutCancel />} />
        <Route path="/presave" element={<PreSave />} />
        <Route path="/release/:id" element={<ReleaseDetail />} />
        <Route path="/store/product/:slug" element={<StoreProductDetail />} />
        <Route path="/releases" element={<ReleasesRedirect />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Navigate to="/contact" replace />} />
        <Route path="/support/domestic-violence" element={<DomesticViolenceSupport />} />
        {/* Coaching routes moved to admin — hidden from public */}
      </Route>

      {/* Embed timer (no layout) */}
      <Route path="/embed-timer" element={<EmbedTimer />} />
      <Route path="/tiktok-platform-review" element={<TikTokPlatformReview />} />
      <Route path="/tiktok-callback" element={<TikTokCallback />} />
      <Route path="/gift-checklist" element={<GiftChecklistPage />} />
      <Route path="/live" element={<Live />} />

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DailyDashboard />} />
        <Route path="/admin/launch-content" element={<LaunchContentHub />} />
        <Route path="/admin/music-fan" element={<MusicFanHub />} />
        <Route path="/admin/store-orders" element={<StoreOrdersHub />} />
        <Route path="/admin/automation-agents" element={<AutomationAgentsHub />} />
        <Route path="/admin/systems-qa" element={<SystemsQaHub />} />
        <Route path="/admin/owner-business" element={<OwnerBusinessHub />} />
        <Route path="/admin/mission-control" element={<MissionControl />} />
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
        <Route path="/admin/integration-action-centre" element={<IntegrationActionCentre />} />
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
        <Route path="/admin/sales-training" element={<SalesTraining />} />
        <Route path="/admin/client-onboarding" element={<ClientOnboarding />} />
        <Route path="/admin/monthly-monitoring" element={<MonthlyMonitoring />} />
        <Route path="/admin/tiktok-screen-guide" element={<TikTokScreenGuide />} />
        <Route path="/admin/tiktok-platform-review" element={<TikTokPlatformReviewAdmin />} />
        <Route path="/admin/tiktok-recording-studio" element={<TikTokRecordingStudio />} />
        <Route path="/admin/revenue-actions" element={<RevenueActions />} />
        <Route path="/admin/merch-feedback" element={<MerchFeedbackAdmin />} />
        <Route path="/admin/operation-registry" element={<OperationRegistry />} />
        <Route path="/admin/site-function-audit" element={<SiteFunctionAudit />} />
        <Route path="/admin/payment-diagnostics" element={<PaymentDiagnostics />} />
        <Route path="/admin/integration-completion-centre" element={<IntegrationCompletionCentre />} />
        <Route path="/admin/stripe-command-centre" element={<StripeCommandCentre />} />
        <Route path="/admin/webhook-health" element={<WebhookHealth />} />
        <Route path="/admin/social-distribution-readiness" element={<SocialDistributionReadiness />} />
        <Route path="/admin/coaching-command" element={<CoachingCommand />} />
        <Route path="/admin/coaching-launch-control" element={<CoachingLaunchControl />} />
        <Route path="/admin/coaching-programs" element={<CoachingPrograms />} />
        <Route path="/admin/coaching-legal" element={<CoachingLegal />} />
        <Route path="/admin/coaching-content-library" element={<CoachingContentLibrary />} />
        <Route path="/admin/meditation-library" element={<CoachingMeditationLibrary />} />
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
        <Route path="/admin/content-to-cash" element={<ContentToCash />} />
        <Route path="/admin/business-attention-centre" element={<Notifications />} />
        <Route path="/admin/todays-money-moves" element={<TodaysMoneymoves />} />
        <Route path="/admin/website-evolution" element={<WebsiteEvolution />} />
        <Route path="/admin/business-worth-command" element={<BusinessWorthCommand />} />
        <Route path="/admin/agent-capability-matrix" element={<AgentCapabilityMatrix />} />
        <Route path="/admin/bundle-proposal-studio" element={<BundleProposalStudio />} />
        <Route path="/admin/az-index" element={<AtoZIndex />} />
        <Route path="/admin/social-platform-parity" element={<SocialPlatformParity />} />
        <Route path="/admin/social-oauth-command" element={<SocialOAuthCommand />} />
        <Route path="/admin/social-review-readiness" element={<SocialReviewReadiness />} />
        <Route path="/admin/social-content-readiness" element={<SocialContentReadiness />} />
        <Route path="/admin/social-analytics-command" element={<SocialAnalyticsCommand />} />
        <Route path="/admin/qa-command-centre" element={<QACommandCentre />} />
        <Route path="/admin/playwright-test-centre" element={<PlaywrightTestCentre />} />
        <Route path="/admin/developer-handoff" element={<DeveloperHandoff />} />
        <Route path="/admin/agent-tool-registry" element={<AgentToolRegistry />} />
        <Route path="/admin/code-audit-export" element={<CodeAuditExport />} />
        <Route path="/admin/chatgpt-code-review-export" element={<ChatGPTCodeReviewExport />} />
        <Route path="/admin/qa-failure-report" element={<QAFailureReport />} />
        <Route path="/admin/voice-input-test" element={<VoiceInputTestPage />} />
        <Route path="/admin/promo-code-audit" element={<PromoCodeAudit />} />
        <Route path="/admin/ai-cost-control" element={<AICostControl />} />
        <Route path="/admin/operation-registry" element={<OperationRegistry />} />
        <Route path="/admin/release-promo-command" element={<ReleasePromoCommand />} />
        <Route path="/admin/release-sprint" element={<ReleaseSprint />} />
        <Route path="/admin/social-asset-library" element={<SocialAssetLibrary />} />
        <Route path="/admin/social-post-factory" element={<SocialPostFactory />} />
        <Route path="/admin/content-quality-review" element={<ContentQualityReview />} />
        <Route path="/admin/social-schedule-queue" element={<SocialScheduleQueue />} />
        <Route path="/admin/content-performance" element={<ContentPerformance />} />
        <Route path="/admin/metricool-command" element={<MetricoolCommand />} />
        <Route path="/admin/system-blueprint" element={<SystemBlueprint />} />
        <Route path="/admin/metricool-api-setup" element={<MetricoolApiSetup />} />
        <Route path="/admin/metricool-media-pipeline" element={<MetricoolMediaPipeline />} />
        <Route path="/admin/metricool-scheduler-queue" element={<MetricoolSchedulerQueue />} />
        <Route path="/admin/metricool-performance-intelligence" element={<MetricoolPerformanceIntelligence />} />
        <Route path="/admin/agent-revenue-status" element={<AgentRevenueStatus />} />
        <Route path="/admin/final-system-status" element={<FinalSystemStatus />} />
        <Route path="/admin/guided-setup-concierge" element={<GuidedSetupConcierge />} />
        <Route path="/admin/metricool-diagnostics" element={<MetricoolDiagnostics />} />
        <Route path="/admin/social-agent-os" element={<SocialAgentOS />} />
        <Route path="/admin/daily-post-engine" element={<DailyPostEngine />} />
        <Route path="/admin/agent-workbench" element={<AgentWorkbench />} />
        <Route path="/admin/business-attention-centre" element={<BusinessAttentionCentre />} />
        <Route path="/admin/instagram-auto-dm-command" element={<InstagramAutoDMCommand />} />
        <Route path="/admin/discount-guard" element={<DiscountGuardAdmin />} />
        <Route path="/admin/procurement-command" element={<ProcurementCommand />} />
        <Route path="/admin/landed-cost-calculator" element={<LandedCostCalculator />} />
        <Route path="/admin/stock-flow-dashboard" element={<StockFlowDashboard />} />
        <Route path="/admin/business-process-command" element={<BusinessProcessCommand />} />
        <Route path="/admin/agent-trust-hub" element={<AgentTrustHub />} />
        <Route path="/admin/external-engineering-command" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/security-trust-centre" element={<AgentTrustHub />} />
        <Route path="/admin/norton-safe-web-guide" element={<PromoDiscountCompliance />} />
        <Route path="/admin/promo-discount-compliance" element={<PromoDiscountCompliance />} />
        <Route path="/admin/cursor-cloud-agent-command" element={<CursorCloudAgentCommand />} />
        <Route path="/admin/autonomous-repair-loop" element={<AutonomousRepairLoop />} />
        <Route path="/admin/content-command" element={<ContentCommand />} />
        <Route path="/admin/openai-command" element={<OpenAICommandCentre />} />
        <Route path="/admin/agent-message-bus" element={<AgentMessageBus />} />
        <Route path="/admin/video-agent-command" element={<VideoAgentCommand />} />
        <Route path="/admin/code-audit-command" element={<CodeAuditCommand />} />
        <Route path="/admin/strategic-execution-plan" element={<StrategicExecutionPlan />} />
        <Route path="/admin/merch-visual-lab" element={<MerchVisualLab />} />
        <Route path="/admin/business-profile-settings" element={<BusinessProfileSettingsPage />} />
        <Route path="/admin/settings/business-details" element={<BusinessProfileSettingsPage />} />
        <Route path="/admin/quick-upload" element={<QuickUpload />} />
        <Route path="/admin/link-integrity-audit" element={<LinkIntegrityAudit />} />
        <Route path="/admin/education-hub" element={<EducationHub />} />
        <Route path="/admin/instagram-story-studio" element={<InstagramStoryStudio />} />
        <Route path="/admin/training-centre" element={<TrainingCentre />} />
        <Route path="/admin/announcement-studio" element={<AnnouncementStudio />} />
        <Route path="/admin/campaign-image-approval" element={<CampaignImageApproval />} />
        <Route path="/admin/master-blueprint" element={<MasterBlueprint />} />
        <Route path="/admin/livestream-command" element={<LivestreamCommand />} />
        <Route path="/admin/click-audit" element={<ClickAudit />} />
        <Route path="/admin/priority-commander" element={<PriorityCommander />} />
        <Route path="/admin/site-upgrade-audit" element={<SiteUpgradeAudit />} />
        <Route path="/admin/base44-exit-plan" element={<Base44ExitPlan />} />
        <Route path="/admin/legal-drafts" element={<LegalDrafts />} />
        <Route path="/admin/ganozmix-direct/legal" element={<LegalDrafts />} />
        <Route path="/admin/music-opportunity-bulletin" element={<MusicOpportunityBulletin />} />
        <Route path="/admin/print-fulfilment" element={<PrintFulfilment />} />
        <Route path="/admin/human-action-required" element={<HumanActionRequired />} />
        <Route path="/admin/merch-content-briefs" element={<MerchContentBriefs />} />
        <Route path="/admin/pricing-margin-calculator" element={<PricingMarginCalculator />} />
        <Route path="/admin/final-system-report" element={<FinalSystemReport />} />
        <Route path="/admin/google-drive" element={<GoogleDriveCommand />} />
        <Route path="/admin/coaching-hub" element={<CoachingHub />} />
        <Route path="/admin/coaching-overview" element={<CoachingOverview />} />
        <Route path="/admin/coaching-leads" element={<CoachingLeads />} />
        <Route path="/admin/coaching-intakes" element={<CoachingIntakes />} />
        <Route path="/admin/coaching-clients" element={<CoachingClients />} />
        <Route path="/admin/coaching-content-engine" element={<CoachingContentEngine />} />
        <Route path="/admin/social-drafts" element={<CoachingSocialDrafts />} />
        <Route path="/admin/workbook-builder" element={<WorkbookBuilder />} />
        <Route path="/admin/client-resource-library" element={<ClientResourceLibrary />} />
        <Route path="/admin/phone-system" element={<PhoneSystem />} />
        <Route path="/admin/mums-garden" element={<MumsGarden />} />
        <Route path="/admin/mum" element={<MumTribute />} />
        <Route path="/admin/without-you-here" element={<MumTribute />} />
        <Route path="/admin/memorial" element={<Memorial />} />
        <Route path="/admin/merch-reel" element={<MerchReelPage />} />
        <Route path="/admin/coaching" element={<Coaching />} />
        <Route path="/admin/coaching/self-worth-reset" element={<CoachingSelfWorthReset />} />
        <Route path="/admin/coaching/boundaries" element={<CoachingBoundaries />} />
        <Route path="/admin/coaching/creative-confidence" element={<CoachingCreativeConfidence />} />
        <Route path="/admin/coaching/workbooks" element={<CoachingWorkbooks />} />
        <Route path="/admin/coaching/intake" element={<CoachingIntakePage />} />
        <Route path="/admin/coaching/client-resources" element={<CoachingClientResources />} />
        <Route path="/admin/press-kit" element={<PressKit />} />
        <Route path="/admin/lyrics-archive" element={<LyricsArchive />} />
        <Route path="/admin/content-studio" element={<ContentStudio />} />
        <Route path="/admin/manychat-drafts" element={<ManyChatDrafts />} />
        <Route path="/admin/instagram-sync" element={<InstagramSync />} />
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