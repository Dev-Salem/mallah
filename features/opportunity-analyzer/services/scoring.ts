import {
    APPLY_READY_SCORE,
    ExtractedCV,
    MAX_MATCH_SCORE,
    MatchScoreBreakdown,
    MissingSkillItem,
    MissingSkillRoadmapTopic,
    PREFERRED_SKILL_WEIGHT,
    PROJECT_WEIGHT,
    REQUIRED_SKILL_WEIGHT,
    SkillMatchInfo,
} from '../types';

type MallahSkill = {
    level?: string | null;
    source?: string | null;
    skills?: {
        name?: string | null;
        category?: string | null;
    } | null;
};

type LearnerProject = {
    project_id?: string;
    project_name?: string | null;
    project_description?: string | null;
    tech_stack?: string[] | null;
    projects?: {
        title?: string | null;
        description?: string | null;
        source_type?: string | null;
        project_skills?: Array<{
            skills?: {
                name?: string | null;
                category?: string | null;
            } | null;
        }> | null;
    } | Array<{
        title?: string | null;
        description?: string | null;
        source_type?: string | null;
        project_skills?: Array<{
            skills?: {
                name?: string | null;
                category?: string | null;
            } | null;
        }> | null;
    }> | null;
};

type InProgressTopic = {
    status?: string | null;
    topics?: {
        title?: string | null;
        topic_skills?: Array<{
            skills?: {
                name?: string | null;
                category?: string | null;
            } | null;
        }> | null;
    } | Array<{
        title?: string | null;
        topic_skills?: Array<{
            skills?: {
                name?: string | null;
                category?: string | null;
            } | null;
        }> | null;
    }> | null;
};

type RolePath = 'frontend' | 'fullstack' | 'cybersecurity' | 'datascience' | 'unknown';

type RoadmapTopicCandidate = {
    topic_id: string;
    topic_title: string;
    stage_title: string;
    stage_order_index: number;
    linked_skills: string[];
};

type SkillMatchOutcome = {
    score: 0 | 0.5 | 1;
    info?: SkillMatchInfo;
};

const SCORE_LABELS = [
    { max: 34, label: 'Not Ready Yet', colorClass: 'text-red-500', barClass: 'bg-red-500' },
    { max: 54, label: 'Early Stage', colorClass: 'text-amber-500', barClass: 'bg-amber-500' },
    { max: 74, label: 'Getting Close', colorClass: 'text-yellow-500', barClass: 'bg-yellow-500' },
    { max: 89, label: 'Strong Candidate', colorClass: 'text-green-500', barClass: 'bg-green-500' },
    { max: MAX_MATCH_SCORE, label: 'Excellent Match', colorClass: 'text-emerald-500', barClass: 'bg-emerald-500' },
] as const;

const LEVEL_ORDER: Record<string, number> = {
    beginner: 1,
    junior: 1,
    foundational: 1,
    intermediate: 2,
    mid: 2,
    advanced: 3,
    senior: 3,
    expert: 3,
};

const SKILL_ALIASES: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'node.js': 'nodejs',
    'node js': 'nodejs',
    'react.js': 'react',
    'react js': 'react',
    'next.js': 'nextjs',
    'next js': 'nextjs',
    'vue.js': 'vue',
    'vue js': 'vue',
    'nuxt.js': 'nuxtjs',
    'nuxt js': 'nuxtjs',
    'postgres': 'postgresql',
    'postgre sql': 'postgresql',
    'restful api': 'rest api',
    'restful apis': 'rest api',
    'apis': 'api',
    'ui/ux': 'ui ux',
    'machine learning': 'ml',
};

const RELATED_SKILLS: Record<string, string[]> = {
    react: ['nextjs'],
    nextjs: ['react'],
    postgresql: ['mysql'],
    mysql: ['postgresql'],
    graphql: ['rest api'],
    'rest api': ['graphql'],
};

const ROLE_KEYWORDS: Record<RolePath, string[]> = {
    frontend: ['frontend', 'front end', 'ui developer', 'web developer', 'react developer', 'javascript developer'],
    fullstack: ['full stack', 'fullstack', 'backend developer', 'back end developer', 'software engineer', 'node.js developer', 'node developer'],
    cybersecurity: ['soc analyst', 'penetration tester', 'security analyst', 'it security', 'cybersecurity', 'information security', 'red team', 'blue team'],
    datascience: ['data analyst', 'data scientist', 'bi analyst', 'business intelligence', 'python developer', 'ml engineer', 'machine learning'],
    unknown: [],
};

