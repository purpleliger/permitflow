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
    email: 'a.chen@urbanedge.ca',
    full_name: 'Angela Chen',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'm.okonkwo@structura.ca',
    full_name: 'Michael Okonkwo',
    created_at: '2024-02-20T10:00:00Z',
  },
];

// Ontario / GTA Building Codes
export const mockBuildingCodes: BuildingCode[] = [
  {
    id: 'code-obc',
    code_name: 'Ontario Building Code (OBC)',
    jurisdiction: 'Ontario, Canada',
    version: '2012 (updated 2022)',
    category: 'Building',
    effective_date: '2022-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-nbc',
    code_name: 'National Building Code of Canada (NBC)',
    jurisdiction: 'Federal, Canada',
    version: '2020',
    category: 'Building',
    effective_date: '2020-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-ofc',
    code_name: 'Ontario Fire Code (O. Reg. 213/07)',
    jurisdiction: 'Ontario, Canada',
    version: '2022',
    category: 'Fire Safety',
    effective_date: '2022-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-tor-zoning',
    code_name: 'City of Toronto Zoning Bylaw 569-2013',
    jurisdiction: 'City of Toronto, Ontario',
    version: '2013 (amended 2024)',
    category: 'Zoning',
    effective_date: '2013-05-09',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-tgs',
    code_name: 'Toronto Green Standard (TGS) v4',
    jurisdiction: 'City of Toronto, Ontario',
    version: '4.0',
    category: 'Environmental',
    effective_date: '2022-05-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-miss-zoning',
    code_name: 'City of Mississauga Zoning Bylaw 0225-2007',
    jurisdiction: 'City of Mississauga, Ontario',
    version: '2007 (amended 2023)',
    category: 'Zoning',
    effective_date: '2007-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'code-brampton-zoning',
    code_name: 'City of Brampton Zoning Bylaw 270-2004',
    jurisdiction: 'City of Brampton, Ontario',
    version: '2004 (amended 2023)',
    category: 'Zoning',
    effective_date: '2004-01-01',
    created_at: '2023-01-01T00:00:00Z',
  },
];

// Ontario Standards
export const mockStandards: Standard[] = [
  {
    id: 'std-aoda',
    standard_name: 'AODA — Design of Public Spaces Standard (O. Reg. 413/12)',
    organization: 'Government of Ontario',
    version: '2012',
    description: 'Accessibility standards for the built environment under the Accessibility for Ontarians with Disabilities Act',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'std-csab149',
    standard_name: 'CSA B149.1 — Natural Gas and Propane Installation Code',
    organization: 'CSA Group',
    version: '2020',
    description: 'Installation requirements for gas-fired equipment and piping systems',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'std-csaa651',
    standard_name: 'CSA A651 — Thermal Performance of Windows, Doors and Skylights',
    organization: 'CSA Group',
    version: '2019',
    description: 'Thermal performance standards for fenestration assemblies in Canadian climate zones',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'std-mnecb',
    standard_name: 'Model National Energy Code for Buildings (MNECB)',
    organization: 'National Research Council Canada',
    version: '2020',
    description: 'Energy efficiency requirements for commercial and institutional buildings',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'std-oea',
    standard_name: 'Ontario Environmental Protection Act (O. Reg. 419)',
    organization: 'Government of Ontario — MECP',
    version: '2005 (amended 2021)',
    description: 'Air quality and emission standards for development projects',
    created_at: '2023-01-01T00:00:00Z',
  },
];

