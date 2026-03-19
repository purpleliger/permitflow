import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  projectsPerMonth: string;
  seats: string;
  municipalities: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For independent practitioners exploring the platform',
    monthlyPrice: 0,
    annualPrice: 0,
    projectsPerMonth: '2 projects / month',
    seats: '1 seat',
    municipalities: 'City of Toronto only',
    features: [
      'OBC, Ontario Fire Code, AODA checks',
      'City of Toronto Zoning Bylaw 569-2013',
      'PDF compliance report export',
      'Up to 5 documents per project',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For active architecture and engineering practices',
    monthlyPrice: 299,
    annualPrice: 239,
    projectsPerMonth: '20 projects / month',
    seats: '3 seats',
    municipalities: 'All GTA municipalities',
    features: [
      'Everything in Starter',
      'All GTA municipal zoning bylaws',
      'Toronto Green Standard v4 checks',
      'NBC 2020 federal code compliance',
      'AI-powered remediation suggestions',
      'Unlimited documents per project',
      'Priority email support (24h SLA)',
      'Team workspace & project sharing',
    ],
    cta: 'Start 14-Day Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'For high-volume firms and multi-discipline teams',
    monthlyPrice: 799,
    annualPrice: 639,
    projectsPerMonth: 'Unlimited projects',
    seats: '10 seats',
    municipalities: 'All GTA + provincial expansion',
    features: [
      'Everything in Professional',
      'Approved proposals repository access',
      'AI success-rate benchmarking',
      'Custom jurisdiction configuration',
      'API access for workflow integration',
      'Advanced reporting & audit trail',
      'Priority phone + email support',
      'Dedicated onboarding session',
    ],
    cta: 'Start 14-Day Trial',
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);

  const formatPrice = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 'Free';
    const price = annual ? plan.annualPrice : plan.monthlyPrice;
    return `$${price?.toLocaleString()}`;
  };

  return (
    <div className="pricing-page">
      {/* ── Public Nav ──────────────────────────────────── */}
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
              <button className="nav-link" onClick={() => navigate('/about')}>About</button>
              <button className="nav-link active" onClick={() => navigate('/pricing')}>Pricing</button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>Sign In</button>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="pricing-hero">
        <div className="container">
          <div className="pricing-hero-inner text-center">
            <div className="pricing-eyebrow">Transparent Pricing</div>
            <h1 className="pricing-title">
              Straightforward plans for every practice size
            </h1>
            <p className="pricing-subtitle">
              Start free. Scale as your project volume grows. Cancel any time.
            </p>

            {/* Billing toggle */}
            <div className="billing-toggle">
              <span className={!annual ? 'toggle-label active' : 'toggle-label'}>Monthly</span>
              <button
                className={`toggle-switch ${annual ? 'annual' : ''}`}
                onClick={() => setAnnual(!annual)}
                aria-label="Toggle annual billing"
              >
                <span className="toggle-thumb" />
              </button>
              <span className={annual ? 'toggle-label active' : 'toggle-label'}>
                Annual
                <span className="toggle-badge">Save 20%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Plans ───────────────────────────────────────── */}
      <section className="pricing-plans-section">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.highlighted ? 'plan-card-highlighted' : 'card-flat'}`}
              >
                {plan.badge && (
                  <div className="plan-badge">{plan.badge}</div>
                )}

                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                </div>

                <div className="plan-price">
                  <span className="price-amount">{formatPrice(plan)}</span>
                  {plan.monthlyPrice !== 0 && (
                    <span className="price-period">
                      / mo{annual ? ', billed annually' : ''}
                    </span>
                  )}
                  {plan.monthlyPrice !== 0 && annual && (
                    <div className="price-monthly-equiv">
                      ${plan.monthlyPrice}/mo billed monthly
                    </div>
                  )}
                </div>

                <div className="plan-limits">
                  <div className="plan-limit-item">
                    <span className="limit-icon">↗</span>
                    {plan.projectsPerMonth}
                  </div>
                  <div className="plan-limit-item">
                    <span className="limit-icon">◎</span>
                    {plan.seats}
                  </div>
                  <div className="plan-limit-item">
                    <span className="limit-icon">⊕</span>
                    {plan.municipalities}
                  </div>
                </div>

                <button
                  className={`btn btn-lg plan-cta ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => navigate('/')}
                >
                  {plan.cta}
                </button>

                <div className="plan-features">
                  <div className="plan-features-label">What's included</div>
                  <ul>
                    {plan.features.map((f, i) => (
                      <li key={i}>
                        <span className="feature-check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise row */}
          <div className="enterprise-card card-flat">
            <div className="enterprise-left">
              <div className="enterprise-eyebrow">Enterprise</div>
              <h3>Built for large development groups and multi-office firms</h3>
              <p className="text-muted">
                Custom project volumes, unlimited seats, white-label deployment, on-premises AI model
                hosting, dedicated compliance configuration, and SLA-backed support. Includes early
                access to the approved proposals repository and AI benchmarking features.
              </p>
            </div>
            <div className="enterprise-right">
              <div className="enterprise-price">Custom pricing</div>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => window.location.href = 'mailto:enterprise@permitflow.ca'}
              >
                Contact Sales
              </button>
              <p className="enterprise-note">Typically responds within 1 business day</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ───────────────────────────── */}
      <section className="comparison-section">
        <div className="container">
          <h2 className="comparison-title">Detailed feature comparison</h2>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th className="col-highlighted">Professional</th>
                  <th>Studio</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-section-row"><td colSpan={4}>Code Coverage</td></tr>
                <tr>
                  <td>Ontario Building Code (OBC)</td>
                  <td><Check /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Ontario Fire Code</td>
                  <td><Check /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>AODA Design of Public Spaces</td>
                  <td><Check /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>National Building Code (NBC) 2020</td>
                  <td><Dash /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>City of Toronto Zoning Bylaw 569-2013</td>
                  <td><Check /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Toronto Green Standard v4</td>
                  <td><Dash /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>GTA regional municipality bylaws</td>
                  <td><Dash /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Custom jurisdictions</td>
                  <td><Dash /></td><td className="col-highlighted"><Dash /></td><td><Check /></td>
                </tr>

                <tr className="table-section-row"><td colSpan={4}>Platform</td></tr>
                <tr>
                  <td>Projects per month</td>
                  <td>2</td><td className="col-highlighted">20</td><td>Unlimited</td>
                </tr>
                <tr>
                  <td>Team seats</td>
                  <td>1</td><td className="col-highlighted">3</td><td>10</td>
                </tr>
                <tr>
                  <td>Documents per project</td>
                  <td>5</td><td className="col-highlighted">Unlimited</td><td>Unlimited</td>
                </tr>
                <tr>
                  <td>PDF report export</td>
                  <td><Check /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>API access</td>
                  <td><Dash /></td><td className="col-highlighted"><Dash /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Approved proposals repository</td>
                  <td><Dash /></td><td className="col-highlighted"><Dash /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>AI success-rate benchmarking</td>
                  <td><Dash /></td><td className="col-highlighted"><Dash /></td><td><Check /></td>
                </tr>

                <tr className="table-section-row"><td colSpan={4}>Support</td></tr>
                <tr>
                  <td>Community support</td>
                  <td><Check /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Priority email (24h SLA)</td>
                  <td><Dash /></td><td className="col-highlighted"><Check /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Phone support</td>
                  <td><Dash /></td><td className="col-highlighted"><Dash /></td><td><Check /></td>
                </tr>
                <tr>
                  <td>Dedicated onboarding</td>
                  <td><Dash /></td><td className="col-highlighted"><Dash /></td><td><Check /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently asked questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is the AI analysis legally binding?</h4>
              <p>No. PermitFlow is a pre-submission review tool that helps identify likely compliance gaps. It does not constitute legal or professional engineering advice. Final permit responsibility remains with the registered professional of record.</p>
            </div>
            <div className="faq-item">
              <h4>How current are the bylaws and codes?</h4>
              <p>We maintain a continuously updated database of Ontario and GTA municipal bylaws. Major amendments are reflected within 30 days of coming into force. Each report includes the version of the code used in the analysis.</p>
            </div>
            <div className="faq-item">
              <h4>Can I try it before committing?</h4>
              <p>The Starter plan is free with no credit card required. Professional and Studio plans include a 14-day full-feature trial. You can upgrade, downgrade, or cancel from your account settings at any time.</p>
            </div>
            <div className="faq-item">
              <h4>What file types are supported?</h4>
              <p>PDF, DWG, DXF, DOCX, and image files (JPG, PNG). For drawings, we use OCR and vector extraction to identify dimensions, annotations, and compliance-relevant elements. Text-heavy specifications are processed directly.</p>
            </div>
            <div className="faq-item">
              <h4>Which GTA municipalities are covered on Professional?</h4>
              <p>City of Toronto, City of Mississauga, City of Brampton, City of Markham, City of Vaughan, Town of Richmond Hill, Town of Oakville, and City of Burlington. We're adding York Region, Peel Region, and Durham Region frameworks in Q2 2026.</p>
            </div>
            <div className="faq-item">
              <h4>Can I self-host the AI model for enterprise deployments?</h4>
              <p>Yes. The Enterprise plan supports on-premises model deployment on AWS ECS or Alibaba Cloud (ApsaraDB) infrastructure. Contact sales for technical requirements and configuration documentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
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

const Check = () => <span className="table-check" aria-label="Included">✓</span>;
const Dash  = () => <span className="table-dash"  aria-label="Not included">—</span>;

export default Pricing;
