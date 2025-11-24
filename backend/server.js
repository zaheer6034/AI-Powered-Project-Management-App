require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(bodyParser.json());

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(toCamelCase);
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            result[camelKey] = toCamelCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
};

// --- PROJECTS ENDPOINTS ---

// GET /api/projects
app.get('/api/projects', async (req, res) => {
    try {
        // Fetch projects
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        // Fetch tasks to calculate stats
        const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*');

        if (tasksError) throw tasksError;

        // Calculate stats for each project
        const projectsWithStats = projects.map(p => {
            const projectTasks = tasks.filter(t => t.project_id === p.id);
            const total = projectTasks.length;
            const completed = projectTasks.filter(t => t.completed).length;
            return {
                ...p,
                totalTasks: total,
                completedTasks: completed
            };
        });

        res.json(toCamelCase(projectsWithStats));
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/projects
app.post('/api/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    name: req.body.name,
                    description: req.body.description,
                    team_ids: req.body.teamIds || [],
                    status: 'active'
                }
            ])
            .select();

        if (error) throw error;
        res.status(201).json(toCamelCase(data[0]));
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/projects/:id
app.put('/api/projects/:id', async (req, res) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.status) updates.status = req.body.status;
        if (req.body.teamIds) updates.team_ids = req.body.teamIds;

        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(toCamelCase(data[0]));
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- TASKS ENDPOINTS ---

// GET /api/tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(toCamelCase(data));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: error.message });
    }
});

// Simple Rule-based AI for categorization
const categorizeTask = (text) => {
    if (!text) return 'general';
    const lowerText = text.toLowerCase();

    const keywords = {
        'work': ['meeting', 'report', 'email', 'presentation', 'proposal', 'project', 'deadline', 'client', 'sop', 'team', 'code', 'debug', 'deploy'],
        'personal': ['gym', 'doctor', 'shopping', 'groceries', 'movie', 'dinner', 'party', 'friend', 'family', 'buy'],
        'learning': ['study', 'read', 'course', 'tutorial', 'practice', 'learn', 'class'],
        'health': ['med', 'run', 'sleep', 'dentist', 'yoga', 'walk', 'water'],
        'finance': ['pay', 'bill', 'bank', 'money', 'budget', 'tax', 'invest']
    };

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowerText.includes(word))) {
            return category;
        }
    }
    return 'general';
};

// POST /api/tasks
app.post('/api/tasks', async (req, res) => {
    try {
        const title = req.body.title || req.body.text || 'Untitled Task';
        const dueDate = req.body.dueDate || req.body.deadline || null;

        let category = req.body.category;
        if (!category || category === 'general') {
            category = categorizeTask(title);
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    title: title,
                    due_date: dueDate,
                    category: category,
                    assignees: req.body.assignees || [],
                    project_id: req.body.projectId || null,
                    is_blocker: req.body.isBlocker || false,
                    completed: false
                }
            ])
            .select();

        if (error) throw error;
        res.status(201).json(toCamelCase(data[0]));
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updates = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.dueDate !== undefined) updates.due_date = req.body.dueDate;
        if (req.body.category !== undefined) updates.category = req.body.category;
        if (req.body.assignees !== undefined) updates.assignees = req.body.assignees;
        if (req.body.projectId !== undefined) updates.project_id = req.body.projectId;
        if (req.body.isBlocker !== undefined) updates.is_blocker = req.body.isBlocker;
        if (req.body.completed !== undefined) updates.completed = req.body.completed;

        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(toCamelCase(data[0]));
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (supabaseUrl === 'YOUR_SUPABASE_URL') {
        console.log('⚠️  WARNING: Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    } else {
        console.log('✅ Connected to Supabase');
    }
});
