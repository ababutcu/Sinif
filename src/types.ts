export interface EducationYear {
  id: number;
  year: string;
  is_active: boolean;
}

export interface Class {
  id: number;
  name: string;
  education_year_id: number;
}

export interface Student {
  id: number;
  photo?: string;
  first_name: string;
  last_name: string;
  student_number: string;
  birth_date?: string;
  class_id: number;
  education_year_id: number;
  is_active: boolean;
  health_info?: string;
  parents_together?: boolean;
  is_bilsem: boolean;
  special_conditions?: string;
  created_at: string;
  mother_name?: string;
  mother_phone?: string;
  mother_email?: string;
  father_name?: string;
  father_phone?: string;
  father_email?: string;
}

export interface StudentDetail extends Student {
  mother_job?: string;
  mother_work_address?: string;
  mother_address?: string;
  mother_is_guardian?: boolean;
  father_job?: string;
  father_work_address?: string;
  father_address?: string;
  father_is_guardian?: boolean;
}

export interface Talent {
  id: number;
  student_id: number;
  talent_name: string;
}

export interface DevelopmentNote {
  id: number;
  student_id: number;
  note: string;
  date: string;
}

export interface EvaluationNote {
  id: number;
  student_id: number;
  note: string;
  date: string;
}

export interface Announcement {
  id: number;
  class_id: number;
  education_year_id: number;
  title: string;
  event_date: string | null;
  is_shared: boolean;
  shared_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface GuidancePlan {
  id: number;
  class_id: number;
  education_year_id: number;
  date: string;
  topic: string;
  description?: string;
  created_at: string;
}

export interface GuidanceEvent {
  id: number;
  plan_id: number;
  date: string;
  event_name: string;
  description?: string;
  file_path?: string;
  created_at: string;
}

export interface Guardian {
  id: number;
  student_id: number;
  name: string;
  phone?: string;
  email?: string;
  relationship?: string;
} 