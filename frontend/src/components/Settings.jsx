import React, { useState } from 'react';

function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        weeklyReport: false
    });
    const [theme, setTheme] = useState('dark');

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'account', label: 'Account' }
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'white', marginBottom: '8px' }}>Settings</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage your workspace preferences</p>

            <div style={{ display: 'flex', gap: '32px' }}>
                {/* Settings Sidebar */}
                <div style={{ width: '200px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    textAlign: 'left',
                                    padding: '10px 16px',
                                    background: activeTab === tab.id ? 'var(--bg-hover)' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'profile' && (
                        <div className="add-task-card" style={{ margin: 0 }}>
                            <h3 style={{ marginTop: 0, color: 'white', marginBottom: '24px' }}>Profile Settings</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(to right, #ec4899, #8b5cf6)' }}></div>
                                <div>
                                    <button className="btn btn-primary" style={{ marginRight: '12px' }}>Upload New Avatar</button>
                                    <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>Remove</button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Display Name</label>
                                <input type="text" className="form-input" defaultValue="Zaheer" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" defaultValue="zaheer@example.com" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <input type="text" className="form-input" defaultValue="Product Manager" disabled style={{ opacity: 0.7 }} />
                            </div>

                            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="add-task-card" style={{ margin: 0 }}>
                            <h3 style={{ marginTop: 0, color: 'white', marginBottom: '24px' }}>Appearance</h3>

                            <div className="form-group">
                                <label className="form-label">Theme</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                    <div
                                        onClick={() => setTheme('dark')}
                                        style={{
                                            padding: '16px',
                                            border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: '#0f1115'
                                        }}
                                    >
                                        <div style={{ color: 'white', fontWeight: '500', marginBottom: '8px' }}>Dark Mode</div>
                                        <div style={{ fontSize: '12px', color: '#8b949e' }}>Default Orbit theme</div>
                                    </div>
                                    <div
                                        onClick={() => setTheme('light')}
                                        style={{
                                            padding: '16px',
                                            border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: '#ffffff'
                                        }}
                                    >
                                        <div style={{ color: '#000', fontWeight: '500', marginBottom: '8px' }}>Light Mode</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>Classic light theme</div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Accent Color</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {['#238636', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map(color => (
                                        <div
                                            key={color}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: color,
                                                cursor: 'pointer',
                                                border: '2px solid var(--bg-card)',
                                                boxShadow: '0 0 0 2px var(--border-subtle)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="add-task-card" style={{ margin: 0 }}>
                            <h3 style={{ marginTop: 0, color: 'white', marginBottom: '24px' }}>Notifications</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: '500' }}>Email Notifications</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive updates via email</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.email}
                                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: '500' }}>Push Notifications</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive browser notifications</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.push}
                                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: '500' }}>Weekly Report</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive a weekly summary of your tasks</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.weeklyReport}
                                        onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="add-task-card" style={{ margin: 0 }}>
                            <h3 style={{ marginTop: 0, color: 'white', marginBottom: '24px' }}>Account Management</h3>

                            <div style={{ padding: '16px', background: 'rgba(218, 54, 51, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px' }}>
                                <h4 style={{ color: 'var(--danger)', margin: '0 0 8px 0' }}>Danger Zone</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <button className="btn" style={{ background: 'var(--danger)', color: 'white' }}>Delete Account</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
