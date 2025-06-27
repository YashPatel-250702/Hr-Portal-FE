import '../styles/Hero.css';
import { useNavigate } from 'react-router-dom';
export default function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="hero">
      <img src="/assets/banner.jpg" alt="Office banner" className="hero-image" />
      <div>
        <h1>Welcome to Employee Management</h1>
        <p>Manage your employees efficiently and effectively.</p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}
