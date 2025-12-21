# PermitFlow

**Created by [Salaaz Market Inc.](https://salaazmarket.com)**

A web application designed to speed up the permitting process and minimize revisions by providing automated compliance checking against building codes and standards.

## 🎯 Problem Statement

PermitFlow aims to create a tool that:
- Speeds up the permitting process
- Results in the least amount of revisions possible
- Provides automated feedback on permit packages against relevant codes and standards

## ✨ Features

### Current Release (Iteration 1)
- **User Authentication** - Secure login system
- **Project Management** - Create and manage multiple permit projects
- **Document Upload** - Support for multiple document types:
  - Building Codes (IBC, IRC, NFPA, etc.)
  - Standards (ASTM, ASHRAE, ADA, etc.)
  - Specifications
  - Drawings (PDF, DWG, DXF, images)
- **Automated Analysis** - AI-powered compliance checking including:
  - OCR/CV Data Extraction
  - Code & Bylaw Database Query
  - AI/NLP Rule Engine Analysis
  - Historical Data Cross-reference
- **Feedback Reports** - Comprehensive compliance reports with:
  - Pass/Fail/Warning status for each requirement
  - Severity levels (Critical, Major, Minor, Info)
  - Suggested fixes for non-compliant items
  - Export capabilities

### Future Releases
- Review Cycle Comments integration
- Past Submissions history and learning
- Enhanced AI recommendations based on historical data

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: TypeScript 5.9.3
- **Routing**: React Router DOM 7.11.0
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Context API

## 📋 Prerequisites

Before running this project, ensure you have the following installed:
- **Node.js** (version 18.x or higher)
- **npm** (comes with Node.js)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd permitflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

### 5. Preview Production Build
```bash
npm run preview
```

## 📖 How to Use PermitFlow

### Step 1: Login
- Navigate to `http://localhost:5173`
- Enter any email and password (demo mode accepts any credentials)
- Click "Sign In"

### Step 2: View Dashboard
- After login, you'll see your projects dashboard
- View existing projects or create a new one

### Step 3: Create New Project
- Click "+ New Project" button
- Enter project name and description
- Click "Continue to Upload Documents"

### Step 4: Upload Documents
Upload your project documents in four categories:
- **Building Codes**: IBC, IRC, NFPA codes (PDF, DOC, DOCX, TXT)
- **Standards**: ASTM, ASHRAE, ADA standards (PDF, DOC, DOCX, TXT)
- **Specifications**: Project specifications (PDF, DOC, DOCX, TXT)
- **Drawings**: Architectural/structural drawings (PDF, DWG, DXF, JPG, PNG)

You can drag and drop files or click to browse.

### Step 5: Review Analysis
- Click "Continue to Analysis" after uploading
- Watch the system process your documents through multiple stages
- Review the comprehensive compliance feedback report
- See pass/fail status for each requirement
- Review suggested fixes for non-compliant items

### Step 6: Take Action
- Export the report for documentation
- Return to dashboard to manage other projects

## 🎨 Design Theme

The UI uses a professional color scheme based on the PermitFlow logo:
- **Primary Color**: Maroon/Burgundy (#8B2F5B)
- **Secondary Colors**: Neutral grays for text and backgrounds
- **Status Colors**: 
  - Success: Green (#38A169)
  - Warning: Orange (#DD6B20)
  - Error: Red (#E53E3E)
  - Info: Blue (#3182CE)

## 📁 Project Structure

```
permitflow/
├── src/
│   ├── components/        # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── context/          # React Context for state management
│   │   └── AuthContext.tsx
│   ├── data/             # Mock data for demo
│   │   └── mockData.ts
│   ├── pages/            # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NewProject.tsx
│   │   ├── UploadDocuments.tsx
│   │   └── ProjectAnalysis.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and theme
├── public/               # Static assets
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🔌 Backend Integration

The current version uses mock data for demonstration purposes. All data and processing are simulated on the frontend.

### Future Backend Integration
The application is designed with clean separation for easy backend integration:
- Authentication endpoints ready for connection
- API service layer prepared for REST/GraphQL integration
- Mock data can be replaced with real API calls
- File upload system ready for cloud storage integration

## 🧪 Mock Data

The demo includes sample data for:
- 2 sample users
- 3 building codes (IBC, NFPA 101, IRC)
- 3 standards (ASTM E119, ASHRAE 90.1, ADA)
- 3 sample projects
- Multiple compliance checks with various statuses
- Project submissions and review comments

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the correct URL.

### Module Not Found Errors
Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
The project uses strict TypeScript settings. Make sure your IDE is using the project's TypeScript version.

## 🤝 Contributing

This is a proprietary application developed by Salaaz Market Inc. For contribution inquiries, please contact the development team.

## 📄 License

Copyright © 2024 Salaaz Market Inc. All rights reserved.

## 📧 Contact

For support or inquiries:
- Website: [www.salaazmarket.com](https://salaazmarket.com)
- Project: PermitFlow - Automated Permit Compliance System

## 🎯 Roadmap

### Phase 1 (Current) ✅
- User authentication
- Project creation and management
- Document upload system
- Basic compliance checking
- Feedback report generation

### Phase 2 (Planned)
- Review cycle comments integration
- Historical submission tracking
- Enhanced AI learning from past reviews
- Multi-user collaboration
- Advanced reporting and analytics

### Phase 3 (Future)
- Real-time collaboration
- Mobile application
- Integration with CAD software
- Automated code updates
- Predictive compliance suggestions

---

**Built with ❤️ by Salaaz Market Inc.**
