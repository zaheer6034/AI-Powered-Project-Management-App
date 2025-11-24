import React from 'react';

function Dashboard({ tasks, projects = [], members = [] }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Categories
    const tasksByCategory = tasks.reduce((acc, task) => {
        const cat = task.category || 'general';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    // Priority Analysis
    const getPriority = (date) => {
        if (!date) return 'No Deadline';
        const today = new Date();
        const due = new Date(date);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Overdue';
        if (diffDays <= 5) return 'High Priority';
        if (diffDays <= 10) return 'Medium Priority';
        return 'Low Priority';
    };

    const priorityStats = {
        'Overdue': 0,
        'High Priority': 0,
        'Medium Priority': 0,
        'Low Priority': 0,
        'No Deadline': 0
    };

    tasks.filter(t => !t.completed).forEach(t => {
        const p = getPriority(t.dueDate);
        if (priorityStats[p] !== undefined) priorityStats[p]++;
    });

    const upcomingTasks = tasks
        .filter(t => !t.completed && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    // Donut Chart Calculation
    const donutCircumference = 2 * Math.PI * 40; // r=40
    const completedOffset = donutCircumference - (completionRate / 100) * donutCircumference;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div className="add-task-card" style={{ margin: 0, padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Tasks</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{totalTasks}</div>
                </div>
                <div className="add-task-card" style={{ margin: 0, padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Completed</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>{completedTasks}</div>
                </div>
                <div className="add-task-card" style={{ margin: 0, padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Active Projects</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-accent)' }}>{projects.filter(p => p.status === 'active').length}</div>
                </div>
                <div className="add-task-card" style={{ margin: 0, padding: '24px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Completion Rate</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-accent)' }}>{completionRate}%</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Project Analytics Graph (Donut) */}
                <div className="add-task-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginTop: 0, color: 'white', alignSelf: 'flex-start' }}>Overall Progress</h3>
                    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '24px 0' }}>
                        <svg width="200" height="200" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-hover)" strokeWidth="10" />
                            <circle
                                cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="10"
                                strokeDasharray={donutCircumference}
                                strokeDashoffset={completedOffset}
                                transform="rotate(-90 50 50)"
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                            <text x="50" y="50" textAnchor="middle" dy="0.3em" fill="white" fontSize="16" fontWeight="bold">
                                {completionRate}%
                            </text>
                        </svg>
                    </div>
                </div>

                {/* Projects Overview */}
                <div className="add-task-card" style={{ margin: 0 }}>
                    <h3 style={{ marginTop: 0, color: 'white' }}>Projects Overview</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', maxHeight: '300px', overflowY: 'auto' }}>
                        {projects.map(project => (
                            <div key={project.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span style={{ color: 'var(--text-main)' }}>{project.name}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{project.completedTasks}/{project.totalTasks}</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%`,
                                        background: 'var(--primary)',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No active projects</div>}
                    </div>
                </div>
            </div>

            {/* Team Workload Section */}
            <div className="add-task-card" style={{ margin: 0 }}>
                <h3 style={{ marginTop: 0, color: 'white' }}>Team Workload & Progress</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                    {members.map(member => {
                        const memberTasks = tasks.filter(t => t.assignees && t.assignees.includes(member.id));
                        const total = memberTasks.length;
                        const completed = memberTasks.filter(t => t.completed).length;
                        const active = total - completed;

                        if (total === 0) return null;

                        return (
                            <div key={member.id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: member.color,
                                        color: 'white',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {member.avatar}
                                    </div>
                                    <span style={{ color: 'var(--text-main)', fontSize: '14px', flex: 1 }}>{member.name}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{completed}/{total} Tasks</span>
                                </div>
                                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-app)' }}>
                                    <div style={{ width: `${(completed / total) * 100}%`, background: 'var(--primary)' }} title="Completed"></div>
                                    <div style={{ width: `${(active / total) * 100}%`, background: 'var(--warning)' }} title="Active"></div>
                                </div>
                            </div>
                        );
                    })}
                    {members.every(m => !tasks.some(t => t.assignees && t.assignees.includes(m.id))) && (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No tasks assigned to team members yet</div>
                    )}
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="add-task-card" style={{ margin: 0 }}>
                <h3 style={{ marginTop: 0, color: 'white' }}>Upcoming Deadlines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                    {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                        <div key={task.id} style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{task.title}</div>
                            <div style={{ fontSize: '12px', color: getPriority(task.dueDate) === 'High Priority' ? 'var(--danger)' : 'var(--warning)', fontWeight: 'bold' }}>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                    )) : (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No upcoming deadlines</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
