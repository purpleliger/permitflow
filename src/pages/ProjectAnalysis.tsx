import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeCompliance } from '../services/claudeService';
import { mockBuildingCodes, mockStandards, mockProjects } from '../data/mockData';
import type { ComplianceCheck } from '../types';
import './ProjectAnalysis.css';

const ProjectAnalysis = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initialising analysis engine…');
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | ComplianceCheck['status']>('all');
  const hasRun = useRef(false);

  const project = mockProjects.find(p => p.id === projectId) ?? mockProjects[0];

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let pct = 0;
    const ticker = setInterval(() => {
      pct += 1;
      setProgress(Math.min(pct, 95));
      if (pct >= 95) clearInterval(ticker);
    }, 120);

    analyzeCompliance(
      {
        projectId: project.id,
        projectName: project.name,
        projectDescription: project.description,
        municipality: project.municipality,
        projectType: project.project_type,
        documentSummaries: ['Architectural Floor Plans', 'Structural Specifications', 'Site Plan'],
      },
      (step) => setCurrentStep(step)
    ).then((checks) => {
      clearInterval(ticker);
      setProgress(100);
      setTimeout(() => {
        setComplianceChecks(checks);
        setProcessing(false);
      }, 400);
    });

    return () => clearInterval(ticker);
  }, [project]);

  const getStatusBadgeClass = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':    return 'badge-success';
      case 'fail':    return 'badge-error';
      case 'warning': return 'badge-warning';
      case 'pending': return 'badge-neutral';
      default:        return 'badge-neutral';
    }
  };

  const getSeverityClass = (severity: ComplianceCheck['severity']) => {
    switch (severity) {
      case 'critical': return 'sev-critical';
      case 'major':    return 'sev-major';
      case 'minor':    return 'sev-minor';
      default:         return 'sev-info';
    }
  };

  const getCodeName = (id: string) =>
    mockBuildingCodes.find(c => c.id === id)?.code_name ?? id;

  const getStandardName = (id: string) =>
    mockStandards.find(s => s.id === id)?.standard_name ?? id;

  const summary = {
    total:    complianceChecks.length,
    passed:   complianceChecks.filter(c => c.status === 'pass').length,
    failed:   complianceChecks.filter(c => c.status === 'fail').length,
    warnings: complianceChecks.filter(c => c.status === 'warning').length,
    pending:  complianceChecks.filter(c => c.status === 'pending').length,
  };

  const overallStatus =
    summary.failed > 0 ? 'non-compliant' :
    summary.pending > 0 ? 'needs-review' : 'compliant';

  const filtered =
    activeFilter === 'all'
      ? complianceChecks
      : complianceChecks.filter(c => c.status === activeFilter);

  const Header = () => (
    <header className="app-header">
      <div className="container app-header-inner">
        <button className="app-logo" onClick={() => navigate('/dashboard')}>
          <svg className="app-logo-icon" viewBox="0 0 100 100" fill="currentColor">
            <rect x="20" y="10" width="60" height="80" rx="3" />
            <rect x="30" y="25" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="45" y="25" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="60" y="25" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="30" y="40" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="45" y="40" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="60" y="40" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="30" y="55" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="45" y="55" width="10" height="10" fill="white" opacity="0.9" />
            <rect x="60" y="55" width="10" height="10" fill="white" opacity="0.9" />
          </svg>
          <span className="app-logo-name">Permit<span>Flow</span></span>
        </button>
        <div className="header-user">
          <span className="header-user-name">{user?.full_name}</span>
          <button onClick={logout} className="btn btn-outline btn-sm">Sign Out</button>
        </div>
      </div>
    </header>
  );

  /* ── Processing state ── */
  if (processing) {
    return (
      <div className="analysis-page">
        <Header />
        <main className="analysis-main">
          <div className="container">
            <div className="processing-wrapper">
              <div className="processing-card card">
                <div className="processing-spinner">
                  <div className="spinner-ring" />
                </div>
                <h2>Analysing your submission</h2>
                <p className="text-muted">
                  PermitFlow is reviewing your documents against Ontario Building Code,
                  {project.municipality} bylaws, and applicable standards.
                </p>

                <div className="progress-track">
                  <div className="progress-fill-bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-meta">
                  <span className="progress-pct">{progress}%</span>
                  <span className="progress-step-text">{currentStep}</span>
                </div>

                <div className="analysis-steps">
                  {[
                    { label: 'Document extraction (OCR/CV)', threshold: 0 },
                    { label: 'Code & bylaw database query', threshold: 25 },
                    { label: 'AI / NLP rule engine', threshold: 50 },
                    { label: 'Historical data cross-reference', threshold: 75 },
                    { label: 'Generating compliance report', threshold: 90 },
                  ].map(({ label, threshold }) => (
                    <div key={label} className={`analysis-step ${progress > threshold ? 'step-active' : ''}`}>
                      <div className="step-dot">
                        {progress > threshold + 20 ? '✓' : ''}
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── Results state ── */
  return (
    <div className="analysis-page">
      <Header />
      <main className="analysis-main">
        <div className="container">

          <nav className="breadcrumb">
            <button className="breadcrumb-link" onClick={() => navigate('/dashboard')}>Projects</button>
            <span className="breadcrumb-separator">/</span>
            <span>{project.name}</span>
          </nav>

          {/* Report header */}
          <div className="report-header-row">
            <div>
              <h1>Compliance Feedback Report</h1>
              <p className="text-muted">
                {project.municipality} · {project.project_type}
              </p>
            </div>
            <div className="report-header-actions">
              <button className="btn btn-outline" onClick={() => window.print()}>
                Export PDF
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Back to Projects
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="summary-row">
            <div className={`summary-status-card card status-card-${overallStatus}`}>
              <div className="status-indicator">
                {overallStatus === 'compliant'     ? '✓' :
                 overallStatus === 'non-compliant' ? '✕' : '!'}
              </div>
              <div>
                <div className="status-label">Overall Status</div>
                <div className="status-value">
                  {overallStatus === 'compliant'     ? 'Compliant' :
                   overallStatus === 'non-compliant' ? 'Non-Compliant' : 'Needs Review'}
                </div>
              </div>
            </div>

            <div className="summary-metrics">
              <div className="metric-card card-flat">
                <div className="metric-number">{summary.total}</div>
                <div className="metric-label">Total checks</div>
              </div>
              <div className="metric-card card-flat">
                <div className="metric-number text-success">{summary.passed}</div>
                <div className="metric-label">Passed</div>
              </div>
              <div className="metric-card card-flat">
                <div className="metric-number text-error">{summary.failed}</div>
                <div className="metric-label">Failed</div>
              </div>
              <div className="metric-card card-flat">
                <div className="metric-number text-warning">{summary.warnings}</div>
                <div className="metric-label">Warnings</div>
              </div>
              {summary.pending > 0 && (
                <div className="metric-card card-flat">
                  <div className="metric-number">{summary.pending}</div>
                  <div className="metric-label">Pending</div>
                </div>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="filter-tabs">
            {(['all', 'fail', 'warning', 'pass', 'pending'] as const).map(f => (
              <button
                key={f}
                className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'all' ? `All (${summary.total})` :
                 f === 'fail' ? `Failed (${summary.failed})` :
                 f === 'warning' ? `Warnings (${summary.warnings})` :
                 f === 'pass' ? `Passed (${summary.passed})` :
                 `Pending (${summary.pending})`}
              </button>
            ))}
          </div>

          {/* Compliance checks list */}
          <div className="checks-list">
            {filtered.map((check) => (
              <div key={check.id} className={`check-card card check-${check.status}`}>
                <div className="check-header">
                  <div className="check-title-group">
                    <div className="check-code-name">{getCodeName(check.building_code_id)}</div>
                    <div className="check-requirement">{check.requirement_text}</div>
                  </div>
                  <div className="check-badges">
                    <span className={`badge ${getStatusBadgeClass(check.status)}`}>
                      {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                    </span>
                    <span className={`sev-badge ${getSeverityClass(check.severity)}`}>
                      {check.severity.charAt(0).toUpperCase() + check.severity.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="check-body">
                  <div className="check-detail-row">
                    <span className="check-detail-label">Standard</span>
                    <span className="check-detail-value">{getStandardName(check.standard_id)}</span>
                  </div>
                  <div className="check-detail-row">
                    <span className="check-detail-label">Finding</span>
                    <span className="check-detail-value">{check.feedback}</span>
                  </div>
                  {check.suggested_fix && (
                    <div className="check-fix">
                      <span className="check-fix-icon">→</span>
                      <div>
                        <span className="check-fix-label">Suggested remediation</span>
                        <p className="check-fix-text">{check.suggested_fix}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="no-results card">
                <p className="text-muted">No checks matching this filter.</p>
              </div>
            )}
          </div>

          <div className="report-footer-actions">
            <button className="btn btn-outline" onClick={() => window.print()}>Export PDF</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Complete Review</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectAnalysis;
