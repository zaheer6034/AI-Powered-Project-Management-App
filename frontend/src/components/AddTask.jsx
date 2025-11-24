import React, { useState, useEffect } from 'react';

function AddTask({ onAdd, onCancel, members = [], projects = [] }) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('general');
    const [assignees, setAssignees] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [autoCatMessage, setAutoCatMessage] = useState('');

    // Auto-categorization logic
    useEffect(() => {
        const lowerTitle = title.toLowerCase();
        let newCategory = 'general';

        if (lowerTitle.includes('meeting') || lowerTitle.includes('report') || lowerTitle.includes('email') || lowerTitle.includes('code') || lowerTitle.includes('debug')) {
            newCategory = 'work';
        } else if (lowerTitle.includes('buy') || lowerTitle.includes('grocery') || lowerTitle.includes('gym') || lowerTitle.includes('doctor') || lowerTitle.includes('call')) {
            newCategory = 'personal';
        } else if (lowerTitle.includes('study') || lowerTitle.includes('read') || lowerTitle.includes('course') || lowerTitle.includes('tutorial')) {
            newCategory = 'learning';
        } else if (lowerTitle.includes('meditate') || lowerTitle.includes('run') || lowerTitle.includes('walk') || lowerTitle.includes('water')) {
            newCategory = 'health';
        } else if (lowerTitle.includes('pay') || lowerTitle.includes('bill') || lowerTitle.includes('bank') || lowerTitle.includes('invest')) {
            newCategory = 'finance';
        }

        if (newCategory !== 'general' && newCategory !== category) {
            setCategory(newCategory);
            setAutoCatMessage(`Auto-categorized as ${newCategory}`);
            setTimeout(() => setAutoCatMessage(''), 3000);
        }
    }, [title]);

    const toggleAssignee = (memberId) => {
        setAssignees(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({ title, dueDate, category, assignees, projectId, completed: false });
        setTitle('');
        setDueDate('');
        setCategory('general');
        setAssignees([]);
        setProjectId('');
    };

    return (
        <form onSubmit={handleSubmit} className="add-task-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Create New Task</h2>
                {autoCatMessage && (
                    <span style={{
                        fontSize: '12px',
                        color: 'var(--text-accent)',
                        background: 'rgba(88, 166, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        animation: 'fadeIn 0.3s'
                    }}>
                        ✨ {autoCatMessage}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    autoFocus
                />
            </div>

            <div className="form-row" style={{ marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="form-input"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select"
                        style={{ textTransform: 'capitalize' }}
                    >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="learning">Learning</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Project</label>
                <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="form-select"
                >
                    <option value="">No Project</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Assign Team Members</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {members.map(member => (
                        <div
                            key={member.id}
                            onClick={() => toggleAssignee(member.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                background: assignees.includes(member.id) ? 'var(--bg-hover)' : 'transparent',
                                border: `1px solid ${assignees.includes(member.id) ? member.color : 'var(--border-subtle)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
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
                            <span style={{ fontSize: '13px', color: assignees.includes(member.id) ? 'white' : 'var(--text-muted)' }}>
                                {member.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn"
                    style={{ color: 'var(--text-muted)' }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="btn btn-primary"
                    style={{ opacity: !title.trim() ? 0.5 : 1 }}
                >
                    Create Task
                </button>
            </div>
        </form>
    );
}

export default AddTask;
