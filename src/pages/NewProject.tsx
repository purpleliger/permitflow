import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NewProject.css';

const MUNICIPALITIES = [
  'City of Toronto',
  'City of Mississauga',
  'City of Brampton',
  'City of Markham',
  'City of Vaughan',
  'Town of Richmond Hill',
  'Town of Oakville',
  'City of Burlington',
  'City of Pickering',
  'Town of Ajax',
  'City of Oshawa',
  'Other GTA Municipality',
];

const PROJECT_TYPES = [
  'Residential — Part 9 (< 3 storeys)',
  'Multi-Residential — Part 3 (≥ 3 storeys)',
  'Commercial / Office (ICI)',
  'Industrial / Logistics',
  'Mixed-Use (Residential + Commercial)',
  'Institutional (School, Hospital, etc.)',
  'Renovation / Interior Alteration',
  'Rehabilitation / Retrofit',
  'Heritage Alteration',
  'Site Plan / Subdivision',
];

const NewProject = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    municipality: '',
    project_type: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const projectId = `proj-${Date.now()}`;
      navigate(`/project/${projectId}/upload`);
    }, 800);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValid =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.municipality &&
    formData.project_type;

  return (
    <div className="new-project-page">
      {/* ── Header ────────────────────────────────────── */}
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

      {/* ── Main ──────────────────────────────────────── */}
      <main className="new-project-main">
        <div className="container">
          <nav className="breadcrumb">
            <button className="breadcrumb-link" onClick={() => navigate('/dashboard')}>Projects</button>
            <span className="breadcrumb-separator">/</span>
            <span>New Project</span>
          </nav>

          <div className="new-project-layout">
            {/* Left: form */}
            <div className="new-project-form-col">
              <div className="new-project-heading">
                <h1>New compliance review</h1>
                <p className="text-muted">
                  Provide project details so PermitFlow can determine the applicable Ontario
                  codes and bylaws for your submission.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="project-form">
                {/* Section 1 — Identification */}
                <div className="form-section card">
                  <div className="form-section-label">Project identification</div>

                  <div className="input-group">
                    <label htmlFor="name" className="input-label">Project name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input-field"
                      placeholder="e.g., King Street Mixed-Use Tower"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="description" className="input-label">Project description *</label>
                    <textarea
                      id="description"
                      name="description"
                      className="input-field textarea-field"
                      placeholder="Describe the project scope, building type, scale, and any key features relevant to permitting…"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <span className="input-hint">
                      Include details such as number of storeys, GFA, and primary use
                    </span>
                  </div>
                </div>

                {/* Section 2 — Jurisdiction */}
                <div className="form-section card">
                  <div className="form-section-label">Jurisdiction & project type</div>
                  <p className="form-section-desc">
                    PermitFlow uses these selections to load the correct zoning bylaw, OBC
                    division, and municipality-specific standards for your analysis.
                  </p>

                  <div className="form-row">
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="municipality" className="input-label">Municipality *</label>
                      <select
                        id="municipality"
                        name="municipality"
                        className="input-field select-field"
                        value={formData.municipality}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="" disabled>Select municipality…</option>
                        {MUNICIPALITIES.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="project_type" className="input-label">Project type *</label>
                      <select
                        id="project_type"
                        name="project_type"
                        className="input-field select-field"
                        value={formData.project_type}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="" disabled>Select project type…</option>
                        {PROJECT_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !isValid}
                  >
                    {loading ? 'Creating…' : 'Continue to Upload Documents'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: info panel */}
            <aside className="new-project-info-col">
              <div className="info-card card-flat">
                <h4>Codes loaded by municipality</h4>
                <ul className="info-code-list">
                  <li>
                    <span className="info-code-tag">All projects</span>
                    Ontario Building Code (OBC) 2022, Ontario Fire Code, AODA
                  </li>
                  <li>
                    <span className="info-code-tag">Federal</span>
                    National Building Code of Canada 2020
                  </li>
                  <li>
                    <span className="info-code-tag">Toronto</span>
                    Zoning Bylaw 569-2013, Toronto Green Standard v4
                  </li>
                  <li>
                    <span className="info-code-tag">Mississauga</span>
                    Zoning Bylaw 0225-2007
                  </li>
                  <li>
                    <span className="info-code-tag">Brampton</span>
                    Zoning Bylaw 270-2004
                  </li>
                </ul>
              </div>

              <div className="info-card card-flat">
                <h4>Tips for best results</h4>
                <ul className="info-tips-list">
                  <li>Include the correct OBC Part in your project type selection</li>
                  <li>Upload all discipline drawings (architectural, structural, mechanical)</li>
                  <li>Ensure drawings include dimension annotations</li>
                  <li>Attach site plan for zoning setback analysis</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewProject;