const CREDENTIAL_PATTERNS = [
    /\bbachelor'?s?\b/,
    /\bmaster'?s?\b/,
    /\bphd\b/,
    /\bdegree\b/,
    /\bcertification\b/,
    /\bcertificate\b/,
    /\bdiploma\b/,
    /\blicen[cs]e\b/,
    /\bbootcamp\b/,
] as const;

function normalizeText(value: string | null | undefined): string {
    let normalized = (value ?? '').toLowerCase().trim();

    for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
        normalized = normalized.replaceAll(alias, canonical);
    }

    return normalized
        .replace(/[()]/g, ' ')
        .replace(/[_-]/g, ' ')
        .replace(/[^\w\s+/.&]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function isCredentialRequirement(value: string): boolean {
    const normalized = normalizeText(value);
    return CREDENTIAL_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function sanitizeExtractedSkills(skills: string[]): string[] {
    const deduped = new Map<string, string>();

    for (const skill of skills) {
        if (isCredentialRequirement(skill)) continue;
        const normalized = normalizeText(skill);
        if (!normalized) continue;
        if (!deduped.has(normalized)) deduped.set(normalized, skill.trim());
    }

    return Array.from(deduped.values());
}

function getLevelRank(level?: string | null): number {
    if (!level) return 0;
    return LEVEL_ORDER[normalizeText(level)] ?? 0;
}

function extractRequiredLevel(skill: string): string | undefined {
    const normalized = normalizeText(skill);
    if (normalized.includes('advanced') || normalized.includes('senior') || normalized.includes('expert')) return 'advanced';
    if (normalized.includes('intermediate') || normalized.includes('mid')) return 'intermediate';
    if (normalized.includes('beginner') || normalized.includes('junior') || normalized.includes('foundational')) return 'beginner';
    return undefined;
}

function splitRequirementParts(skill: string): string[] {
    const normalized = normalizeText(skill);
    const parts = normalized
        .split(/\s*(?:\+|\/|&|,| and )\s*/g)
        .map((part) => part.trim())
        .filter(Boolean);

    return parts.length > 1 ? parts : [normalized];
}

function stringsOverlap(a: string, b: string): boolean {
    return a === b || a.includes(b) || b.includes(a);
}

function isRelatedSkill(requiredSkill: string, candidateSkill: string): boolean {
    const normalizedRequired = normalizeText(requiredSkill);
    const normalizedCandidate = normalizeText(candidateSkill);

    if (stringsOverlap(normalizedRequired, normalizedCandidate)) return true;

    const related = RELATED_SKILLS[normalizedRequired] ?? [];
    return related.includes(normalizedCandidate);
}

function isSubsetSkill(requiredSkill: string, candidateSkill: string): boolean {
    const requiredParts = splitRequirementParts(requiredSkill);
    const normalizedCandidate = normalizeText(candidateSkill);

    return requiredParts.length > 1 && requiredParts.some((part) => stringsOverlap(part, normalizedCandidate));
}

function partialCompositeCoverage(parts: string[], candidates: string[]): number {
    if (parts.length <= 1) return 0;

    const matchedParts = parts.filter((part) => candidates.some((candidate) => stringsOverlap(part, normalizeText(candidate))));
    if (matchedParts.length === parts.length) return 1;
    if (matchedParts.length > 0) return 0.5;
    return 0;
}

function uniqueByRequirement(items: SkillMatchInfo[]): SkillMatchInfo[] {
    const seen = new Set<string>();
    const output: SkillMatchInfo[] = [];

    for (const item of items) {
        const key = `${item.requirement_type}:${normalizeText(item.matched_requirement)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        output.push(item);
    }

    return output;
}

function detectPath(pathId?: string | null): RolePath {
    const normalized = normalizeText(pathId || '');
    if (normalized.includes('front')) return 'frontend';
    if (normalized.includes('full')) return 'fullstack';
    if (normalized.includes('cyber')) return 'cybersecurity';
    if (normalized.includes('data')) return 'datascience';
    return 'unknown';
}

function hasRelevantRole(previousRoles: string[], pathId?: string | null): boolean {
    const path = detectPath(pathId);
    const keywords = ROLE_KEYWORDS[path];
    if (keywords.length === 0) return false;

    return previousRoles.some((role) => {
        const normalizedRole = normalizeText(role);
        return keywords.some((keyword) => normalizedRole.includes(keyword));
    });
}

function getExperienceBonus(experienceYears: number, previousRoles: string[], pathId?: string | null): number {
    if (!hasRelevantRole(previousRoles, pathId)) return 0;
    if (experienceYears >= 3) return 22;
    if (experienceYears >= 2) return 18;
    if (experienceYears >= 1) return 13;
    return 8;
}

function buildProjectSkillList(project: LearnerProject): string[] {
    const projectMeta = Array.isArray(project.projects) ? project.projects[0] : project.projects;
    const linkedSkills = (projectMeta?.project_skills ?? [])
        .map((entry) => entry.skills?.name)
        .filter((name): name is string => Boolean(name));

    return [
        ...linkedSkills,
        ...(project.tech_stack ?? []),
    ];
}

export function getCoveredSkillsForProject(requiredSkills: string[], projectSkills: string[]): string[] {
    const normalizedProjectSkills = projectSkills.map((skill) => normalizeText(skill));
    const coveredSkills: string[] = [];

    for (const requiredSkill of requiredSkills) {
        const parts = splitRequirementParts(requiredSkill);
        const hasFullMatch = parts.every((part) =>
            normalizedProjectSkills.some((projectSkill) => stringsOverlap(part, projectSkill))
        );

        if (hasFullMatch) {
            coveredSkills.push(requiredSkill);
            continue;
        }

        const partialScore = partialCompositeCoverage(parts, normalizedProjectSkills);
        if (partialScore > 0 || normalizedProjectSkills.some((projectSkill) => isRelatedSkill(requiredSkill, projectSkill))) {
            coveredSkills.push(requiredSkill);
        }
    }

    return coveredSkills;
}

function countProjectCoverage(requiredSkills: string[], projectSkills: string[]): number {
    return getCoveredSkillsForProject(requiredSkills, projectSkills).length;
}

function evaluateRequirementMatch(
    skill: string,
    requirementType: 'required' | 'preferred',
    mallahSkills: MallahSkill[],
    cvData: ExtractedCV | null,
    inProgressTopics: InProgressTopic[]
): SkillMatchOutcome {
    const requiredLevel = extractRequiredLevel(skill);
    const requirementParts = splitRequirementParts(skill);

    const mallahCandidates = mallahSkills
        .filter((entry) => entry.skills?.name)
        .map((entry) => ({
            name: entry.skills?.name ?? skill,
            category: entry.skills?.category ?? undefined,
            level: entry.level ?? undefined,
            source: (entry.source ?? 'roadmap') as SkillMatchInfo['source'],
            is_verified: true,
        }));

    const cvCandidates = (cvData?.extracted_skills ?? []).map((entry) => ({
        name: entry.skill_name,
        level: entry.inferred_level,
        source: 'cv' as const,
        is_verified: false,
    }));

    const topicCandidates = inProgressTopics.flatMap((progress) =>
        ((Array.isArray(progress.topics) ? progress.topics[0] : progress.topics)?.topic_skills ?? [])
            .map((entry) => entry.skills?.name)
            .filter((name): name is string => Boolean(name))
            .map((name) => ({
                name,
                source: 'roadmap' as const,
                is_verified: false,
            }))
    );

    const exactCandidates = [...mallahCandidates, ...cvCandidates];
    const exactMatch = exactCandidates.find((candidate) =>
        requirementParts.every((part) => stringsOverlap(part, normalizeText(candidate.name)))
    );

    if (exactMatch) {
        const candidateLevelRank = getLevelRank(exactMatch.level);
        const requiredLevelRank = getLevelRank(requiredLevel);

        if (requiredLevelRank > 0 && candidateLevelRank > 0 && candidateLevelRank < requiredLevelRank) {
            return {
                score: 0.5,
                info: {
                    skill_name: exactMatch.name,
                    matched_requirement: skill,
                    requirement_type: requirementType,
                    source: exactMatch.source,
                    is_verified: exactMatch.is_verified,
                    current_level: exactMatch.level,
                    required_level: requiredLevel,
                    weight: 0.5,
                    match_reason: `You have ${exactMatch.name} (${exactMatch.level}) - this role needs ${requiredLevel}.`,
                },
            };
        }

        return {
            score: 1,
            info: {
                skill_name: exactMatch.name,
                matched_requirement: skill,
                requirement_type: requirementType,
                source: exactMatch.source,
                is_verified: exactMatch.is_verified,
                current_level: exactMatch.level,
                required_level: requiredLevel,
                weight: 1,
            },
        };
    }

    const compositePartial = exactCandidates.find((candidate) => partialCompositeCoverage(requirementParts, [candidate.name]) > 0);
    if (compositePartial) {
        return {
            score: 0.5,
            info: {
                skill_name: compositePartial.name,
                matched_requirement: skill,
                requirement_type: requirementType,
                source: compositePartial.source,
                is_verified: compositePartial.is_verified,
                current_level: compositePartial.level,
                required_level: requiredLevel,
                weight: 0.5,
                match_reason: `You have ${compositePartial.name} - this role also needs the rest of ${skill}.`,
            },
        };
    }

    const relatedMallah = mallahCandidates.find((candidate) => isRelatedSkill(skill, candidate.name));
    if (relatedMallah) {
        return {
            score: 0.5,
            info: {
                skill_name: relatedMallah.name,
                matched_requirement: skill,
                requirement_type: requirementType,
                source: relatedMallah.source,
                is_verified: true,
                current_level: relatedMallah.level,
                required_level: requiredLevel,
                weight: 0.5,
                match_reason: `You have ${relatedMallah.name} - this role requires ${skill}.`,
            },
        };
    }

    const inProgressMatch = topicCandidates.find((candidate) => isRelatedSkill(skill, candidate.name));
    if (inProgressMatch) {
        return {
            score: 0.5,
            info: {
                skill_name: inProgressMatch.name,
                matched_requirement: skill,
                requirement_type: requirementType,
                source: inProgressMatch.source,
                is_verified: false,
                required_level: requiredLevel,
                current_level: 'in progress',
                weight: 0.5,
                match_reason: `${inProgressMatch.name} topic in progress - finish it to fully match.`,
            },
        };
    }

    return { score: 0 };
}

export function calculateOpportunityScore(params: {
    requiredSkills: string[];
    preferredSkills: string[];
    mallahSkills: unknown[];
    completedProjects: unknown[];
    progress: unknown[];
    cvData: ExtractedCV | null;
    currentPathId?: string | null;
}): {
    score: number;
    breakdown: MatchScoreBreakdown;
    cvSkillsContributed: number;
    experienceBonus: number;
} {
    const { requiredSkills, preferredSkills, cvData, currentPathId } = params;
    const mallahSkills = (params.mallahSkills ?? []) as MallahSkill[];
    const completedProjects = (params.completedProjects ?? []) as LearnerProject[];
    const progress = (params.progress ?? []) as InProgressTopic[];

    const breakdown: MatchScoreBreakdown = {
        matched: [],
        partial: [],
        missing: { required: [], preferred: [] },
    };

    let requiredCoveragePoints = 0;
    let preferredCoveragePoints = 0;

    for (const skill of requiredSkills) {
        const outcome = evaluateRequirementMatch(skill, 'required', mallahSkills, cvData, progress);
        if (outcome.score === 1 && outcome.info) breakdown.matched.push(outcome.info);
        else if (outcome.score === 0.5 && outcome.info) breakdown.partial.push(outcome.info);
        else breakdown.missing.required.push({
            skill_name: skill,
            roadmap_topic: null,
            outside_current_path: false,
        });
        requiredCoveragePoints += outcome.score;
    }

    for (const skill of preferredSkills) {
        const outcome = evaluateRequirementMatch(skill, 'preferred', mallahSkills, cvData, progress);
        if (outcome.score === 1 && outcome.info) breakdown.matched.push(outcome.info);
        else if (outcome.score === 0.5 && outcome.info) breakdown.partial.push(outcome.info);
        else breakdown.missing.preferred.push({
            skill_name: skill,
            roadmap_topic: null,
            outside_current_path: false,
        });
        preferredCoveragePoints += outcome.score;
    }

    breakdown.matched = uniqueByRequirement(breakdown.matched);
    breakdown.partial = uniqueByRequirement(
        breakdown.partial.filter((partial) =>
            !breakdown.matched.some((full) =>
                full.requirement_type === partial.requirement_type &&
                normalizeText(full.matched_requirement) === normalizeText(partial.matched_requirement)
            )
        )
    );

    const requiredCoverage = requiredSkills.length > 0 ? requiredCoveragePoints / requiredSkills.length : 0;
    const preferredCoverage = preferredSkills.length > 0 ? preferredCoveragePoints / preferredSkills.length : 0;

    const relevantLearnerProjects = completedProjects.filter((project) => {
        const coveredSkills = countProjectCoverage(requiredSkills, buildProjectSkillList(project));
        return coveredSkills >= 2;
    });

    const relevantCvProjects = (cvData?.extracted_projects ?? []).filter((project) => {
        const coveredSkills = countProjectCoverage(requiredSkills, project.skills);
        return coveredSkills >= 2;
    });

    const relevantProjectCount = relevantLearnerProjects.length + relevantCvProjects.length;
    const requiredSkillGroups = requiredSkills.length;
    const projectCoverageDenominator = Math.max(requiredSkillGroups, 3);
    const projectCoverage = Math.min(relevantProjectCount / projectCoverageDenominator, 1);

    const activeWeight =
        REQUIRED_SKILL_WEIGHT +
        PROJECT_WEIGHT +
        (preferredSkills.length > 0 ? PREFERRED_SKILL_WEIGHT : 0);

    const weightedBase =
        (requiredCoverage * REQUIRED_SKILL_WEIGHT) +
        (preferredSkills.length > 0 ? preferredCoverage * PREFERRED_SKILL_WEIGHT : 0) +
        (projectCoverage * PROJECT_WEIGHT);

    const normalizedBase = activeWeight > 0 ? (weightedBase / activeWeight) * 100 : 0;
    const experienceBonus = getExperienceBonus(
        cvData?.experience_years ?? 0,
        cvData?.previous_roles ?? [],
        currentPathId
    );
    const finalScore = Math.min(Math.round(normalizedBase + experienceBonus), MAX_MATCH_SCORE);

    const cvSkillsContributed = breakdown.matched.filter((entry) => entry.source === 'cv').length +
        breakdown.partial.filter((entry) => entry.source === 'cv').length;

    return {
        score: finalScore,
        breakdown,
        cvSkillsContributed,
        experienceBonus,
    };
}

export function getScoreLabel(score: number): string {
    return SCORE_LABELS.find((tier) => score <= tier.max)?.label ?? 'Excellent Match';
}

export function getScoreTextColor(score: number): string {
    return SCORE_LABELS.find((tier) => score <= tier.max)?.colorClass ?? 'text-emerald-500';
}

export function getScoreBarColor(score: number): string {
    return SCORE_LABELS.find((tier) => score <= tier.max)?.barClass ?? 'bg-emerald-500';
}

export function isApplyReady(score: number): boolean {
    return score >= APPLY_READY_SCORE;
}

export function findRoadmapTopicForSkill(
    skill: string,
    roadmapTopics: RoadmapTopicCandidate[]
): MissingSkillRoadmapTopic | null {
    const exactMatch = roadmapTopics.find((topic) =>
        topic.linked_skills.some((linkedSkill) => stringsOverlap(normalizeText(skill), normalizeText(linkedSkill)))
    );

    if (exactMatch) {
        return {
            topic_id: exactMatch.topic_id,
            topic_title: exactMatch.topic_title,
            stage_title: exactMatch.stage_title,
            stage_order_index: exactMatch.stage_order_index,
        };
    }

    const relatedMatch = roadmapTopics.find((topic) =>
        topic.linked_skills.some((linkedSkill) =>
            isRelatedSkill(skill, linkedSkill) || isSubsetSkill(skill, linkedSkill)
        )
    );

    if (!relatedMatch) return null;

    return {
        topic_id: relatedMatch.topic_id,
        topic_title: relatedMatch.topic_title,
        stage_title: relatedMatch.stage_title,
        stage_order_index: relatedMatch.stage_order_index,
    };
}

export function enrichMissingSkillsWithRoadmap(
    items: MissingSkillItem[],
    roadmapTopics: RoadmapTopicCandidate[]
): MissingSkillItem[] {
    return items.map((item) => {
        const topic = findRoadmapTopicForSkill(item.skill_name, roadmapTopics);
        return {
            ...item,
            roadmap_topic: topic,
            outside_current_path: !topic,
        };
    });
}
