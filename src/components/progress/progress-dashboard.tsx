

import type { Employee } from"../Dashbord"
import "../../styles/ProgressDashboard.css"

interface ProgressDashboardProps {
  employees: Employee[]
  loading: boolean
}

export function ProgressDashboard({ employees, loading }: ProgressDashboardProps) {
  return (
    <div className="progress-container">
      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Active Goals</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Avg Progress</h3>
            <p className="stat-number">0%</p>
          </div>
        </div>
      </div>

      <div className="progress-actions">
        <div className="goals-card">
          <div className="goals-header">
            <h2>Goal Management</h2>
            <button className="btn btn-primary">➕ Add New Goal</button>
          </div>
          <div className="goals-summary">
            <div className="progress-circle">
              <div className="circle-progress">
                <span>0%</span>
              </div>
              <p>Overall Progress</p>
            </div>
            <div className="goals-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-color completed"></span>
                <span>Completed: 0</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-color in-progress"></span>
                <span>In Progress: 0</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-color pending"></span>
                <span>Pending: 0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="performance-card">
          <h3>Performance Metrics</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span>Goal Completion Rate</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: "0%" }}></div>
              </div>
              <span>0%</span>
            </div>
            <div className="metric-item">
              <span>Average Time to Complete</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: "0%" }}></div>
              </div>
              <span>0 days</span>
            </div>
            <div className="metric-item">
              <span>Team Performance</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: "0%" }}></div>
              </div>
              <span>0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-table-card">
        <div className="table-header">
          <h3>Employee Progress</h3>
          <div className="table-filters">
            <select className="filter-select">
              <option>All Employees</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name}
                </option>
              ))}
            </select>
            <select className="filter-select">
              <option>All Goals</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th>Progress</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      Loading progress data...
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="empty-state-content">
                      <div className="empty-state-icon">📈</div>
                      <div>
                        <h3>No goals set yet</h3>
                        <p>Start by creating goals for your team members</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
