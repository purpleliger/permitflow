-- ============================================================
--  PermitFlow — Approved Proposals Repository Schema
--  Target: PostgreSQL 15+ (Supabase, ApsaraDB RDS, or AWS RDS)
--
--  PURPOSE:
--    This schema stores the long-term "flywheel" asset:
--    metadata and patterns extracted from government-approved
--    project submissions. Over time this data trains the AI
--    to recommend optimizations that improve first-submission
--    approval rates.
--
--  STORAGE OPTIONS FOR DOCUMENT FILES:
--    Option A — AWS S3:
--      s3://<bucket>/proposals/{jurisdiction}/{year}/{proposal_id}/
--    Option B — Alibaba Cloud OSS (ApsaraDB environment):
--      oss://<bucket>/proposals/{jurisdiction}/{year}/{proposal_id}/
--    The `document_storage_url` columns store the full
--    object URL. Use presigned URLs for secure access.
--
--  This can live in the same Supabase project as the main
--  schema (separate schema = "repository") or a dedicated
--  analytics RDS instance for isolation and cost control.
--
--  Recommended: start in same Supabase DB under schema
--  "repository", migrate to dedicated RDS when data volume
--  justifies the operational overhead.
-- ============================================================

create schema if not exists repository;

-- ── Approved Proposals ─────────────────────────────────────
-- One row per government-approved project submission
create table repository.approved_proposals (
  id                  uuid primary key default gen_random_uuid(),

  -- Identification
  title               text not null,
  jurisdiction        text not null,           -- e.g. "City of Toronto"
  province            text not null default 'ON',
  municipality        text not null,
  project_type        text not null,           -- matches PermitFlow project_type enum values
  permit_number       text,                    -- government-issued permit number
  approval_date       date not null,

  -- Scale
  gross_floor_area_m2 numeric(12,2),
  num_storeys         integer,
  num_units           integer,                 -- for residential

  -- Submission performance
  submission_count    integer not null default 1,  -- how many attempts before approval
  first_submission_date date,
  days_to_approval    integer,                 -- calendar days from first submission to approval

  -- Applicant (anonymized or with consent)
  applicant_type      text,                    -- 'architecture_firm' | 'engineering_firm' | 'developer' | 'gc'
  applicant_anonymous boolean not null default true,

  -- Source
  source              text not null default 'permitflow', -- 'permitflow' | 'public_record' | 'partner'
  permitflow_project_id uuid,                  -- FK to main schema projects.id if originated here

  -- Metadata
  tags                text[],
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_ap_jurisdiction on repository.approved_proposals(jurisdiction);
create index idx_ap_project_type on repository.approved_proposals(project_type);
create index idx_ap_approval_date on repository.approved_proposals(approval_date);
create index idx_ap_municipality   on repository.approved_proposals(municipality);

-- ── Proposal Documents ─────────────────────────────────────
-- References to approved document packages (stored in S3/OSS)
create table repository.proposal_documents (
  id                  uuid primary key default gen_random_uuid(),
  proposal_id         uuid not null references repository.approved_proposals(id) on delete cascade,

  document_type       text not null,           -- 'architectural' | 'structural' | 'mechanical' | 'site_plan' | 'energy_model' | 'specifications'
  file_name           text not null,
  storage_url         text not null,           -- S3 or OSS object URL
  storage_bucket      text not null,
  storage_key         text not null,           -- object key for direct SDK access
  file_size_bytes     bigint,
  mime_type           text,

  -- Extracted content (after OCR/processing pipeline runs)
  extracted_text      text,                    -- raw OCR output
  extraction_status   text default 'pending' check (extraction_status in ('pending','processing','completed','failed')),
  extracted_at        timestamptz,

  uploaded_at         timestamptz not null default now()
);

create index idx_pd_proposal on repository.proposal_documents(proposal_id);
create index idx_pd_type     on repository.proposal_documents(document_type);

-- ── Code Requirement Patterns ──────────────────────────────
-- Patterns extracted from approved documents — what satisfied
-- specific code requirements looks like in practice
create table repository.code_requirement_patterns (
  id                  uuid primary key default gen_random_uuid(),
  proposal_id         uuid not null references repository.approved_proposals(id) on delete cascade,

  building_code_ref   text not null,           -- e.g. "OBC Div. B 3.4.4.3"
  requirement_summary text not null,
  how_satisfied       text not null,           -- the actual design solution used
  municipality        text not null,
  project_type        text not null,

  -- Embeddings for semantic search (populated by AI pipeline)
  -- Requires pgvector extension: create extension if not exists vector;
  -- embedding            vector(1536),

  extracted_at        timestamptz not null default now(),
  confidence          numeric(4,3) check (confidence between 0 and 1)  -- AI extraction confidence
);

create index idx_crp_proposal      on repository.code_requirement_patterns(proposal_id);
create index idx_crp_code_ref      on repository.code_requirement_patterns(building_code_ref);
create index idx_crp_municipality  on repository.code_requirement_patterns(municipality);
create index idx_crp_project_type  on repository.code_requirement_patterns(project_type);

-- ── Jurisdiction Insights ──────────────────────────────────
-- Aggregated stats per municipality + project type combination.
-- Refreshed by a nightly analytics job.
create table repository.jurisdiction_insights (
  id                      uuid primary key default gen_random_uuid(),
  municipality            text not null,
  project_type            text not null,
  snapshot_date           date not null,

  -- Approval stats
  total_proposals         integer not null default 0,
  first_submission_approved integer not null default 0,
  avg_submissions_to_approval numeric(4,2),
  avg_days_to_approval    numeric(7,1),
  p50_days_to_approval    numeric(7,1),
  p90_days_to_approval    numeric(7,1),

  -- Common failure categories (top 5 per jurisdiction/type)
  top_failure_categories  jsonb,               -- [{"code_ref": "...", "count": n, "pct": 0.xx}]

  -- Common passing strategies
  top_success_patterns    jsonb,               -- [{"pattern": "...", "frequency": n}]

  calculated_at           timestamptz not null default now(),

  unique (municipality, project_type, snapshot_date)
);

create index idx_ji_municipality on repository.jurisdiction_insights(municipality);
create index idx_ji_date         on repository.jurisdiction_insights(snapshot_date desc);

-- ── Recommendation Templates ───────────────────────────────
-- AI-generated checklists and recommendations for specific
-- municipality + project type combinations, derived from
-- high-performing approved proposals
create table repository.recommendation_templates (
  id                  uuid primary key default gen_random_uuid(),
  municipality        text not null,
  project_type        text not null,
  version             integer not null default 1,
  is_active           boolean not null default true,

  -- The actual recommendations
  title               text not null,
  summary             text,
  recommendations     jsonb not null,          -- structured checklist
  /*
    recommendations shape:
    [
      {
        "category": "AODA Accessibility",
        "priority": "critical",
        "items": [
          {
            "code_ref": "AODA O. Reg. 413/12 s.80.25",
            "recommendation": "Ensure all exterior paths of travel have cross-slope ≤ 2%",
            "success_rate": 0.94
          }
        ]
      }
    ]
  */

  -- Provenance
  derived_from_count  integer not null default 0,  -- number of proposals used to generate this
  generated_by_model  text,
  generated_at        timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_rt_municipality  on repository.recommendation_templates(municipality);
create index idx_rt_project_type  on repository.recommendation_templates(project_type);
create index idx_rt_active        on repository.recommendation_templates(is_active) where is_active = true;

-- ── AI Training Runs ───────────────────────────────────────
-- Audit log for model fine-tuning and recommendation generation jobs
create table repository.ai_training_runs (
  id                  uuid primary key default gen_random_uuid(),
  run_type            text not null,           -- 'recommendation_generation' | 'pattern_extraction' | 'fine_tune'
  status              text not null default 'pending'
                        check (status in ('pending','running','completed','failed')),
  model_name          text,
  base_model          text,
  proposals_used      integer,
  patterns_processed  integer,
  templates_updated   integer,

  -- Job metadata
  triggered_by        text,                   -- 'schedule' | 'manual' | 'threshold'
  started_at          timestamptz,
  completed_at        timestamptz,
  error_message       text,
  run_metadata        jsonb,                  -- arbitrary job-specific metadata

  created_at          timestamptz not null default now()
);

create index idx_atr_status on repository.ai_training_runs(status);
create index idx_atr_run_type on repository.ai_training_runs(run_type);

-- ── Proposal → Recommendation Linkage ────────────────────
-- Which proposals contributed to which recommendation templates
create table repository.proposal_template_contributions (
  proposal_id     uuid not null references repository.approved_proposals(id) on delete cascade,
  template_id     uuid not null references repository.recommendation_templates(id) on delete cascade,
  weight          numeric(5,4) default 1.0,    -- how much this proposal influenced the template
  primary key (proposal_id, template_id)
);

-- ── updated_at trigger (reuse from main schema or redefine) ─
create or replace function repository.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_ap_updated
  before update on repository.approved_proposals
  for each row execute function repository.set_updated_at();

create trigger trg_rt_updated
  before update on repository.recommendation_templates
  for each row execute function repository.set_updated_at();

-- ── Useful views ───────────────────────────────────────────

-- First-submission approval rate by municipality
create or replace view repository.v_approval_rates as
select
  municipality,
  project_type,
  count(*) as total_proposals,
  sum(case when submission_count = 1 then 1 else 0 end) as first_attempt_approved,
  round(
    sum(case when submission_count = 1 then 1 else 0 end)::numeric / count(*) * 100, 1
  ) as first_attempt_pct,
  round(avg(days_to_approval), 0) as avg_days_to_approval,
  round(avg(submission_count), 2) as avg_submissions
from repository.approved_proposals
group by municipality, project_type;

-- Top failure patterns per municipality
create or replace view repository.v_top_failure_patterns as
select
  municipality,
  project_type,
  building_code_ref,
  count(*) as occurrence_count,
  round(count(*) * 100.0 / sum(count(*)) over (partition by municipality, project_type), 1) as pct_of_checks
from repository.code_requirement_patterns
group by municipality, project_type, building_code_ref
order by municipality, project_type, occurrence_count desc;

-- ── S3 / OSS storage path convention (comment) ────────────
--
-- AWS S3 bucket layout:
--   s3://permitflow-proposals-prod/
--     {municipality_slug}/
--       {year}/
--         {proposal_id}/
--           documents/
--             {document_type}_{file_name}
--           extracted/
--             {document_id}_ocr.txt
--             {document_id}_structured.json
--
-- Alibaba Cloud OSS (ApsaraDB environment):
--   Same path convention, prefix: oss://permitflow-proposals-prod/
--   Use Alibaba Cloud RAM roles for access control.
--   Enable OSS Object Storage Transfer Acceleration for CDN.
--
-- Access:
--   Documents are private. Generate presigned URLs (15 min TTL)
--   for in-app preview. Long-lived access via signed cookies
--   for batch processing jobs.
