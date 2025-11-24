import React, { useState, useEffect } from 'react';

const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);

const Icons = {
  Home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  List: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  Users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
  Settings: <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />,
  Search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  Bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  Folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon path={icon} />
    <span>{label}</span>
  </div>
);

const Layout = ({ children, currentView, onNavigate, tasks = [] }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    checkDeadlines();
  }, [tasks]);

  const checkDeadlines = () => {
    const now = new Date();
    const upcoming = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const due = new Date(task.dueDate);
      const diffTime = due - now;
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return diffHours > 0 && diffHours <= 24;
    });
    setAlerts(upcoming);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">O</div>
          <span className="brand-name">Orbit</span>
        </div>

        <nav className="nav-menu">
          <SidebarItem
            icon={Icons.Home}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <SidebarItem
            icon={Icons.Folder}
            label="Projects"
            active={currentView === 'projects'}
            onClick={() => onNavigate('projects')}
          />
          <SidebarItem
            icon={Icons.Users}
            label="Team"
            active={currentView === 'team'}
            onClick={() => onNavigate('team')}
          />
          <SidebarItem
            icon={Icons.Settings}
            label="Settings"
            active={currentView === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </nav>

        <div className="user-profile">
          <div className="avatar"></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>Zaheer</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pro Plan</span>
          </div>
        </div>

        <div style={{ padding: '16px 20px', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ marginBottom: '4px' }}>Orbit v2.0</div>
          <div>Built by <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => onNavigate('settings')}>Zaheer Abbas</span></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'white', textTransform: 'capitalize' }}>{currentView.replace('-', ' ')}</span>
          </div>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <button
                className="btn-icon"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative' }}
              >
                <Icon path={Icons.Bell} />
                {alerts.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    background: 'var(--danger)',
                    borderRadius: '50%',
                    border: '1px solid var(--bg-app)'
                  }}></span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '320px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 100,
                  marginTop: '8px'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: '600', color: 'white' }}>
                    Notifications
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {alerts.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No upcoming deadlines
                      </div>
                    ) : (
                      alerts.map(task => (
                        <div key={task.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }} className="nav-item">
                          <div style={{ fontSize: '14px', color: 'white', marginBottom: '4px' }}>{task.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>⚠️ Due soon:</span>
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Icon path={Icons.Search} />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="content-scroll">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
