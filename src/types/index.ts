// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
}

// Project types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  municipality: string;
  project_type: string;
  status: 'draft' | 'processing' | 'completed' | 'under_review';
  created_at: string;
  updated_at: string;
}

// Building Code types
export interface BuildingCode {
  id: string;
  code_name: string;
  jurisdiction: string;
  version: string;
  category: string;
  effective_date: string;
  created_at: string;
}

// Standard types
export interface Standard {
  id: string;
  standard_name: string;
  organization: string;
  version: string;
  description: string;
  created_at: string;
}

// Project Design Input types
export interface ProjectDesignInput {
  id: string;
  project_id: string;
  file_url: string;
  file_type: 'text' | 'pdf' | 'dwg' | 'image';
  title: string;
  description: string;
  input_type: 'code' | 'standard' | 'spec' | 'drawing';
  uploaded_at: string;
}

// Compliance Check types
export interface ComplianceCheck {
  id: string;
  project_id: string;
  building_code_id: string;
  standard_id: string;
  check_type: 'code' | 'standard' | 'both';
  requirement_text: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  feedback: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  suggested_fix: string;
  checked_at: string;
}

// Project Submission types
export interface ProjectSubmission {
  id: string;
  project_id: string;
  submission_number: number;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_required';
  notes: string;
}

// Review Comment types
export interface ReviewComment {
  id: string;
  project_submission_id: string;
  comment_text: string;
  comment_type: 'general' | 'technical' | 'compliance';
  reviewer_id: string;
  created_at: string;
  resolved_at: string;
  status: 'open' | 'resolved' | 'acknowledged';
}

// Project Applicable Codes types
export interface ProjectApplicableCode {
  project_id: string;
  building_code_id: string;
}

// Project Applicable Standards types
export interface ProjectApplicableStandard {
  project_id: string;
  standard_id: string;
}

// Feedback Report types
export interface FeedbackReport {
  id: string;
  project_id: string;
  overallStatus: 'compliant' | 'non-compliant' | 'needs-review';
  complianceChecks: ComplianceCheck[];
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
    pending: number;
  };
  generatedAt: string;
}
