export type ApplicationStage = 
  | 'saved' 
  | 'applied' 
  | 'in_review' 
  | 'interviewing' 
  | 'offer' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface JobApplication {
  application_id: string;
  user_id: string;
  analysis_id?: string | null;
  company_name: string;
  role_title: string;
  location?: string | null;
  stage: ApplicationStage;
  date: string; // ISO date string
  posting_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationDTO {
  analysis_id?: string | null;
  company_name: string;
  role_title: string;
  location?: string | null;
  stage: ApplicationStage;
  date: string;
  posting_url?: string | null;
  notes?: string | null;
}

export interface UpdateApplicationDTO extends Partial<CreateApplicationDTO> {
  application_id: string;
}
