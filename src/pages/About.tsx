import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* ── Public Nav ───────────────────────────────────── */}
      <header className="public-nav">
        <div className="container">
          <div className="public-nav-inner">
            <button className="nav-logo" onClick={() => navigate('/')}>
              <svg className="nav-logo-icon" viewBox="0 0 100 100" fill="currentColor">
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
              <span className="nav-logo-name">Permit<span>Flow</span></span>
            </button>

            <nav className="public-nav-links">
              <button className="nav-link active" onClick={() => navigate('/about')}>About</button>
              <button className="nav-link" onClick={() => navigate('/pricing')}>Pricing</button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>Sign In</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/pricing')}>Get Started</button>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-inner">
            <div className="about-hero-eyebrow">Built for the GTA Construction Industry</div>
            <h1 className="about-hero-title">
              Permit approvals that move<br />at the speed of your project
            </h1>
            <p className="about-hero-subtitle">
              PermitFlow analyzes your engineering and architectural submissions against Ontario Building Code,
              municipal zoning bylaws, and AODA standards — before you submit. Identify gaps, fix them early,
              and arrive at the permit desk with a submission designed to be approved.
            </p>
            <div className="about-hero-actions">
              <button className="btn btn-primary btn-xl" onClick={() => navigate('/pricing')}>
                Start Free Trial
              </button>
              <button className="btn btn-outline btn-xl" onClick={() => navigate('/')}>
                See a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Stats ─────────────────────────────────── */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">6–24</div>
              <div className="stat-unit">months</div>
              <div className="stat-label">Average Toronto building permit wait time</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">62%</div>
              <div className="stat-unit">of submissions</div>
              <div className="stat-label">Require at least one revision cycle before approval</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">$50K+</div>
              <div className="stat-unit">per month</div>
              <div className="stat-label">Carrying cost impact for a stalled mid-rise project</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">3–5×</div>
              <div className="stat-unit">faster</div>
              <div className="stat-label">Typical improvement in revision cycles with pre-checked submissions</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ───────────────────────────────────── */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-inner two-col">
            <div className="about-section-text">
              <h6>The Problem</h6>
              <h2>The permitting bottleneck is costing the industry billions</h2>
              <p className="text-muted">
                Ontario's construction industry is navigating one of the most complex regulatory
                environments in North America. A single mixed-use project in Toronto touches the Ontario
                Building Code, City of Toronto Zoning Bylaw 569-2013, Toronto Green Standard v4, the
                Ontario Fire Code, AODA accessibility standards, and potentially heritage overlays — all
                at once.
              </p>
              <p className="text-muted">
                When submissions arrive at city hall with compliance gaps, the consequences compound
                quickly: revision cycles that take weeks, carrying costs that accumulate daily, and project
                timelines that slip by months. The frustrating reality is that most of these issues were
                knowable — and fixable — before submission.
              </p>
            </div>
            <div className="about-problem-card card">
              <h4>Common failure points</h4>
              <ul className="problem-list">
                <li>
                  <span className="problem-icon">—</span>
                  <div>
                    <strong>AODA path of travel deficiencies</strong>
                    <p>Cross-slopes, rest interval spacing, and accessible entrance details are frequently cited</p>
                  </div>
                </li>
                <li>
                  <span className="problem-icon">—</span>
                  <div>
                    <strong>Toronto Green Standard energy compliance</strong>
                    <p>TGS Tier 1 EUI thresholds missed due to late-stage envelope or mechanical decisions</p>
                  </div>
                </li>
                <li>
                  <span className="problem-icon">—</span>
                  <div>
                    <strong>OBC occupancy separation ratings</strong>
                    <p>Mixed-use projects regularly miss fire separation requirements between Group C and Group E</p>
                  </div>
                </li>
                <li>
                  <span className="problem-icon">—</span>
                  <div>
                    <strong>Municipal setback and height non-conformances</strong>
                    <p>Zoning bylaw specifics overlooked, triggering Committee of Adjustment referrals</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="about-section about-section-alt">
        <div className="container">
          <div className="about-section-header text-center">
            <h6>How It Works</h6>
            <h2>From upload to submission-ready in hours, not weeks</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4>Upload your documents</h4>
              <p className="text-muted">
                Upload architectural drawings, structural specs, and engineering reports in PDF, DWG, or DXF.
                PermitFlow accepts your existing deliverables — no reformatting required.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">02</div>
              <h4>AI compliance analysis</h4>
              <p className="text-muted">
                Our AI engine cross-references your submission against OBC, your municipality's zoning
                bylaw, Ontario Fire Code, AODA, and Toronto Green Standard — simultaneously.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">03</div>
              <h4>Receive your report</h4>
              <p className="text-muted">
                Get a structured compliance report that flags gaps by severity, cites the exact code
                section, and provides specific remediation guidance — not generic advice.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">04</div>
              <h4>Submit with confidence</h4>
              <p className="text-muted">
                Address flagged items, re-analyze until clean, and submit knowing your application
                is aligned with what the reviewing authority expects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who It's For ──────────────────────────────────── */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header text-center">
            <h6>Who It's For</h6>
            <h2>Built for every professional in the project delivery chain</h2>
          </div>
          <div className="audience-grid">
            <div className="audience-card card-flat">
              <div className="audience-icon">◈</div>
              <h4>Architecture Firms</h4>
              <p className="text-muted">
                Validate designs against current bylaws before DD and CD milestones. Reduce
                client revision costs and strengthen your firm's permit track record.
              </p>
            </div>
            <div className="audience-card card-flat">
              <div className="audience-icon">◈</div>
              <h4>Engineering Consultants</h4>
              <p className="text-muted">
                Confirm structural, mechanical, and envelope designs comply with OBC and
                CSA standards. Catch misses before peer review, not after submission.
              </p>
            </div>
            <div className="audience-card card-flat">
              <div className="audience-icon">◈</div>
              <h4>Real Estate Developers</h4>
              <p className="text-muted">
                Protect your pro forma. Every revision cycle and approval delay has a
                dollar cost. PermitFlow lets you manage permit risk like a project variable,
                not a surprise.
              </p>
            </div>
            <div className="audience-card card-flat">
              <div className="audience-icon">◈</div>
              <h4>General Contractors</h4>
              <p className="text-muted">
                Verify permit packages for your ICI and residential projects. Know what's
                coming back from the building department before it does.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Future / Moat ─────────────────────────────── */}
      <section className="about-section about-section-alt">
        <div className="container">
          <div className="about-section-inner two-col reverse">
            <div className="about-future-visual card">
              <div className="future-metric">
                <div className="future-metric-number">847</div>
                <div className="future-metric-label">Approved proposals in repository</div>
              </div>
              <div className="future-bar-group">
                <div className="future-bar-label">First-submission approval rate</div>
                <div className="future-bar-row">
                  <span className="future-bar-tag">With PermitFlow</span>
                  <div className="future-bar-track">
                    <div className="future-bar-fill high" style={{ width: '78%' }} />
                  </div>
                  <span className="future-bar-pct">78%</span>
                </div>
                <div className="future-bar-row">
                  <span className="future-bar-tag">Industry average</span>
                  <div className="future-bar-track">
                    <div className="future-bar-fill low" style={{ width: '38%' }} />
                  </div>
                  <span className="future-bar-pct">38%</span>
                </div>
              </div>
            </div>
            <div className="about-section-text">
              <h6>The Road Ahead</h6>
              <h2>A learning engine built from real approvals</h2>
              <p className="text-muted">
                Every project approved through PermitFlow contributes to our repository of successful
                submissions — catalogued by municipality, project type, and reviewing authority. Over time,
                this creates a proprietary dataset that no code document alone can provide.
              </p>
              <p className="text-muted">
                Our AI learns which design decisions correlate with first-submission approvals in
                Scarborough vs. Etobicoke, in mixed-use vs. industrial. That institutional knowledge
                becomes part of every analysis we run — making your recommendations progressively
                sharper as the repository grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-inner">
            <h2>Ready to de-risk your next submission?</h2>
            <p className="text-muted">
              Join GTA architecture and engineering firms already using PermitFlow to reduce
              revision cycles and move projects faster.
            </p>
            <div className="about-hero-actions">
              <button className="btn btn-primary btn-xl" onClick={() => navigate('/pricing')}>
                View Plans & Pricing
              </button>
              <button className="btn btn-outline btn-xl" onClick={() => navigate('/')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="public-footer">
        <div className="container">
          <div className="public-footer-inner">
            <span className="footer-brand">PermitFlow</span>
            <span className="footer-copy">© {new Date().getFullYear()} PermitFlow Inc. Toronto, Ontario.</span>
            <nav className="footer-links">
              <button className="footer-link" onClick={() => navigate('/about')}>About</button>
              <button className="footer-link" onClick={() => navigate('/pricing')}>Pricing</button>
              <button className="footer-link" onClick={() => navigate('/')}>Sign In</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
