-- ============================================================
--  PermitFlow — Supabase / PostgreSQL Application Schema
--  Target: Supabase (PostgreSQL 15+)
--
--  Usage:
--    1. Create a new Supabase project
--    2. Paste this into the SQL Editor and run
--    3. Enable Supabase Auth (email + password)
--    4. Configure Supabase Storage bucket "project-documents"
--       with RLS enabled (see storage policies below)
--
--  Multi-tenancy model:
--    Every row is scoped to an organization. Row-Level Security
--    (RLS) ensures users only see their own organization's data.
-- ============================================================

-- ── Extensions ────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";  -- for full-text search on project names

-- ── Enums ─────────────────────────────────────────────────
create type project_status as enum (
  'draft',
  'processing',
  'under_review',
  'completed',
  'archived'
);

create type compliance_status as enum (
  'pass',
  'fail',
  'warning',
  'pending'
);

create type compliance_severity as enum (
  'critical',
  'major',
  'minor',
  'info'
);

create type submission_status as enum (
  'pending',
  'approved',
  'rejected',
  'revision_required'
);

create type comment_status as enum (
  'open',
  'resolved',
  'acknowledged'
);

create type comment_type as enum (
  'general',
  'technical',
  'compliance'
);

create type document_file_type as enum (
  'pdf',
  'dwg',
  'dxf',
  'docx',
  'image',
  'text'
);

create type document_input_type as enum (
  'code',
  'standard',
  'spec',
  'drawing',
  'site_plan',
  'energy_model',
  'other'
);

create type org_member_role as enum (
  'owner',
  'admin',
  'member',
  'viewer'
);

