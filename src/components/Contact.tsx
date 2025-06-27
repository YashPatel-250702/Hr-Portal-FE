import '../styles/Contact.css';

export default function Contact() {
  return (
    <div className="contact-section">
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Please fill out the form below and we'll get in touch with you soon.</p>
      
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows={5} required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
