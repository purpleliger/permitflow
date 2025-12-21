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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadgeClass = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'processing':
        return 'badge-info';
      case 'under_review':
        return 'badge-warning';
      case 'draft':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const formatStatus = (status: Project['status']) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
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
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-title-section">
            <div>
              <h1>Projects</h1>
              <p className="text-muted">Manage your permit applications</p>
            </div>
            <button 
              onClick={() => navigate('/project/new')}
              className="btn btn-primary"
            >
              + New Project
            </button>
          </div>

          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">📋</div>
                <h3>No projects yet</h3>
                <p className="text-muted">Create your first project to get started</p>
                <button 
                  onClick={() => navigate('/project/new')}
                  className="btn btn-primary mt-lg"
                >
                  Create Project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card card"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="project-card-header">
                    <h3>{project.name}</h3>
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-card-footer">
                    <span className="project-date">
                      Updated: {formatDate(project.updated_at)}
                    </span>
                    <span className="project-link">View Details →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
