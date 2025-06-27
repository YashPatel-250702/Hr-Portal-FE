
import type React from "react"

import { useState } from "react"
import type { Employee } from "../Dashbord"
import { EmployeeForm } from "./employee-form"
import "../../styles/EmployeeList.css"
import axios from "axios"
import { toast } from "react-toastify"

interface EmployeeListProps {
  employees: Employee[]
  loading: boolean
  onRefresh: () => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null> 
  onScroll: () => void
  sidebarOpen: boolean
  onCloseSidebar: () => void
}

export function EmployeeList({
  employees,
  loading,
  onRefresh,
  scrollContainerRef,
  onScroll,
  sidebarOpen,
  onCloseSidebar,
}: EmployeeListProps) {
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState<Employee | null>(null)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [formLoading, setFormLoading] = useState(false)

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

  const handleFormSubmit = async (employee: Employee) => {
    try {
      setFormLoading(true)
      if (formMode === "add") {
        await axios.post("http://localhost:8082/employee/addEmployee", employee)
        toast.success("Employee added successfully!")
      } else {
        await axios.put(`http://localhost:8082/employee/updateEmployee/${employee.employeeId}`, employee)
        toast.success("Employee updated successfully!")
      }
      onRefresh()
      setFormVisible(false)
      setFormData(null)
      setFormMode("add")
    } catch (error) {
      console.error("Error saving employee:", error)
      toast.error("Failed to save employee. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteEmployee = async (empId: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return
    }

    try {
      setFormLoading(true)
      const res = await axios.delete(`http://localhost:8082/employee/deleteEmployee/${empId}`)
      if (res.status === 200) {
        toast.success("Employee deleted successfully!")
        onRefresh()
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast.error("Failed to delete employee. Please try again.")
    } finally {
      setFormLoading(false)
    }
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
    <div className="employee-list-container">
      <div className="employee-list-header">
        <button className="add-employee-btn" onClick={handleAddClick} disabled={loading || formLoading}>
          {loading ? "Loading..." : "➕ Add Employee"}
        </button>
      </div>

      {formVisible && formData && (
        <EmployeeForm
          employee={formData}
          mode={formMode}
          loading={formLoading}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormVisible(false)}
        />
      )}

      {!formVisible && (
        <div className="employee-table-card">
          <div className="table-container" ref={scrollContainerRef} onScroll={onScroll}>
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
                      <div className="loading-container">
                        <div className="loading-spinner"></div>
                        Loading employees...
                      </div>
                    </td>
                  </tr>
                ) : employees.length > 0 ? (
                  employees.map((employee, index) => (
                    <tr key={employee.employeeId}>
                      <td>{index + 1}</td>
                      <td className="employee-id">{employee.employeeId}</td>
                      <td className="employee-name">{employee.name}</td>
                      <td className="employee-email">{employee.email}</td>
                      <td className="employee-mobile">{employee.mobileNumber}</td>
                      <td className="employee-salary">{formatCurrency(employee.salary)}</td>
                      <td className="employee-address">{employee.address || "N/A"}</td>
                      <td className="employee-date">{formatDate(employee.joiningDate)}</td>
                      <td className="employee-position">{employee.position || "N/A"}</td>
                      <td className="employee-department">{employee.departmentName || "N/A"}</td>
                      <td className="employee-hours">{employee.workingHours || "N/A"} hrs</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditClick(employee)}
                            disabled={loading || formLoading}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEmployee(employee.employeeId)}
                            disabled={loading || formLoading}
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
                      <div className="empty-state-content">
                        <div className="empty-state-icon">👥</div>
                        <div>
                          <h3>No employees found</h3>
                          <p>Start by adding your first employee to the system</p>
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
  )
}
