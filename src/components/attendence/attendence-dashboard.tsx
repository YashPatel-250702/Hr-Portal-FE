import { Employee } from "../Dashbord";
import "../../styles/AttendenceDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface AttendanceEvent {
  type: string;
  timestamp: string;
}

interface AttendanceRecord {
  date: string;
  employeeId: string;
  totalHours: number;
  events: AttendanceEvent[];
}

interface AttendanceDashboardProps {
  employees: Employee[];
  loading: boolean;
}

export function AttendanceDashboard({ employees, loading }: AttendanceDashboardProps) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [currentDay,setCurrentDay] = useState<string>(() => {
    const d = new Date();
    let day = d.getDay();
    return daysOfWeek[day];
  })

  const [liveTime, setLiveTime] = useState<string>(() =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  const fetchAttendanceData = async (date: string) => {
    try {
      const response = await axios.get<AttendanceRecord[]>(
        `http://localhost:8082/employee/attandence/logsByDate/${date}`
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setCurrentDay(daysOfWeek[new Date(e.target.value).getDay()]);
  };

  const currentDateFormatted = new Date(selectedDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="attendance-container">
      {/* STATS */}
      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{employees.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Present Today</h3>
            <p className="stat-number">{attendanceData.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Absent Today</h3>
            <p className="stat-number">{employees.length - attendanceData.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Late Arrivals</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>

      {/* CLOCK IN OUT */}
      <div className="attendance-actions">
        <div className="clock-in-card">
          <div className="clock-header">
            <h2>Clock In/Out</h2>
            <div className="current-time">
              <p className="date">{currentDateFormatted}</p>
              <p className="time">{liveTime}</p>
            </div>
          </div>
          <div className="clock-actions">
            <button className="btn btn-success">🕐 Clock In</button>
            <button className="btn btn-danger">🕐 Clock Out</button>
          </div>
        </div>

        <div className="quick-actions-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="btn btn-outline">📊 View Reports</button>
            <button className="btn btn-outline">📅 Mark Leave</button>
            <button className="btn btn-outline">⏰ Overtime Request</button>
            <button className="btn btn-outline">📋 Export Data</button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="attendance-table-card">
        <div className="table-header">
          <h3>Today's Attendance</h3>
          <div className="table-filters">
            <select className="filter-select">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>IT</option>
            </select>
            <input type="date" className="filter-date" value={selectedDate} onChange={handleDate} />
          </div>
        </div>
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Check In / Check Out</th>
                <th>Day</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      Loading attendance data...
                    </div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((employee) => {
                  const record = attendanceData.find((rec) => rec.employeeId === employee.employeeId);
                  const checkIns = record?.events.filter((e) => e.type === "CHECK_IN") || [];
                  const checkOuts = record?.events.filter((e) => e.type === "CHECK_OUT") || [];
                  const maxEvents = Math.max(checkIns.length, checkOuts.length);

                  return (
                    <tr key={employee.employeeId}>
                      <td>
                        <div className="employee-info">
                          <strong>{employee.name}</strong>
                          <small>{employee.employeeId}</small>
                        </div>
                      </td>
                      <td>{employee.departmentName}</td>
                      <td>
                        {currentDay !== "Sunday" ? (
                          maxEvents > 0 ? (
                            [...Array(maxEvents)].map((_, idx) => {
                              const checkInTime = checkIns[idx]
                                ? new Date(checkIns[idx].timestamp).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                  })
                                : "Missing Swipe";

                              const checkOutTime = checkOuts[idx]
                                ? new Date(checkOuts[idx].timestamp).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                  })
                                : "Missing Swipe";

                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.9rem",
                                    padding: "2px 0",
                                  }}
                                >
                                  <span style={{ 
                                    width: "50%",
                                    color: checkInTime === "Missing Swipe" ? "red" : "green",
                                  }}>
                                    {checkInTime}
                                  </span>
                                  <span
                                    style={{
                                      width: "50%",
                                      color: checkOutTime === "Missing Swipe" ? "red" : "green",
                                    }}
                                  >
                                    {checkOutTime}
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            "--:--"
                          )
                        ) : (
                          <div className="status-badge-weeklly-off">
                            Weeklyy off
                          </div>
                        )}
                        
                      </td>
                      <td>{currentDay}</td>
                      <td>{record ? `${record.totalHours} ` : "0 hrs"}</td>
                      <td>
                        {currentDay!=="Sunday" ? (
                          (record ? (
                            <span className="status-badge status-present">Present</span>
                          ) : (
                            <span className="status-badge status-absent">Absent</span>
                          )
                          )
                        ) : (
                          <span className="status-badge-weeklly-off">Weeklyy off</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-state-content">
                      <div className="empty-state-icon">📅</div>
                      <div>
                        <h3>No attendance data</h3>
                        <p>Attendance tracking will appear here</p>
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
  );
}
