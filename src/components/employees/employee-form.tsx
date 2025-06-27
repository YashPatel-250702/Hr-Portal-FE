

import type React from "react"

import { useState } from "react"
import type { Employee } from "../Dashbord"
import "../../styles/EmployeeForm.css"

interface EmployeeFormProps {
  employee: Employee
  mode: "add" | "edit"
  loading: boolean
  onSubmit: (employee: Employee) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, mode, loading, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Employee>(employee)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value
    setFormData({
      ...formData,
      [e.target.id]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="employee-form-card">
      <div className="employee-form-header">
        <h2 className="employee-form-title">{mode === "edit" ? "✏️ Edit Employee" : "➕ Add New Employee"}</h2>
      </div>
      <div className="employee-form-content">
        <form onSubmit={handleSubmit} className={`employee-form ${loading ? "loading" : ""}`}>
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
                onChange={handleChange}
                disabled={mode === "edit"}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="position" className="form-label">
                Position *
              </label>
              <select id="position" className="form-select" value={formData.position} onChange={handleChange} required>
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
                onChange={handleChange}
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
              {loading ? "Saving..." : mode === "edit" ? "💾 Update Employee" : "➕ Add Employee"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
