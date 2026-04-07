// A deterministic, rule-based ATS scorer as defined by the specification.
export interface ATSResult {
    score: number;
    breakdown: {
        keywordCoverage: number;
        sectionCompleteness: number;
        summaryQuality: number;
        projectDescriptions: number;
        formatting: number;
    };
    hints: { issue: string; description: string; sectionTarget: string }[];
}

export const PATH_BASELINES: Record<string, string[]> = {
    'frontend': ['html', 'css', 'javascript', 'react', 'typescript', 'git', 'rest api', 'responsive design', 'tailwind', 'next.js'],
    'fullstack': ['node.js', 'express', 'postgresql', 'rest api', 'react', 'docker', 'jwt', 'ci/cd', 'typescript', 'redis'],
    'cybersecurity': ['penetration testing', 'network security', 'owasp', 'burp suite', 'linux', 'python', 'vulnerability assessment', 'wireshark', 'metasploit'],
    'datascience': ['python', 'pandas', 'numpy', 'machine learning', 'scikit-learn', 'sql', 'data analysis', 'visualization', 'tensorflow'],
};

const ACTION_VERBS = [
    'built', 'developed', 'designed', 'implemented', 'created', 'deployed', 
    'optimized', 'reduced', 'increased', 'led', 'integrated', 'architected', 
    'automated', 'migrated', 'refactored', 'launched', 'delivered', 'engineered', 
    'configured', 'established'
];

export function calculateATSScore(resumeSections: any[], targetKeywords: string[]): ATSResult {
    let score = 0;
    const hints: ATSResult['hints'] = [];
    const breakdown = {
        keywordCoverage: 0,
        sectionCompleteness: 0,
        summaryQuality: 0,
        projectDescriptions: 0,
        formatting: 100 // Pattern 5 compliance
    };

    const summarySection = resumeSections.find(s => s.section_type === 'SUMMARY');
    const summaryText = summarySection?.content?.text || '';
    
    const projectsSection = resumeSections.find(s => s.section_type === 'PROJECTS');
    const projectsList = projectsSection?.content || [];
    const includedProjects = projectsList.filter((p: any) => p.included);

    const skillsSection = resumeSections.find(s => s.section_type === 'SKILLS');
    const manualSkills = skillsSection?.content?.manual_skills || [];
    const includedSkills = skillsSection?.content?.included_skill_ids || [];

    const expSection = resumeSections.find(s => s.section_type === 'EXPERIENCE');
    const expList = expSection?.content || [];

    const eduSection = resumeSections.find(s => s.section_type === 'EDUCATION');
    const eduList = eduSection?.content || [];

    // --- Factor 2: Summary Quality (20%) ---
    let summaryPoints = 0;
    const summaryWords = summaryText.trim().split(/\s+/).length;
    
    if (summaryWords >= 30 && summaryWords <= 80) {
        summaryPoints += 25;
    } else if (summaryText.length > 0) {
        hints.push({ issue: "Length fix", description: "Summary should be 30-80 words.", sectionTarget: "Summary" });
    } else {
        hints.push({ issue: "Add a Summary", description: "A summary is crucial for ATS systems.", sectionTarget: "Summary" });
    }

    const firstWord = summaryText.split(/\s+/)[0]?.toLowerCase();
    const hasRoleTitle = /(developer|engineer|designer|manager|analyst)/i.test(firstWord || "");
    if (ACTION_VERBS.includes(firstWord) || hasRoleTitle) {
        summaryPoints += 25;
    } else if (summaryText.length > 0) {
        hints.push({ issue: "Summary start", description: "Start summary with role title or action verb.", sectionTarget: "Summary" });
    }

    if (/\d+%|\d+ [a-z]+|\$\d+/i.test(summaryText)) {
        summaryPoints += 30;
    } else if (summaryText.length > 0) {
        hints.push({ issue: "Measurable result", description: "Add a number or % to your summary.", sectionTarget: "Summary" });
    }

    let hasTargetKwInSummary = false;
    for (const kw of targetKeywords) {
        if (summaryText.toLowerCase().includes(kw.toLowerCase())) {
            hasTargetKwInSummary = true;
            break;
        }
    }
    if (hasTargetKwInSummary) summaryPoints += 20;

    breakdown.summaryQuality = summaryPoints;
    score += (summaryPoints / 100) * 20;


    // --- Factor 3: Project Descriptions (15%) ---
    let projTotalPoints = 0;
    if (includedProjects.length === 0) {
        hints.push({ issue: "Include Projects", description: "Add a project to demonstrate experience.", sectionTarget: "Projects" });
    } else {
        for (const proj of includedProjects) {
            let pPoints = 0;
            const bullets = proj.bullets || [];
            if (bullets.length > 0) {
                const firstBulletFirstWord = bullets[0].split(/\s+/)[0]?.toLowerCase();
                if (ACTION_VERBS.includes(firstBulletFirstWord)) pPoints += 30;
                
                let hasMetric = false;
                for (const b of bullets) {
                    if (/\d+%|\d+ [a-z]+|\$\d+/i.test(b)) hasMetric = true;
                }
                if (hasMetric) pPoints += 40;

                const validBullets = bullets.filter((b: string) => b.split(/\s+/).length >= 8);
                if (validBullets.length >= 2) pPoints += 30;
            } else if (proj.description && proj.description.length > 10) {
                // simple fallback if string instead of bullets
                pPoints += 40;
                hints.push({ issue: "Project bullets", description: "Convert project description to bullet points.", sectionTarget: "Projects" });
            }
            projTotalPoints += pPoints;
        }
        breakdown.projectDescriptions = Math.floor(projTotalPoints / includedProjects.length);
        score += (breakdown.projectDescriptions / 100) * 15;
    }


    // --- Factor 4: Section Completeness (20%) ---
    let compPoints = 0;
    if (summaryWords >= 10) compPoints += 30;
    if ((includedSkills.length + manualSkills.length) >= 3) compPoints += 25;
    else hints.push({ issue: "Add more skills", description: "Add at least 3 skills.", sectionTarget: "Skills" });

    if (includedProjects.some((p: any) => p.bullets?.length > 0 || p.description?.length > 0)) compPoints += 20;
    if (expList.length > 0) compPoints += 15;
    if (eduList.length > 0) compPoints += 10;
    
    breakdown.sectionCompleteness = compPoints;
    score += (compPoints / 100) * 20;


    // --- Factor 5: Formatting Compliance (10%) ---
    score += 10; 

    // --- Factor 1: Keyword Coverage (35%) ---
    const fullResumeText = JSON.stringify(resumeSections).toLowerCase();
    if (targetKeywords.length > 0) {
        let matchedKeywords = 0;
        targetKeywords.forEach(kw => {
            const kwLower = kw.toLowerCase();
            if (fullResumeText.includes(kwLower)) {
                // placement bonus
                const placementMultiplier = (summaryText.toLowerCase().includes(kwLower) || JSON.stringify(skillsSection).toLowerCase().includes(kwLower)) ? 1.2 : 1.0;
                matchedKeywords += (1 * placementMultiplier); // simplify: strict match is full credit * multiplier
            }
        });
        const keywordScore = Math.min(Math.floor((matchedKeywords / targetKeywords.length) * 100), 100);
        breakdown.keywordCoverage = keywordScore;
        score += (keywordScore / 100) * 35;
    } else {
        breakdown.keywordCoverage = 100;
        score += 35;
    }

    return {
        score: Math.min(Math.floor(score), 100),
        breakdown,
        hints: hints.slice(0, 4) // max 4 hints
    };
}
