const BottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { 
      id: 'calendar', 
      label: 'CALENDAR', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    { 
      id: 'health', 
      label: 'MY HEALTH', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    { 
      id: 'stats', 
      label: 'STATISTICS', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    }
  ];

  return (
    <nav className="fixed-bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="icon">{item.icon}</span>
          <span className="label text-bold">{item.label}</span>
        </button>
      ))}

      <style>{`
        .fixed-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: #880E4F; /* Deep purple from image */
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 1rem;
          z-index: 2000;
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
        }

        .nav-btn.active {
          color: white;
        }

        .nav-btn .icon {
          transition: transform 0.2s ease;
        }

        .nav-btn.active .icon {
          transform: scale(1.1);
        }

        .nav-btn .label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        @media (min-width: 1024px) {
          .fixed-bottom-nav {
            height: 120px;
            padding: 0 20%;
          }
          .nav-btn .label {
            font-size: 0.9rem;
          }
          .nav-btn .icon svg {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
