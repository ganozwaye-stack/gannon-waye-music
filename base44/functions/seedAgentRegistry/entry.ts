import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const AGENTS = [
  // PERSONAL (10)
  { agent_name: "Daily Briefing Agent", group: "personal", purpose: "Delivers a morning summary of tasks, calendar, news, and priorities", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Health & Wellness Tracker", group: "personal", purpose: "Monitors sleep, exercise, nutrition goals and sends reminders", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Personal Calendar Manager", group: "personal", purpose: "Manages appointments, blocks focus time, prevents scheduling conflicts", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Goal Tracker", group: "personal", purpose: "Tracks personal and professional goals with progress milestones", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Reading & Learning Curator", group: "personal", purpose: "Curates articles, books, and courses aligned to growth goals", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Mood Journal Agent", group: "personal", purpose: "Tracks emotional patterns and generates reflective prompts", status: "inactive", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Travel Planner", group: "personal", purpose: "Plans tours, travel logistics, accommodation and transport", status: "inactive", approval_level: "low_risk_auto", financial_risk: "low", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Gift & Milestone Tracker", group: "personal", purpose: "Tracks birthdays, anniversaries and gift ideas for key people", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Dietary & Recipe Agent", group: "personal", purpose: "Suggests meals, tracks dietary goals, generates shopping lists", status: "inactive", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Personal Finance Advisor", group: "personal", purpose: "Tracks personal spending and flags budget deviations", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "low", reputation_risk: "none" },

  // COMMUNICATION (10)
  { agent_name: "Email Triage Agent", group: "communication", purpose: "Categorises, prioritises and drafts responses to incoming emails", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "low", reputation_risk: "low" },
  { agent_name: "Fan Message Responder", group: "communication", purpose: "Drafts personalised replies to fan DMs and community messages", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "medium" },
  { agent_name: "Press Inquiry Handler", group: "communication", purpose: "Filters and drafts responses to media and press inquiries", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "medium", reputation_risk: "high" },
  { agent_name: "Booking Inquiry Agent", group: "communication", purpose: "Handles initial booking inquiries and gathers event details", status: "active", approval_level: "low_risk_auto", financial_risk: "low", legal_risk: "low", reputation_risk: "low" },
  { agent_name: "Newsletter Composer", group: "communication", purpose: "Drafts and schedules email newsletters to subscribers", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "SMS Campaign Agent", group: "communication", purpose: "Creates and sends SMS campaigns to opted-in fans", status: "inactive", approval_level: "always_approve", financial_risk: "low", legal_risk: "medium", reputation_risk: "medium" },
  { agent_name: "Collaboration Outreach Agent", group: "communication", purpose: "Drafts outreach messages for artist collaborations and features", status: "inactive", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Sponsorship Outreach Agent", group: "communication", purpose: "Researches and contacts potential sponsors and brand partners", status: "inactive", approval_level: "always_approve", financial_risk: "medium", legal_risk: "medium", reputation_risk: "medium" },
  { agent_name: "Community Moderator", group: "communication", purpose: "Monitors community posts, flags violations, auto-approves safe content", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "medium", reputation_risk: "high" },
  { agent_name: "Interview Prep Agent", group: "communication", purpose: "Prepares talking points and anticipated questions for interviews", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },

  // LEGAL (8)
  { agent_name: "Contract Review Agent", group: "legal", purpose: "Reviews contracts for red flags, unfair clauses, and missing protections", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "IP Protection Monitor", group: "legal", purpose: "Scans for unauthorised use of music, brand, and imagery", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "Rights & Royalties Tracker", group: "legal", purpose: "Tracks publishing rights, royalties and licensing agreements", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "none" },
  { agent_name: "Privacy Compliance Agent", group: "legal", purpose: "Ensures GDPR, Australian Privacy Act compliance across all systems", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "Terms & Policy Reviewer", group: "legal", purpose: "Reviews and updates terms of service and privacy policies", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "high", reputation_risk: "low" },
  { agent_name: "Dispute Resolution Agent", group: "legal", purpose: "Documents and prepares materials for resolving business disputes", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },
  { agent_name: "Licensing Deal Analyst", group: "legal", purpose: "Analyses licensing opportunities and their legal/financial implications", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "low" },
  { agent_name: "NDA & Confidentiality Agent", group: "legal", purpose: "Prepares and tracks NDAs for collaborators and business partners", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "high", reputation_risk: "medium" },

  // RESEARCH (10)
  { agent_name: "Music Industry Analyst", group: "research", purpose: "Monitors music industry trends, streaming data, and market shifts", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Competitor Intelligence Agent", group: "research", purpose: "Tracks similar artists' releases, campaigns, and fan engagement", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Fan Sentiment Analyser", group: "research", purpose: "Analyses fan comments, reviews, and sentiment across platforms", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Trend Spotter", group: "research", purpose: "Identifies emerging trends in music, culture, and social media", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Platform Algorithm Researcher", group: "research", purpose: "Monitors Spotify, TikTok, YouTube algorithm changes and optimises strategy", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Grant & Funding Scout", group: "research", purpose: "Identifies arts grants, government funding and music industry grants", status: "active", approval_level: "low_risk_auto", financial_risk: "low", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Venue & Festival Researcher", group: "research", purpose: "Researches venues, festivals, and booking contacts for touring", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Press & Media Monitor", group: "research", purpose: "Tracks press coverage, reviews, and media mentions", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Audience Demographics Analyst", group: "research", purpose: "Analyses fan demographics across platforms for targeted campaigns", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Technology Scout", group: "research", purpose: "Researches new tools, AI systems, and technology relevant to operations", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },

  // CREATIVE (10)
  { agent_name: "Lyrics & Songwriting Assistant", group: "creative", purpose: "Assists with lyric writing, song structure, and creative prompts", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "low", reputation_risk: "low" },
  { agent_name: "Visual Identity Guardian", group: "creative", purpose: "Ensures all visuals align with brand guidelines and aesthetic", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Music Video Concept Agent", group: "creative", purpose: "Generates concept briefs and storyboards for music videos", status: "inactive", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Cover Art Generator", group: "creative", purpose: "Creates and iterates on artwork concepts for releases", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Merch Design Agent", group: "creative", purpose: "Generates merchandise design concepts and product mockups", status: "active", approval_level: "always_approve", financial_risk: "low", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Bio & Press Kit Writer", group: "creative", purpose: "Writes and updates artist biography and press kit materials", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "high" },
  { agent_name: "Caption & Hook Writer", group: "creative", purpose: "Writes compelling captions, hooks, and short-form copy", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "medium" },
  { agent_name: "Storytelling Agent", group: "creative", purpose: "Crafts narratives around releases, tours, and personal milestones", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "medium" },
  { agent_name: "Podcast & Long-Form Content Agent", group: "creative", purpose: "Outlines and scripts long-form content including podcast episodes", status: "inactive", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Creative Brief Generator", group: "creative", purpose: "Creates production briefs for videos, shoots, and campaigns", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },

  // WEBSITE (8)
  { agent_name: "Site Content Manager", group: "website", purpose: "Updates and maintains website content, pages, and copy", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "SEO Optimiser", group: "website", purpose: "Monitors and improves SEO performance across all site pages", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Site Health Monitor", group: "website", purpose: "Monitors uptime, broken links, load times, and technical errors", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Conversion Optimiser", group: "website", purpose: "Analyses and improves store, back-this, and newsletter conversion rates", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "none", reputation_risk: "medium" },
  { agent_name: "Fan Experience Agent", group: "website", purpose: "Improves fan journey across the website with UX recommendations", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "medium" },
  { agent_name: "Release Page Builder", group: "website", purpose: "Creates and configures release landing pages for new music", status: "inactive", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Store Product Manager", group: "website", purpose: "Manages product listings, pricing, and inventory on the site store", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Analytics Interpreter", group: "website", purpose: "Interprets site analytics and surfaces actionable insights", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },

  // MARKETING (10)
  { agent_name: "Release Campaign Planner", group: "marketing", purpose: "Plans full marketing campaigns for music releases end-to-end", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Ad Creative Agent", group: "marketing", purpose: "Creates ad copy and creative assets for paid campaigns", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "medium", reputation_risk: "medium" },
  { agent_name: "Playlist Pitching Agent", group: "marketing", purpose: "Identifies and pitches music to relevant playlists and curators", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Email Marketing Strategist", group: "marketing", purpose: "Plans and optimises email marketing sequences and campaigns", status: "active", approval_level: "always_approve", financial_risk: "low", legal_risk: "medium", reputation_risk: "medium" },
  { agent_name: "Influencer Outreach Agent", group: "marketing", purpose: "Identifies and outreaches to influencers for campaign collaborations", status: "inactive", approval_level: "always_approve", financial_risk: "medium", legal_risk: "medium", reputation_risk: "medium" },
  { agent_name: "Pre-Save Campaign Manager", group: "marketing", purpose: "Manages pre-save campaigns for upcoming releases", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Press Release Writer", group: "marketing", purpose: "Writes and distributes press releases for new releases and milestones", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "medium", reputation_risk: "high" },
  { agent_name: "Promo Code Manager", group: "marketing", purpose: "Creates, tracks, and optimises promotional codes and discount campaigns", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Street Team Coordinator", group: "marketing", purpose: "Organises and communicates with volunteer street teams and ambassadors", status: "inactive", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Chart Tracker", group: "marketing", purpose: "Monitors chart positions across streaming and download platforms", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },

  // SOCIAL (10)
  { agent_name: "Instagram Content Planner", group: "social", purpose: "Plans and schedules Instagram posts, reels, and stories", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "TikTok Strategy Agent", group: "social", purpose: "Develops TikTok content strategy and trending audio alignment", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "YouTube Content Strategist", group: "social", purpose: "Plans YouTube content calendar, thumbnails, and titles", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Facebook Community Manager", group: "social", purpose: "Manages Facebook page and community group engagement", status: "inactive", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Twitter/X Agent", group: "social", purpose: "Drafts and schedules Twitter/X posts for engagement and announcements", status: "inactive", approval_level: "always_approve", financial_risk: "none", legal_risk: "medium", reputation_risk: "high" },
  { agent_name: "Social Engagement Monitor", group: "social", purpose: "Monitors mentions, comments, and engagement metrics across all platforms", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Cross-Platform Scheduler", group: "social", purpose: "Coordinates and syncs content posting across all social channels", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Viral Content Spotter", group: "social", purpose: "Identifies trending content formats to adapt and leverage quickly", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "low", reputation_risk: "medium" },
  { agent_name: "Fan Interaction Agent", group: "social", purpose: "Manages fan replies, likes, and community interactions strategically", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "none", reputation_risk: "medium" },
  { agent_name: "Social Analytics Reviewer", group: "social", purpose: "Reviews platform analytics and surfaces weekly performance summaries", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },

  // BUSINESS (10)
  { agent_name: "Revenue Tracker", group: "business", purpose: "Tracks all revenue streams including merch, streaming, sync, and live", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Business Plan Agent", group: "business", purpose: "Maintains and updates the long-term business strategy document", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "medium", reputation_risk: "low" },
  { agent_name: "Partnership Deal Analyst", group: "business", purpose: "Evaluates partnership and collaboration opportunities for fit and risk", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "Label Relations Manager", group: "business", purpose: "Manages communications and obligations with distribution and labels", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "Merch Strategy Agent", group: "business", purpose: "Plans merch releases, pricing strategy, and inventory management", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "none", reputation_risk: "low" },
  { agent_name: "Tour & Live Strategy Agent", group: "business", purpose: "Plans touring logistics, venue selection, and live revenue strategy", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "medium", reputation_risk: "medium" },
  { agent_name: "KPI Dashboard Agent", group: "business", purpose: "Maintains and updates key performance indicators across all verticals", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "CRM Manager", group: "business", purpose: "Manages fan and business contact relationships and touchpoints", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "low", reputation_risk: "low" },
  { agent_name: "Competitive Positioning Agent", group: "business", purpose: "Analyses market position and recommends strategic differentiation", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Investor Relations Agent", group: "business", purpose: "Manages communications with investors and prepares reporting materials", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },

  // FINANCE (10)
  { agent_name: "Cash Flow Monitor", group: "finance", purpose: "Tracks income and expenses in real-time and flags cash flow risks", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Tax Preparation Agent", group: "finance", purpose: "Organises financial records and prepares tax documentation", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "none" },
  { agent_name: "Royalty Collection Agent", group: "finance", purpose: "Tracks and chases outstanding royalty payments from all sources", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "medium", reputation_risk: "none" },
  { agent_name: "Budget Planner", group: "finance", purpose: "Creates and maintains budgets for projects, campaigns, and operations", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Invoice Manager", group: "finance", purpose: "Creates, sends, and tracks invoices for services and licensing", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "medium", reputation_risk: "none" },
  { agent_name: "Expense Categoriser", group: "finance", purpose: "Categorises all business expenses for bookkeeping and reporting", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Profit & Loss Analyser", group: "finance", purpose: "Generates P&L summaries per project, quarter, and revenue stream", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Sync Licensing Revenue Tracker", group: "finance", purpose: "Tracks sync deals, placement fees, and licensing income", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "low", reputation_risk: "none" },
  { agent_name: "Superannuation & Benefits Agent", group: "finance", purpose: "Ensures superannuation contributions and entitlements are managed", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "none" },
  { agent_name: "Financial Reporting Agent", group: "finance", purpose: "Compiles monthly and annual financial reports for review", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "medium", reputation_risk: "none" },

  // SYSTEMS (8)
  { agent_name: "Automation Architect", group: "systems", purpose: "Designs and maintains automated workflows across all business systems", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "low", reputation_risk: "low" },
  { agent_name: "Database Integrity Monitor", group: "systems", purpose: "Monitors data integrity, duplicate records, and schema compliance", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "API Health Agent", group: "systems", purpose: "Monitors all external API connections for failures and rate limits", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Backup & Recovery Agent", group: "systems", purpose: "Ensures data backups and tests recovery procedures", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "none" },
  { agent_name: "Performance Optimiser", group: "systems", purpose: "Identifies and resolves performance bottlenecks in the application", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Integration Manager", group: "systems", purpose: "Manages all third-party integrations and their configurations", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "low", reputation_risk: "none" },
  { agent_name: "Error Alerting Agent", group: "systems", purpose: "Detects and alerts on application errors and system failures", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Deployment Manager", group: "systems", purpose: "Coordinates code deployments, rollbacks, and release management", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "low", reputation_risk: "medium" },

  // SECURITY (8)
  { agent_name: "Threat Intelligence Agent", group: "security", purpose: "Monitors for cyber threats, phishing, and account compromise attempts", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "none", reputation_risk: "none" },
  { agent_name: "Access Control Monitor", group: "security", purpose: "Audits user access levels and flags unauthorised permission changes", status: "active", approval_level: "always_approve", financial_risk: "none", legal_risk: "high", reputation_risk: "none" },
  { agent_name: "Data Leakage Detector", group: "security", purpose: "Scans for sensitive data exposure in public-facing systems", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },
  { agent_name: "Fraud Detection Agent", group: "security", purpose: "Monitors transactions and user behaviour for fraudulent activity", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "Password & Credential Manager", group: "security", purpose: "Audits credential hygiene and flags weak or reused passwords", status: "inactive", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "none" },
  { agent_name: "Compliance Auditor", group: "security", purpose: "Performs regular security and compliance audits against standards", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "medium" },
  { agent_name: "Social Engineering Monitor", group: "security", purpose: "Detects social engineering attempts against accounts and brand", status: "active", approval_level: "auto", financial_risk: "none", legal_risk: "medium", reputation_risk: "high" },
  { agent_name: "Incident Response Agent", group: "security", purpose: "Coordinates response to security incidents with documented playbooks", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },

  // ORCHESTRATOR (6)
  { agent_name: "Master Orchestrator", group: "orchestrator", purpose: "Routes tasks to specialist agents, enforces safety protocols, manages escalations", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },
  { agent_name: "Risk Assessment Engine", group: "orchestrator", purpose: "Evaluates all proposed agent actions against Do-Not-Spend-Or-Lose rules", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },
  { agent_name: "Approval Queue Manager", group: "orchestrator", purpose: "Manages the approval queue, escalations, and decision notifications", status: "active", approval_level: "always_approve", financial_risk: "high", legal_risk: "high", reputation_risk: "high" },
  { agent_name: "Knowledge Vault Librarian", group: "orchestrator", purpose: "Manages storage, retrieval, and versioning of knowledge vault entries", status: "active", approval_level: "low_risk_auto", financial_risk: "none", legal_risk: "medium", reputation_risk: "none" },
  { agent_name: "System Health Orchestrator", group: "orchestrator", purpose: "Aggregates system health data and coordinates remediation actions", status: "active", approval_level: "always_approve", financial_risk: "medium", legal_risk: "low", reputation_risk: "none" },
  { agent_name: "Daily Operations Coordinator", group: "orchestrator", purpose: "Coordinates daily task execution across all agent groups with priority ordering", status: "active", approval_level: "low_risk_auto", financial_risk: "low", legal_risk: "low", reputation_risk: "low" },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const results = await base44.asServiceRole.entities.AgentRegistry.bulkCreate(AGENTS);

    return Response.json({ 
      success: true, 
      seeded: results.length,
      message: `Successfully seeded ${results.length} agents via service role`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});