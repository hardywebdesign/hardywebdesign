export type QuestionType = "text" | "email" | "tel" | "url" | "area" | "checks" | "radio";

export type Question = {
  id: string;
  label: string;
  type: QuestionType;
  hint?: string;
  options?: string[];
  required?: boolean;
  half?: boolean;
  max?: number;
};

export type Section = {
  id: string;
  title: string;
  lead: string;
  questions: Question[];
};

export type Answers = Record<string, string | string[]>;

export const SECTIONS: Section[] = [
  {
    id: "about",
    title: "About you",
    lead: "So I know who I'm building for.",
    questions: [
      { id: "contact_name", type: "text", label: "Your name", required: true, half: true },
      { id: "business_name", type: "text", label: "Business name", required: true, half: true },
      { id: "contact_email", type: "email", label: "Email", required: true, half: true },
      { id: "contact_phone", type: "tel", label: "Phone", half: true },
      {
        id: "business_desc",
        type: "area",
        label: "What does your business do?",
        hint: "A few sentences, the way you'd explain it to a new customer.",
        required: true,
      },
      {
        id: "ideal_customer",
        type: "area",
        label: "Who is your ideal customer?",
        hint: "Age, location, what problem you solve for them.",
      },
    ],
  },
  {
    id: "goals",
    title: "Goals",
    lead: "What the site needs to accomplish.",
    questions: [
      {
        id: "main_action",
        type: "checks",
        label: "What's the #1 thing you want visitors to do?",
        hint: "Pick up to two.",
        max: 2,
        options: [
          "Call or text",
          "Book an appointment",
          "Buy something",
          "Request a quote",
          "Join an email list",
          "Learn about us",
          "Visit in person",
          "Donate",
        ],
      },
      {
        id: "success",
        type: "area",
        label: "A few months after launch, how will you know the site is working?",
        hint: "More calls, more bookings, fewer repeat questions, etc.",
      },
      {
        id: "competitors",
        type: "area",
        label: "List 2–3 competitors. What do you like or dislike about their websites?",
      },
    ],
  },
  {
    id: "content",
    title: "Pages & content",
    lead: "What goes on the site and who provides it.",
    questions: [
      {
        id: "pages",
        type: "checks",
        label: "Which pages do you need?",
        options: [
          "Home",
          "About",
          "Services",
          "Pricing",
          "Shop",
          "Portfolio / Gallery",
          "Blog / News",
          "FAQ",
          "Testimonials",
          "Events",
          "Team",
          "Contact",
          "Careers",
        ],
      },
      { id: "pages_other", type: "text", label: "Any other pages?" },
      {
        id: "copy_writer",
        type: "radio",
        label: "Who will write the text for the site?",
        options: ["I'll write it", "I'd like you to write it", "A mix of both", "Not sure yet"],
      },
      {
        id: "photos",
        type: "radio",
        label: "Do you have photos or video to use?",
        options: [
          "Yes, professional photos",
          "Some, but not great quality",
          "No, use stock images",
          "I'll need a photographer",
        ],
      },
      {
        id: "social_proof",
        type: "text",
        label: "Do you have reviews, testimonials or case studies to show?",
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    lead: "Tap everything you'd like the site to do. This is where most of the price is decided.",
    questions: [
      {
        id: "features",
        type: "checks",
        label: "Features",
        options: [
          "Online booking / scheduling",
          "Online store",
          "Accept payments",
          "Subscriptions or memberships",
          "Contact form",
          "Quote request form",
          "Email newsletter signup",
          "Member login / client portal",
          "Blog I can update",
          "Photo gallery",
          "Video",
          "Google Map",
          "Reviews widget",
          "Social media feed",
          "Live chat",
          "Event calendar",
          "Downloadable files (PDFs, menus)",
          "Multiple languages",
          "Search",
        ],
      },
      {
        id: "current_tools",
        type: "area",
        label: "What tools do you already use that the site should connect to?",
        hint: "Calendly, Square, Shopify, Mailchimp, QuickBooks, a CRM, etc.",
      },
      {
        id: "form_dest",
        type: "text",
        label: "When someone fills out a form on your site, where should it go?",
        hint: "An email address, a spreadsheet, a CRM…",
      },
    ],
  },
  {
    id: "look",
    title: "Look & feel",
    lead: "Your brand and the impression you want to make.",
    questions: [
      {
        id: "brand_assets",
        type: "checks",
        label: "What do you already have?",
        options: ["Logo", "Brand colors", "Brand fonts", "Brand guidelines", "None of these yet"],
      },
      {
        id: "vibe",
        type: "checks",
        label: "How should the site feel?",
        hint: "Pick up to three.",
        max: 3,
        options: [
          "Clean & modern",
          "Warm & friendly",
          "Bold & energetic",
          "Calm & relaxing",
          "Luxury / high-end",
          "Playful",
          "Professional & trustworthy",
          "Rustic / handmade",
          "Techy",
        ],
      },
      {
        id: "sites_love",
        type: "area",
        label: "Share 2–3 websites you love, and what you like about each.",
        hint: "They don't have to be in your industry.",
      },
      { id: "avoid", type: "area", label: "Anything you definitely don't want?" },
    ],
  },
  {
    id: "technical",
    title: "Technical",
    lead: "The behind-the-scenes details.",
    questions: [
      { id: "domain", type: "radio", label: "Do you own a domain name?", options: ["Yes", "No", "Not sure"] },
      {
        id: "domain_name",
        type: "text",
        label: "If yes, what is it and where is it registered?",
        hint: "e.g. mybusiness.com on GoDaddy",
      },
      { id: "current_site", type: "text", label: "Current website address, if you have one" },
      {
        id: "updates",
        type: "radio",
        label: "Who will update the site after launch?",
        options: ["Me or my staff", "You (the developer)", "Both", "Rarely needs updates"],
      },
      {
        id: "requirements",
        type: "checks",
        label: "Any special requirements?",
        options: [
          "Accessibility (ADA)",
          "Cookie / privacy notice",
          "Health info (HIPAA)",
          "Age verification",
          "None that I know of",
        ],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget & timeline",
    lead: "So I can recommend the right scope.",
    questions: [
      {
        id: "budget",
        type: "radio",
        label: "Budget range",
        required: true,
        options: [
          "Under $1,000",
          "$1,000–$2,500",
          "$2,500–$5,000",
          "$5,000–$10,000",
          "$10,000+",
          "Not sure yet",
        ],
      },
      { id: "deadline", type: "text", label: "Is there a launch date or event this is tied to?" },
      { id: "decider", type: "text", label: "Who makes final decisions and approves designs?" },
      {
        id: "ongoing",
        type: "checks",
        label: "After launch, would you like help with any of these?",
        options: ["Maintenance & updates", "Hosting", "SEO", "Content updates", "Analytics reports", "Not needed"],
      },
      { id: "anything_else", type: "area", label: "Anything else I should know?" },
    ],
  },
];

export const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);

export function isAnswered(v: string | string[] | undefined) {
  return Array.isArray(v) ? v.length > 0 : !!v && v.trim().length > 0;
}

/** Validate and normalize untrusted input. Returns cleaned answers or a list of error messages. */
export function cleanAnswers(input: unknown): { answers: Answers; errors: string[] } {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const answers: Answers = {};
  const errors: string[] = [];

  for (const q of ALL_QUESTIONS) {
    const raw = src[q.id];
    if (q.type === "checks") {
      const list = Array.isArray(raw) ? raw : [];
      const allowed = new Set(q.options);
      const picked = list.filter((x): x is string => typeof x === "string" && allowed.has(x));
      answers[q.id] = q.max ? picked.slice(0, q.max) : picked;
    } else if (q.type === "radio") {
      answers[q.id] = typeof raw === "string" && q.options?.includes(raw) ? raw : "";
    } else {
      const limit = q.type === "area" ? 4000 : 300;
      answers[q.id] = typeof raw === "string" ? raw.trim().slice(0, limit) : "";
    }
    if (q.required && !isAnswered(answers[q.id])) errors.push(`${q.label} is required.`);
  }

  const email = answers.contact_email as string;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");

  return { answers, errors };
}
