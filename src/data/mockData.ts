import type {
  User,
  Project,
  BuildingCode,
  Standard,
  ProjectDesignInput,
  ComplianceCheck,
  ProjectSubmission,
  ReviewComment,
  FeedbackReport
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    created_at: '2024-02-20T10:00:00Z',
  },
];

// Mock Building Codes
export const mockBuildingCodes: BuildingCode[] = [
  {
    id: 'code-1',
    code_name: 'International Building Code (IBC)',
    jurisdiction: 'United States',
    version: '2021',
    category: 'Building',
    effective_date: '2021-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-2',
    code_name: 'National Fire Protection Association (NFPA) 101',
    jurisdiction: 'United States',
    version: '2021',
    category: 'Fire Safety',
    effective_date: '2021-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-3',
    code_name: 'International Residential Code (IRC)',
    jurisdiction: 'United States',
    version: '2021',
    category: 'Residential',
    effective_date: '2021-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
];

// Mock Standards
export const mockStandards: Standard[] = [
  {
    id: 'std-1',
    standard_name: 'ASTM E119 - Fire Tests of Building Construction',
    organization: 'American Society for Testing and Materials',
    version: '2020',
    description: 'Standard for fire resistance testing',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'std-2',
    standard_name: 'ASHRAE 90.1 - Energy Standard',
    organization: 'American Society of Heating, Refrigerating and Air-Conditioning Engineers',
    version: '2019',
    description: 'Energy efficiency standard for buildings',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'std-3',
    standard_name: 'ADA Standards for Accessible Design',
    organization: 'U.S. Department of Justice',
    version: '2010',
    description: 'Accessibility standards for buildings',
    created_at: '2023-01-01T00:00:00Z',
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    user_id: 'user-1',
    name: 'Downtown Office Building',
    description: 'New 10-story commercial office building in downtown area',
    status: 'completed',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T14:30:00Z',
  },
  {
    id: 'proj-2',
    user_id: 'user-1',
    name: 'Residential Complex Phase 2',
    description: 'Multi-family residential development with 150 units',
    status: 'processing',
    created_at: '2024-06-10T09:00:00Z',
    updated_at: '2024-06-12T16:45:00Z',
  },
  {
    id: 'proj-3',
    user_id: 'user-1',
    name: 'Shopping Center Renovation',
    description: 'Renovation and expansion of existing retail center',
    status: 'draft',
    created_at: '2024-12-01T11:00:00Z',
    updated_at: '2024-12-05T13:20:00Z',
  },
];

// Mock Project Design Inputs
export const mockProjectDesignInputs: ProjectDesignInput[] = [
  {
    id: 'input-1',
    project_id: 'proj-1',
    file_url: '/uploads/architectural-plans.pdf',
    file_type: 'pdf',
    title: 'Architectural Floor Plans',
    description: 'Complete architectural drawings for all floors',
    input_type: 'drawing',
    uploaded_at: '2024-03-02T10:00:00Z',
  },
  {
    id: 'input-2',
    project_id: 'proj-1',
    file_url: '/uploads/structural-specs.pdf',
    file_type: 'pdf',
    title: 'Structural Specifications',
    description: 'Structural engineering specifications',
    input_type: 'spec',
    uploaded_at: '2024-03-02T10:30:00Z',
  },
  {
    id: 'input-3',
    project_id: 'proj-2',
    file_url: '/uploads/site-plan.dwg',
    file_type: 'dwg',
    title: 'Site Plan',
    description: 'Overall site layout and grading plan',
    input_type: 'drawing',
    uploaded_at: '2024-06-11T09:00:00Z',
  },
];

// Mock Compliance Checks
export const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: 'check-1',
    project_id: 'proj-1',
    building_code_id: 'code-1',
    standard_id: 'std-1',
    check_type: 'code',
    requirement_text: 'Fire resistance rating for structural frame must be 2 hours minimum',
    status: 'pass',
    feedback: 'Structural frame meets required 2-hour fire resistance rating as per IBC Section 603.',
    severity: 'critical',
    suggested_fix: '',
    checked_at: '2024-03-05T10:00:00Z',
  },
  {
    id: 'check-2',
    project_id: 'proj-1',
    building_code_id: 'code-1',
    standard_id: 'std-3',
    check_type: 'standard',
    requirement_text: 'Accessible routes must have minimum 36-inch clear width',
    status: 'fail',
    feedback: 'Corridor width on 3rd floor measures 34 inches, below the required 36-inch minimum.',
    severity: 'critical',
    suggested_fix: 'Increase corridor width to minimum 36 inches. Adjust room layouts on 3rd floor accordingly.',
    checked_at: '2024-03-05T10:15:00Z',
  },
  {
    id: 'check-3',
    project_id: 'proj-1',
    building_code_id: 'code-2',
    standard_id: 'std-1',
    check_type: 'code',
    requirement_text: 'Exit discharge capacity must accommodate occupant load',
    status: 'pass',
    feedback: 'Exit discharge capacity is adequate for the calculated occupant load of 850 persons.',
    severity: 'critical',
    suggested_fix: '',
    checked_at: '2024-03-05T10:30:00Z',
  },
  {
    id: 'check-4',
    project_id: 'proj-1',
    building_code_id: 'code-1',
    standard_id: 'std-2',
    check_type: 'standard',
    requirement_text: 'Building envelope must meet energy efficiency requirements',
    status: 'warning',
    feedback: 'Window U-factor is 0.42, slightly above recommended 0.40 for optimal energy performance.',
    severity: 'minor',
    suggested_fix: 'Consider upgrading to windows with U-factor of 0.40 or lower to improve energy efficiency.',
    checked_at: '2024-03-05T10:45:00Z',
  },
  {
    id: 'check-5',
    project_id: 'proj-2',
    building_code_id: 'code-3',
    standard_id: 'std-3',
    check_type: 'code',
    requirement_text: 'Stairway width must be minimum 36 inches',
    status: 'pending',
    feedback: 'Awaiting detailed stairway dimensions from architectural drawings.',
    severity: 'major',
    suggested_fix: '',
    checked_at: '2024-06-12T09:00:00Z',
  },
  {
    id: 'check-6',
    project_id: 'proj-2',
    building_code_id: 'code-3',
    standard_id: 'std-1',
    check_type: 'code',
    requirement_text: 'Smoke alarms required in all sleeping rooms',
    status: 'pass',
    feedback: 'Smoke alarms are properly specified in all sleeping rooms per IRC Section R314.',
    severity: 'critical',
    suggested_fix: '',
    checked_at: '2024-06-12T09:15:00Z',
  },
];

