import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 className="logo">Employee Management</h1>
      <div className="header-right">
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#blogs">Blogs</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="login-btn" onClick={handleLogin}>
          Login/Register
        </button>
      </div>
    </header>
  );
}
