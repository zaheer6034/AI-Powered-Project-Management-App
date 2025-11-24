const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE_URL}/api/tasks`;
const PROJECTS_API_URL = `${API_BASE_URL}/api/projects`;

export const fetchTasks = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
};

export const updateTask = async (id, updates) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
};

export const fetchProjects = async () => {
    const response = await fetch(PROJECTS_API_URL);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
};

export const createProject = async (projectData) => {
    const response = await fetch(PROJECTS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
};

export const updateProject = async (id, updates) => {
    const response = await fetch(`${PROJECTS_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
};
