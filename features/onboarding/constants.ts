import type { InterestSignal, PathId, WeeklyHours, LearningVelocity } from "./types";

// ─── Path Content (Pre-defined, NOT AI-generated) ───

export const PATH_CONTENT: Record<
    PathId,
    {
        name: string;
        oneLiner: string;
        whatYoullLearn: string;
        skills: string[];
        projects: Array<{ title: string; subtitle: string }>;
        careers: string[];
    }
> = {
    frontend: {
        name: "Frontend Development",
        oneLiner: "Create professional, responsive web interfaces and user-facing applications.",
        whatYoullLearn:
            "Master the art of building fast, accessible, and beautiful user interfaces. You'll learn to translate designs into code and handle complex state management in modern web apps.",
        skills: ["React & Next.js", "Tailwind CSS", "TypeScript", "Responsive UI", "Web Performance"],
        projects: [
            { title: "Personal Brand Portfolio", subtitle: "High-performance site with smooth transitions" },
            { title: "Dynamic Product Engine", subtitle: "E-commerce interface with real-time updates" },
        ],
        careers: ["Frontend Engineer", "UI Developer", "React Specialist"],
    },
    fullstack: {
        name: "Full-Stack Web Development",
        oneLiner: "Engineer complete, scalable products from database to browser.",
        whatYoullLearn:
            "Design, build, and deploy entire web systems. You'll learn how to architecturalize backends, manage databases, and create seamless frontend experiences.",
        skills: ["Next.js & Node.js", "PostgreSQL", "Auth Systems", "Server Actions", "API Design"],
        projects: [
            { title: "SaaS Workflow Manager", subtitle: "Complete CRUD with auth and real-time data" },
            { title: "Social Learning Engine", subtitle: "Complex state and relational database logic" },
        ],
        careers: ["Full-Stack Engineer", "Product Engineer", "Startup Developer"],
    },
    cybersecurity: {
        name: "Cybersecurity & Security Engineering",
        oneLiner: "Protect digital infrastructure and defend systems against vulnerabilities.",
        whatYoullLearn:
            "Dive into network security, web application testing, and digital forensics. You'll learn to secure systems and think from a defensive and offensive engineering perspective.",
        skills: ["Network Security", "Ethical Hacking", "Linux Systems", "Python Scripting", "Pentesting"],
        projects: [
            { title: "Security Lab Environment", subtitle: "Virtual infrastructure for threat modeling" },
            { title: "Vulnerability Audit Report", subtitle: "Professional pentest on a target app" },
        ],
        careers: ["Security Analyst", "Penetration Tester", "SOC Engineer"],
    },
    datascience: {
        name: "Data Science & AI Engineering",
        oneLiner: "Analyze complex datasets and build intelligent, data-driven systems.",
        whatYoullLearn:
            "Master data analysis, statistical modeling, and machine learning. You'll learn to build predictive models and integrate AI into modern software solutions.",
        skills: ["Python (Pandas/NumPy)", "SQL & Data Modeling", "Machine Learning", "AI API Integration", "Visualization"],
        projects: [
            { title: "Predictive Market Analyzer", subtitle: "ML model applied to real-world trends" },
            { title: "Intelligent Assistant Hub", subtitle: "LLM-powered automation tool" },
        ],
        careers: ["Data Scientist", "ML Engineer", "Data Analyst"],
    },
};

// ─── Interest Signals (Step 4) ───

export const INTEREST_SIGNALS: InterestSignal[] = [
    {
        id: "visual-building",
        statement: "I enjoy building things people can see and interact with.",
        pathWeights: { frontend: 1.0, fullstack: 0.8, cybersecurity: 0.0, datascience: 0.2 },
    },
    {
        id: "puzzles-weaknesses",
        statement: "I'm drawn to finding hidden flaws in systems.",
        pathWeights: { frontend: 0.0, fullstack: 0.3, cybersecurity: 1.0, datascience: 0.2 },
    },
    {
        id: "numbers-data",
        statement: "I enjoy working with data, patterns, and numbers.",
        pathWeights: { frontend: 0.0, fullstack: 0.2, cybersecurity: 0.2, datascience: 1.0 },
    },
    {
        id: "logic-systems",
        statement: "I like understanding how things work under the hood.",
        pathWeights: { frontend: 0.2, fullstack: 0.9, cybersecurity: 0.7, datascience: 0.4 },
    },
];

// ─── Confidence Statements (Step 5) ───

export const CONFIDENCE_STATEMENTS = [
    { key: "git", statement: "Using Git (version control)" },
    { key: "api", statement: "What an API is and how it works" },
    { key: "program", statement: "Writing basic code in any language" },
    { key: "project", statement: "Building and shipping any project" },
] as const;

// ─── Velocity Mapping ───

export const VELOCITY_MAP: Record<WeeklyHours, LearningVelocity> = {
    "0-3": "slow",
    "4-7": "normal",
    "8-12": "fast",
    "13+": "fast",
};

export const MILESTONE_WEEKS: Record<WeeklyHours, number> = {
    "0-3": 24,
    "4-7": 16,
    "8-12": 10,
    "13+": 6,
};

// ─── Match Score Labels ───

export const MATCH_LABELS: Array<{ min: number; max: number; label: string; color: string }> = [
    { min: 0, max: 34, label: "Weak signal", color: "destructive" },
    { min: 35, max: 54, label: "Possible fit", color: "warning" },
    { min: 55, max: 74, label: "Good match", color: "warning" },
    { min: 75, max: 89, label: "Strong match", color: "success" },
    { min: 90, max: 100, label: "Exceptional fit", color: "success" },
];

export function getMatchLabel(score: number): { label: string; color: string } {
    const entry = MATCH_LABELS.find((e) => score >= e.min && score <= e.max);
    return entry ?? { label: "Unknown", color: "muted" };
}