// Mock Projects (GTA-specific)
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    user_id: 'user-1',
    name: 'King Street Mixed-Use Tower',
    description: '28-storey mixed-use development — retail podium with residential above, King West neighbourhood',
    municipality: 'City of Toronto',
    project_type: 'Mixed-Use',
    status: 'completed',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T14:30:00Z',
  },
  {
    id: 'proj-2',
    user_id: 'user-1',
    name: 'Mississauga Residential Complex — Phase 2',
    description: 'Multi-residential development, 180 units across 3 mid-rise buildings, Port Credit waterfront',
    municipality: 'City of Mississauga',
    project_type: 'Multi-Residential (Part 3)',
    status: 'processing',
    created_at: '2024-06-10T09:00:00Z',
    updated_at: '2024-06-12T16:45:00Z',
  },
  {
    id: 'proj-3',
    user_id: 'user-1',
    name: 'Brampton Distribution Centre',
    description: 'Industrial logistics facility, 320,000 sq ft, Highway 410 corridor',
    municipality: 'City of Brampton',
    project_type: 'Industrial',
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
    file_url: '/uploads/king-st-architectural-drawings.pdf',
    file_type: 'pdf',
    title: 'Architectural Floor Plans — All Levels',
    description: 'Full architectural drawings including podium retail, amenity floors, and residential tower',
    input_type: 'drawing',
    uploaded_at: '2024-03-02T10:00:00Z',
  },
  {
    id: 'input-2',
    project_id: 'proj-1',
    file_url: '/uploads/king-st-structural-specs.pdf',
    file_type: 'pdf',
    title: 'Structural Engineering Specifications',
    description: 'Structural system design — concrete core and post-tensioned slabs',
    input_type: 'spec',
    uploaded_at: '2024-03-02T10:30:00Z',
  },
  {
    id: 'input-3',
    project_id: 'proj-2',
    file_url: '/uploads/portcredit-site-plan.dwg',
    file_type: 'dwg',
    title: 'Site Plan — Port Credit Residential',
    description: 'Overall site layout, grading plan, landscape design',
    input_type: 'drawing',
    uploaded_at: '2024-06-11T09:00:00Z',
  },
];

