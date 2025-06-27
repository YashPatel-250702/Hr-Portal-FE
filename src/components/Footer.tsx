import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        {/* Company Info */}
        <div className="footer-column">
          <h3>Employee Management</h3>
          <p>
            A powerful and user-friendly platform to manage employee data, track performance, and streamline HR operations.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/careers">Careers</a>
          <a href="/support">Support</a>
        </div>

        {/* Resources */}
        <div className="footer-column">
          <h4>Resources</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/faq">FAQs</a>
          <a href="/docs">Documentation</a>
        </div>

        {/* Social Media */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 Employee Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}
