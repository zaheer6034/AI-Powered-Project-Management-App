import React, { useState } from 'react';

const KanbanBoard = ({ tasks, onUpdateTask, members }) => {
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [loadingBreakdown, setLoadingBreakdown] = useState(null);

    const columns = [
        { id: 'todo', title: 'To Do', color: '#8b949e', bg: 'rgba(139, 148, 158, 0.1)' },
        { id: 'in_progress', title: 'In Progress', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        { id: 'done', title: 'Done', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
    ];

    const getTasksByStatus = (status) => {
        return tasks.filter(t => {
            if (t.status) return t.status === status;
            // Fallback for old data
            if (status === 'done') return t.completed;
            if (status === 'todo') return !t.completed;
            return false;
        });
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id); // Required for Firefox

        // Create a custom drag image (optional, but nice)
        const dragImage = document.createElement('div');
        dragImage.innerText = task.title;
        dragImage.style.background = '#1f2937';
        dragImage.style.color = 'white';
        dragImage.style.padding = '8px';
        dragImage.style.borderRadius = '4px';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverColumn !== colId) {
            setDragOverColumn(colId);
        }
    };

    const handleDragLeave = (e) => {
        // Only clear if we're leaving the column container
        // This is a bit tricky with nested elements, so we'll rely on Drop to clear
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (draggedTask && draggedTask.status !== status) {
            // Optimistic update
            onUpdateTask(draggedTask.id, { status });
        }
        setDraggedTask(null);
    };

    const handleMagicBreakdown = async (task) => {
        if (loadingBreakdown === task.id) return;
        setLoadingBreakdown(task.id);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/ai/breakdown`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskTitle: task.title })
            });

            const data = await response.json();
            if (data.subtasks) {
                const newDescription = (task.description ? task.description + '\n\n' : '') +
                    "✨ AI Breakdown:\n" +
                    data.subtasks.map(s => `- [ ] ${s}`).join('\n');

                onUpdateTask(task.id, { description: newDescription });
            }
        } catch (err) {
            console.error('Breakdown failed:', err);
            alert('Failed to generate breakdown. Please try again.');
        } finally {
            setLoadingBreakdown(null);
        }
    };

    return (
        <div className="kanban-board" style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '24px',
            height: 'calc(100vh - 220px)',
            alignItems: 'flex-start'
        }}>
            {columns.map(col => (
                <div
                    key={col.id}
                    className="kanban-column"
                    style={{
                        flex: '0 0 340px',
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        border: `1px solid ${dragOverColumn === col.id ? col.color : 'var(--border-subtle)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '100%',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxShadow: dragOverColumn === col.id ? `0 0 0 2px ${col.color}40` : 'none'
                    }}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    {/* Column Header */}
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: col.bg,
                        borderRadius: '16px 16px 0 0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: col.color,
                                boxShadow: `0 0 8px ${col.color}`
                            }}></div>
                            <span style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>{col.title}</span>
                        </div>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '500'
                        }}>
                            {getTasksByStatus(col.id).length}
                        </span>
                    </div>

                    {/* Tasks List */}
                    <div style={{
                        padding: '16px',
                        flex: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {getTasksByStatus(col.id).map(task => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                style={{
                                    background: 'var(--bg-app)',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-subtle)',
                                    cursor: 'grab',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                                    position: 'relative',
                                    opacity: draggedTask?.id === task.id ? 0.5 : 1
                                }}
                                className="kanban-card"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                }}
                            >
                                <div style={{ marginBottom: '12px', color: 'white', fontWeight: '600', fontSize: '15px', lineHeight: '1.4' }}>{task.title}</div>

                                {task.description && (
                                    <div style={{
                                        fontSize: '13px',
                                        color: 'var(--text-muted)',
                                        marginBottom: '16px',
                                        whiteSpace: 'pre-wrap',
                                        maxHeight: '120px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: '1.5',
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '8px',
                                        borderRadius: '6px'
                                    }}>
                                        {task.description}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', gap: '-8px' }}>
                                        {task.assignees && task.assignees.length > 0 ? (
                                            task.assignees.map((assigneeId, idx) => {
                                                const member = members.find(m => m.id === assigneeId);
                                                if (!member) return null;
                                                return (
                                                    <div key={idx} style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '50%',
                                                        background: member.color,
                                                        border: '2px solid var(--bg-app)',
                                                        marginLeft: idx > 0 ? '-10px' : 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '11px',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        title: member.name
                                                    }}>
                                                        {member.avatar}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: 'var(--bg-hover)',
                                                border: '2px solid var(--bg-app)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                                color: 'var(--text-muted)'
                                            }}>
                                                👤
                                            </div>
                                        )}
                                    </div>

                                    {/* Magic Breakdown Button */}
                                    {!task.description?.includes('AI Breakdown') && (
                                        <button
                                            onClick={() => handleMagicBreakdown(task)}
                                            disabled={loadingBreakdown === task.id}
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
                                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                                borderRadius: '6px',
                                                padding: '6px 10px',
                                                fontSize: '12px',
                                                color: '#c084fc',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'}
                                        >
                                            {loadingBreakdown === task.id ? (
                                                <>
                                                    <span className="spin">✨</span> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <span>✨</span> AI Breakdown
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
