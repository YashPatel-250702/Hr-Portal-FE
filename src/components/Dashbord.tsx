"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import "../styles/Dashboard.css"
import { toast } from "react-toastify"
import { AppSidebar } from "./SideBar"

interface Employee {
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

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState<Employee | null>(null)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [sidebarOpen, setSidebarOpen] = useState(false) // Changed to false - sidebar closed by default
  const [loading, setLoading] = useState(false)

  // Refs for scroll detection
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollLeft = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Improved scroll detection with useCallback
  const handleScroll = useCallback(() => {
    if (!tableContainerRef.current || !sidebarOpen) return

    const container = tableContainerRef.current
    const currentScrollLeft = container.scrollLeft
    const scrollDifference = currentScrollLeft - lastScrollLeft.current

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // If scrolling right (positive difference) and scrolled more than 30px
    if (scrollDifference > 0 && currentScrollLeft > 30) {
      // Add a small delay to prevent accidental closing
      scrollTimeoutRef.current = setTimeout(() => {
        setSidebarOpen(false)
        toast.info("Sidebar closed for better table viewing", {
          position: "bottom-right",
          autoClose: 2000,
        })
      }, 200)
    }

    lastScrollLeft.current = currentScrollLeft
  }, [sidebarOpen])

  // Set up scroll listener
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    // Add scroll event listener
    container.addEventListener("scroll", handleScroll, { passive: true })

    // Cleanup
    return () => {
      container.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [handleScroll])

  // Close sidebar when clicking outside on mobile
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

  const handleAddClick = () => {
    setFormMode("add")
    setFormData({
      employeeId: "",
      name: "",
      email: "",
      mobileNumber: "",
      salary: 0,
      address: "",
      joiningDate: new Date(),
      position: "",
      departmentName: "",
      workingHours: 0,
    })
    setFormVisible(true)
  }

