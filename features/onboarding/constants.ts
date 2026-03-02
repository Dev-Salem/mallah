import type { InterestSignal, PathId, WeeklyHours, LearningVelocity } from "./types";

// ─── Path Content (Pre-defined, NOT AI-generated) ───

export const PATH_CONTENT: Record<
    PathId,
    {
        name: string;
        oneLiner: string;
        whatYoullLearn: string;
        skills: string[];
        projects: string[];
        careers: string[];
    }
> = {
    frontend: {
        name: "Frontend Development",
        oneLiner: "Build websites and web apps that real people use — from layout to interaction.",
        whatYoullLearn:
            "Design and build responsive, accessible interfaces using modern web technologies. By the end of this path you'll be able to build complete, deployable web applications and connect them to external APIs.",
        skills: [
            "HTML5 & Semantic Markup",
            "CSS3, Flexbox, Grid",
            "JavaScript (ES6+)",
            "TypeScript (basics)",
            "React",
            "Responsive Design",
            "Git & GitHub",
            "REST API consumption",
            "Web Performance & Accessibility basics",
        ],
        projects: [
            "Personal portfolio website",
            "Movie or product search app connected to a public API",
            "E-commerce product page with cart functionality",
        ],
        careers: [
            "Junior Frontend Developer",
            "UI Developer",
            "Frontend Engineer",
            "Freelance Web Developer",
        ],
    },
    fullstack: {
        name: "Full-Stack Web Development",
        oneLiner: "Build complete web products — front to back — entirely on your own.",
        whatYoullLearn:
            "Design and build both the user-facing side and the server-side logic of web applications. By the end of this path you'll be able to design, build, and deploy a full working product from scratch without depending on anyone else.",
        skills: [
            "HTML, CSS, JavaScript (ES6+)",
            "React (frontend)",
            "Node.js & Express (backend)",
            "REST API design and implementation",
            "PostgreSQL or MongoDB",
            "Authentication & Authorization (JWT)",
            "Git & GitHub",
            "Basic cloud deployment",
            "Docker basics",
        ],
        projects: [
            "Blog REST API with full CRUD operations",
            "Social app with user authentication and a live feed",
            "Deployed SaaS-style dashboard with real data",
        ],
        careers: [
            "Full-Stack Developer",
            "Web Application Developer",
            "Backend Developer",
            "Freelance Product Developer",
            "Startup Engineer",
        ],
    },
    cybersecurity: {
        name: "Cybersecurity & Ethical Hacking",
        oneLiner:
            "Find vulnerabilities in systems before the bad actors do — legally and professionally.",
        whatYoullLearn:
            "Understand how systems are attacked, practice identifying weaknesses in controlled environments, and build the skills needed to protect real infrastructure. By the end of this path you'll be able to conduct basic penetration tests and participate in real bug bounty programs.",
        skills: [
            "Networking fundamentals (TCP/IP, DNS, HTTP, firewalls)",
            "Linux command line",
            "Python or Bash scripting (basic automation)",
            "OWASP Top 10 web vulnerabilities",
            "Penetration testing methodology",
            "Tools: Nmap, Burp Suite, Metasploit, Wireshark, Kali Linux",
            "CTF (Capture The Flag) problem-solving",
            "Basic cryptography concepts",
        ],
        projects: [
            "Home hacking lab (virtual machines, Kali Linux, practice targets)",
            "Web application vulnerability report on a practice target",
            "First bug bounty or CTF submission on a public platform",
        ],
        careers: [
            "Junior Penetration Tester",
            "SOC Analyst",
            "Security Analyst",
            "Bug Bounty Hunter",
        ],
    },
    datascience: {
        name: "Data Science & Machine Learning",
        oneLiner: "Turn raw data into decisions — and build AI-powered products.",
        whatYoullLearn:
            "Work with real datasets, build and evaluate machine learning models, and eventually integrate AI APIs into working applications. By the end of this path you'll be able to analyze data, train basic models, and build simple AI-powered tools.",
        skills: [
            "Python (core language for the entire path)",
            "SQL (data querying and manipulation)",
            "pandas & NumPy (data handling)",
            "Matplotlib & Seaborn (visualization)",
            "Statistics & probability fundamentals",
            "Machine learning basics: regression, classification, clustering (scikit-learn)",
            "Model evaluation and validation",
            "Working with AI APIs (OpenAI, HuggingFace)",
            "Jupyter Notebooks",
        ],
        projects: [
            "Exploratory data analysis report on a real-world dataset",
            "Spam classifier or sentiment analysis model",
            "LLM-powered Q&A app built with an AI API",
        ],
        careers: [
            "Data Analyst",
            "Junior Data Scientist",
            "ML Engineer (entry level)",
            "AI Product Developer",
            "Business Intelligence Analyst",
        ],
    },
};

// ─── Interest Signals (Step 4) ───

export const INTEREST_SIGNALS: InterestSignal[] = [
    {
        id: "visual-building",
        statement: "I enjoy building things people can see and use.",
        pathWeights: { frontend: 3, fullstack: 1, cybersecurity: 0, datascience: 0 },
    },
    {
        id: "puzzles-weaknesses",
        statement: "I like solving puzzles and finding system weaknesses.",
        pathWeights: { frontend: 0, fullstack: 0, cybersecurity: 3, datascience: 1 },
    },
    {
        id: "numbers-data",
        statement: "I enjoy working with numbers, patterns, and data.",
        pathWeights: { frontend: 0, fullstack: 0, cybersecurity: 0, datascience: 3 },
    },
    {
        id: "logic-systems",
        statement: "I prefer building the logic and systems behind applications.",
        pathWeights: { frontend: 0, fullstack: 3, cybersecurity: 1, datascience: 0 },
    },
];

// ─── Confidence Statements (Step 5) ───

export const CONFIDENCE_STATEMENTS = [
    { key: "git", statement: "I have used Git before." },
    { key: "api", statement: "I understand what an API is." },
    { key: "program", statement: "I wrote a small program before." },
    { key: "project", statement: "I built any project (even a simple one)." },
] as const;

// ─── Velocity Mapping ───

export const VELOCITY_MAP: Record<WeeklyHours, LearningVelocity> = {
    "0-3": "slow",
    "4-7": "normal",
    "8-12": "fast",
    "13+": "fast",
};

// ─── Milestone Estimates (weeks to first milestone project) ───

export const MILESTONE_WEEKS: Record<WeeklyHours, number> = {
    "0-3": 10,
    "4-7": 6,
    "8-12": 4,
    "13+": 3,
};

// ─── Match Score Labels ───

export const MATCH_LABELS: Array<{ min: number; max: number; label: string }> = [
    { min: 0, max: 34, label: "Weak match" },
    { min: 35, max: 54, label: "Possible fit" },
    { min: 55, max: 74, label: "Good match" },
    { min: 75, max: 89, label: "Strong match" },
    { min: 90, max: 100, label: "Excellent match" },
];

export function getMatchLabel(score: number): string {
    const entry = MATCH_LABELS.find((e) => score >= e.min && score <= e.max);
    return entry?.label ?? "Unknown";
}
