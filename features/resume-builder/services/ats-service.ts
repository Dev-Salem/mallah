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
    'frontend': ['html', 'css', 'javascript', 'react', 'typescript', 'git', 'rest api', 'responsive design', 'tailwind'],
    'fullstack': ['node.js', 'express', 'postgresql', 'rest api', 'react', 'docker', 'jwt', 'ci/cd'],
    'cybersecurity': ['penetration testing', 'network security', 'owasp', 'burp suite', 'linux', 'python', 'vulnerability assessment'],
    'datascience': ['python', 'pandas', 'numpy', 'machine learning', 'scikit-learn', 'sql', 'data analysis', 'visualization'],
};

export function calculateATSScore(resumeSections: any[], targetKeywords: string[]): ATSResult {
    let score = 0;
    const hints: ATSResult['hints'] = [];
    const breakdown = {
        keywordCoverage: 0,
        sectionCompleteness: 0,
        summaryQuality: 0,
        projectDescriptions: 0,
        formatting: 100 // Formatting is fixed to 100% due to builder restrictions
    };

    // Extract text payload
    const summaryNode = resumeSections.find(s => s.section_type === 'SUMMARY');
    const summaryText = summaryNode?.content?.text || '';
    
    const projectsNode = resumeSections.find(s => s.section_type === 'PROJECTS');
    const projectsList = projectsNode?.content || [];
    const includedProjects = projectsList.filter((p: any) => p.included);

    const skillsNode = resumeSections.find(s => s.section_type === 'SKILLS');
    const manualSkills = skillsNode?.content?.manual_skills || [];
    
    // Evaluate summary
    const summaryWords = summaryText.trim().split(/\s+/).length;
    if (summaryWords === 0) {
        hints.push({ issue: "Add a Summary", description: "A summary is crucial for ATS systems.", sectionTarget: "Summary" });
    } else if (summaryWords < 20) {
        hints.push({ issue: "Summary too short", description: "Add 2-3 more sentences with action verbs.", sectionTarget: "Summary" });
    } else {
        breakdown.summaryQuality = 100;
        score += 15; // 15% weight
    }

    // Evaluate Completness
    let isComplete = true;
    if (summaryWords === 0) isComplete = false;
    if (!skillsNode || (skillsNode.content?.included_skill_ids?.length === 0 && manualSkills.length === 0)) {
        isComplete = false;
        hints.push({ issue: "No Skills", description: "Add at least one skill to pass basic scanning.", sectionTarget: "Skills" });
    }
    
    if (isComplete) {
        breakdown.sectionCompleteness = 100;
        score += 25; // 25% weight
    }

    // Format & Base
    score += 10; // Formatting is always 100% -> 10 points

    // Evaluate Keywords
    // Flatten all text from resume to search for keywords
    const fullResumeText = JSON.stringify(resumeSections).toLowerCase();
    
    if (targetKeywords.length > 0) {
        let matchedKeywords = 0;
        targetKeywords.forEach(kw => {
            if (fullResumeText.includes(kw.toLowerCase())) matchedKeywords++;
        });
        const keywordScore = Math.floor((matchedKeywords / targetKeywords.length) * 100);
        breakdown.keywordCoverage = keywordScore;
        score += Math.floor((keywordScore / 100) * 40); // 40% weight
    } else {
        breakdown.keywordCoverage = 100;
        score += 40;
    }

    // Evaluate Project Descriptions
    if (includedProjects.length > 0) {
        breakdown.projectDescriptions = 100;
        score += 10; // 10% weight
    } else {
        hints.push({ issue: "Include Projects", description: "Add a project to demonstrate experience.", sectionTarget: "Projects" });
    }

    return {
        score: Math.min(score, 100),
        breakdown,
        hints
    };
}