  const handleEditClick = (employee: Employee) => {
    setFormMode("edit")
    setFormData({ ...employee })
    setFormVisible(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (formData) {
      const value = e.target.type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value
      setFormData({
        ...formData,
        [e.target.id]: value,
      })
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData) return

    try {
      setLoading(true)
      if (formMode === "add") {
        await axios.post("http://localhost:8082/employee/addEmployee", formData)
        toast.success("Employee added successfully!")
      } else {
        await axios.put(`http://localhost:8082/employee/updateEmployee/${formData?.employeeId}`, formData)
        toast.success("Employee updated successfully!")
      }
      fetchEmployees()
      setFormVisible(false)
      setFormData(null)
      setFormMode("add")
    } catch (error) {
      console.error("Error adding/updating employee:", error)
      toast.error("Failed to save employee. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async (empId: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return
    }

    try {
      setLoading(true)
      const res = await axios.delete(`http://localhost:8082/employee/deleteEmployee/${empId}`)
      if (res.status === 200) {
        toast.success("Employee deleted successfully!")
        fetchEmployees()
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast.error("Failed to delete employee. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    // Reset scroll position when toggling
    lastScrollLeft.current = 0
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="sidebar-provider">
      <AppSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onClose={closeSidebar} />

      <div className={`main-content ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
        {/* Simplified header with just hamburger menu */}
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
              <h1 className="dashboard-title">Employee Directory</h1>
              <p className="dashboard-subtitle">Manage your team members and their information</p>
            </div>
            <button className="add-employee-btn" onClick={handleAddClick} disabled={loading}>
              {loading ? "Loading..." : "➕ Add Employee"}
            </button>
          </div>

          {formVisible && formData && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">{formMode === "edit" ? "✏️ Edit Employee" : "➕ Add New Employee"}</h2>
              </div>
              <div className="card-content">
                <form onSubmit={handleFormSubmit} className={`employee-form ${loading ? "loading" : ""}`}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="employeeId" className="form-label">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        id="employeeId"
                        className="form-input"
                        value={formData.employeeId}
                        onChange={handleFormChange}
                        disabled={formMode === "edit"}
                        placeholder="Enter employee ID"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobileNumber" className="form-label">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        className="form-input"
                        value={formData.mobileNumber}
                        onChange={handleFormChange}
                        placeholder="Enter mobile number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="salary" className="form-label">
                        Salary (₹) *
                      </label>
                      <input
                        type="number"
                        id="salary"
                        className="form-input"
                        value={formData.salary}
                        onChange={handleFormChange}
                        placeholder="Enter salary amount"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="workingHours" className="form-label">
                        Working Hours *
                      </label>
                      <input
                        type="number"
                        id="workingHours"
                        className="form-input"
                        value={formData.workingHours}
                        onChange={handleFormChange}
                        placeholder="Enter working hours"
                        min="0"
                        max="24"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        className="form-input"
                        value={formData.address}
                        onChange={handleFormChange}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="joiningDate" className="form-label">
                        Joining Date *
                      </label>
                      <input
                        type="date"
                        id="joiningDate"
                        className="form-input"
                        value={
                          typeof formData.joiningDate === "string"
                            ? formData.joiningDate
                            : new Date(formData.joiningDate).toISOString().split("T")[0]
                        }
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="position" className="form-label">
                        Position *
                      </label>
                      <select
                        id="position"
                        className="form-select"
                        value={formData.position}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select Position</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Associate Software Developer">Associate Software Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Quality Analyst">Quality Analyst</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="System Administrator">System Administrator</option>
                        <option value="Business Analyst">Business Analyst</option>
                        <option value="Network Engineer">Network Engineer</option>
                        <option value="Database Administrator">Database Administrator</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="departmentName" className="form-label">
                        Department *
                      </label>
                      <select
                        id="departmentName"
                        className="form-select"
                        value={formData.departmentName}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="IT">IT</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : formMode === "edit" ? "💾 Update Employee" : "➕ Add Employee"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setFormVisible(false)}
                      disabled={loading}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!formVisible && (
            <div className="card">
              <div
                className="table-container"
                ref={tableContainerRef}
                style={{
                  overflowX: "auto",
                  border: sidebarOpen ? "2px solid #3b82f6" : "1px solid #f1f5f9",
                  transition: "border-color 0.3s ease",
                }}
              >
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Salary</th>
                      <th>Address</th>
                      <th>Joining Date</th>
                      <th>Position</th>
                      <th>Department</th>
                      <th>Working Hours</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={12} className="empty-state">
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                border: "2px solid #e2e8f0",
                                borderTop: "2px solid #667eea",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                              }}
                            ></div>
                            Loading employees...
                          </div>
                        </td>
                      </tr>
                    ) : employees.length > 0 ? (
                      employees.map((employee, index) => (
                        <tr key={employee.employeeId}>
                          <td>{index + 1}</td>
                          <td style={{ fontWeight: "600", color: "#374151" }}>{employee.employeeId}</td>
                          <td style={{ fontWeight: "500", color: "#1f2937" }}>{employee.name}</td>
                          <td style={{ color: "#6b7280" }}>{employee.email}</td>
                          <td style={{ color: "#6b7280" }}>{employee.mobileNumber}</td>
                          <td style={{ fontWeight: "600", color: "#059669" }}>{formatCurrency(employee.salary)}</td>
                          <td style={{ color: "#6b7280" }}>{employee.address || "N/A"}</td>
                          <td style={{ color: "#6b7280" }}>{formatDate(employee.joiningDate)}</td>
                          <td style={{ color: "#374151" }}>{employee.position || "N/A"}</td>
                          <td style={{ color: "#374151" }}>{employee.departmentName || "N/A"}</td>
                          <td style={{ color: "#6b7280" }}>{employee.workingHours || "N/A"} hrs</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleEditClick(employee)}
                                disabled={loading}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteEmployee(employee.employeeId)}
                                disabled={loading}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="empty-state">
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                            <div style={{ fontSize: "3rem" }}>👥</div>
                            <div>
                              <h3 style={{ margin: "0 0 0.5rem 0", color: "#374151" }}>No employees found</h3>
                              <p style={{ margin: 0, color: "#6b7280" }}>
                                Start by adding your first employee to the system
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      
    </div>
  )
}
