import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../data/mockData';
import type { Project } from '../types';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects] = useState<Project[]>(mockProjects);

  const getStatusBadgeClass = (status: Project['status']) => {
    switch (status) {
      case 'completed':   return 'badge-success';
      case 'processing':  return 'badge-info';
      case 'under_review':return 'badge-warning';
      case 'draft':       return 'badge-neutral';
      default:            return 'badge-neutral';
    }
  };

  const formatStatus = (status: Project['status']) =>
    status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

  const statusCounts = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    processing: projects.filter(p => p.status === 'processing').length,
    draft: projects.filter(p => p.status === 'draft').length,
  };

  return (
    <div className="dashboard-page">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="app-header">
        <div className="container app-header-inner">
          <div className="app-logo">
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
          </div>
          <div className="header-user">
            <span className="header-user-name">{user?.full_name}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────── */}
      <main className="dashboard-main">
        <div className="container">

          {/* Page title row */}
          <div className="dashboard-title-row">
            <div>
              <h1>Projects</h1>
              <p className="text-muted">Manage your permit compliance reviews</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/project/new')}>
              + New Project
            </button>
          </div>

          {/* Summary stats */}
          <div className="dashboard-stats">
            <div className="dash-stat card-flat">
              <div className="dash-stat-number">{statusCounts.total}</div>
              <div className="dash-stat-label">Total projects</div>
            </div>
            <div className="dash-stat card-flat">
              <div className="dash-stat-number text-success">{statusCounts.completed}</div>
              <div className="dash-stat-label">Completed</div>
            </div>
            <div className="dash-stat card-flat">
              <div className="dash-stat-number text-warning">{statusCounts.processing}</div>
              <div className="dash-stat-label">In progress</div>
            </div>
            <div className="dash-stat card-flat">
              <div className="dash-stat-number">{statusCounts.draft}</div>
              <div className="dash-stat-label">Drafts</div>
            </div>
          </div>

          {/* Project list */}
          {projects.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">◫</div>
              <h3>No projects yet</h3>
              <p className="text-muted">Create your first compliance review to get started</p>
              <button
                className="btn btn-primary mt-lg"
                onClick={() => navigate('/project/new')}
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="project-table card">
              <div className="project-table-header">
                <span>Project</span>
                <span>Municipality</span>
                <span>Type</span>
                <span>Status</span>
                <span>Updated</span>
                <span />
              </div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-table-row"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="project-name-cell">
                    <div className="project-name">{project.name}</div>
                    <div className="project-desc">{project.description}</div>
                  </div>
                  <div className="project-cell">{project.municipality}</div>
                  <div className="project-cell project-type-cell">{project.project_type}</div>
                  <div className="project-cell">
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </div>
                  <div className="project-cell project-date-cell">
                    {formatDate(project.updated_at)}
                  </div>
                  <div className="project-cell project-action-cell">
                    <span className="project-view-link">View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
