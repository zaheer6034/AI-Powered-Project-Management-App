import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, members, onToggle, onDelete, onUpdate }) {
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks found. Create one to get started!</p>
            </div>
        );
    }

    // Sort tasks: incomplete first, then by date
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return a.completed ? 1 : -1;
    });

    return (
        <div className="task-list">
            {sortedTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    members={members}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}

export default TaskList;
