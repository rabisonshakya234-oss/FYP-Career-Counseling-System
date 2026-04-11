import { NavLink } from "react-router-dom";


function Footer() {
    return (
        <div>

            <footer className="Footer">
                <div className="container">

                    {/* ── Top Section ── */}
                    <div className="row footer-top">

                        {/* ── Brand Column ── */}
                        <div className="col-12 col-md-4 footer-brand-col">
                            <div className="footer-brand">
                                <i className="bx bx-briefcase-alt-2 footer-brand-icon" />
                                <span className="footer-brand-name">Career Counseling</span>
                            </div>
                            <p className="footer-brand-desc">
                                Guiding you toward the future you deserve — one step at a time.
                                Our expert counselors help students find their perfect career path.
                            </p>

                            {/* Social Icons */}
                            <div className="footer-socials">
                                <a href="#" className="footer-social-link" aria-label="Facebook">
                                    <i className="bx bxl-facebook" />
                                </a>
                                <a href="#" className="footer-social-link" aria-label="Twitter">
                                    <i className="bx bxl-twitter" />
                                </a>
                                <a href="#" className="footer-social-link" aria-label="LinkedIn">
                                    <i className="bx bxl-linkedin" />
                                </a>
                                <a href="#" className="footer-social-link" aria-label="Instagram">
                                    <i className="bx bxl-instagram" />
                                </a>
                            </div>
                        </div>

                        {/* ── Quick Links Column ── */}
                        <div className="col-6 col-md-2 footer-links-col">
                            <h6 className="footer-col-title">Quick Links</h6>
                            <ul className="footer-links-list">
                                <li>
                                    <NavLink to="/" className="footer-link">
                                        <i className="bx bx-chevron-right" /> Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about" className="footer-link">
                                        <i className="bx bx-chevron-right" /> About Us
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/login" className="footer-link">
                                        <i className="bx bx-chevron-right" /> Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/signup" className="footer-link">
                                        <i className="bx bx-chevron-right" /> Sign Up
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                        {/* ── Services Column ── */}
                        <div className="col-6 col-md-3 footer-links-col">
                            <h6 className="footer-col-title">Our Services</h6>
                            <ul className="footer-links-list">
                                <li>
                                    <a href="#" className="footer-link">
                                        <i className="bx bx-chevron-right" /> Career Assessment
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">
                                        <i className="bx bx-chevron-right" /> One-on-One Counseling
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">
                                        <i className="bx bx-chevron-right" /> Quiz & Evaluation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">
                                        <i className="bx bx-chevron-right" /> Student Dashboard
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* ── Contact Column ── */}
                        <div className="col-12 col-md-3 footer-contact-col">
                            <h6 className="footer-col-title">Contact Us</h6>
                            <ul className="footer-contact-list">
                                <li className="footer-contact-item">
                                    <i className="bx bx-map footer-contact-icon" />
                                    <span>Kathmandu, Nepal</span>
                                </li>
                                <li className="footer-contact-item">
                                    <i className="bx bx-phone footer-contact-icon" />
                                    <span>+977 9861492520</span>
                                </li>
                                <li className="footer-contact-item">
                                    <i className="bx bx-envelope footer-contact-icon" />
                                    <span>rabisonshakya6@gmail.com</span>
                                </li>
                                <li className="footer-contact-item">
                                    <i className="bx bx-time footer-contact-icon" />
                                    <span>Sun – Fri: 9:00 AM – 5:00 PM</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* ── Divider ── */}
                    <hr className="footer-divider" />

                </div>

                {/* ── Bottom Section ── */}
                <div className="footer-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 footer-bottom-left">
                                <p className="footer-copy">
                                    &copy; {new Date().getFullYear()} Career Counseling System. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </footer>

        </div>
    );
}

export default Footer;