import '../styles/About.css'; 

export default function About() {
  return (
    <div className="about-section">
      <div className="about-image">
        <img src="/assets/about.jpg" alt="About Us" />
      </div>
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          At Employee Management, we believe that managing people should be simple, efficient, and stress-free.
          Our platform is designed to help businesses of all sizes streamline employee data, improve team productivity,
          and simplify HR operations. From onboarding to attendance tracking, we provide tools that help you manage your
          workforce with confidence and clarity.
        </p>
        <h2>How We Started</h2>
        <p>
          Founded in 2025 by a group of HR professionals and software engineers, Employee Management was born
          out of frustration with outdated, overly complex systems used in modern workplaces.
        </p>
      </div>
    </div>
  );
}
