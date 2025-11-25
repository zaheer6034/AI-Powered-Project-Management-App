require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// --- AI ENDPOINT ---

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        // Construct the prompt with context
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `
        You are Orbit AI, an advanced project management assistant.
        
        CURRENT CONTEXT:
        - Projects: ${JSON.stringify(context.projects?.map(p => ({ name: p.name, status: p.status, progress: p.completedTasks + '/' + p.totalTasks })) || [])}
        - Tasks: ${JSON.stringify(context.tasks?.map(t => ({ title: t.title, status: t.completed ? 'done' : 'pending', due: t.dueDate, assignees: t.assignees })) || [])}
        - Team Members: ${JSON.stringify(context.members?.map(m => ({ id: m.id, name: m.name, role: m.role })) || [])}
        
        USER REQUEST: "${message}"
        
        INSTRUCTIONS:
        1. Answer the user's question based on the context.
        2. If asked about workload, calculate the number of pending tasks for each team member.
        3. Identify underperforming (0 tasks) or overperforming (many tasks) members if asked.
        4. If the user wants to perform an action (navigate, create task), include a JSON block at the END of your response.
        
        AVAILABLE ACTIONS:
        - Navigate: {"action": "NAVIGATE", "payload": "dashboard" | "projects" | "team"}
        - Create Task: {"action": "CREATE_TASK", "payload": { "title": "Task Name" }}
        
        Keep your response concise, professional, and futuristic.
        `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI processing failed', details: error.message });
    }
});

app.post('/api/ai/breakdown', async (req, res) => {
    try {
        const { taskTitle } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert project manager. Break down the following task into a checklist of 3-5 actionable subtasks.
        Task: "${taskTitle}"
        
        Return ONLY the list of subtasks as a JSON array of strings. Example: ["Draft outline", "Research competitors", "Write first draft"].
        Do not include markdown formatting or extra text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up response to ensure valid JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const subtasks = JSON.parse(jsonStr);

        res.json({ subtasks });
    } catch (error) {
        console.error('AI Breakdown Error:', error);
        res.status(500).json({ error: 'Failed to generate breakdown' });
    }
});

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
                    description: req.body.description || '',
                    due_date: dueDate,
                    category: category,
                    assignees: req.body.assignees || [],
                    project_id: req.body.projectId || null,
                    is_blocker: req.body.isBlocker || false,
                    completed: false,
                    status: req.body.status || 'todo'
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
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.dueDate !== undefined) updates.due_date = req.body.dueDate;
        if (req.body.category !== undefined) updates.category = req.body.category;
        if (req.body.assignees !== undefined) updates.assignees = req.body.assignees;
        if (req.body.projectId !== undefined) updates.project_id = req.body.projectId;
        if (req.body.isBlocker !== undefined) updates.is_blocker = req.body.isBlocker;
        if (req.body.completed !== undefined) updates.completed = req.body.completed;
        if (req.body.status !== undefined) updates.status = req.body.status;

        // Sync completed status with kanban status
        if (req.body.status === 'done') updates.completed = true;
        if (req.body.status === 'todo' || req.body.status === 'in_progress') updates.completed = false;
        if (req.body.completed === true) updates.status = 'done';

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
    if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  WARNING: GEMINI_API_KEY not found in .env');
    } else {
        console.log('✅ Gemini AI Initialized');
    }
});