-- ── Organizations ──────────────────────────────────────────
create table organizations (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text unique not null,          -- URL-safe identifier
  plan          text not null default 'starter' check (plan in ('starter','professional','studio','enterprise')),
  projects_used integer not null default 0,
  projects_limit integer not null default 2,   -- varies by plan
  billing_email text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Organization Members ───────────────────────────────────
-- Links Supabase auth.users to organizations
create table organization_members (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  role            org_member_role not null default 'member',
  full_name       text,
  joined_at       timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index idx_org_members_user on organization_members(user_id);
create index idx_org_members_org  on organization_members(organization_id);

-- ── Building Codes ─────────────────────────────────────────
-- Maintained by PermitFlow; not organization-scoped
create table building_codes (
  id              uuid primary key default uuid_generate_v4(),
  code_name       text not null,
  jurisdiction    text not null,               -- e.g. "City of Toronto, Ontario"
  province        text not null default 'ON',
  municipality    text,                        -- null = province-wide or federal
  version         text not null,
  category        text not null,               -- Building, Fire Safety, Zoning, Environmental, etc.
  effective_date  date not null,
  expiry_date     date,                        -- null = currently in force
  source_url      text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_codes_jurisdiction on building_codes(jurisdiction);
create index idx_codes_municipality  on building_codes(municipality);

-- Seed: core Ontario/GTA codes
insert into building_codes (code_name, jurisdiction, province, municipality, version, category, effective_date) values
  ('Ontario Building Code (OBC)',                 'Ontario, Canada',              'ON', null,                  '2012/2022',             'Building',       '2022-01-01'),
  ('National Building Code of Canada (NBC)',      'Federal, Canada',              'ON', null,                  '2020',                  'Building',       '2020-01-01'),
  ('Ontario Fire Code (O. Reg. 213/07)',          'Ontario, Canada',              'ON', null,                  '2022',                  'Fire Safety',    '2022-01-01'),
  ('City of Toronto Zoning Bylaw 569-2013',       'City of Toronto, Ontario',     'ON', 'City of Toronto',     '2013 (amended 2024)',   'Zoning',         '2013-05-09'),
  ('Toronto Green Standard v4',                   'City of Toronto, Ontario',     'ON', 'City of Toronto',     '4.0',                   'Environmental',  '2022-05-01'),
  ('City of Mississauga Zoning Bylaw 0225-2007',  'City of Mississauga, Ontario', 'ON', 'City of Mississauga', '2007 (amended 2023)',   'Zoning',         '2007-01-01'),
  ('City of Brampton Zoning Bylaw 270-2004',      'City of Brampton, Ontario',    'ON', 'City of Brampton',    '2004 (amended 2023)',   'Zoning',         '2004-01-01'),
  ('City of Markham Zoning Bylaw 177-96',         'City of Markham, Ontario',     'ON', 'City of Markham',     '1996 (amended 2023)',   'Zoning',         '1996-01-01'),
  ('City of Vaughan Zoning Bylaw 1-88',           'City of Vaughan, Ontario',     'ON', 'City of Vaughan',     '1988 (amended 2023)',   'Zoning',         '1988-01-01'),
  ('Town of Richmond Hill Zoning Bylaw 1275',     'Town of Richmond Hill, Ontario','ON','Town of Richmond Hill','2019 (amended 2023)',   'Zoning',         '2019-01-01'),
  ('Town of Oakville Zoning Bylaw 2014-014',      'Town of Oakville, Ontario',    'ON', 'Town of Oakville',    '2014 (amended 2023)',   'Zoning',         '2014-01-01'),
  ('City of Burlington Zoning Bylaw 2020',        'City of Burlington, Ontario',  'ON', 'City of Burlington',  '2020 (amended 2023)',   'Zoning',         '2020-01-01');

-- ── Standards ──────────────────────────────────────────────
create table standards (
  id              uuid primary key default uuid_generate_v4(),
  standard_name   text not null,
  organization    text not null,               -- CSA, ASHRAE, NRC, Government of Ontario, etc.
  version         text not null,
  description     text,
  applicable_to   text[],                      -- array of project types this applies to
  created_at      timestamptz not null default now()
);

insert into standards (standard_name, organization, version, description) values
  ('AODA — Design of Public Spaces Standard (O. Reg. 413/12)', 'Government of Ontario', '2012',
   'Accessibility standards for the built environment under the Accessibility for Ontarians with Disabilities Act'),
  ('CSA B149.1 — Natural Gas and Propane Installation Code', 'CSA Group', '2020',
   'Installation requirements for gas-fired equipment and piping systems'),
  ('CSA A651 — Thermal Performance of Windows, Doors and Skylights', 'CSA Group', '2019',
   'Thermal performance standards for fenestration assemblies in Canadian climate zones'),
  ('Model National Energy Code for Buildings (MNECB)', 'National Research Council Canada', '2020',
   'Energy efficiency requirements for commercial and institutional buildings'),
  ('Ontario Environmental Protection Act (O. Reg. 419)', 'Government of Ontario — MECP', '2021',
   'Air quality and emission standards for development projects'),
  ('CSA A23.3 — Design of Concrete Structures', 'CSA Group', '2019',
   'Design requirements for reinforced and prestressed concrete structures'),
  ('CSA S16 — Design of Steel Structures', 'CSA Group', '2019',
   'Design requirements for steel structural systems');

-- ── Projects ───────────────────────────────────────────────
create table projects (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  created_by      uuid not null references auth.users(id),
  name            text not null,
  description     text,
  municipality    text not null,
  project_type    text not null,
  address         text,
  postal_code     text,
  status          project_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_projects_org    on projects(organization_id);
create index idx_projects_status on projects(status);
create index idx_projects_name   on projects using gin(name gin_trgm_ops);

-- ── Project Documents ──────────────────────────────────────
-- Metadata only — actual files stored in Supabase Storage
create table project_documents (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references projects(id) on delete cascade,
  uploaded_by     uuid not null references auth.users(id),
  storage_path    text not null,               -- Supabase Storage path: "org-id/proj-id/filename"
  file_name       text not null,
  file_size_bytes bigint,
  file_type       document_file_type not null,
  input_type      document_input_type not null,
  title           text,
  description     text,
  uploaded_at     timestamptz not null default now()
);

create index idx_docs_project on project_documents(project_id);

-- ── Project Applicable Codes ───────────────────────────────
create table project_applicable_codes (
  project_id      uuid not null references projects(id) on delete cascade,
  code_id         uuid not null references building_codes(id),
  primary key (project_id, code_id)
);

-- ── Project Applicable Standards ──────────────────────────
create table project_applicable_standards (
  project_id      uuid not null references projects(id) on delete cascade,
  standard_id     uuid not null references standards(id),
  primary key (project_id, standard_id)
);

-- ── Compliance Checks ──────────────────────────────────────
create table compliance_checks (
  id                uuid primary key default uuid_generate_v4(),
  project_id        uuid not null references projects(id) on delete cascade,
  building_code_id  uuid references building_codes(id),
  standard_id       uuid references standards(id),
  check_type        text not null check (check_type in ('code','standard','both')),
  requirement_text  text not null,
  status            compliance_status not null default 'pending',
  feedback          text,
  severity          compliance_severity not null default 'info',
  suggested_fix     text,
  ai_model_used     text,                      -- e.g. "claude-sonnet-4-6"
  checked_at        timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

create index idx_checks_project on compliance_checks(project_id);
create index idx_checks_status  on compliance_checks(status);

-- ── Feedback Reports ───────────────────────────────────────
create table feedback_reports (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references projects(id) on delete cascade,
  overall_status  text not null check (overall_status in ('compliant','non-compliant','needs-review')),
  total_checks    integer not null default 0,
  passed          integer not null default 0,
  failed          integer not null default 0,
  warnings        integer not null default 0,
  pending         integer not null default 0,
  report_pdf_path text,                        -- Supabase Storage path for generated PDF
  generated_at    timestamptz not null default now()
);

create index idx_reports_project on feedback_reports(project_id);

-- ── Project Submissions ────────────────────────────────────
-- Tracks each formal government submission attempt
create table project_submissions (
  id                uuid primary key default uuid_generate_v4(),
  project_id        uuid not null references projects(id) on delete cascade,
  feedback_report_id uuid references feedback_reports(id),
  submission_number integer not null default 1,
  submitted_by      uuid references auth.users(id),
  submitted_at      timestamptz not null default now(),
  status            submission_status not null default 'pending',
  notes             text,
  government_ref    text                        -- permit number or tracking ID from city
);

create index idx_submissions_project on project_submissions(project_id);

-- ── Review Comments ────────────────────────────────────────
create table review_comments (
  id                    uuid primary key default uuid_generate_v4(),
  project_submission_id uuid not null references project_submissions(id) on delete cascade,
  compliance_check_id   uuid references compliance_checks(id),
  comment_text          text not null,
  comment_type          comment_type not null default 'general',
  reviewer_id           uuid references auth.users(id),   -- internal reviewer
  created_at            timestamptz not null default now(),
  resolved_at           timestamptz,
  status                comment_status not null default 'open'
);

create index idx_comments_submission on review_comments(project_submission_id);

-- ── updated_at triggers ────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated
  before update on organizations
  for each row execute function set_updated_at();

create trigger trg_projects_updated
  before update on projects
  for each row execute function set_updated_at();

create trigger trg_codes_updated
  before update on building_codes
  for each row execute function set_updated_at();

-- ── Row-Level Security ─────────────────────────────────────
alter table organizations          enable row level security;
alter table organization_members   enable row level security;
alter table projects               enable row level security;
alter table project_documents      enable row level security;
alter table project_applicable_codes     enable row level security;
alter table project_applicable_standards enable row level security;
alter table compliance_checks      enable row level security;
alter table feedback_reports       enable row level security;
alter table project_submissions    enable row level security;
alter table review_comments        enable row level security;
-- building_codes and standards are public read (no RLS needed for select)

-- Helper: is the current user a member of the given org?
create or replace function is_org_member(org_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id
      and user_id = auth.uid()
  );
$$;

-- Organizations: members can read; only owners/admins can update
create policy "org_select" on organizations
  for select using (is_org_member(id));

create policy "org_update" on organizations
  for update using (
    exists (
      select 1 from organization_members
      where organization_id = id
        and user_id = auth.uid()
        and role in ('owner','admin')
    )
  );

-- Org members: members see their org's roster
create policy "member_select" on organization_members
  for select using (is_org_member(organization_id));

create policy "member_insert" on organization_members
  for insert with check (
    exists (
      select 1 from organization_members
      where organization_id = organization_id
        and user_id = auth.uid()
        and role in ('owner','admin')
    )
  );

-- Projects: org members can read; members/admins can insert/update
create policy "project_select" on projects
  for select using (is_org_member(organization_id));

create policy "project_insert" on projects
  for insert with check (is_org_member(organization_id));

create policy "project_update" on projects
  for update using (is_org_member(organization_id));

-- Project documents: follow project access
create policy "doc_select" on project_documents
  for select using (
    exists (select 1 from projects p where p.id = project_id and is_org_member(p.organization_id))
  );

create policy "doc_insert" on project_documents
  for insert with check (
    exists (select 1 from projects p where p.id = project_id and is_org_member(p.organization_id))
  );

-- Compliance checks: follow project access
create policy "check_select" on compliance_checks
  for select using (
    exists (select 1 from projects p where p.id = project_id and is_org_member(p.organization_id))
  );

create policy "check_insert" on compliance_checks
  for insert with check (
    exists (select 1 from projects p where p.id = project_id and is_org_member(p.organization_id))
  );

-- Feedback reports: follow project access
create policy "report_select" on feedback_reports
  for select using (
    exists (select 1 from projects p where p.id = project_id and is_org_member(p.organization_id))
  );

-- Submissions: follow project access
create policy "submission_select" on project_submissions
  for select using (
    exists (select 1 from projects p where p.id = project_id and is_org_member(p.organization_id))
  );

-- Review comments: follow submission → project access
create policy "comment_select" on review_comments
  for select using (
    exists (
      select 1
      from project_submissions sub
      join projects p on p.id = sub.project_id
      where sub.id = project_submission_id
        and is_org_member(p.organization_id)
    )
  );

-- ── Supabase Storage bucket notes ─────────────────────────
-- Create bucket: "project-documents" (private, RLS enabled)
-- Path convention: {organization_id}/{project_id}/{document_id}/{filename}
--
-- Storage RLS policy (paste into Supabase Dashboard > Storage > Policies):
--
-- SELECT:
--   bucket_id = 'project-documents'
--   AND (storage.foldername(name))[1]::uuid IN (
--     SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
--   )
--
-- INSERT:
--   same as SELECT
--
-- DELETE:
--   bucket_id = 'project-documents'
--   AND (storage.foldername(name))[1]::uuid IN (
--     SELECT om.organization_id FROM organization_members om
--     WHERE om.user_id = auth.uid() AND om.role IN ('owner','admin','member')
--   )