// Mock Project Submissions
export const mockProjectSubmissions: ProjectSubmission[] = [
  {
    id: 'sub-1',
    project_id: 'proj-1',
    submission_number: 1,
    submitted_at: '2024-03-05T15:00:00Z',
    status: 'revision_required',
    notes: 'Initial submission - requires corridor width correction',
  },
  {
    id: 'sub-2',
    project_id: 'proj-1',
    submission_number: 2,
    submitted_at: '2024-03-12T10:00:00Z',
    status: 'approved',
    notes: 'All corrections implemented - approved for construction',
  },
];

// Mock Review Comments
export const mockReviewComments: ReviewComment[] = [
  {
    id: 'comment-1',
    project_submission_id: 'sub-1',
    comment_text: 'Corridor width on 3rd floor does not meet ADA requirements. Minimum 36 inches required.',
    comment_type: 'compliance',
    reviewer_id: 'reviewer-1',
    created_at: '2024-03-06T09:00:00Z',
    resolved_at: '2024-03-12T10:00:00Z',
    status: 'resolved',
  },
  {
    id: 'comment-2',
    project_submission_id: 'sub-1',
    comment_text: 'Consider upgrading window specifications for better energy performance.',
    comment_type: 'technical',
    reviewer_id: 'reviewer-1',
    created_at: '2024-03-06T09:15:00Z',
    resolved_at: '',
    status: 'acknowledged',
  },
];

// Mock Feedback Report
export const mockFeedbackReports: FeedbackReport[] = [
  {
    id: 'report-1',
    project_id: 'proj-1',
    overallStatus: 'non-compliant',
    complianceChecks: mockComplianceChecks.filter(c => c.project_id === 'proj-1'),
    summary: {
      totalChecks: 4,
      passed: 2,
      failed: 1,
      warnings: 1,
      pending: 0,
    },
    generatedAt: '2024-03-05T11:00:00Z',
  },
  {
    id: 'report-2',
    project_id: 'proj-2',
    overallStatus: 'needs-review',
    complianceChecks: mockComplianceChecks.filter(c => c.project_id === 'proj-2'),
    summary: {
      totalChecks: 2,
      passed: 1,
      failed: 0,
      warnings: 0,
      pending: 1,
    },
    generatedAt: '2024-06-12T09:30:00Z',
  },
];

// Export current user for authentication
export const mockCurrentUser: User = mockUsers[0];
