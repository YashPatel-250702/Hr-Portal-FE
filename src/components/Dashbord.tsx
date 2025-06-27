
import { useState, useRef, useCallback, useEffect } from "react"
import axios from "axios"
import "../styles/Dashboard.css"
import { toast } from "react-toastify"
import { ProgressDashboard } from "./progress/progress-dashboard"
import { EmployeeList } from "./employees/employee.list"
import { AttendanceDashboard } from "./attendence/attendence-dashboard"
import { AppSidebar } from "./SideBar"

export interface Employee {
  employeeId: string
  name: string
  email: string
  mobileNumber: string
  salary: number
  address: string
  joiningDate: Date
  position: string
  departmentName: string
  workingHours: number
}

export type SectionType = "employees" | "attendance" | "progress" | "profile"

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [activeSection, setActiveSection] = useState<SectionType>("employees")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Refs for scroll detection
   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
   const lastScrollLeft = useRef<number>(0);
   const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
 

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const employeesData = await axios.get("http://localhost:8082/employee/getAllEmployees")
      if (employeesData.status === 200) {
        setEmployees(employeesData.data as Employee[])
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setEmployees([])
      toast.error("Failed to fetch employees")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Scroll detection for auto-closing sidebar
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !sidebarOpen) return

    const container = scrollContainerRef.current
    const currentScrollLeft = container.scrollLeft
    const scrollDifference = currentScrollLeft - lastScrollLeft.current

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    if (scrollDifference > 0 && currentScrollLeft > 30) {
      scrollTimeoutRef.current = setTimeout(() => {
        setSidebarOpen(false)
        toast.info("Sidebar closed for better viewing", {
          position: "bottom-right",
          autoClose: 2000,
        })
      }, 200)
    }

    lastScrollLeft.current = currentScrollLeft
  }, [sidebarOpen])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const sidebar = document.querySelector(".sidebar")
      const trigger = document.querySelector(".sidebar-trigger")

      if (sidebarOpen && sidebar && !sidebar.contains(target) && !trigger?.contains(target)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [sidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    lastScrollLeft.current = 0
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section)
    // Close sidebar on mobile when switching sections
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "employees":
        return (
          <EmployeeList
            employees={employees}
            loading={loading}
            onRefresh={fetchEmployees}
            scrollContainerRef={scrollContainerRef}
            onScroll={handleScroll}
            sidebarOpen={sidebarOpen}
            onCloseSidebar={closeSidebar}
          />
        )
      case "attendance":
        return <AttendanceDashboard employees={employees} loading={loading} />
      case "progress":
        return <ProgressDashboard employees={employees} loading={loading} />
      case "profile":
        return (
          <div className="profile-placeholder">
            <h2>Profile Section</h2>
            <p>Profile management coming soon...</p>
          </div>
        )
      default:
        return (
          <EmployeeList
            employees={employees}
            loading={loading}
            onRefresh={fetchEmployees}
            scrollContainerRef={scrollContainerRef}
            onScroll={handleScroll}
            sidebarOpen={sidebarOpen}
            onCloseSidebar={closeSidebar}
          />
        )
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "employees":
        return "Employee Directory"
      case "attendance":
        return "Attendance Management"
      case "progress":
        return "Progress Tracking"
      case "profile":
        return "Profile Settings"
      default:
        return "Dashboard"
    }
  }

  const getSectionSubtitle = () => {
    switch (activeSection) {
      case "employees":
        return "Manage your team members and their information"
      case "attendance":
        return "Track employee attendance and working hours"
      case "progress":
        return "Monitor goals and performance metrics"
      case "profile":
        return "Manage your account settings"
      default:
        return "Welcome to your dashboard"
    }
  }

  return (
    <div className="sidebar-provider">
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className={`main-content ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
        <header className="main-header">
          <button className="sidebar-trigger" onClick={toggleSidebar} title="Open Menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </header>

        <div className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">{getSectionTitle()}</h1>
              <p className="dashboard-subtitle">{getSectionSubtitle()}</p>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}
