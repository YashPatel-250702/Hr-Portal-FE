"use client"

import "../styles/SideBar.css"

const menuItems = [
  {
    title: "Employees",
    url: "#employees",
    icon: "👥",
    isActive: true,
  },
  {
    title: "Attendance",
    url: "#attendance",
    icon: "📅",
  },
  {
    title: "Progress",
    url: "#progress",
    icon: "📈",
  },
  {
    title: "Profile",
    url: "#profile",
    icon: "👤",
  },
]

interface AppSidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export function AppSidebar({ isOpen, onToggle, onClose }: AppSidebarProps) {
  const handleLogout = () => {
    console.log("Logging out...")
    // Add your logout logic here
  }

  const handleOverlayClick = () => {
    if (isOpen) {
      onClose()
    }
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
                  <a
                    href={item.url}
                    className={`sidebar-menu-button ${item.isActive ? "active" : ""}`}
                    onClick={() => {
                      // Close sidebar on mobile when clicking menu item
                      if (window.innerWidth <= 768) {
                        onClose()
                      }
                    }}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.title}</span>
                  </a>
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
