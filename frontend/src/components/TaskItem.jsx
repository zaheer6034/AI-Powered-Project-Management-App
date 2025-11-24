import React, { useState } from 'react';

function TaskItem({ task, members = [], onToggle, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDate, setEditedDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

    const handleSave = () => {
        onUpdate(task.id, { title: editedTitle, dueDate: editedDate });
        setIsEditing(false);
    };

    const getStatusColor = (date) => {
        if (!date) return 'var(--text-muted)';
        const today = new Date();
        const due = new Date(date);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'var(--danger)'; // Overdue
        if (diffDays <= 5) return 'var(--danger)'; // Urgent (< 5 days)
        if (diffDays <= 10) return 'var(--warning)'; // Approaching
        return 'var(--primary)'; // Safe
    };

    const getPriorityLabel = (date) => {
        if (!date) return null;
        const today = new Date();
        const due = new Date(date);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays <= 5) return 'High Priority';
        if (diffDays <= 10) return 'Medium Priority';
        return 'Low Priority';
    };

    // Get assigned members objects
    const assignedMembers = members.filter(m => task.assignees && task.assignees.includes(m.id));

    if (isEditing) {
        return (
            <div className="task-row" style={{ display: 'block' }}>
                <div className="form-group">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="form-input"
                        autoFocus
                        style={{ marginBottom: '12px' }}
                    />
                    <div className="form-row">
                        <input
                            type="date"
                            value={editedDate}
                            onChange={(e) => setEditedDate(e.target.value)}
                            className="form-input"
                            style={{ width: 'auto' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="btn"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`task-row ${task.completed ? 'completed' : ''}`}>
            <div className="task-checkbox">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggle(task.id, e.target.checked)}
                />
            </div>

            <div className="task-content">
                <h3 className="task-title">
                    {task.title}
                </h3>
                <div className="task-meta">
                    <span className="meta-item" style={{ color: getStatusColor(task.dueDate) }}>
                        📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </span>
                    {task.dueDate && !task.completed && (
                        <span className="tag" style={{
                            backgroundColor: getStatusColor(task.dueDate),
                            color: 'white',
                            opacity: 0.8
                        }}>
                            {getPriorityLabel(task.dueDate)}
                        </span>
                    )}
                    {task.category && (
                        <span className="tag">
                            {task.category}
                        </span>
                    )}

                    {/* Assignees Avatars */}
                    {assignedMembers.length > 0 && (
                        <div style={{ display: 'flex', marginLeft: '8px' }}>
                            {assignedMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    title={member.name}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: member.color,
                                        color: 'white',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        border: '2px solid var(--bg-card)',
                                        marginLeft: index > 0 ? '-8px' : '0'
                                    }}
                                >
                                    {member.avatar}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="task-actions">
                <button
                    onClick={() => setIsEditing(true)}
                    className="btn-icon"
                    title="Edit"
                >
                    ✎
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="btn-icon"
                    title="Delete"
                    style={{ color: 'var(--danger)' }}
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default TaskItem;
