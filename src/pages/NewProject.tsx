import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NewProject.css';

const NewProject = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Generate a mock project ID
      const projectId = `proj-${Date.now()}`;
      navigate(`/project/${projectId}/upload`);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="new-project-page">
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

      <main className="new-project-main">
        <div className="container">
          <div className="breadcrumb">
            <button onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              Projects
            </button>
            <span className="breadcrumb-separator">/</span>
            <span>New Project</span>
          </div>

          <div className="new-project-container">
            <div className="new-project-header">
              <h1>Create New Project</h1>
              <p className="text-muted">
                Enter your project details to get started with permit review
              </p>
            </div>

            <form onSubmit={handleSubmit} className="project-form card">
              <div className="form-section">
                <h3>Project Information</h3>
                <p className="text-muted mb-lg">
                  Provide basic information about your project
                </p>

                <div className="input-group">
                  <label htmlFor="name" className="input-label">
                    Project Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Downtown Office Building"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="description" className="input-label">
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="input-field textarea-field"
                    placeholder="Brief description of your project..."
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span className="input-hint">
                    Describe the type of project, location, and key features
                  </span>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !formData.name || !formData.description}
                >
                  {loading ? 'Creating...' : 'Continue to Upload Documents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewProject;
