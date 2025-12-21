import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockComplianceChecks, mockBuildingCodes, mockStandards } from '../data/mockData';
import type { ComplianceCheck } from '../types';
import './ProjectAnalysis.css';

const ProjectAnalysis = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Extracting document data...');
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);

  useEffect(() => {
    // Simulate processing steps
    const steps = [
      { text: 'Extracting document data...', duration: 2000 },
      { text: 'Querying building codes database...', duration: 2500 },
      { text: 'Analyzing compliance requirements...', duration: 2000 },
      { text: 'Cross-referencing historical data...', duration: 2000 },
      { text: 'Generating feedback report...', duration: 1500 },
    ];

    let currentStepIndex = 0;
    let totalDuration = 0;

    steps.forEach(step => {
      totalDuration += step.duration;
    });

    const stepInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex].text);
        currentStepIndex++;
      }
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          setProcessing(false);
          // Load mock data
          setComplianceChecks(mockComplianceChecks.filter(c => c.project_id === 'proj-1'));
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const getStatusBadgeClass = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':
        return 'badge-success';
      case 'fail':
        return 'badge-error';
      case 'warning':
        return 'badge-warning';
      case 'pending':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getSeverityBadgeClass = (severity: ComplianceCheck['severity']) => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'major':
        return 'severity-major';
      case 'minor':
        return 'severity-minor';
      case 'info':
        return 'severity-info';
      default:
        return 'severity-info';
    }
  };

  const formatStatus = (status: ComplianceCheck['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatSeverity = (severity: ComplianceCheck['severity']) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const getCodeName = (codeId: string) => {
    const code = mockBuildingCodes.find(c => c.id === codeId);
    return code?.code_name || 'Unknown Code';
  };

  const getStandardName = (standardId: string) => {
    const standard = mockStandards.find(s => s.id === standardId);
    return standard?.standard_name || 'Unknown Standard';
  };

  const summary = {
    total: complianceChecks.length,
    passed: complianceChecks.filter(c => c.status === 'pass').length,
    failed: complianceChecks.filter(c => c.status === 'fail').length,
    warnings: complianceChecks.filter(c => c.status === 'warning').length,
    pending: complianceChecks.filter(c => c.status === 'pending').length,
  };

  const overallStatus = summary.failed > 0 ? 'non-compliant' : 
                        summary.pending > 0 ? 'needs-review' : 'compliant';

  if (processing) {
    return (
      <div className="analysis-page">
        <header className="dashboard-header">
          <div className="container">
            <div className="header-content">
              <div className="header-left">
                <div className="logo-icon-small">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <rect x="20" y="10" width="60" height="80" rx="2" />
                    <rect x="30" y="25" width="10" height="10" fill="white" />
                    <rect x="45" y="25" width="10" height="10" fill="white" />
                    <rect x="60" y="25" width="10" height="10" fill="white" />
                    <rect x="30" y="40" width="10" height="10" fill="white" />
                    <rect x="45" y="40" width="10" height="10" fill="white" />
                    <rect x="60" y="40" width="10" height="10" fill="white" />
                    <rect x="30" y="55" width="10" height="10" fill="white" />
                    <rect x="45" y="55" width="10" height="10" fill="white" />
                    <rect x="60" y="55" width="10" height="10" fill="white" />
                  </svg>
                </div>
                <h2>PermitFlow</h2>
              </div>
              <div className="header-right">
                <span className="user-name">{user?.full_name}</span>
                <button onClick={logout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="analysis-main">
          <div className="container">
            <div className="processing-container">
              <div className="processing-card card">
                <div className="processing-icon">
                  <div className="spinner"></div>
                </div>
                <h2>Analyzing Your Project</h2>
                <p className="text-muted mb-xl">
                  Our AI system is reviewing your documents against applicable codes and standards
                </p>

                <div className="progress-section">
                  <div className="progress-bar-large">
                    <div 
                      className="progress-fill-large" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="progress-info">
                    <span className="progress-text-large">{progress}%</span>
                    <span className="progress-step">{currentStep}</span>
                  </div>
                </div>

                <div className="processing-steps">
                  <div className="step-item">
                    <div className="step-icon">✓</div>
                    <span>OCR/CV Data Extraction</span>
                  </div>
                  <div className="step-item">
                    <div className="step-icon">✓</div>
                    <span>Code & Bylaw Database Query</span>
                  </div>
                  <div className="step-item">
                    <div className={`step-icon ${progress >= 60 ? 'active' : ''}`}>
                      {progress >= 80 ? '✓' : '⋯'}
                    </div>
                    <span>AI/NLP Rule Engine Analysis</span>
                  </div>
                  <div className="step-item">
                    <div className={`step-icon ${progress >= 80 ? 'active' : ''}`}>
                      {progress >= 90 ? '✓' : '⋯'}
                    </div>
                    <span>Historical Data Cross-reference</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-icon-small">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <rect x="20" y="10" width="60" height="80" rx="2" />
                  <rect x="30" y="25" width="10" height="10" fill="white" />
                  <rect x="45" y="25" width="10" height="10" fill="white" />
                  <rect x="60" y="25" width="10" height="10" fill="white" />
                  <rect x="30" y="40" width="10" height="10" fill="white" />
                  <rect x="45" y="40" width="10" height="10" fill="white" />
                  <rect x="60" y="40" width="10" height="10" fill="white" />
                  <rect x="30" y="55" width="10" height="10" fill="white" />
                  <rect x="45" y="55" width="10" height="10" fill="white" />
                  <rect x="60" y="55" width="10" height="10" fill="white" />
                </svg>
              </div>
              <h2>PermitFlow</h2>
            </div>
            <div className="header-right">
              <span className="user-name">{user?.full_name}</span>
              <button onClick={logout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="analysis-main">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              Projects
            </button>
            <span className="breadcrumb-separator">/</span>
            <span>Analysis Report</span>
          </div>

          <div className="report-header">
            <div>
              <h1>Compliance Feedback Report</h1>
              <p className="text-muted">
                Review the compliance analysis results for your project
              </p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="summary-cards">
            <div className={`summary-card card status-${overallStatus}`}>
              <div className="summary-icon">
                {overallStatus === 'compliant' ? '✓' : 
                 overallStatus === 'non-compliant' ? '✕' : '⚠'}
              </div>
              <h3>Overall Status</h3>
              <p className="summary-status">
                {overallStatus === 'compliant' ? 'Compliant' :
                 overallStatus === 'non-compliant' ? 'Non-Compliant' : 'Needs Review'}
              </p>
            </div>

            <div className="summary-card card">
              <div className="summary-number">{summary.total}</div>
              <p className="text-muted">Total Checks</p>
            </div>

            <div className="summary-card card">
              <div className="summary-number text-success">{summary.passed}</div>
              <p className="text-muted">Passed</p>
            </div>

            <div className="summary-card card">
              <div className="summary-number text-error">{summary.failed}</div>
              <p className="text-muted">Failed</p>
            </div>

            <div className="summary-card card">
              <div className="summary-number text-warning">{summary.warnings}</div>
              <p className="text-muted">Warnings</p>
            </div>
          </div>

          <div className="compliance-results card">
            <h2 className="mb-lg">Compliance Checks</h2>
            
            <div className="compliance-list">
              {complianceChecks.map((check) => (
                <div key={check.id} className="compliance-item">
                  <div className="compliance-header">
                    <div className="compliance-title-section">
                      <h3>{getCodeName(check.building_code_id)}</h3>
                      <p className="text-muted">{check.requirement_text}</p>
                    </div>
                    <div className="compliance-badges">
                      <span className={`badge ${getStatusBadgeClass(check.status)}`}>
                        {formatStatus(check.status)}
                      </span>
                      <span className={`badge ${getSeverityBadgeClass(check.severity)}`}>
                        {formatSeverity(check.severity)}
                      </span>
                    </div>
                  </div>

                  <div className="compliance-body">
                    <div className="compliance-row">
                      <span className="compliance-label">Standard:</span>
                      <span className="compliance-value">{getStandardName(check.standard_id)}</span>
                    </div>
                    
                    <div className="compliance-row">
                      <span className="compliance-label">Feedback:</span>
                      <span className="compliance-value">{check.feedback}</span>
                    </div>

                    {check.suggested_fix && (
                      <div className="compliance-fix">
                        <span className="compliance-label">💡 Suggested Fix:</span>
                        <span className="compliance-value">{check.suggested_fix}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="report-actions">
            <button 
              onClick={() => window.print()}
              className="btn btn-outline"
            >
              Export Report
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Complete Review
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectAnalysis;
