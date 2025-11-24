import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, fetchProjects, createProject, updateProject } from './api';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Team from './components/Team';
import Projects from './components/Projects';
import AICopilot from './components/AICopilot';
import Settings from './components/Settings';

// Mock Team Members Data
const TEAM_MEMBERS = [
    { id: '1', name: 'Alex Johnson', role: 'Product Owner', status: 'online', avatar: 'AJ', color: '#3b82f6' },
    { id: '2', name: 'Sarah Smith', role: 'Frontend Dev', status: 'busy', avatar: 'SS', color: '#ec4899' },
    { id: '3', name: 'Mike Brown', role: 'Backend Dev', status: 'offline', avatar: 'MB', color: '#10b981' },
    { id: '4', name: 'Emily Davis', role: 'Designer', status: 'online', avatar: 'ED', color: '#f59e0b' },
    { id: '5', name: 'David Wilson', role: 'QA Engineer', status: 'online', avatar: 'DW', color: '#8b5cf6' },
];

function App() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [tasksData, projectsData] = await Promise.all([fetchTasks(), fetchProjects()]);
            console.log('Loaded tasks:', tasksData);
            console.log('Loaded projects:', projectsData);
            setTasks(tasksData || []);
            setProjects(projectsData || []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            console.log('Creating task:', taskData);
            const newTask = await createTask(taskData);
            console.log('Created task:', newTask);
            setTasks([...tasks, newTask]);
            setIsAddTaskOpen(false);
            // Refresh projects to update stats
            const projectsData = await fetchProjects();
            setProjects(projectsData);
        } catch (err) {
            console.error('Failed to add task:', err);
            alert('Failed to add task: ' + err.message);
        }
    };

    const handleAddProject = async (projectData) => {
        try {
            const newProject = await createProject(projectData);
            setProjects([...projects, newProject]);
        } catch (err) {
            console.error('Failed to add project:', err);
            alert('Failed to add project: ' + err.message);
        }
    };

    const handleUpdateProject = async (id, updates) => {
        try {
            const updatedProject = await updateProject(id, updates);
            setProjects(projects.map(p => p.id === id ? updatedProject : p));

            // Refresh to get updated stats
            const projectsData = await fetchProjects();
            setProjects(projectsData);
        } catch (err) {
            console.error('Failed to update project:', err);
        }
    };

    const handleToggleTask = async (id, completed) => {
        try {
            const updatedTask = await updateTask(id, { completed });
            setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));

            // Check for project completion celebration
            if (completed && updatedTask.projectId) {
                const projectTasks = tasks.filter(t => t.projectId === updatedTask.projectId);
                const allCompleted = projectTasks.every(t => t.id === id ? true : t.completed);
                if (allCompleted && projectTasks.length > 0) {
                    // Auto-update project status to completed
                    await handleUpdateProject(updatedTask.projectId, { status: 'completed' });
                }
            }

            // Refresh projects stats
            const projectsData = await fetchProjects();
            setProjects(projectsData);
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const handleUpdateTask = async (id, updates) => {
        try {
            const updatedTask = await updateTask(id, updates);
            setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter((t) => t.id !== id));
            // Refresh projects stats
            const projectsData = await fetchProjects();
            setProjects(projectsData);
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    // AI Command Handler
    const handleAICommand = (command) => {
        console.log('AI Command received:', command);
        switch (command.type) {
            case 'NAVIGATE':
                setCurrentView(command.payload);
                setSelectedProject(null);
                break;
            case 'CREATE_TASK':
                // Open add task modal with pre-filled title if possible, 
                // or just create it directly if we had full AI parsing.
                // For now, let's open the modal.
                setIsAddTaskOpen(true);
                // In a real app, we'd pass the title to the form
                break;
            default:
                console.warn('Unknown AI command:', command.type);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '18px', marginBottom: '16px' }}>Loading...</div>
                    <div style={{ fontSize: '14px' }}>Connecting to database...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ padding: '24px', background: 'rgba(218, 54, 51, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', margin: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>⚠️ Error Loading Data</h3>
                    <p style={{ margin: '0 0 16px 0' }}>{error}</p>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        <p>Please check:</p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Backend server is running (npm start in backend folder)</li>
                            <li>Supabase credentials are set in backend/.env</li>
                            <li>Database tables are created (run supabase-schema.sql)</li>
                        </ul>
                    </div>
                    <button onClick={loadData} className="btn btn-primary" style={{ marginTop: '16px' }}>
                        Retry
                    </button>
                </div>
            );
        }

        switch (currentView) {
            case 'dashboard':
                return <Dashboard tasks={tasks} projects={projects} members={TEAM_MEMBERS} />;
            case 'projects':
                if (selectedProject) {
                    // Filter tasks for this project - handle both null and matching projectId
                    const projectTasks = tasks.filter(t => {
                        // If task has no projectId, don't show it
                        if (!t.projectId) return false;
                        // Show if projectId matches
                        return t.projectId === selectedProject.id;
                    });

                    console.log('Selected project:', selectedProject);
                    console.log('All tasks:', tasks);
                    console.log('Filtered project tasks:', projectTasks);
                    console.log('Task projectIds:', tasks.map(t => ({ id: t.id, title: t.title, projectId: t.projectId })));

                    return (
                        <>
                            <div className="page-header">
                                <div className="page-title">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setSelectedProject(null)} className="btn-icon" style={{ fontSize: '20px' }}>←</button>
                                        <h1>{selectedProject.name}</h1>
                                    </div>
                                    <p className="page-subtitle">{selectedProject.description}</p>
                                </div>
                                <button
                                    onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}
                                    className="btn btn-primary"
                                >
                                    + New Task
                                </button>
                            </div>

                            {isAddTaskOpen && (
                                <AddTask
                                    onAdd={(data) => handleAddTask({ ...data, projectId: selectedProject.id })}
                                    onCancel={() => setIsAddTaskOpen(false)}
                                    members={TEAM_MEMBERS}
                                    projects={projects}
                                />
                            )}

                            {/* Debug info */}
                            {projectTasks.length === 0 && tasks.length > 0 && (
                                <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', borderRadius: '8px', marginBottom: '16px' }}>
                                    <p style={{ margin: 0, color: 'var(--warning)' }}>
                                        ℹ️ No tasks found for this project. You have {tasks.length} total task(s) in the database.
                                        {tasks.filter(t => !t.projectId).length > 0 && ` (${tasks.filter(t => !t.projectId).length} unassigned to any project)`}
                                    </p>
                                </div>
                            )}

                            <TaskList
                                tasks={projectTasks}
                                members={TEAM_MEMBERS}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onUpdate={handleUpdateTask}
                            />
                        </>
                    );
                }
                return (
                    <Projects
                        projects={projects}
                        onAddProject={handleAddProject}
                        onSelectProject={setSelectedProject}
                        onUpdateProject={handleUpdateProject}
                    />
                );
            case 'team':
                return <Team members={TEAM_MEMBERS} tasks={tasks} />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard tasks={tasks} projects={projects} members={TEAM_MEMBERS} />;
        }
    };

    return (
        <Layout currentView={currentView} onNavigate={(view) => { setCurrentView(view); setSelectedProject(null); }} tasks={tasks}>
            {renderContent()}
            <AICopilot onCommand={handleAICommand} context={{ tasks, projects, members: TEAM_MEMBERS }} />
        </Layout>
    );
}

export default App;
