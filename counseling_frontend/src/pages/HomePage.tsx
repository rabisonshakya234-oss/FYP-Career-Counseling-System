// import React from 'react'

import { NavLink } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-vh-100 bg-light">
      <div className="career-page">
        {/* Navigation */}
        <nav className="career-nav">
          <a href="#" className="nav-brand">
            <div className="nav-brand-mark">C</div>
            <span className="nav-brand-text">CareerPath</span>
          </a>
          <ul className="nav-links">
            <li><a href="#">Services</a></li>
            <li><a href="#">Counselors</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#" className="nav-cta">Get Started</a></li>
          </ul>
        </nav>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content">
            <div>
              <div className="hero-badge">Trusted Career Guidance</div>
              <h1 className="hero-title">
                Shape Your Future<br />with <em>Confidence</em>
              </h1>
              <p className="hero-quote">
                "Choose a job you love, and you will never have to work a day in your life." — Confucius
              </p>
              <p className="hero-sub">
                Discover your true potential with expert career guidance tailored just for you
              </p>
              <div className="hero-actions">
                <button className="btn-gold">Get Started</button>
                <button className="btn-outline-white">Learn More</button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">12K+</div>
                  <div className="stat-label">Careers Guided</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">96%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Expert Counselors</div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card-cluster">
                <div className="float-card float-card-main">
                  <div className="float-card-label">Career Match</div>
                  <div className="float-card-value">Software Engineer</div>
                  <div className="float-card-sub">98% compatibility score</div>
                  <div className="progress-mini"><div className="progress-fill" /></div>
                </div>
                <div className="float-card float-card-sm">
                  <div className="float-card-label">Session Today</div>
                  <div className="float-card-value">2:30 PM</div>
                  <div className="float-card-sub">With Dr. Sarah Lin</div>
                </div>
                <div className="float-card float-card-xs">
                  <div className="float-card-label">Assessment</div>
                  <div className="float-card-value">72%</div>
                  <div className="float-card-sub">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="trust-bar">
          <div className="trust-inner">
            <span className="trust-label">Trusted by professionals from</span>
            <div className="trust-divider" />
            <span className="trust-item"><span className="trust-icon">✦</span> Harvard Alumni Network</span>
            <span className="trust-item"><span className="trust-icon">✦</span> Fortune 500 Employees</span>
            <span className="trust-item"><span className="trust-icon">✦</span> Top Universities</span>
            <span className="trust-item"><span className="trust-icon">✦</span> Global NGOs</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-header">
            <div>
              <span className="section-eyebrow">What We Offer</span>
              <h2 className="section-title">Everything You Need to Succeed</h2>
            </div>
            <p className="section-subtitle">
              Comprehensive evaluation of your skills, interests, and personality — matched with the world's leading career experts.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap icon-blue">
                <i className='bx bx-clipboard' style={{ fontSize: '26px' }}></i>
              </div>
              <h5>Personalized Assessment</h5>
              <p>Comprehensive evaluation of your skills, interests, and personality to match you with ideal career paths</p>
              <a href="#" className="feature-link">Learn more →</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap icon-gold">
                <i className='bx bx-group' style={{ fontSize: '26px' }}></i>
              </div>
              <h5>Expert Counselors</h5>
              <p>Connect with experienced career counselors who provide one-on-one guidance and support</p>
              <a href="#" className="feature-link">Learn more →</a>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap icon-green">
                <i className='bx bx-trophy' style={{ fontSize: '26px' }}></i>
              </div>
              <h5>Success Resources</h5>
              <p>Access tools, resources, and actionable insights to help you achieve your career goals</p>
              <a href="#" className="feature-link">Learn more →</a>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="quote-section">
          <div className="quote-inner">
            <div className="quote-ornament" />
            <p className="quote-text">
              "The future belongs to those who believe in the beauty of their dreams."
            </p>
            <div className="quote-author">Eleanor Roosevelt</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-inner">
            <div className="cta-badge">Start Today — It's Free</div>
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-sub">
              Take the first step towards a fulfilling career today
            </p>
            <NavLink to="/questionset/list"> <button className="cta-btn">Begin Your Assessment</button></NavLink>
          </div>
        </div>

        {/* Footer */}
        {/* REMOVED: Footer JSX commented out on request.
            WHERE: Was the last element inside <div className="career-page">,
                   after the CTA section.
            ORIGINAL:
        <footer className="site-footer">
          <p className="footer-text">© 2025 CareerPath Counseling. All rights reserved.</p>
        </footer>
        */}

      </div>
    </div>
  )
}

export default HomePage;