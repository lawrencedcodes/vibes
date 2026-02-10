export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswerIndices: number[]; // Changed to array for multiple correct answers
}

export const questions: Question[] = [
    // Module 1: Intro
    {
        id: 1,
        text: "Which decade saw the rise of 'Time Sharing', often considered a precursor to modern SaaS?",
        options: ["1950s", "1960s", "1990s", "2000s"],
        correctAnswerIndices: [1], // 1960s
    },
    {
        id: 2,
        text: "What was the primary flaw of the Application Service Provider (ASP) model compared to modern SaaS?",
        options: [
            "It used the internet",
            "It was too cheap",
            "It typically used single-tenant instances, limiting scalability",
            "It required local installation"
        ],
        correctAnswerIndices: [2],
    },
    {
        id: 3,
        text: "Which company is widely credited with pioneering modern SaaS with its 'No Software' motto?",
        options: ["Microsoft", "Oracle", "Salesforce", "Google"],
        correctAnswerIndices: [2],
    },

    // Module 2: What is SaaS
    {
        id: 4,
        text: "Which of the following is NOT a projected characteristic of SaaS?",
        options: [
            "On-Demand Access",
            "Centrally Hosted",
            "Subscription Pricing",
            "User manages database backups manually"
        ],
        correctAnswerIndices: [3],
    },
    {
        id: 5,
        text: "In the context of SaaS vs. On-Premise, what does CapEx stand for?",
        options: ["Capital Expenditure", "Captain Experience", "Captured Expenses", "Capacity Extraction"],
        correctAnswerIndices: [0],
    },
    {
        id: 6,
        text: "Which of these is an example of a Vertical SaaS company?",
        options: ["Salesforce", "Slack", "Toast (for Restaurants)", "Dropbox"],
        correctAnswerIndices: [2],
    },

    // Module 3: Motivations
    {
        id: 7,
        text: "Which metric represents the total cost to buy, deploy, use, and maintain software over its life?",
        options: ["ROI", "TCO (Total Cost of Ownership)", "NPS", "GDP"],
        correctAnswerIndices: [1],
    },
    {
        id: 8,
        text: "What is 'Shadow IT'?",
        options: [
            "IT staff working at night",
            "Dark mode interfaces",
            "Employees using software without explicit IT approval",
            "A security protocol"
        ],
        correctAnswerIndices: [2],
    },
    {
        id: 9,
        text: "Why do vendors prefer SaaS (recurring revenue)?",
        options: [
            "It is harder to predict",
            "It provides a predictable, improved valuation and cash flow",
            "Customers hate it",
            "It requires more physical shipping"
        ],
        correctAnswerIndices: [1],
    },

    // Module 4: Business Models
    {
        id: 10,
        text: "Which pricing model is best suited for collaboration tools where value grows with team size?",
        options: ["Flat Rate", "Per User / Per Seat", "Usage Based", "Freemium"],
        correctAnswerIndices: [1],
    },
    {
        id: 11,
        text: "What is a 'Healthy' LTV:CAC ratio benchmark for extensive SaaS growth?",
        options: ["1:1", "3:1", "10:1", "0.5:1"],
        correctAnswerIndices: [1],
    },
    {
        id: 12,
        text: "The 'Rule of 40' states that Growth Rate + Profit Margin should be at least:",
        options: ["20%", "40%", "50%", "100%"],
        correctAnswerIndices: [1],
    },
    {
        id: 13,
        text: "What does 'Churn' measure?",
        options: [
            "The speed of the database",
            "The percentage of customers who cancel their subscription",
            "The number of new signups",
            "The server latency"
        ],
        correctAnswerIndices: [1],
    },

    // Module 5: Multitenancy
    {
        id: 14,
        text: "In a Multi-Tenant architecture:",
        options: [
            "Every customer gets their own server",
            "Multiple customers share the same infrastructure and application instance",
            "Customers install the software on their own laptops",
            "Data is public to everyone"
        ],
        correctAnswerIndices: [1],
    },
    {
        id: 15,
        text: "Which isolation strategy involves shared resources (database/compute) for all tenants with logical separation?",
        options: ["Silo", "Pool", "Bridge", "Air Gap"],
        correctAnswerIndices: [1],
    },
    {
        id: 16,
        text: "What is the 'Noisy Neighbor' effect?",
        options: [
            "Loud servers in the data center",
            "One heavy tenant consuming resources and slowing down others",
            "Marketing emails being marked as spam",
            "Tenants complaining about pricing"
        ],
        correctAnswerIndices: [1],
    },

    // Module 6: Control Plane
    {
        id: 17,
        text: "Which component is responsible for 'SaaS for the SaaS provider' (onboarding, billing, metrics)?",
        options: ["Application Plane", "Data Plane", "Control Plane", "User Plane"],
        correctAnswerIndices: [2],
    },
    {
        id: 18,
        text: "Which protocol is commonly used for Identity Federation in Enterprise SaaS?",
        options: ["HTTP", "SAML", "FTP", "SMTP"],
        correctAnswerIndices: [1],
    },
    {
        id: 19,
        text: "What allows a user to be created automatically in a SaaS app the first time they log in via SSO?",
        options: ["Magic Links", "JIT (Just-in-Time) Provisioning", "Manual Entry", "Database Seeding"],
        correctAnswerIndices: [1],
    },

    // Module 7: Approaches
    {
        id: 20,
        text: "Which architecture style decouples the Frontend (Head) from the Backend (Body)?",
        options: ["Monolith", "Headless", "Serverless", "Microservices"],
        correctAnswerIndices: [1],
    },
    {
        id: 21,
        text: "Micro-SaaS businesses are typically characterized by:",
        options: [
            "Massive VC funding",
            "Solving a very specific niche problem extremely well",
            "Trying to be the next Salesforce",
            "Large operational teams"
        ],
        correctAnswerIndices: [1],
    },
    {
        id: 22,
        text: "B2B SaaS sales cycles are typically ______ than B2C.",
        options: ["Shorter", "Longer", "The same", "Non-existent"],
        correctAnswerIndices: [1],
    },

    // Module 8: Roadmaps & SLAs
    {
        id: 23,
        text: "What is an SLA?",
        options: [
            "Service Level Agreement",
            "Software License Audit",
            "System Log Analysis",
            "Standard Latency Average"
        ],
        correctAnswerIndices: [0],
    },
    {
        id: 24,
        text: "If an SLO is 99.9%, what is the 'Error Budget'?",
        options: ["10%", "1%", "0.1%", "0.01%"],
        correctAnswerIndices: [2],
    },
    {
        id: 25,
        text: "Which level of availability is often considered 'Enterprise Grade' (approx 52 mins downtime/year)?",
        options: ["99% (Two Nines)", "99.9% (Three Nines)", "99.99% (Four Nines)", "100%"],
        correctAnswerIndices: [2],
    },
];
