export interface ModulePage {
    title: string;
    content: string;
}

export interface Module {
    id: string;
    title: string;
    pages: ModulePage[];
}

export const modules: Module[] = [
    {
        id: "intro",
        title: "1. Introduction",
        pages: [
            {
                title: "Course Overview",
                content: `
# Course Introduction

Welcome to **SaaS Principles**, a comprehensive guide to understanding Software as a Service.

In this course, we will explore the fundamental concepts that drive the modern software industry. Whether you are a developer, product manager, or entrepreneur, understanding these patterns is crucial.

## What You Will Learn
- The core definition of SaaS and how it differs from traditional software.
- Key business models and metrics.
- Architectural patterns like Multitenancy and Control Planes.
- Strategies for tiering and SLAs.

Click **Next** to begin your journey.
        `,
            },
            {
                title: "Deep Dive: Evolution of SaaS",
                content: `
# The Evolution of SaaS

To understand where we are, we must look at where we came from. SaaS didn't just appear; it evolved through decades of computing shifts.

## The Timeline

### 1. The Mainframe Era (1960s - 1980s)
Compute was massive and expensive. Organizations practiced "Time Sharing" — effectively the proto-SaaS. Dumb terminals connected to a central mainframe.
- **Key Concept:** Centralized resources, shared usage.

### 2. The Client-Server Era (1980s - 1990s)
The rise of the PC. Software was purchased on floppy disks or CD-ROMs and installed locally.
- **Pros:** Better UI, ownership.
- **Cons:** "DLL Hell," difficult updates, data synchronization issues.

### 3. The ASP Era (Late 1990s)
**Application Service Providers (ASPs)** were the direct precursors to SaaS. They hosted third-party software (like ERPs) and delivered it over the web.
- **The Flaw:** They were often "Single Tenant" — hosting a separate instance for every customer. Ideally suited for the web, but operationally unscalable.

### 4. Modern SaaS (2000s - Present)
Salesforce (1999) led the charge with the "No Software" motto. The key differentiator from ASPs was **Multitenancy**.
- **The Shift:** One codebase, one database (logically partitioned), serving thousands of customers.
- **Result:** Marginal cost to serve a new customer dropped to near zero.

## Why This Matters
Understanding this history explains why **Multitenancy** is the defining technical characteristic of true SaaS. Without it, you are just a modern ASP.
        `,
            },
        ],
    },
    {
        id: "what-is-saas",
        title: "2. What is SaaS?",
        pages: [
            {
                title: "Definition & Characteristics",
                content: `
# What is SaaS?

**Software as a Service (SaaS)** is a software licensing and delivery model in which software is licensed on a subscription basis and is centrally hosted.

## Key Characteristics
1.  **On-Demand Access:** Users access the software via a web browser or API, typically over the internet.
2.  **Centrally Hosted:** The provider manages the infrastructure, security, and updates. Users don't need to install anything locally.
3.  **Subscription Model:** Instead of a one-time purchase (Perpetual License), customers pay a recurring fee (monthly or annually).

## Contrast with Traditional Software
| Feature | Traditional (On-Premise) | SaaS |
| :--- | :--- | :--- |
| **Ownership** | You buy and own the license forever. | You rent the service. |
| **Maintenance** | You are responsible for updates and patches. | The provider handles all maintenance. |
| **Cost** | High upfront CapEx (Capital Expenditure). | OpeEx (Operating Expenditure), predictable recurring costs. |
| **Accessibility** | Limited to installed devices/network. | Accessible from anywhere with internet. |
        `,
            },
            {
                title: "Deep Dive: Horizontal vs. Vertical SaaS",
                content: `
# Horizontal vs. Vertical SaaS

Not all SaaS companies target the same breadth of market. We generally categorize them into two buckets.

## Horizontal SaaS
These products solve a common problem shared by almost every industry. The Total Addressable Market (TAM) is massive, but so is the competition.
-   **Examples:**
    -   **Salesforce (CRM):** Used by hospitals, tech startups, and construction firms alike.
    -   **Slack (Communication):** Team chat for everyone.
    -   **QuickBooks (Accounting):** General ledger for any business.
-   **Strategy:** "Land and Expand." Win on features that appeal to the widest audience.

## Vertical SaaS
These products target a specific industry (niche). The TAM is smaller, but they can capture a much higher market share and charge a premium for specialized features.
-   **Examples:**
    -   **Toast:** POS and management specifically for **Restaurants**.
    -   **Veeva:** CRM and content management for **Life Sciences/Pharma**.
    -   **Procore:** Project management for **Construction**.
-   **Strategy:** "Deep Domain Expertise." Build features (like compliance workflows) that a horizontal player would never build.

## Market Trends (2024)
-   **Vertical SaaS Growth:** Growing at ~31% vs 28% for Horizontal.
-   **Consolidation:** Big Horizontal players are acquiring Vertical tools to deepen their moat.
        `,
            },
        ],
    },
    {
        id: "motivations",
        title: "3. Motivations for SaaS",
        pages: [
            {
                title: "Why SaaS?",
                content: `
# Motivations for SaaS

Why has the industry shifted so heavily towards SaaS? The benefits are significant for both providers and customers.

## For Customers (Tenants)
-   **Lower Upfront Costs:** No need to buy expensive servers or perpetual licenses.
-   **Speed to Market:** Deployment is often instant.
-   **Scalability:** Easily add more users or features as the business grows.
-   **Focus on Core Business:** Let the software vendor worry about uptime, security, and backups.

## For Providers (Vendors)
-   **Recurring Revenue:** Predictable income stream (ARR - Annual Recurring Revenue).
-   **Single Codebase:** Easier to maintain and update one version for all customers rather than supporting multiple legacy versions installed on client machines.
-   **Data Insights:** Better visibility into how users interact with the product, allowing for data-driven improvements.
        `,
            },
            {
                title: "Deep Dive: TCO & Shadow IT",
                content: `
# TCO & The Risk of Shadow IT

## Total Cost of Ownership (TCO)
SaaS often looks expensive over 5 years compared to a one-time purchase. However, the TCO calculation for On-Premise is often underestimated.

### The Hidden Costs of On-Premise
1.  **Hardware Refresh:** Servers die every 3-5 years.
2.  **Power & Cooling:** Data centers are expensive to run.
3.  **Personnel:** You need SysAdmins to patch OS, manage DB backups, and secure the network. Personnel costs often account for **50-85%** of TCO.
4.  **Downtime:** What is the cost to your business if your self-hosted email server goes down for 2 days?

**SaaS Value Proposition:** You are outsourcing this risk and operational complexity.

## Shadow IT
The ease of SaaS adoption ("just swipe a credit card") leads to **Shadow IT**: employees signing up for tools without IT approval.
-   **Pros:** Agility. Teams solve problems fast.
-   **Cons:** Security risks, data fragmentation, and wasted spend (orphaned subscriptions).
-   **Stat:** Experts estimate large enterprises have 30-40% more SaaS apps than their CIOs are aware of.
        `,
            },
        ],
    },
    {
        id: "business-models",
        title: "4. SaaS Business Models",
        pages: [
            {
                title: "Pricing & Metrics",
                content: `
# SaaS Business Models

SaaS companies typically monetise through various strategies tailored to their target market.

## Common Pricing Strategies
1.  **Flat Rate:** A single price for all features (e.g., Basecamp). Simple, but doesn't scale with usage.
2.  **Per User / Per Seat:** Ideally suited for collaboration tools (e.g., Slack, Jira). Revenue grows with the customer's team size.
3.  **Tiered Pricing:** Different feature sets at different price points (e.g., Free, Pro, Enterprise). This allows capturing different market segments.
4.  **Usage-Based (Pay-as-you-go):** Charged based on consumption (e.g., API requests, storage, emails sent). Common in infrastructure SaaS (e.g., AWS, Twilio, Stripe).
5.  **Freemium:** Basic features are free, but premium features require a subscription. A powerful user acquisition strategy.

## Key Metrics
-   **ARR:** Annual Recurring Revenue.
-   **MRR:** Monthly Recurring Revenue.
-   **Churn Rate:** The percentage of customers who cancel their subscription.
-   **CAC:** Customer Acquisition Cost.
-   **LTV:** Lifetime Value of a customer.
        `,
            },
            {
                title: "Deep Dive: Unit Economics",
                content: `
# Deep Dive: Unit Economics

SaaS companies live and die by their "Unit Economics" — the profitability of a single customer.

## The Golden Ratio: LTV:CAC
-   **LTV (Lifetime Value):** How much total profit you make from a customer before they churn.
-   **CAC (Customer Acquisition Cost):** Total Sales & Marketing spend / Number of new customers.

### Benchmarks
-   **3:1 (Good):** You make $3 for every $1 you spend acquiring a customer. This is the industry standard target.
-   **1:1 (Bad):** You are burning cash and will likely run out of money.
-   **5:1+ (Too Conservative):** You might be under-investing in growth. You could grow faster by spending more!

## The Rule of 40
A benchmark for mature SaaS companies (>$5M ARR) to balance growth vs. profitability.
-   **Formula:** Revenue Growth % + Profit Margin % (EBITDA) >= 40%
-   **Meaning:**
    -   If you are growing at **100%**, it's okay to have **-60%** margins (burning cash to grow).
    -   If you are growing at **10%**, you better have **30%** profit margins.
    -   If you sum to < 40%, your business is likely struggling or inefficient.
        `,
            },
        ],
    },
    {
        id: "multitenancy",
        title: "5. Multitenancy",
        pages: [
            {
                title: "Core Concepts",
                content: `
# Multitenancy

**Multitenancy** is an architecture in which a single instance of a software application serves multiple customers (tenants). This is a cornerstone of SaaS efficiency.

## Single-Tenant vs. Multi-Tenant

### Single-Tenant
-   Every customer gets their own independent database and server instance.
-   **Pros:** Maximum isolation, security, and easier customization.
-   **Cons:** High cost to operate, difficult to maintain and upgrade (you have to upgrade 1000 servers for 1000 customers).

### Multi-Tenant
-   All customers share the same infrastructure and application instance. Data is logically separated (e.g., by a \`tenant_id\` column in the database).
-   **Pros:** Economies of scale, lower hardware costs, updates happen once for everyone.
-   **Cons:** Complexity in code to ensure data isolation ("Noisy Neighbor" effect where one heavy user slows down others).

## Isolation Strategies
1.  **Silo:** Separate resources (database/compute) per tenant.
2.  **Pool:** Shared resources for all tenants.
3.  **Bridge:** A hybrid approach (e.g., shared compute, separate databases).
        `,
            },
            {
                title: "Deep Dive: Isolation & Sharding",
                content: `
# Deep Dive: Isolation Architectures

How do we actually keep tenant data safe in a shared database?

## Row Level Security (RLS)
Instead of relying on developers to remember \`WHERE tenant_id = ?\` in every SQL query (which is prone to error), modern databases (Postgres, SQL Server) offer RLS.
-   **Mechanism:** You define a security policy on the database table itself.
-   **Enforcement:** The database automatically hides rows that don't match the current user's \`tenant_id\` context.
-   **Pros:** "Defense in Depth." Even if the application has a bug, the DB layer prevents data leaks.

## Sharding
When a single database gets too big (e.g., 50TB of data), we must split it.
-   **Tenant-Based Sharding:** We store Tenant A-M on **Shard 1** and Tenant N-Z on **Shard 2**.
-   **The "Noisy Neighbor" Fix:** If Tenant A is doing heavy processing, it slows down Shard 1, but Tenant Z on Shard 2 is unaffected.
-   **Trade-off:** Cross-shard reporting becomes very hard (e.g., "What is our total global revenue?").

**Enterprise Trend:** Many SaaS apps run a "Pool" for free/small tiers and "Silos" (dedicated shards) for enterprise customers who pay for guaranteed performance.
        `,
            },
        ],
    },
    {
        id: "control-plane",
        title: "6. SaaS Control Plane",
        pages: [
            {
                title: "The Brain of SaaS",
                content: `
# SaaS Control Plane

In a mature SaaS architecture, we distinguish between the **Application Plane** and the **Control Plane**.

## Application Plane
This is where the actual business logic lives. It's what the users interact with every day (e.g., the dashboard, the document editor).

## Control Plane
This is the system responsible for managing the tenants and the application itself. It is "SaaS for the SaaS provider."

### Responsibilities of the Control Plane
-   **Onboarding:** Provisioning new tenants (creating accounts, setting up databases).
-   **Billing & Metering:** Tracking usage and generating invoices.
-   **Configuration Management:** Managing feature flags and tenant-specific settings.
-   **Metrics & Health:** Monitoring the health of specific tenants.
-   **User Management:** Handling identity provider (IdP) integration and user roles.

Without a control plane, managing thousands of tenants becomes manually impossible.
        `,
            },
            {
                title: "Deep Dive: Identity Federation",
                content: `
# Deep Dive: Identity Federation

In B2B SaaS, enterprise customers don't want to create new usernames/passwords for your app. They want to log in using their company credentials (Okta, Azure AD, Google).

## Federation Protocols: SAML & OIDC
Your SaaS Control Plane must act as a "Service Provider" (SP) and talk to the customer's "Identity Provider" (IdP).

### How it Works (SAML Flow)
1.  **User Visits App:** "I want to log in as \`alice@bigcorp.com\`".
2.  **Redirect:** App sees domain \`bigcorp.com\` and redirects Alice to BigCorp's Login Page (Okta).
3.  **Auth:** Alice enters her corporate password on Okta (you never see it).
4.  **Assertion:** Okta sends a signed "SAML Assertion" back to your App. "ID: verified, Role: Admin".
5.  **Access:** Your app validates the signature and logs her in.

## Just-in-Time (JIT) Provisioning
Instead of manually creating users in your SaaS, you create them on-the-fly the first time they log in via SSO. Only the Tenant (Account) needs to be created beforehand.
        `,
            },
        ],
    },
    {
        id: "approaches",
        title: "7. SaaS Approaches",
        pages: [
            {
                title: "Architecture Strategies",
                content: `
# SaaS Approaches

There isn't one "correct" way to build SaaS. Your approach depends on your target customer and technical requirements.

## B2B vs. B2C
-   **B2B (Business-to-Business):** Focuses on teams, permissions, compliance, and SLAs. Sales cycles are longer. (e.g., Salesforce).
-   **B2C (Business-to-Consumer):** Focuses on user experience, viral growth, and simplicity. (e.g., Spotify, Netflix).

## Microservices vs. Monolith
-   **Monolithic SaaS:** Easier to start. All functionality in one codebase. Good for early-stage startups.
-   **Microservices:** Splits functionality into small, independent services. Better for scaling teams and complex domains, but adds operational overhead.

## API-First vs. UI-First
-   **API-First:** The product *is* the API (e.g., Stripe, Twilio). The UI is secondary or just a wrapper.
-   **UI-First:** The product is the visual interface (e.g., Canva, Zoom).
        `,
            },
            {
                title: "Deep Dive: Headless & Micro-SaaS",
                content: `
# Deep Dive: Emerging Models

## Headless SaaS
Decoupling the "Head" (Frontend/UI) from the "Body" (Backend/Logic).
-   **Example:** A Headless CMS (like Contentful) provides APIs to store and retrieve content, but no website. The customer builds their own website (in React, Vue, iOS) and pulls content via API.
-   **Why:** Infinite flexibility. The same backend can power a Website, an Apple Watch app, and a Digital Kiosk.

## Micro-SaaS
A trend of small, niche tools often built by solo founders or small teams.
-   **Philosophy:** "Do one thing really well" rather than "Do everything okay."
-   **Examples:** A plugin specifically for generating PDF invoices from Notion. An AI tool just for writing real estate listings.
-   **Economics:** Lower churn, lower operational costs, specialized user base. No need for VC funding.
        `,
            },
        ],
    },
    {
        id: "roadmaps-slas",
        title: "8. Roadmaps and SLAs",
        pages: [
            {
                title: "Managing Expectations",
                content: `
# Roadmaps and SLAs

Managing expectations is key in the service industry.

## Product Roadmap
A roadmap outlines the vision and direction of your product over time. In SaaS, roadmaps are often:
-   **Dynamic:** Priorities change based on user feedback and data.
-   **Public (Optional):** Some companies publish roadmaps to build trust (e.g., "Coming in Q3: Dark Mode").

## Service Level Agreements (SLAs)
An SLA is a commitment between the service provider and the customer regarding the level of service.

### Components of an SLA
-   **Availability (Uptime):** e.g., "99.9% uptime guarantee."
-   **Response Time:** e.g., "Support will respond to critical issues within 1 hour."
-   **Penalties:** Credits or refunds if the SLA is breached.

### The "Nines"
-   **99%:** ~3.65 days downtime/year.
-   **99.9%:** ~8.76 hours downtime/year.
-   **99.99%:** ~52.56 minutes downtime/year. (Enterprise Grade)
-   **99.999%:** ~5.26 minutes downtime/year. (Telco/Critical Infrastructure)

Achieving higher "nines" costs exponentially more engineering effort.
        `,
            },
            {
                title: "Deep Dive: SRE & Error Budgets",
                content: `
# Deep Dive: SRE Concepts

How do engineering teams actually maintain those SLAs? They use **Site Reliability Engineering (SRE)** principles.

## SLI vs. SLO
-   **SLI (Service Level Indicator):** The *actual* measurement. "My server success rate was 99.95% last month."
-   **SLO (Service Level Objective):** The *goal*. "We want our success rate to be >= 99.90%."
-   **SLA (Service Level Agreement):** The *contract* (with money attached). "If we drop below 99.90%, we owe you a refund."
    -   *Note: SLO is usually stricter than SLA to give a safety buffer.*

## The Error Budget
Error Budget = 100% - SLO.
-   If SLO is **99.9%**, your Error Budget is **0.1%**.
-   **Philosophy:** Reliability is not binary. You don't need 100% uptime (it's too expensive). You need *enough* uptime.
-   **Usage:** You can "spend" your error budget on innovation (releasing generic code, trying new upgrades).
-   **The Rule:** If you burn your Error Budget (too many outages), **Production Freezes**. You stop releasing features and work only on reliability until the budget resets.
        `,
            },
        ],
    },
];
