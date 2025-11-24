import React, { useState } from 'react';

function Projects({ projects, onAddProject, onSelectProject, onUpdateProject }) {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAddProject({ name, description });
        setName('');
        setDescription('');
        setIsAdding(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)' };
            case 'completed': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
            case 'delayed': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
            case 'cancelled': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' };
            default: return { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-muted)' };
        }
    };

    const handleStatusChange = (project, newStatus) => {
        onUpdateProject(project.id, { status: newStatus });
    };

    if (projects.length === 0) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ margin: 0, color: 'white' }}>Projects</h2>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="btn btn-primary"
                    >
                        + New Project
                    </button>
                </div>

                {isAdding && (
                    <form onSubmit={handleSubmit} className="add-task-card">
                        <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>Create Project</h3>
                        <div className="form-group">
                            <label className="form-label">Project Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input"
                                rows="3"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => setIsAdding(false)} className="btn" style={{ color: 'var(--text-muted)' }}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Project</button>
                        </div>
                    </form>
                )}

                <div className="empty-state" style={{ marginTop: '48px' }}>
                    <p>No projects yet. Create your first project to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ margin: 0, color: 'white' }}>Projects</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary"
                >
                    + New Project
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="add-task-card">
                    <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>Create Project</h3>
                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                            rows="3"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setIsAdding(false)} className="btn" style={{ color: 'var(--text-muted)' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Project</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {projects.map(project => {
                    const statusStyle = getStatusColor(project.status);
                    return (
                        <div
                            key={project.id}
                            className="add-task-card"
                            style={{ margin: 0, border: '1px solid var(--border-subtle)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {project.name.charAt(0)}
                                </div>
                                <select
                                    value={project.status}
                                    onChange={(e) => handleStatusChange(project, e.target.value)}
                                    className="form-select"
                                    style={{
                                        width: 'auto',
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        background: statusStyle.bg,
                                        color: statusStyle.color,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="delayed">Delayed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div
                                onClick={() => onSelectProject(project)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3 style={{ margin: '0 0 8px 0', color: 'white' }}>{project.name}</h3>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {project.description || 'No description'}
                                </p>

                                <div style={{ marginTop: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        <span>Progress</span>
                                        <span>{project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%`,
                                            background: 'var(--primary)',
                                            borderRadius: '3px'
                                        }}></div>
                                    </div>
                                    <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {project.completedTasks} / {project.totalTasks} tasks completed
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Projects;
