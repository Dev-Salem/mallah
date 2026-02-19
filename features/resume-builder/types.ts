
export type ResumeSectionType =
    | 'SUMMARY'
    | 'EXPERIENCE'
    | 'EDUCATION'
    | 'PROJECTS'
    | 'SKILLS'
    | 'CERTIFICATES'
    | 'ACTIVITIES'
    | 'CUSTOM';

export type Language = 'AR' | 'EN';

export interface Resume {
    id: string;
    user_id: string;
    title: string;
    language: Language;
    created_at: string;
    last_updated_at: string;
    ats_score: number | null;
    status?: string;
}

export interface ResumeSection {
    id: string;
    resume_id: string;
    section_type: ResumeSectionType;
    header: string | null;
    section_content: string; // JSON string or plain text depending on type
    sort_order: number;
}

export interface ResumeWithSections extends Resume {
    sections: ResumeSection[];
}

export interface ResumeFormValues {
    title: string;
    language: Language;
    sections: {
        type: ResumeSectionType;
        header?: string;
        content: any; // Can be string for summary or structured data for exp/edu
    }[];
}
