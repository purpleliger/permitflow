import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UploadDocuments.css';

interface UploadedFile {
  id: string;
  file: File;
  type: 'code' | 'standard' | 'spec' | 'drawing';
  uploadProgress: number;
}

const UploadDocuments = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null, type: UploadedFile['type']) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      type,
      uploadProgress: 0,
    }));

    // Simulate upload progress
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id);
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 100) }
            : f
        )
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: UploadedFile['type']) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files, type);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleContinue = () => {
    if (uploadedFiles.length > 0) {
      navigate(`/project/${projectId}/analysis`);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.endsWith('.dwg') || fileName.endsWith('.dxf')) return '📐';
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFilesByType = (type: UploadedFile['type']) => {
    return uploadedFiles.filter(f => f.type === type);
  };

  return (
    <div className="upload-page">
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

      <main className="upload-main">
        <div className="container">
          <nav className="breadcrumb">
            <button onClick={() => navigate('/dashboard')} className="breadcrumb-link">Projects</button>
            <span className="breadcrumb-separator">/</span>
            <button onClick={() => navigate('/project/new')} className="breadcrumb-link">New Project</button>
            <span className="breadcrumb-separator">/</span>
            <span>Upload Documents</span>
          </nav>

          <div className="upload-container">
            <div className="upload-header">
              <h1>Upload Project Documents</h1>
              <p className="text-muted">
                Upload your building codes, standards, specifications, and drawings for analysis
              </p>
            </div>

            <div className="upload-sections">
              {/* Building Codes */}
              <div className="upload-section card">
                <div className="section-header">
                  <div>
                    <h3>📋 Building Codes</h3>
                    <p className="text-muted">IBC, IRC, NFPA, and other applicable codes</p>
                  </div>
                  <span className="badge badge-info">{getFilesByType('code').length} files</span>
                </div>
                
                <div
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'code')}
                >
                  <input
                    type="file"
                    id="code-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileSelect(e.target.files, 'code')}
                    className="file-input"
                  />
                  <label htmlFor="code-upload" className="upload-label">
                    <span className="upload-icon">📁</span>
                    <span className="upload-text">Click to upload or drag and drop</span>
                    <span className="upload-hint">PDF, DOC, DOCX, TXT (max 50MB)</span>
                  </label>
                </div>

                {getFilesByType('code').length > 0 && (
                  <div className="file-list">
                    {getFilesByType('code').map(file => (
                      <FileItem key={file.id} file={file} onRemove={removeFile} getFileIcon={getFileIcon} formatFileSize={formatFileSize} />
                    ))}
                  </div>
                )}
              </div>

              {/* Standards */}
              <div className="upload-section card">
                <div className="section-header">
                  <div>
                    <h3>⚙️ Standards</h3>
                    <p className="text-muted">ASTM, ASHRAE, ADA, and other standards</p>
                  </div>
                  <span className="badge badge-info">{getFilesByType('standard').length} files</span>
                </div>
                
                <div
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'standard')}
                >
                  <input
                    type="file"
                    id="standard-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileSelect(e.target.files, 'standard')}
                    className="file-input"
                  />
                  <label htmlFor="standard-upload" className="upload-label">
                    <span className="upload-icon">📁</span>
                    <span className="upload-text">Click to upload or drag and drop</span>
                    <span className="upload-hint">PDF, DOC, DOCX, TXT (max 50MB)</span>
                  </label>
                </div>

                {getFilesByType('standard').length > 0 && (
                  <div className="file-list">
                    {getFilesByType('standard').map(file => (
                      <FileItem key={file.id} file={file} onRemove={removeFile} getFileIcon={getFileIcon} formatFileSize={formatFileSize} />
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="upload-section card">
                <div className="section-header">
                  <div>
                    <h3>📝 Specifications</h3>
                    <p className="text-muted">Project specifications and requirements</p>
                  </div>
                  <span className="badge badge-info">{getFilesByType('spec').length} files</span>
                </div>
                
                <div
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'spec')}
                >
                  <input
                    type="file"
                    id="spec-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileSelect(e.target.files, 'spec')}
                    className="file-input"
                  />
                  <label htmlFor="spec-upload" className="upload-label">
                    <span className="upload-icon">📁</span>
                    <span className="upload-text">Click to upload or drag and drop</span>
                    <span className="upload-hint">PDF, DOC, DOCX, TXT (max 50MB)</span>
                  </label>
                </div>

                {getFilesByType('spec').length > 0 && (
                  <div className="file-list">
                    {getFilesByType('spec').map(file => (
                      <FileItem key={file.id} file={file} onRemove={removeFile} getFileIcon={getFileIcon} formatFileSize={formatFileSize} />
                    ))}
                  </div>
                )}
              </div>

              {/* Drawings */}
              <div className="upload-section card">
                <div className="section-header">
                  <div>
                    <h3>📐 Drawings</h3>
                    <p className="text-muted">Architectural, structural, and engineering drawings</p>
                  </div>
                  <span className="badge badge-info">{getFilesByType('drawing').length} files</span>
                </div>
                
                <div
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'drawing')}
                >
                  <input
                    type="file"
                    id="drawing-upload"
                    multiple
                    accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(e.target.files, 'drawing')}
                    className="file-input"
                  />
                  <label htmlFor="drawing-upload" className="upload-label">
                    <span className="upload-icon">📁</span>
                    <span className="upload-text">Click to upload or drag and drop</span>
                    <span className="upload-hint">PDF, DWG, DXF, JPG, PNG (max 50MB)</span>
                  </label>
                </div>

                {getFilesByType('drawing').length > 0 && (
                  <div className="file-list">
                    {getFilesByType('drawing').map(file => (
                      <FileItem key={file.id} file={file} onRemove={removeFile} getFileIcon={getFileIcon} formatFileSize={formatFileSize} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="upload-actions">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="btn btn-primary"
                disabled={uploadedFiles.length === 0}
              >
                Continue to Analysis
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface FileItemProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
  getFileIcon: (fileName: string) => string;
  formatFileSize: (bytes: number) => string;
}

const FileItem = ({ file, onRemove, getFileIcon, formatFileSize }: FileItemProps) => {
  return (
    <div className="file-item">
      <div className="file-info">
        <span className="file-icon">{getFileIcon(file.file.name)}</span>
        <div className="file-details">
          <span className="file-name">{file.file.name}</span>
          <span className="file-size">{formatFileSize(file.file.size)}</span>
        </div>
      </div>
      
      {file.uploadProgress < 100 ? (
        <div className="file-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${file.uploadProgress}%` }}
            />
          </div>
          <span className="progress-text">{file.uploadProgress}%</span>
        </div>
      ) : (
        <button
          onClick={() => onRemove(file.id)}
          className="btn-remove"
          title="Remove file"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default UploadDocuments;
