
import "../styles/SideBar.css"
import { SectionType } from "./Dashbord"


const menuItems = [
  {
    title: "Employees",
    section: "employees" as SectionType,
    icon: "👥",
  },
  {
    title: "Attendance",
    section: "attendance" as SectionType,
    icon: "📅",
  },
  {
    title: "Progress",
    section: "progress" as SectionType,
    icon: "📈",
  },
  {
    title: "Profile",
    section: "profile" as SectionType,
    icon: "👤",
  },
]

interface AppSidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  activeSection: SectionType
  onSectionChange: (section: SectionType) => void
}

export function AppSidebar({ isOpen, onToggle, onClose, activeSection, onSectionChange }: AppSidebarProps) {
  const handleLogout = () => {
    console.log("Logging out...")
    // Add your logout logic here
  }

  const handleOverlayClick = () => {
    if (isOpen) {
      onClose()
    }
  }

  const handleMenuClick = (section: SectionType) => {
    onSectionChange(section)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={handleOverlayClick} />}

      <div className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">🏢</div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">HR Dashboard</span>
              <span className="sidebar-brand-subtitle">Management System</span>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-group">
            <div className="sidebar-group-label">Navigation</div>
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.title} className="sidebar-menu-item">
                  <button
                    className={`sidebar-menu-button ${activeSection === item.section ? "active" : ""}`}
                    onClick={() => handleMenuClick(item.section)}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <button className="sidebar-menu-button" onClick={handleLogout}>
                <span className="icon">🚪</span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
