import React, { useState, useEffect, useRef } from 'react';

const Calendar = ({ entries, predictions = [], onDeleteEntry }) => {
  const [scrollRange, setScrollRange] = useState([-6, -5, -4, -3, -2, -1, 0, 1]);
  const today = new Date();
  const scrollContainerRef = useRef(null);

  // Helper to get days in a month
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust to start from Monday
  };

  const isPeriodDay = (year, month, day) => {
    const dateToCheck = new Date(year, month, day);
    // Find the entry that covers this day
    return entries.find(entry => {
      const start = new Date(entry.start_date);
      const end = entry.end_date ? new Date(entry.end_date) : start;
      const d = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return d >= s && d <= e;
    });
  };

  const isPredictedDay = (year, month, day) => {
    const dateToCheck = new Date(year, month, day);
    const dateStr = dateToCheck.toISOString().split('T')[0];
    
    return predictions.find(p => {
      const start = new Date(p.start_date);
      const end = new Date(p.end_date);
      const d = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return d >= s && d <= e;
    });
  };

  const isToday = (year, month, day) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isFuture = (year, month, day) => {
    const dateToCheck = new Date(year, month, day);
    const comparisonDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateToCheck > comparisonDate;
  };

  const handleDayClick = (year, month, day) => {
    const entry = isPeriodDay(year, month, day);
    if (entry && onDeleteEntry) {
      onDeleteEntry(entry.id);
    }
  };

  useEffect(() => {
    const currentMonthElement = scrollContainerRef.current?.children[6]; 
    if (currentMonthElement) {
      currentMonthElement.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    }
  }, []);

  const renderMonth = (monthOffset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'long' }).toUpperCase();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);
    
    const calendarDays = [];
    for (let i = firstDay - 1; i >= 0; i--) calendarDays.push({ day: prevMonthDays - i, currentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ day: i, currentMonth: true });
    
    const remainingSlots = (calendarDays.length > 35 ? 42 : 35) - calendarDays.length;
    for (let i = 1; i <= remainingSlots; i++) calendarDays.push({ day: i, currentMonth: false });

    return (
      <div key={monthOffset} className="month-section">
        <header className="month-header-sticky">
          <h2>{monthName} {year}</h2>
        </header>

        <div className="month-grid-container">
          <div className="week-days-labels">
            {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="days-grid">
            {calendarDays.map((d, index) => {
              const actualPeriod = d.currentMonth && isPeriodDay(year, month, d.day);
              const predictedPeriod = d.currentMonth && !actualPeriod && isPredictedDay(year, month, d.day);
              const isTdy = d.currentMonth && isToday(year, month, d.day);
              const isDisabled = d.currentMonth && isFuture(year, month, d.day);
              
              let dayClass = "day-cell";
              if (!d.currentMonth) dayClass += " day-padding";
              if (actualPeriod) dayClass += " day-actual";
              if (predictedPeriod) dayClass += " day-predicted";
              if (isTdy) dayClass += " day-today";
              if (isDisabled && !predictedPeriod) dayClass += " day-future";

              return (
                <div 
                  key={index} 
                  className={dayClass}
                  onClick={() => d.currentMonth && actualPeriod && handleDayClick(year, month, d.day)}
                >
                  <span className="num">{d.day}</span>
                  {isTdy && <span className="label-today">TODAY</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="infinite-calendar">
      <div className="scroll-viewport" ref={scrollContainerRef}>
        {scrollRange.map(offset => renderMonth(offset))}
      </div>

      <style>{`
        .infinite-calendar {
          width: 100%;
          height: calc(100vh - 180px);
          overflow: hidden;
          position: relative;
        }

        .scroll-viewport {
          height: 100%;
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scroll-viewport::-webkit-scrollbar {
          display: none;
        }

        .month-section {
          min-width: 100%;
          height: 100%;
          scroll-snap-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.5rem;
          flex-shrink: 0;
        }

        .month-header-sticky {
          padding: 2rem 0;
          text-align: center;
          width: 100%;
        }

        .month-header-sticky h2 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-shadow: 0 4px 15px rgba(0,0,0,0.1);
          color: var(--text-dark);
        }

        .month-grid-container {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 1.8rem;
          box-shadow: 0 15px 40px rgba(66, 13, 59, 0.08);
          border: 1px solid rgba(255,255,255,1);
          width: 100%;
          max-width: 450px;
        }

        .week-days-labels {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 1.5rem;
          font-weight: 900;
          font-size: 0.75rem;
          opacity: 0.7;
          color: var(--text-dark);
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          position: relative;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          color: var(--text-dark);
        }

        .day-cell:hover:not(.day-future):not(.day-padding) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          z-index: 5;
        }

        .day-padding {
          opacity: 0.15;
          cursor: default;
        }

        /* Actual Period Style (Light Red Blurry) */
        .day-actual {
          background: rgba(255, 107, 107, 0.6) !important;
          backdrop-filter: blur(8px);
          box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
          border: 1px solid rgba(255, 107, 107, 0.4);
        }

        /* Predicted Period Style (Light Pink Blurry) */
        .day-predicted {
          background: rgba(255, 192, 203, 0.4) !important;
          backdrop-filter: blur(8px);
          box-shadow: 0 5px 15px rgba(255, 192, 203, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: pulsePredicted 2.4s infinite ease-in-out;
        }

        @keyframes pulsePredicted {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .day-today {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid white;
        }

        .day-future {
          opacity: 0.2;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .label-today {
          font-size: 0.4rem;
          position: absolute;
          bottom: 6px;
          font-weight: 900;
        }

        @media (min-width: 1024px) {
          .month-section {
            padding: 0 5rem;
          }
          .month-grid-container {
            max-width: 650px;
            padding: 2.5rem;
          }
          .day-cell {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;
