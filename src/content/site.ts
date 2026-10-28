export const INSTAGRAM_URL = "TODO";

interface SiteContentShape {
  brand: {
    name: string;
    tagline: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    instagramUrl: string;
  };
  nav: {
    items: readonly string[];
    cta: string;
  };
  hero: {
    eyebrow: string;
    headline: readonly [string, string];
    sub: string;
    ctas: readonly [string, string];
    systemLogs: readonly string[];
    systemCardTitle: string;
    systemStatus: string;
    scrollCue: string;
  };
  stats: readonly (
    | { label: string; value: number; suffix: string; note: string }
    | { label: string; prefix: string; value: number; suffix: string; note: string }
    | { label: string; text: string; note: string }
  )[];
  manifesto: {
    text: string;
    emphasisWords: readonly string[];
  };
  services: readonly {
    number: string;
    title: string;
    emphasisWord: string;
    description: string;
    chips: readonly [string, string, string, string];
  }[];
  servicesSection: {
    eyebrow: string;
    headline: readonly [string, string];
    cta: string;
  };
  stack: {
    eyebrow: string;
    marqueeItems: readonly string[];
  };
  playground: {
    eyebrow: string;
    headline: readonly [string, string];
    sub: string;
    cta: string;
    layers: readonly {
      name: string;
      value: string;
    }[];
    header: string;
    status: string;
    metrics: readonly [string, string, string];
  };
  entryPoints: {
    eyebrow: string;
    headline: readonly [string, string];
    cta: string;
    items: readonly {
      title: string;
      description: string;
    }[];
  };
  delivery: {
    eyebrow: string;
    headline: readonly [string, string];
    cta: string;
    stages: readonly {
      number: string;
      title: string;
      description: string;
    }[];
  };
  faq: readonly {
    question: string;
    answer: string;
  }[];
  faqSection: {
    eyebrow: string;
    headline: readonly [string, string];
    cta: string;
    itemLabel: string;
    verifiedLabel: string;
  };
  contactSection: {
    eyebrow: string;
    headline: readonly [string, string];
    sub: string;
    contactLabels: readonly [string, string, string];
    form: {
      title: string;
      helper: string;
      fields: {
        name: string;
        email: string;
        phone: string;
        company: string;
        serviceInterest: {
          label: string;
          options: readonly string[];
        };
        projectDetails: string;
      };
      submit: string;
      loading: string;
      success: string;
      sendAnother: string;
      copiedToast: string;
      copyFailedToast: string;
      rateLimitMessage: string;
      genericError: string;
      honeypotLabel: string;
      validation: {
        name: string;
        email: string;
        phone: string;
        company: string;
        serviceInterest: string;
        projectDetails: string;
      };
    };
  };
  finalCta: {
    headline: readonly [string, string];
    sub: string;
    button: string;
    marquee: string;
  };
  footer: {
    columns: readonly [string, string, string];
    instagram: string;
    legal: readonly [string, string];
    copyright: string;
    backToTop: string;
    wordmark: string;
  };
  accessibility: {
    skipToContent: string;
  };
  widgets: {
    chatbotTeaser: string;
  };
}

