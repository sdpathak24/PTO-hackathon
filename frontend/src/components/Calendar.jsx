import React, { useState, useEffect } from "react";

const Calendar = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ptoRequests, setPtoRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      fetchPTORequests();
    }
  }, [user]);

  const fetchPTORequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pto');
      if (response.ok) {
        const data = await response.json();
        // Filter PTO requests for current user
        const userRequests = data.filter(request => {
          const requestEmail = request.user?.email || request.user;
          return requestEmail === user.email;
        });
        setPtoRequests(userRequests);
      }
    } catch (error) {
      console.error('Error fetching PTO requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getLeaveTypeText = (leaveType) => {
    const types = {
      personal: 'P',
      sick: 'S',
      maternity: 'M',
      paternity: 'F',
      bereavement: 'B'
    };
    return types[leaveType] || 'L';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFC107', // ORANGE
      approved: '#4CAF50', // GREEN
      denied: '#F44336' // RED
    };
    return colors[status] || '#FFC107'; // Default to orange for pending
  };

  const isDateInRange = (checkDate, startDate, endDate) => {
    const check = new Date(checkDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return check >= start && check <= end;
  };

  const getPTOForDate = (date) => {
    const dateStr = formatDate(date);
    return ptoRequests.find(request => 
      isDateInRange(date, request.startDate, request.endDate)
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="calendar-section">
        <div className="section-header">
          <h2>My Calendar</h2>
          <p>View your leave requests</p>
        </div>
        <div className="calendar-loading">Loading calendar...</div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  return (
    <div className="calendar-section">
      <div className="section-header">
        <h2>My Calendar</h2>
        <p>View your leave requests</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="calendar-nav-btn" 
            onClick={() => navigateMonth(-1)}
          >
            ←
          </button>
          <div className="calendar-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button 
            className="calendar-nav-btn" 
            onClick={() => navigateMonth(1)}
          >
            →
          </button>
        </div>

        <div className="calendar-today">
          <button className="today-btn" onClick={goToToday}>
            Today
          </button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}
          </div>

          <div className="calendar-days">
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="empty-day"></div>
            ))}
            
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNumber = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
              const ptoRequest = getPTOForDate(date);
              const isToday = date.toDateString() === today.toDateString();


              return (
                <div key={dayNumber} className={`calendar-day ${isToday ? 'today' : ''}`}>
                  <span className="day-number">{dayNumber}</span>
                  {ptoRequest && (
                    <div 
                      className="pto-indicator"
                      style={{ 
                        backgroundColor: getStatusColor(ptoRequest.status),
                        color: '#fff',
                        borderColor: getStatusColor(ptoRequest.status)
                      }}
                    >
                      {getLeaveTypeText(ptoRequest.leaveType)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#FFC107' }}></div>
              <span>Pending</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Approved</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
              <span>Denied</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Calendar;
