import React, { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/clerk-react'
import { periodAPI } from '../services/api'
import Calendar from '../components/Calendar'
import BottomNav from '../components/BottomNav'

const Dashboard = () => {
  const { user } = useUser()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('calendar')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    flow_intensity: 3,
    symptoms: '',
    notes: '',
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.firstName
      }))
    }
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await periodAPI.getAll()
      setEntries(response.data)
    } catch (err) {
      console.error('Error fetching entries:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation: 2-10 days range
    const start = new Date(formData.start_date);
    const end = formData.end_date ? new Date(formData.end_date) : start;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (end < start) {
      alert("Oops! End date cannot be before start date.");
      return;
    }
    
    if (diffDays < 2 || diffDays > 10) {
      alert(`Please enter valid dates. (A normal period lasts 2-10 days, but your selection is ${diffDays} days).`);
      return;
    }

    try {
      await periodAPI.create(formData)
      setShowAddForm(false)
      setFormData({
        start_date: '',
        end_date: '',
        flow_intensity: 3,
        symptoms: '',
        notes: '',
      })
      fetchEntries()
    } catch (err) {
      console.error('Error creating entry:', err)
    }
  }

  // Prediction Engine: Calculates next period dates based on history
  const getPredictions = () => {
    if (entries.length < 2) return [];
    
    // Sort entries by start date
    const sorted = [...entries].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    
    // Calculate cycle lengths (days between start dates)
    const cycleLengths = [];
    for (let i = 1; i < sorted.length; i++) {
      const prevStart = new Date(sorted[i - 1].start_date);
      const currStart = new Date(sorted[i].start_date);
      const diff = Math.ceil((currStart - prevStart) / (1000 * 60 * 60 * 24));
      // Only include realistic cycles (21-45 days)
      if (diff >= 21 && diff <= 45) cycleLengths.push(diff);
    }
    
    // Use average or standard 28 days
    const avgCycle = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;
      
    // Predict next 2 cycles
    const predictions = [];
    let lastStart = new Date(sorted[sorted.length - 1].start_date);
    const lastDuration = Math.ceil((new Date(sorted[sorted.length - 1].end_date) - lastStart) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 1; i <= 2; i++) {
      const nextStart = new Date(lastStart);
      nextStart.setDate(nextStart.getDate() + avgCycle);
      
      const nextEnd = new Date(nextStart);
      nextEnd.setDate(nextEnd.getDate() + (lastDuration || 5) - 1);
      
      predictions.push({
        start_date: nextStart.toISOString().split('T')[0],
        end_date: nextEnd.toISOString().split('T')[0],
        type: 'predicted'
      });
      
      lastStart = nextStart;
    }
    
    return predictions;
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm("Do you want to remove this period entry?")) return;
    try {
      await periodAPI.delete(entryId)
      fetchEntries()
    } catch (err) {
      console.error('Error deleting entry:', err)
    }
  }

  const renderContent = () => {
    const predictions = getPredictions();
    switch (activeTab) {
      case 'calendar':
        return <Calendar entries={entries} predictions={predictions} onDeleteEntry={handleDeleteEntry} />;
      case 'health':
        return (
          <div className="placeholder-view animate-fade-in">
            <h2>MY HEALTH</h2>
            <div className="health-card">
              <p>Daily symptoms tracking and health insights coming soon!</p>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="placeholder-view animate-fade-in">
            <h2>STATISTICS</h2>
            <div className="stats-board">
              <p>Analyzing your cycle patterns...</p>
            </div>
          </div>
        );
      default:
        return <Calendar entries={entries} predictions={predictions} onDeleteEntry={handleDeleteEntry} />;
    }
  }

  return (
    <div className="app-container">
      <header className="app-top-bar">
        <div className="user-info-section">
          <span className="user-greeting">Hi, {user?.firstName || 'User'}!</span>
        </div>
        <UserButton afterSignOutUrl="/login" />
      </header>

      <main className="main-viewport">
        {renderContent()}
      </main>

      <button className="fab-add" onClick={() => setShowAddForm(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* Add Date Slide-up Panel */}
      <div className={`add-panel-overlay ${showAddForm ? 'active' : ''}`} onClick={() => setShowAddForm(false)}>
        <div className="add-panel" onClick={e => e.stopPropagation()}>
          <div className="panel-handle"></div>
          <h2>Log Period</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label>Start Date</label>
              <input 
                type="date" 
                required 
                max={new Date().toISOString().split('T')[0]}
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div className="form-group-custom">
              <label>End Date</label>
              <input 
                type="date" 
                max={new Date().toISOString().split('T')[0]}
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
            <button type="submit" className="save-btn">SAVE DATES</button>
          </form>
        </div>
      </div>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-top-bar {
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
        }

        .user-greeting {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          color: var(--text-dark);
        }

        .logout-link {
          background: transparent;
          border: none;
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          opacity: 0.7;
          letter-spacing: 0.05em;
        }

        .main-viewport {
          flex: 1;
          padding-bottom: 120px;
        }

        .placeholder-view {
          padding: 2rem;
          text-align: center;
        }

        .placeholder-view h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: var(--text-dark);
        }

        .health-card, .stats-board {
          background: rgba(255, 255, 255, 0.4);
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          color: var(--text-dark);
        }

        .fab-add {
          position: fixed;
          right: 2rem;
          bottom: 120px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent-magenta);
          border: none;
          color: white;
          box-shadow: 0 10px 30px rgba(239, 71, 188, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          transition: transform 0.2s ease;
        }

        .fab-add:hover {
          transform: scale(1.1);
        }

        /* Slide-up Panel Styles */
        .add-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(42, 13, 59, 0.3);
          backdrop-filter: blur(10px);
          z-index: 3000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .add-panel-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .add-panel {
          position: absolute;
          bottom: -100%;
          left: 0;
          right: 0;
          background: var(--deep-dark);
          border-radius: 30px 30px 0 0;
          padding: 3rem 2rem;
          transition: bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .active .add-panel {
          bottom: 0;
        }

        .panel-handle {
          width: 50px;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          margin: -1.5rem auto 2rem;
        }

        .add-panel h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 800;
          color: var(--bg-lilac-light);
        }

        .form-group-custom {
          margin-bottom: 2rem;
        }

        .form-group-custom label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
        }

        .form-group-custom input {
          width: 100%;
          padding: 1.2rem;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
        }

        .save-btn {
          width: 100%;
          padding: 1.2rem;
          background: var(--accent-magenta);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        @media (min-width: 1024px) {
          .main-viewport {
            padding: 0 10%;
          }
          .app-top-bar {
            padding: 2rem 10%;
          }
          .fab-add {
            right: 10%;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