export const siteContent = {
  brand: {
    name: "Mavrix Technologies",
    tagline:
      "Engineering precision, intelligent workflow automation, and custom digital systems tailored for modern businesses.",
  },
  contact: {
    email: "hr@mavrixtechnologies.org.in",
    phone: "+91 86561 615991",
    address: "Ghaziabad, Uttar Pradesh, PIN 201024, India",
    instagramUrl: INSTAGRAM_URL,
  },
  nav: {
    items: ["Services", "How We Work", "Stack", "FAQ", "Contact"],
    cta: "Let's Talk",
  },
  hero: {
    eyebrow: "DIGITAL ENGINEERING & INTELLIGENT SYSTEMS STUDIO",
    headline: ["We engineer ideas into", "digital reality."],
    sub: "One focused engineering foundry for every stage of your technical lifecycle. Custom web platforms, autonomous AI chatbots, enterprise workflow automation, and robust cloud backends — brought together around what clients need.",
    ctas: ["Explore our services", "Start a Conversation"],
    systemLogs: [
      "> scaffolding platform...",
      "> connecting RAG pipeline...",
      "> running load tests...",
      "> deployed in 14 days ✓",
    ],
    systemCardTitle: "SYSTEM_DEPLOY",
    systemStatus: "LIVE",
    scrollCue: "SCROLL",
  },
  stats: [
    {
      label: "CORE ENGINES",
      value: 7,
      suffix: " Verticals",
      note: "Web, AI, Cloud & Automation",
    },
    {
      label: "IP STANDARD",
      value: 100,
      suffix: "% Owned",
      note: "Full client codebase ownership",
    },
    {
      label: "AI RESPONSE",
      prefix: "< ",
      value: 850,
      suffix: "ms",
      note: "Sub-second neural reasoning",
    },
    {
      label: "DIRECT ACCESS",
      text: "Engineers",
      note: "Direct technical consultation",
    },
  ],
  manifesto: {
    text: "We are not organized around rigid agency layers. We are organized around engineering momentum.",
    emphasisWords: ["engineering momentum."],
  },
  services: [
    {
      number: "01",
      title: "SEO Services",
      emphasisWord: "SEO",
      description:
        "Technical search engine optimization, on-page architecture, performance tuning, and content structure engineered for long-term organic visibility.",
      chips: [
        "Comprehensive Technical SEO Audits",
        "Core Web Vitals & Page Speed Optimization",
        "Structured Data & Schema Markup Implementation",
        "On-Page Semantic Content & Metadata Structuring",
      ],
    },
    {
      number: "02",
      title: "Business & Workflow Automation",
      emphasisWord: "Automation",
      description:
        "Connecting disparate business tools, automating repetitive manual tasks, and building resilient data pipelines to accelerate operational efficiency.",
      chips: [
        "Multi-System API Integrations & Webhooks",
        "CRM, Billing & ERP Workflow Synchronization",
        "Document Generation & Automated Reporting",
        "Lead Ingestion & Routing Pipelines",
      ],
    },
    {
      number: "03",
      title: "AI Chatbot & Support Chatbot Development",
      emphasisWord: "Chatbot",
      description:
        "Intelligent, context-aware conversational bots for automated customer support, instant lead qualification, and 24/7 client engagement.",
      chips: [
        "Knowledge Base & Document Retrieval (RAG)",
        "Customer Support Ticket Deflection",
        "Lead Qualification & Meeting Scheduling",
        "Multi-Channel Deployment (Web, WhatsApp, Slack)",
      ],
    },
    {
      number: "04",
      title: "Website Development",
      emphasisWord: "Website",
      description:
        "High-performance, accessible, and responsive web platforms built with modern frameworks to convert visitors and represent your brand.",
      chips: [
        "Custom Next.js & React Web Applications",
        "Headless CMS & Dynamic Content Architecture",
        "Fully Responsive & Mobile-First Implementation",
        "Strict Accessibility (WCAG) & Web Standards",
      ],
    },
    {
      number: "05",
      title: "Mobile App Development",
      emphasisWord: "Mobile",
      description:
        "Native-feel cross-platform iOS and Android mobile applications built for smooth performance, offline resilience, and intuitive user experiences.",
      chips: [
        "Cross-Platform iOS & Android Engineering",
        "Offline-First Data Architecture & Local Storage",
        "Push Notifications & User Re-engagement",
        "Secure Device Authentication (Biometrics, OAuth)",
      ],
    },
    {
      number: "06",
      title: "Custom Software Development",
      emphasisWord: "Software",
      description:
        "Tailor-made internal tools, SaaS backends, customer portals, and specialized software systems architected for your unique operational logic.",
      chips: [
        "Custom Web Portals & Administrative Dashboards",
        "Multi-Tenant SaaS Architecture",
        "Role-Based Access Control (RBAC) & Security",
        "Relational Database Modeling & Optimization",
      ],
    },
    {
      number: "07",
      title: "Graphic Design",
      emphasisWord: "Design",
      description:
        "Cohesive digital visual identity, branding systems, UI/UX asset kits, and marketing collateral crafted to convey credibility and quality.",
      chips: [
        "Brand Identity & Visual Style Guides",
        "Custom SVG Iconography & Illustration Kits",
        "Digital Marketing Collateral & Banners",
        "Presentation Deck & Technical Infographic Design",
      ],
    },
  ],
  servicesSection: {
    eyebrow: "SERVICES",
    headline: ["What we", "do"],
    cta: "All capabilities",
  },
  stack: {
    eyebrow: "ENGINEERED WITH HIGH-PERFORMANCE TECHNOLOGIES & STANDARDS",
    marqueeItems: [
      "React Native / Cross-Platform",
      "Cloudflare / Edge Security",
      "Kubernetes / Orchestration",
      "Tailwind CSS / Design Tokens",
      "WhatsApp API / Agent Gateway",
      "Pinecone / Vector Database",
      "FastAPI / Async Backend",
      "Sentry / Error Telemetry",
      "Next.js / Turbopack",
      "n8n / Workflow Engine",
      "PostgreSQL / Relational Core",
      "RAG / Retrieval Layer",
    ],
  },
  playground: {
    eyebrow: "THE ARCHITECTURE PLAYGROUND",
    headline: ["Your turn to", "shape a system."],
    sub: "Choose a stack. Connect the data contracts. Architect a resilient platform built to scale without friction.",
    cta: "Explore the systems playground",
    layers: [
      { name: "Web Platform", value: "Next.js 16 • Turbopack" },
      { name: "AI Neural Core", value: "RAG • WhatsApp Bot API" },
      { name: "Data Layer", value: "PostgreSQL • Vector DB" },
      { name: "Workflow Mesh", value: "n8n • Webhook Engine" },
    ],
    header: "SYSTEMS_MATRIX_V2",
    status: "PRODUCTION",
    metrics: ["LATENCY", "UPTIME", "REQ/S"],
  },
  entryPoints: {
    eyebrow: "ENTRY POINTS",
    headline: ["We enter where the", "work is."],
    cta: "How we work",
    items: [
      {
        title: "Discovery & Architecture",
        description:
          "A rough product idea or complex workflow that needs technical structure. We define data models, API contracts, and milestone blueprints before writing code.",
      },
      {
        title: "Sprint Velocity",
        description:
          "The deadline is immediate. We slot in as full-stack Next.js, mobile, or AI engineering capacity without an onboarding ramp or managerial friction.",
      },
      {
        title: "Midstream Modernization",
        description:
          "The project drifted, performance degraded, or technical debt accumulated. We refactor the architecture, restore test coverage, and reignite momentum.",
      },
      {
        title: "Last-Mile Delivery & SLAs",
        description:
          "Security audits, automated CI/CD pipelines, uptime SLAs, and full IP repository handover. The last mile is where quality matters most, so we treat it with absolute rigor.",
      },
    ],
  },
  delivery: {
    eyebrow: "HOW WE WORK",
    headline: ["The delivery", "standard"],
    cta: "Our philosophy",
    stages: [
      {
        number: "01",
        title: "Discovery & Specifications",
        description:
          "We unpack your system requirements, operational friction, and data schemas to formulate a mathematically sound scope of work.",
      },
      {
        number: "02",
        title: "Architecture & UX Design",
        description:
          "We architect relational database models, API contracts, and clean interfaces prioritized for conversion, speed, and usability.",
      },
      {
        number: "03",
        title: "Iterative Engineering",
        description:
          "Our engineers ship clean code in 2-week sprints with continuous milestone staging environments and transparent progress demos.",
      },
      {
        number: "04",
        title: "Quality Assurance & Hardening",
        description:
          "Rigorous automated validation across security benchmarks, Core Web Vitals, API load testing, and edge failure recovery.",
      },
      {
        number: "05",
        title: "Production Launch & Continuity",
        description:
          "Zero-downtime deployment backed by comprehensive documentation, complete IP handover, and proactive 99.98% SLA support.",
      },
    ],
  },
  faq: [
    {
      question: "What core engineering services does Mavrix Technologies provide?",
      answer:
        "Mavrix Technologies provides seven core engineering services: Custom Web Platforms (Next.js, React, Node.js), Mobile App Development (iOS & Android, React Native), Intelligent AI Chatbots (RAG models, WhatsApp bots), Enterprise Workflow Automation (n8n, API orchestration), Technical SEO & AEO Strategy, Bespoke Software Architecture, and Digital Design Systems.",
    },
    {
      question: "Where is Mavrix Technologies located and which regions do you serve?",
      answer:
        "Mavrix Technologies is headquartered in Ghaziabad, Uttar Pradesh, PIN 201024, India. We collaborate with growing businesses, startups, and established enterprises across India and internationally through modern remote collaboration tools.",
    },
    {
      question: "How do you structure new client engagements?",
      answer:
        "We begin with an in-depth Discovery and Architecture analysis to establish concrete technical specifications, data models, and milestones before writing production code. This ensures predictable delivery schedules and transparent costs.",
    },
    {
      question: "Who owns the codebase and intellectual property upon project completion?",
      answer:
        "You retain 100% ownership of the repository, source code, database architecture, and proprietary assets from milestone satisfaction. We never lock clients into proprietary hosting or closed frameworks.",
    },
    {
      question: "Do you provide ongoing maintenance and post-launch support?",
      answer:
        "Yes. We offer structured post-launch service level agreements (SLAs) covering routine security audits, dependencies updating, performance monitoring, and proactive feature enhancements.",
    },
  ],
  faqSection: {
    eyebrow: "FAQ",
    headline: ["Frequently asked", "questions"],
    cta: "Ask our engineers",
    itemLabel: "Item",
    verifiedLabel: "VERIFIED",
  },
  contactSection: {
    eyebrow: "GET IN TOUCH",
    headline: ["Discuss your next", "milestone."],
    sub: "Whether you need custom web or mobile development, an automated data workflow, or an intelligent support chatbot, our engineers in Ghaziabad, UP are ready to evaluate your requirements.",
    contactLabels: ["Email", "Phone", "Location"],
    form: {
      title: "Send Us a Message",
      helper:
        "Fill out the details below. Our engineering leads review every submission and respond promptly.",
      fields: {
        name: "Your Name*",
        email: "Work Email*",
        phone: "Phone Number*",
        company: "Company (optional)",
        serviceInterest: {
          label: "Service of Interest",
          options: [
            "SEO Services",
            "Business & Workflow Automation",
            "AI Chatbot & Support Chatbot Development",
            "Website Development",
            "Mobile App Development",
            "Custom Software Development",
            "Graphic Design",
          ],
        },
        projectDetails: "Project Details or Inquiry*",
      },
      submit: "Send Inquiry",
      loading: "Sending inquiry...",
      success: "Thanks, we'll respond promptly.",
      sendAnother: "Send another",
      copiedToast: "Email copied",
      copyFailedToast: "Unable to copy email",
      rateLimitMessage: "Please wait a moment before sending another inquiry.",
      genericError: "We couldn't send your inquiry. Please try again.",
      honeypotLabel: "Leave this field empty",
      validation: {
        name: "Enter your name using 2 to 100 characters.",
        email: "Enter a valid work email address.",
        phone: "Enter a valid phone number.",
        company: "Keep the company name under 120 characters.",
        serviceInterest: "Choose a service of interest.",
        projectDetails: "Enter project details using 10 to 5,000 characters.",
      },
    },
  },
  finalCta: {
    headline: ["Ready when", "you are."],
    sub: "Tell us where your technical challenges stand today, and our engineers will meet you there.",
    button: "Start a Conversation",
    marquee: "LET'S BUILD • LET'S SHIP • LET'S SCALE •",
  },
  footer: {
    columns: ["NAVIGATE", "CONNECT", "FOLLOW"],
    instagram: "Instagram",
    legal: ["Privacy Policy", "Terms of Service"],
    copyright: "© 2026 Mavrix Technologies",
    backToTop: "Back to top",
    wordmark: "MAVRIX",
  },
  accessibility: {
    skipToContent: "Skip to content",
  },
  widgets: {
    chatbotTeaser: "Click here for instant engineering answers",
  },
} as const satisfies SiteContentShape;

export type SiteContent = typeof siteContent;
export type Service = SiteContent["services"][number];
export type ServiceTitle = Service["title"];
export type FaqItem = SiteContent["faq"][number];
export type DeliveryStage = SiteContent["delivery"]["stages"][number];
