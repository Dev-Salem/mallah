import { OnboardingResponse, InterestVector, WorkstyleVector } from "../types";

export interface PathScorecard {
    frontend: number;
    fullstack: number;
    cybersecurity: number;
    datascience: number;
}

export function computePathScorecard(response: Partial<OnboardingResponse>): {
    scorecard: PathScorecard;
    top_signals: string[];
} {
    const scorecard: PathScorecard = {
        frontend: 0,
        fullstack: 0,
        cybersecurity: 0,
        datascience: 0,
    };

    const signals: string[] = [];

    // 1. Interest Vector Scoring
    if (response.interest_vector) {
        const iv = response.interest_vector;
        scorecard.frontend += iv.frontend * 10;
        scorecard.fullstack += iv.fullstack * 10;
        scorecard.cybersecurity += iv.cybersecurity * 10;
        scorecard.datascience += iv.datascience * 10;

        // Shared interests
        scorecard.fullstack += iv.debugging * 5;
        scorecard.cybersecurity += iv.debugging * 5;

        scorecard.fullstack += iv.experimenting * 5;
        scorecard.datascience += iv.experimenting * 5;

        if (iv.frontend > 0.7) signals.push("High interest in visual interfaces");
        if (iv.cybersecurity > 0.7) signals.push("Strong inclination towards security");
    }

    // 2. Workstyle Vector
    if (response.workstyle_vector) {
        const wv = response.workstyle_vector;
        switch (wv.choice) {
            case 'visual': scorecard.frontend += 20; break;
            case 'complete': scorecard.fullstack += 20; break;
            case 'secure': scorecard.cybersecurity += 20; break;
            case 'analyze': scorecard.datascience += 20; break;
        }

        if (wv.math_comfort === 'High') {
            scorecard.datascience += 15;
            signals.push("Strong mathematical foundation");
        } else if (wv.math_comfort === 'Low') {
            scorecard.frontend += 10;
        }
    }

    // 3. Goals
    if (response.primary_goal === 'Freelance') {
        scorecard.frontend += 5;
        signals.push("Goal aligned with market-ready freelance skills");
    } else if (response.primary_goal === 'OwnProject') {
        scorecard.fullstack += 10;
        signals.push("Entrepreneurial mindset favoring full-stack capability");
    }

    // 4. Readiness (Optional: affects path recommendation confidence)
    // For example, high readiness might favor more complex paths like cybersecurity or fullstack.
    if (response.readiness_level && response.readiness_level > 80) {
        scorecard.cybersecurity += 5;
        scorecard.fullstack += 5;
    }

    return { scorecard, top_signals: signals.slice(0, 3) };
}

export function deriveLearningVelocity(hours: string): 'slow' | 'normal' | 'fast' {
    switch (hours) {
        case '0-3': return 'slow';
        case '4-7': return 'normal';
        case '8-12':
        case '13+': return 'fast';
        default: return 'normal';
    }
}
