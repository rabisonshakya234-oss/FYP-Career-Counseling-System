import { NavLink } from "react-router-dom";

function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-black text-capitalize">about our career counseling system</h1>
              <p className="lead text-black">
                Empowering individuals to discover their true potential and navigate successful career paths with expert guidance and personalized support.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Career counseling session"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="bi bi-bullseye text-primary" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h3 className="fw-bold mb-3">Our Mission</h3>
                  <p className="text-muted">
                    To provide comprehensive career guidance that helps students and professionals make informed decisions about their educational and career paths, enabling them to achieve their full potential and career satisfaction.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="bi bi-eye text-primary" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h3 className="fw-bold mb-3">Our Vision</h3>
                  <p className="text-muted">
                    To be the leading career counseling platform that transforms lives by bridging the gap between aspirations and achievements, creating a future where everyone finds fulfillment in their chosen career path.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">What We Offer</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-person-check text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold">Personalized Counseling</h5>
                <p className="text-muted">
                  One-on-one sessions tailored to your unique skills, interests, and career goals.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-clipboard-data text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold">Career Assessments</h5>
                <p className="text-muted">
                  Comprehensive aptitude and personality tests to identify your strengths and ideal career matches.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-briefcase text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold">Industry Insights</h5>
                <p className="text-muted">
                  Up-to-date information on career trends, job markets, and industry requirements.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold">Resume & Portfolio Building</h5>
                <p className="text-muted">
                  Expert guidance on creating compelling resumes and professional portfolios.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-chat-dots text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold">Interview Preparation</h5>
                <p className="text-muted">
                  Mock interviews and coaching to help you ace your job interviews with confidence.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-graph-up-arrow text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold">Career Development Plans</h5>
                <p className="text-muted">
                  Strategic roadmaps to help you achieve your short-term and long-term career objectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Meet Our Expert Counselors</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
                  className="card-img-top"
                  alt="Career counselor"
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">Dr. Michael Roberts</h5>
                  <p className="text-primary small mb-2">Senior Career Counselor</p>
                  <p className="text-muted small mb-3">
                    Ph.D. in Psychology | 15+ years experience in career guidance and student counseling
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-linkedin fs-5"></i>
                    </NavLink>
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-envelope fs-5"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
                  className="card-img-top"
                  alt="Career counselor"
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">Sarah Thompson</h5>
                  <p className="text-primary small mb-2">Education & Career Specialist</p>
                  <p className="text-muted small mb-3">
                    M.A. in Counseling | Specialized in academic planning and career transitions
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-linkedin fs-5"></i>
                    </NavLink>
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-envelope fs-5"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
                  className="card-img-top"
                  alt="Career counselor"
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">David Chen</h5>
                  <p className="text-primary small mb-2">Technology Career Advisor</p>
                  <p className="text-muted small mb-3">
                    MBA & Industry Expert | Former HR Director at leading tech companies
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-linkedin fs-5"></i>
                    </NavLink>
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-envelope fs-5"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
                  className="card-img-top"
                  alt="Career counselor"
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">Dr. Emily Johnson</h5>
                  <p className="text-primary small mb-2">Healthcare Career Specialist</p>
                  <p className="text-muted small mb-3">
                    Ph.D. in Career Development | Expert in medical and healthcare career pathways
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-linkedin fs-5"></i>
                    </NavLink>
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-envelope fs-5"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                  className="card-img-top"
                  alt="Career counselor"
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">James Anderson</h5>
                  <p className="text-primary small mb-2">Business & Finance Advisor</p>
                  <p className="text-muted small mb-3">
                    MBA in Finance | 12+ years experience in business consulting and career planning
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-linkedin fs-5"></i>
                    </NavLink>
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-envelope fs-5"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
                  className="card-img-top"
                  alt="Career counselor"
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">Lisa Martinez</h5>
                  <p className="text-primary small mb-2">Creative Arts Career Counselor</p>
                  <p className="text-muted small mb-3">
                    M.F.A. in Arts Administration | Specialized in creative industries and media careers
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-linkedin fs-5"></i>
                    </NavLink>
                    <NavLink to="#" className="text-primary">
                      <i className="bi bi-envelope fs-5"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <div className="p-3">
                <h2 className="display-4 fw-bold text-primary">5000+</h2>
                <p className="text-muted">Students Counseled</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <h2 className="display-4 fw-bold text-primary">95%</h2>
                <p className="text-muted">Success Rate</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <h2 className="display-4 fw-bold text-primary">10+</h2>
                <p className="text-muted">Years of Experience</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <h2 className="display-4 fw-bold text-primary">50+</h2>
                <p className="text-muted">Partner Companies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-3 fw-bold">Ready to Start Your Career Journey?</h2>
          <p className="lead mb-4 fw-medium">
            Start a chat with our career counselors
          </p>
          <NavLink to="/chat" className="btn btn-light btn-lg px-5 text-capitalize fw-medium">
            chat with our career counselors
          </NavLink>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;