// Mock Compliance Checks — Ontario/GTA specific
export const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: 'check-1',
    project_id: 'proj-1',
    building_code_id: 'code-obc',
    standard_id: 'std-aoda',
    check_type: 'code',
    requirement_text: 'OBC Div. B 3.4.4.3 — Fire separation between residential and commercial occupancies (Group C / Group E) must be minimum 2-hour fire-resistance-rated assembly',
    status: 'pass',
    feedback: 'Party wall assembly between retail podium and residential tower meets 2-hour FRR per OBC Div. B 3.4.4.3. Construction type confirmed as non-combustible.',
    severity: 'critical',
    suggested_fix: '',
    checked_at: '2024-03-05T10:00:00Z',
  },
  {
    id: 'check-2',
    project_id: 'proj-1',
    building_code_id: 'code-tor-zoning',
    standard_id: 'std-aoda',
    check_type: 'standard',
    requirement_text: 'AODA O. Reg. 413/12 s.80.25 — Accessible exterior paths of travel: minimum 1.5 m clear width, cross-slope ≤ 2%, rest areas every 30 m on inclines exceeding 1:20',
    status: 'fail',
    feedback: 'South pedestrian link between tower entrance and King Street has a cross-slope of 3.1% at grid line D4, exceeding the 2% maximum permitted under AODA Design of Public Spaces. Rest area not provided at 28 m mark on the 1:18 ramp.',
    severity: 'critical',
    suggested_fix: 'Revise grading at grid line D4 to achieve cross-slope ≤ 2%. Introduce a 1.8 m × 1.8 m level rest area at the 28 m point on the ramp per AODA s.80.25(3)(b).',
    checked_at: '2024-03-05T10:15:00Z',
  },
  {
    id: 'check-3',
    project_id: 'proj-1',
    building_code_id: 'code-ofc',
    standard_id: 'std-aoda',
    check_type: 'code',
    requirement_text: 'Ontario Fire Code Part 9.8 — Exit stairwell pressurization system required for buildings exceeding 18 storeys (Group C occupancy)',
    status: 'pass',
    feedback: 'Mechanical drawings confirm vestibule pressurization system on all 6 exit stairwells. System designed to maintain 25–80 Pa differential per OFC 9.8.3.3. Commissioning report included.',
    severity: 'critical',
    suggested_fix: '',
    checked_at: '2024-03-05T10:30:00Z',
  },
  {
    id: 'check-4',
    project_id: 'proj-1',
    building_code_id: 'code-tgs',
    standard_id: 'std-mnecb',
    check_type: 'standard',
    requirement_text: 'Toronto Green Standard v4 Tier 1 (mandatory) — Residential buildings ≥ 20 storeys: whole building energy use intensity (EUI) ≤ 110 kWh/m²/yr; suite electricity sub-metering required',
    status: 'warning',
    feedback: 'Energy model projects EUI of 118 kWh/m²/yr — 7.3% above TGS v4 Tier 1 mandatory threshold of 110 kWh/m²/yr. Suite electricity sub-metering is specified. Non-compliance with TGS Tier 1 will require a written variance request to City Planning prior to permit issuance.',
    severity: 'major',
    suggested_fix: 'Upgrade building envelope: increase wall insulation from RSI 4.4 to RSI 5.3, or install heat-recovery ventilation units (HRV) with ≥ 75% efficiency in all suites. Rerun energy model to confirm EUI ≤ 110.',
    checked_at: '2024-03-05T10:45:00Z',
  },
  {
    id: 'check-5',
    project_id: 'proj-2',
    building_code_id: 'code-obc',
    standard_id: 'std-aoda',
    check_type: 'code',
    requirement_text: 'OBC Div. B 9.8.4.1 — Stairway width in Part 3 multi-residential: minimum 1100 mm clear between handrails for floor area ≥ 600 m²',
    status: 'pending',
    feedback: 'Stairway dimensions on Buildings B and C not yet submitted. Buildings A stair width confirmed at 1200 mm clear. Awaiting revised drawings for remaining two buildings.',
    severity: 'major',
    suggested_fix: '',
    checked_at: '2024-06-12T09:00:00Z',
  },
  {
    id: 'check-6',
    project_id: 'proj-2',
    building_code_id: 'code-miss-zoning',
    standard_id: 'std-aoda',
    check_type: 'code',
    requirement_text: 'Mississauga Zoning Bylaw 0225-2007 — Waterfront Residential (WR) zone: minimum rear yard setback 7.5 m from the Regulatory Shoreline; building height not to exceed 14 storeys without site-specific amendment',
    status: 'pass',
    feedback: 'Site plan confirms 8.2 m rear yard setback from Regulatory Shoreline — compliant. Building heights are 10, 12, and 8 storeys respectively. No OPA/ZBA required.',
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
    notes: 'Submission 1 — AODA path of travel non-compliance and TGS energy model shortfall flagged by City Planning',
  },
  {
    id: 'sub-2',
    project_id: 'proj-1',
    submission_number: 2,
    submitted_at: '2024-03-12T10:00:00Z',
    status: 'approved',
    notes: 'Submission 2 — All deficiencies addressed. Building permit approved. Site plan agreement executed.',
  },
];

// Mock Review Comments
export const mockReviewComments: ReviewComment[] = [
  {
    id: 'comment-1',
    project_submission_id: 'sub-1',
    comment_text: 'Accessible path of travel on south pedestrian link does not comply with AODA O. Reg. 413/12. Cross-slope at grid D4 exceeds 2% maximum. Revise grading and resubmit.',
    comment_type: 'compliance',
    reviewer_id: 'reviewer-1',
    created_at: '2024-03-06T09:00:00Z',
    resolved_at: '2024-03-12T10:00:00Z',
    status: 'resolved',
  },
  {
    id: 'comment-2',
    project_submission_id: 'sub-1',
    comment_text: 'TGS v4 Tier 1 energy model exceeds permitted EUI. Variance request submitted and accepted with upgraded HRV specification.',
    comment_type: 'technical',
    reviewer_id: 'reviewer-1',
    created_at: '2024-03-06T09:15:00Z',
    resolved_at: '2024-03-11T14:00:00Z',
    status: 'resolved',
  },
];

// Mock Feedback Reports
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

export const mockCurrentUser: User = mockUsers[0];
