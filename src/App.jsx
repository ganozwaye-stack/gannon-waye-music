import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import EmbedTimer from '@/pages/EmbedTimer';
import { initializeEventSystem } from '@/lib/eventAutomation';
import { lazy, Suspense, useEffect } from 'react';
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
import StoreProductDetail from '@/pages/StoreProductDetail';
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
import AboutGannon from '@/pages/AboutGannon';
import ContactGannon from '@/pages/ContactGannon.jsx';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import PublicLayout from '@/components/public/PublicLayout';
import StickySupportBar from '@/components/global/StickySupportBar';
import LyricsPage from '@/pages/LyricsPage';
import LyricsDetail from '@/pages/LyricsDetail';
import ThisIsMyLife from '@/pages/ThisIsMyLife';
import SongFeedbackProvider from '@/components/global/SongFeedbackGate';
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
import MumDesignLab from '@/pages/MumDesignLab';
import SoniaUpload from '@/pages/family/SoniaUpload';
import MerchReelPage from '@/components/mum/MerchReelPage';
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import CheckoutCancel from '@/pages/CheckoutCancel';

// Admin pages
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Releases = lazy(() => import('@/pages/admin/Releases'));
const MerchManagement = lazy(() => import('@/pages/admin/MerchManagement'));
const Orders = lazy(() => import('@/pages/admin/Orders'));
const Subscribers = lazy(() => import('@/pages/admin/Subscribers'));
const FanManagement = lazy(() => import('@/pages/admin/FanManagement'));
const SiteSettings = lazy(() => import('@/pages/admin/SiteSettings'));
const MerchPlatforms = lazy(() => import('@/pages/admin/MerchPlatforms'));
const VideoManagement = lazy(() => import('@/pages/admin/VideoManagement'));
const FanNewsletterDashboard = lazy(() => import('@/pages/admin/SubscriberNewsletter'));
const MerchDesigns = lazy(() => import('@/pages/admin/MerchDesigns'));
const ThankYouCards = lazy(() => import('@/pages/admin/ThankYouCards'));
const FanMedia = lazy(() => import('@/pages/admin/FanMedia'));
const PromoCodes = lazy(() => import('@/pages/admin/PromoCodes'));
const BackOfHouseReport = lazy(() => import('@/pages/admin/BackOfHouseReport'));
const RevealNewsletter = lazy(() => import('@/pages/admin/RevealNewsletter'));
const ProductInsights = lazy(() => import('@/pages/admin/ProductInsights'));
const Supporters = lazy(() => import('@/pages/admin/Supporters'));
const GiftClaims = lazy(() => import('@/pages/admin/GiftClaims'));
const TunecoreIntegration = lazy(() => import('@/pages/admin/TunecoreIntegration'));
const HoodieOffer = lazy(() => import('@/pages/admin/HoodieOffer'));
const FinancialDashboard = lazy(() => import('@/pages/admin/FinancialDashboard'));
const GiftVerification = lazy(() => import('@/pages/admin/GiftVerification'));
import GiftChecklistPage from '@/pages/GiftChecklistPage';
const MerchFinancials = lazy(() => import('@/pages/admin/MerchFinancials'));
const ImageEditor = lazy(() => import('@/pages/admin/ImageEditor'));
const SiteHealthDashboard = lazy(() => import('@/pages/admin/SiteHealthDashboard'));
const GiftProgressAdmin = lazy(() => import('@/pages/admin/GiftProgressAdmin'));
const ReleaseCountdown = lazy(() => import('@/pages/admin/ReleaseCountdown'));
const BirthdayDiscounts = lazy(() => import('@/pages/admin/BirthdayDiscounts'));
const CharityTracking = lazy(() => import('@/pages/admin/CharityTracking'));
const TrainingHub = lazy(() => import('@/pages/admin/TrainingHub'));
const AuditLog = lazy(() => import('@/pages/admin/AuditLog'));
const OperationalStatus = lazy(() => import('@/pages/admin/OperationalStatus'));
import Mastering from '@/pages/Mastering';
import OrderStatus from '@/pages/OrderStatus';
const MasteringAdmin = lazy(() => import('@/pages/admin/MasteringAdmin'));
const Blueprint = lazy(() => import('@/pages/admin/Blueprint'));
const SocialContentGenerator = lazy(() => import('@/pages/admin/SocialContentGenerator'));
const CommandCentre = lazy(() => import('@/pages/admin/CommandCentre'));
const AgentRegistryPage = lazy(() => import('@/pages/admin/AgentRegistry'));
const ApprovalQueuePage = lazy(() => import('@/pages/admin/ApprovalQueue'));
const KnowledgeVaultPage = lazy(() => import('@/pages/admin/KnowledgeVault'));
const RiskAlertsPage = lazy(() => import('@/pages/admin/RiskAlerts'));
const OrchestratorChat = lazy(() => import('@/pages/admin/OrchestratorChat'));
const LegalDashboard = lazy(() => import('@/pages/admin/LegalDashboard'));
const WealthDashboard = lazy(() => import('@/pages/admin/WealthDashboard'));
const ResearchHub = lazy(() => import('@/pages/admin/ResearchHub'));
const CreativeStudio = lazy(() => import('@/pages/admin/CreativeStudio'));
const MarketingCentre = lazy(() => import('@/pages/admin/MarketingCentre'));
const SocialCommand = lazy(() => import('@/pages/admin/SocialCommand'));
const SecurityCentre = lazy(() => import('@/pages/admin/SecurityCentre'));
const AgentTaskLogPage = lazy(() => import('@/pages/admin/AgentTaskLog'));
const TrendMonitor = lazy(() => import('@/pages/admin/TrendMonitor'));
const WebsiteOps = lazy(() => import('@/pages/admin/WebsiteOps'));
const SocialMonitor = lazy(() => import('@/pages/admin/SocialMonitor'));
const ContentDashboard = lazy(() => import('@/pages/admin/ContentDashboard'));
const ExecutiveFeed = lazy(() => import('@/pages/admin/ExecutiveFeed'));
const IdeasEngine = lazy(() => import('@/pages/admin/IdeasEngine'));
const EcommerceIntelligence = lazy(() => import('@/pages/admin/EcommerceIntelligence'));
const PremiumUX = lazy(() => import('@/pages/admin/PremiumUX'));
const BlueprintBuilder = lazy(() => import('@/pages/admin/BlueprintBuilder'));
const ClientInstalls = lazy(() => import('@/pages/admin/ClientInstalls'));
const Distributors = lazy(() => import('@/pages/admin/Distributors'));
const AgentLearning = lazy(() => import('@/pages/admin/AgentLearning'));
const MemoryGraph = lazy(() => import('@/pages/admin/MemoryGraph'));
const SelfHealing = lazy(() => import('@/pages/admin/SelfHealing'));
const SocialIntelligence = lazy(() => import('@/pages/admin/SocialIntelligence'));
const CreatorInsights = lazy(() => import('@/pages/admin/CreatorInsights'));
const ApiSetup = lazy(() => import('@/pages/admin/ApiSetup'));
const GoLiveChecklist = lazy(() => import('@/pages/admin/GoLiveChecklist'));
const AgentIntelligence = lazy(() => import('@/pages/admin/AgentIntelligence'));
const EcommerceCommand = lazy(() => import('@/pages/admin/EcommerceCommand'));
const ResearchGrid = lazy(() => import('@/pages/admin/ResearchGrid'));
const AutonomousOps = lazy(() => import('@/pages/admin/AutonomousOps'));
const StripeLiveReport = lazy(() => import('@/pages/admin/StripeLiveReport'));
const ContentAutomate = lazy(() => import('@/pages/admin/ContentAutomate'));
const GrowthEngine = lazy(() => import('@/pages/admin/GrowthEngine'));
const Notifications = lazy(() => import('@/pages/admin/Notifications'));
const ShippingRates = lazy(() => import('@/pages/admin/ShippingRates'));
const TikTokAppReview = lazy(() => import('@/pages/admin/TikTokAppReview'));
const RevenueCommandCentre = lazy(() => import('@/pages/admin/RevenueCommandCentre'));
const MusicCommandCentre = lazy(() => import('@/pages/admin/MusicCommandCentre'));
const GanozMixBridge = lazy(() => import('@/pages/admin/GanozMixBridge'));
const SalesTraining = lazy(() => import('@/pages/admin/SalesTraining'));
const ClientOnboarding = lazy(() => import('@/pages/admin/ClientOnboarding'));
const MonthlyMonitoring = lazy(() => import('@/pages/admin/MonthlyMonitoring'));
const TikTokScreenGuide = lazy(() => import('@/pages/admin/TikTokScreenGuide'));
import TikTokPlatformReview from '@/pages/TikTokPlatformReview';
import TikTokCallback from '@/pages/TikTokCallback.jsx';
const TikTokPlatformReviewAdmin = lazy(() => import('@/pages/admin/TikTokPlatformReviewAdmin'));
const TikTokRecordingStudio = lazy(() => import('@/pages/admin/TikTokRecordingStudio'));
const RevenueActions = lazy(() => import('@/pages/admin/RevenueActions'));
const MerchFeedbackAdmin = lazy(() => import('@/pages/admin/MerchFeedbackAdmin'));
const OperationRegistry = lazy(() => import('@/pages/admin/OperationRegistry'));
const SiteFunctionAudit = lazy(() => import('@/pages/admin/SiteFunctionAudit'));
const PaymentDiagnostics = lazy(() => import('@/pages/admin/PaymentDiagnosticsNew'));
const IntegrationCompletionCentre = lazy(() => import('@/pages/admin/IntegrationCompletionCentre'));
const StripeCommandCentre = lazy(() => import('@/pages/admin/StripeCommandCentreNew'));
const WebhookHealth = lazy(() => import('@/pages/admin/WebhookHealthNew'));
const SocialDistributionReadiness = lazy(() => import('@/pages/admin/SocialDistributionReadiness'));
const CoachingCommand = lazy(() => import('@/pages/admin/CoachingCommand'));
const CoachingPrograms = lazy(() => import('@/pages/admin/coaching/CoachingPrograms'));
const CoachingLegal = lazy(() => import('@/pages/admin/coaching/CoachingLegal'));
const CoachingLaunchControl = lazy(() => import('@/pages/admin/coaching/CoachingLaunchControl'));
const CoachingROI = lazy(() => import('@/pages/admin/coaching/CoachingROI'));
const CoachingContentLibrary = lazy(() => import('@/pages/admin/coaching/CoachingContentLibrary'));
const CoachingMeditationLibrary = lazy(() => import('@/pages/admin/coaching/MeditationLibrary'));
const CoachingClientManagement = lazy(() => import('@/pages/admin/coaching/ClientManagement'));
const AppointmentScheduler = lazy(() => import('@/pages/admin/coaching/AppointmentScheduler'));
const CoachingSalesFunnel = lazy(() => import('@/pages/admin/coaching/CoachingSalesFunnel'));
const IntelligenceToIncome = lazy(() => import('@/pages/admin/IntelligenceToIncome'));
const ArtistBusinessSetup = lazy(() => import('@/pages/admin/ArtistBusinessSetup'));
const SyncLicensingCommand = lazy(() => import('@/pages/admin/SyncLicensingCommand'));
const OrderProfitIntelligence = lazy(() => import('@/pages/admin/OrderProfitIntelligence'));
const WeeklyMoneyReport = lazy(() => import('@/pages/admin/WeeklyMoneyReport'));
const FanConversionEngine = lazy(() => import('@/pages/admin/FanConversionEngine'));
const AgentCapabilityMatrix = lazy(() => import('@/pages/admin/AgentCapabilityMatrix'));
const BundleProposalStudio = lazy(() => import('@/pages/admin/BundleProposalStudio'));
const TodaysMoneymoves = lazy(() => import('@/pages/admin/TodaysMoneymoves'));
const ContentToCash = lazy(() => import('@/pages/admin/ContentToCash'));
const WebsiteEvolution = lazy(() => import('@/pages/admin/WebsiteEvolution'));
const BusinessWorthCommand = lazy(() => import('@/pages/admin/BusinessWorthCommand'));
const OfferEngine = lazy(() => import('@/pages/admin/OfferEngine'));
const AtoZIndex = lazy(() => import('@/pages/admin/AtoZIndex'));
const SocialPlatformParity = lazy(() => import('@/pages/admin/SocialPlatformParity'));
const SocialOAuthCommand = lazy(() => import('@/pages/admin/SocialOAuthCommand'));
const SocialReviewReadiness = lazy(() => import('@/pages/admin/SocialReviewReadiness'));
const SocialContentReadiness = lazy(() => import('@/pages/admin/SocialContentReadiness'));
const SocialAnalyticsCommand = lazy(() => import('@/pages/admin/SocialAnalyticsCommand'));
const QACommandCentre = lazy(() => import('@/pages/admin/QACommandCentre'));
const PlaywrightTestCentre = lazy(() => import('@/pages/admin/PlaywrightTestCentre'));
const DeveloperHandoff = lazy(() => import('@/pages/admin/DeveloperHandoff'));
const AgentToolRegistry = lazy(() => import('@/pages/admin/AgentToolRegistry'));
const CodeAuditExport = lazy(() => import('@/pages/admin/CodeAuditExport'));
const ChatGPTCodeReviewExport = lazy(() => import('@/pages/admin/ChatGPTCodeReviewExport'));
const QAFailureReport = lazy(() => import('@/pages/admin/QAFailureReport'));
const VoiceInputTestPage = lazy(() => import('@/pages/admin/VoiceInputTestPage'));
const PromoCodeAudit = lazy(() => import('@/pages/admin/PromoCodeAudit'));
const AICostControl = lazy(() => import('@/pages/admin/AICostControl'));
const ReleasePromoCommand = lazy(() => import('@/pages/admin/ReleasePromoCommand'));
const ReleaseSprint = lazy(() => import('@/pages/admin/ReleaseSprint'));
const SocialAssetLibrary = lazy(() => import('@/pages/admin/SocialAssetLibrary'));
const SocialPostFactory = lazy(() => import('@/pages/admin/SocialPostFactory'));
const ContentQualityReview = lazy(() => import('@/pages/admin/ContentQualityReview'));
const SocialScheduleQueue = lazy(() => import('@/pages/admin/SocialScheduleQueue'));
const ContentPerformance = lazy(() => import('@/pages/admin/ContentPerformance'));
const MetricoolCommand = lazy(() => import('@/pages/admin/MetricoolCommand'));
const SystemBlueprint = lazy(() => import('@/pages/admin/SystemBlueprint'));
const MetricoolApiSetup = lazy(() => import('@/pages/admin/MetricoolApiSetup'));
const MetricoolMediaPipeline = lazy(() => import('@/pages/admin/MetricoolMediaPipeline'));
const MetricoolSchedulerQueue = lazy(() => import('@/pages/admin/MetricoolSchedulerQueue'));
const MetricoolPerformanceIntelligence = lazy(() => import('@/pages/admin/MetricoolPerformanceIntelligence'));
const AgentRevenueStatus = lazy(() => import('@/pages/admin/AgentRevenueStatus'));
const FinalSystemStatus = lazy(() => import('@/pages/admin/FinalSystemStatus'));
const GuidedSetupConcierge = lazy(() => import('@/pages/admin/GuidedSetupConcierge'));
const MetricoolDiagnostics = lazy(() => import('@/pages/admin/MetricoolDiagnostics.jsx'));
const SocialAgentOS = lazy(() => import('@/pages/admin/SocialAgentOS.jsx'));
const DailyPostEngine = lazy(() => import('@/pages/admin/DailyPostEngine.jsx'));
const AgentWorkbench = lazy(() => import('@/pages/admin/AgentWorkbench'));
const BusinessAttentionCentre = lazy(() => import('@/pages/admin/BusinessAttentionCentre'));
const InstagramAutoDMCommand = lazy(() => import('@/pages/admin/InstagramAutoDMCommand'));
const DiscountGuardAdmin = lazy(() => import('@/pages/admin/DiscountGuardAdmin'));
const ProcurementCommand = lazy(() => import('@/pages/admin/ProcurementCommand'));
const LandedCostCalculator = lazy(() => import('@/pages/admin/LandedCostCalculator'));
const StockFlowDashboard = lazy(() => import('@/pages/admin/StockFlowDashboard'));
const BusinessProcessCommand = lazy(() => import('@/pages/admin/BusinessProcessCommand'));
const AgentTrustHub = lazy(() => import('@/pages/admin/AgentTrustHub'));
const ExternalEngineeringCommand = lazy(() => import('@/pages/admin/ExternalEngineeringCommand'));
const PromoDiscountCompliance = lazy(() => import('@/pages/admin/PromoDiscountCompliance'));
const CursorCloudAgentCommand = lazy(() => import('@/pages/admin/CursorCloudAgentCommand'));
const AutonomousRepairLoop = lazy(() => import('@/pages/admin/AutonomousRepairLoop'));
const ContentCommandCentre = lazy(() => import('@/pages/admin/ContentCommandCentre'));
const ContentCommand = lazy(() => import('@/pages/admin/ContentCommand'));
const OpenAICommandCentre = lazy(() => import('@/pages/admin/OpenAICommandCentre'));
const AgentMessageBus = lazy(() => import('@/pages/admin/AgentMessageBus'));
const VideoAgentCommand = lazy(() => import('@/pages/admin/VideoAgentCommand'));
const AITwinContentStudio = lazy(() => import('@/pages/admin/AITwinContentStudio'));
const CodeAuditCommand = lazy(() => import('@/pages/admin/CodeAuditCommand'));
const StrategicExecutionPlan = lazy(() => import('@/pages/admin/StrategicExecutionPlan'));
const MerchVisualLab = lazy(() => import('@/pages/admin/MerchVisualLab'));
const BusinessProfileSettingsPage = lazy(() => import('@/pages/admin/BusinessProfileSettings'));
const CampaignImageApproval = lazy(() => import('@/pages/admin/CampaignImageApproval'));
const MasterBlueprint = lazy(() => import('@/pages/admin/MasterBlueprint'));
import Live from '@/pages/Live';
const LivestreamCommand = lazy(() => import('@/pages/admin/LivestreamCommand'));
const QuickUpload = lazy(() => import('@/pages/admin/QuickUpload'));
const LinkIntegrityAudit = lazy(() => import('@/pages/admin/LinkIntegrityAudit'));
const EducationHub = lazy(() => import('@/pages/admin/EducationHub'));
const IntegrationActionCentre = lazy(() => import('@/pages/admin/IntegrationActionCentre'));
const InstagramStoryStudio = lazy(() => import('@/pages/admin/InstagramStoryStudio'));
const GannonScheduler = lazy(() => import('@/pages/admin/GannonScheduler'));
const FamilyUploads = lazy(() => import('@/pages/admin/FamilyUploads'));
const MumTributeStudio = lazy(() => import('@/pages/admin/MumTributeStudio'));
const SoniaMemoryChatAdmin = lazy(() => import('@/pages/admin/SoniaMemoryChatAdmin'));
// New Hub & Mission Control pages
const LaunchContentHub = lazy(() => import('@/pages/admin/LaunchContentHub'));
const MusicFanHub = lazy(() => import('@/pages/admin/MusicFanHub'));
const StoreOrdersHub = lazy(() => import('@/pages/admin/StoreOrdersHub'));
const AutomationAgentsHub = lazy(() => import('@/pages/admin/AutomationAgentsHub'));
const SystemsQaHub = lazy(() => import('@/pages/admin/SystemsQaHub'));
const OwnerBusinessHub = lazy(() => import('@/pages/admin/OwnerBusinessHub'));
const MissionControl = lazy(() => import('@/pages/admin/MissionControl'));
const AskGannonOS = lazy(() => import('@/pages/admin/AskGannonOS'));
import SystemsManagerOffer from '@/pages/SystemsManagerOffer';
import SystemsServicePage from '@/pages/SystemsServicePage';
const Base44ExitPlan = lazy(() => import('@/pages/admin/Base44ExitPlan'));
const StyleStudio = lazy(() => import('@/pages/admin/StyleStudio'));
const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const isMemorialRoute = location.pathname === '/mum'
    || location.pathname === '/mum/garden'
    || location.pathname === '/mum/design-lab'
    || location.pathname === '/mum-garden'
    || location.pathname === '/mum-garden-preview';
  const isCleanEntranceRoute = location.pathname === '/'
    || location.pathname === '/store'
    || location.pathname === '/store-world';
  const showStickySupportBar = !location.pathname.startsWith('/admin') && !isMemorialRoute && !isCleanEntranceRoute;

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
    {showStickySupportBar && <StickySupportBar />}
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    }>
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store-world" element={<Navigate to="/store" replace />} />
        <Route path="/store/all" element={<Store />} />
        <Route path="/store/product/:productKey" element={<StoreProductDetail />} />
        <Route path="/store/cart" element={<StoreCartPage />} />
        <Route path="/store/customer-details" element={<StoreCustomerDetails />} />
        <Route path="/store/cart-details" element={<StoreCartDetails />} />
        <Route path="/store/checkout" element={<StoreCheckout />} />
        <Route path="/community" element={<Community />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/email-preferences" element={<EmailPreferences />} />
        <Route path="/fan-profile" element={<FanProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/back-this" element={<BackThis />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/about" element={<AboutGannon />} />
        <Route path="/contact" element={<ContactGannon />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/lyrics" element={<LyricsPage />} />
        <Route path="/lyrics/:songId" element={<LyricsDetail />} />
        <Route path="/this-is-my-life" element={<ThisIsMyLife />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/supporter-activity" element={<RecentFanActivity />} />
        <Route path="/fan-activity" element={<RecentFanActivity />} />
        <Route path="/member-tiers" element={<MemberTiers />} />
        <Route path="/portrait-gallery" element={<PortraitGallery />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/bookings" element={<Navigate to="/" replace />} />
        <Route path="/7-day-standard" element={<SevenDayStandard />} />
        <Route path="/mastering" element={<Mastering />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/current-single" element={<CurrentSingle />} />
        <Route path="/merch-feedback" element={<MerchFeedback />} />
        <Route path="/tour" element={<Navigate to="/" replace />} />
        <Route path="/founding-supporter" element={<FoundingSupporterPage />} />
        <Route path="/become-founding-supporter" element={<FoundingSupporterPage />} />
        <Route path="/mum" element={<MumTribute mode="foyer" />} />
        <Route path="/mum/garden" element={<MumTribute mode="garden" />} />
        <Route path="/mum/design-lab" element={<MumDesignLab />} />
        <Route path="/mum-garden" element={<MumTribute mode="garden" />} />
        <Route path="/mum-garden-preview" element={<MumTribute mode="garden" />} />
        <Route path="/without-you-here" element={<Navigate to="/current-single" replace />} />
        <Route path="/remember-mum" element={<SoniaUpload />} />
        <Route path="/family/sonia-upload" element={<SoniaUpload />} />
        <Route path="/merch-reel" element={<MerchReelPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/store/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/payment-success" element={<CheckoutSuccess />} />
        <Route path="/order-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-cancel" element={<CheckoutCancel />} />
        <Route path="/store/checkout-cancel" element={<CheckoutCancel />} />

        {/* Systems Manager public portfolio routes */}
        <Route path="/systems-manager" element={<SystemsManagerOffer />} />
        <Route path="/ai-systems-manager" element={<SystemsManagerOffer />} />
        <Route path="/business-systems" element={<SystemsManagerOffer />} />
        <Route path="/systems/packages/:slug" element={<SystemsServicePage packagePage />} />
        <Route path="/systems/:slug" element={<SystemsServicePage />} />
        <Route path="/systems/case-studies/:slug" element={<SystemsServicePage caseStudy />} />
      </Route>

      {/* Embed timer (no layout) */}
      <Route path="/embed-timer" element={<EmbedTimer />} />
      <Route path="/tiktok-platform-review" element={<TikTokPlatformReview />} />
      <Route path="/tiktok-callback" element={<TikTokCallback />} />
      <Route path="/gift-checklist" element={<GiftChecklistPage />} />
      <Route path="/live" element={<Live />} />

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/ask-gannon-os" element={<AskGannonOS />} />
        <Route path="/admin/ai-twin-content-studio" element={<AITwinContentStudio />} />
        <Route path="/admin/launch-content" element={<LaunchContentHub />} />
        <Route path="/admin/music-fan" element={<MusicFanHub />} />
        <Route path="/admin/store-orders" element={<StoreOrdersHub />} />
        <Route path="/admin/automation-agents" element={<AutomationAgentsHub />} />
        <Route path="/admin/systems-qa" element={<SystemsQaHub />} />
        <Route path="/admin/owner-business" element={<OwnerBusinessHub />} />
        <Route path="/admin/mission-control" element={<MissionControl />} />
        <Route path="/admin/scheduler" element={<GannonScheduler />} />
        <Route path="/admin/lyrics" element={<Navigate to="/admin/releases" replace />} />
        <Route path="/admin/lyrics/new" element={<Navigate to="/admin/releases?action=new" replace />} />
        <Route path="/admin/lyrics/:songId/edit" element={<Navigate to="/admin/releases" replace />} />
        <Route path="/admin/services/:slug" element={<Navigate to="/admin/blueprint-builder" replace />} />
        <Route path="/admin/packages/:slug" element={<Navigate to="/admin/blueprint-builder" replace />} />
        <Route path="/admin/products/:slug" element={<Navigate to="/admin/merch" replace />} />
        <Route path="/admin/base44-exit-plan" element={<Base44ExitPlan />} />
        <Route path="/admin/style-studio" element={<StyleStudio />} />
        <Route path="/admin/legal-drafts" element={<LegalDashboard />} />
        <Route path="/admin/ganozmix-direct/legal" element={<LegalDashboard />} />
        <Route path="/admin/today" element={<GannonScheduler />} />
        <Route path="/admin/action-centre" element={<GannonScheduler />} />
        <Route path="/admin/family-uploads" element={<FamilyUploads />} />
        <Route path="/admin/mum" element={<MumTribute mode="garden" />} />
        <Route path="/admin/mum-tribute" element={<MumTribute mode="garden" />} />
        <Route path="/admin/without-you-here" element={<MumTribute mode="garden" />} />
        <Route path="/admin/mum-tribute-studio" element={<MumTributeStudio />} />
        <Route path="/admin/sonia-memory-chat" element={<SoniaMemoryChatAdmin />} />
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
        <Route path="/admin/system-health" element={<SiteHealthDashboard />} />
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
        <Route path="/admin/implementation-center" element={<Navigate to="/admin/integration-completion-centre" replace />} />
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
        <Route path="/admin/integration-war-room" element={<IntegrationCompletionCentre />} />
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
        <Route path="/admin/artist-management-command" element={<ArtistBusinessSetup />} />
        <Route path="/admin/income-stream-planner" element={<ArtistBusinessSetup />} />
        <Route path="/admin/social-platform-security" element={<ArtistBusinessSetup />} />
        <Route path="/admin/june-4-recording-plan" element={<ArtistBusinessSetup />} />
        <Route path="/admin/negotiation-rights-tracker" element={<ArtistBusinessSetup />} />
        <Route path="/admin/creative-tools-stack" element={<ArtistBusinessSetup />} />
        <Route path="/admin/sync-licensing-command" element={<SyncLicensingCommand />} />
        <Route path="/admin/publishing-deal-readiness" element={<SyncLicensingCommand />} />
        <Route path="/admin/music-supervisor-pitching" element={<SyncLicensingCommand />} />
        <Route path="/admin/apple-playlist-pitching" element={<SyncLicensingCommand />} />
        <Route path="/admin/catalogue-growth-command" element={<SyncLicensingCommand />} />
        <Route path="/admin/ad-agency-writing-command" element={<SyncLicensingCommand />} />
        <Route path="/admin/session-opportunity-command" element={<SyncLicensingCommand />} />
        <Route path="/admin/catalogue-readiness" element={<SyncLicensingCommand />} />
        <Route path="/admin/licensing-request-centre" element={<SyncLicensingCommand />} />
        <Route path="/admin/song-testing-command" element={<SyncLicensingCommand />} />
        <Route path="/admin/order-profit-intelligence" element={<OrderProfitIntelligence />} />
        <Route path="/admin/offer-engine" element={<OfferEngine />} />
        <Route path="/admin/content-to-cash" element={<ContentToCash />} />
        <Route path="/admin/business-attention-centre" element={<Notifications />} />
        <Route path="/admin/todays-money-moves" element={<TodaysMoneymoves />} />
        <Route path="/admin/website-evolution" element={<WebsiteEvolution />} />
        <Route path="/admin/opportunity-engine" element={<GrowthEngine />} />
        <Route path="/admin/agent-performance" element={<AgentIntelligence />} />
        <Route path="/admin/growth-command" element={<GrowthEngine />} />
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
        <Route path="/admin/clickability-audit" element={<QACommandCentre />} />
        <Route path="/admin/developer-handoff" element={<DeveloperHandoff />} />
        <Route path="/admin/source-export-readiness" element={<DeveloperHandoff />} />
        <Route path="/admin/codex-task-packs" element={<DeveloperHandoff />} />
        <Route path="/admin/cursor-task-packs" element={<DeveloperHandoff />} />
        <Route path="/admin/claude-code-task-packs" element={<DeveloperHandoff />} />
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
        <Route path="/admin/live-setup-wizard" element={<GuidedSetupConcierge />} />
        <Route path="/admin/external-login-assistant" element={<GuidedSetupConcierge />} />
        <Route path="/admin/credential-install-centre" element={<GuidedSetupConcierge />} />
        <Route path="/admin/connection-completion-centre" element={<GuidedSetupConcierge />} />
        <Route path="/admin/agent-workbench" element={<AgentWorkbench />} />
        <Route path="/admin/business-attention-centre" element={<BusinessAttentionCentre />} />
        <Route path="/admin/instagram-auto-dm-command" element={<InstagramAutoDMCommand />} />
        <Route path="/admin/social-dm-funnel" element={<InstagramAutoDMCommand />} />
        <Route path="/admin/comment-response-library" element={<InstagramAutoDMCommand />} />
        <Route path="/admin/auto-reply-safety-centre" element={<InstagramAutoDMCommand />} />
        <Route path="/admin/discount-guard" element={<DiscountGuardAdmin />} />
        <Route path="/admin/procurement-command" element={<ProcurementCommand />} />
        <Route path="/admin/alibaba-command" element={<ProcurementCommand />} />
        <Route path="/admin/supplier-command" element={<ProcurementCommand />} />
        <Route path="/admin/purchase-orders" element={<ProcurementCommand />} />
        <Route path="/admin/supplier-products" element={<ProcurementCommand />} />
        <Route path="/admin/stock-receiving" element={<StockFlowDashboard />} />
        <Route path="/admin/landed-cost-calculator" element={<LandedCostCalculator />} />
        <Route path="/admin/inventory-batches" element={<StockFlowDashboard />} />
        <Route path="/admin/inventory-costing" element={<LandedCostCalculator />} />
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
        <Route path="/admin/content-command-v1" element={<ContentCommandCentre />} />
        <Route path="/admin/content-command-centre" element={<ContentCommandCentre />} />
        <Route path="/admin/openai-command" element={<OpenAICommandCentre />} />
        <Route path="/admin/chatgpt-control-centre" element={<OpenAICommandCentre />} />
        <Route path="/admin/agent-message-bus" element={<AgentMessageBus />} />
        <Route path="/admin/ai-agent-command" element={<OpenAICommandCentre />} />
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
        <Route path="/admin/campaign-image-approval" element={<CampaignImageApproval />} />
        <Route path="/admin/thankyou-image-review" element={<CampaignImageApproval />} />
        <Route path="/admin/master-blueprint" element={<MasterBlueprint />} />
        <Route path="/admin/livestream-command" element={<LivestreamCommand />} />
        <Route path="/admin/blueprint" element={<MasterBlueprint />} />
        <Route path="/admin/system-blueprint" element={<MasterBlueprint />} />
        <Route path="/admin/site-blueprint" element={<MasterBlueprint />} />
        <Route path="/admin/code-audit" element={<CodeAuditCommand />} />
        <Route path="/admin/clip-idea-studio" element={<VideoAgentCommand />} />
        <Route path="/admin/capcut-prompt-builder" element={<VideoAgentCommand />} />
        <Route path="/admin/hook-detection-centre" element={<VideoAgentCommand />} />
        <Route path="/admin/cursor-handoff" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/replit-handoff" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/warp-handoff" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/github-export-guide" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/external-engineering-task-list" element={<ExternalEngineeringCommand />} />
        <Route path="/admin/ai-tool-budget-control" element={<AICostControl />} />
        <Route path="/admin/action-required" element={<BusinessAttentionCentre />} />
        <Route path="/admin/action-required-engineering" element={<BusinessAttentionCentre />} />
        <Route path="/admin/go-live-checklist" element={<GoLiveChecklist />} />
        <Route path="/admin/training-hub" element={<TrainingHub />} />
        <Route path="/admin/social-scheduler-health" element={<MetricoolCommand />} />
        <Route path="/admin/metricool-profile-map" element={<MetricoolDiagnostics />} />
        <Route path="/admin/metricool-performance-sync" element={<MetricoolPerformanceIntelligence />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <SongFeedbackProvider>
            <ScrollToTop />
            <PostHogPageTracker />
            <AuthenticatedApp />
          </SongFeedbackProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
