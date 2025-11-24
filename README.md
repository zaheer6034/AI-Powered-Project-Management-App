# Orbit - Project Management App

A modern, feature-rich project management application built with React and Supabase.

![Orbit Dashboard](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

- 📊 **Dashboard Analytics** - Real-time project and task statistics
- 🎯 **Project Management** - Create and manage projects with status tracking (Active, Completed, Delayed, Cancelled)
- ✅ **Task Management** - Create, assign, and track tasks with deadlines
- 👥 **Team Collaboration** - Assign tasks to team members and track workload
- 🤖 **Auto-Categorization** - AI-powered task categorization based on keywords
- 🎨 **Priority System** - Color-coded priority levels based on deadlines
- 📈 **Progress Tracking** - Visual progress bars and completion rates
- 🎉 **Celebration Features** - Auto-complete projects when all tasks are done

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- CSS (Custom Design System "Orbit")

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- RESTful API

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier available)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/zaheer6034/AI-Powered-Project-Management-App.git
cd AI-Powered-Project-Management-App
```

### 2. Set up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `backend/supabase-schema.sql`
3. Copy your project URL and anon key from Settings → API

### 4. Set up Frontend

```bash
cd ../frontend
npm install
```

## 🎮 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Project-Manager-App/
├── backend/
│   ├── server.js           # Express server with Supabase integration
│   ├── supabase-schema.sql # Database schema
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.js         # API client
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
└── SUPABASE_SETUP.md      # Detailed setup guide
```

## 🎨 Features in Detail

### Project Management
- Create projects with descriptions
- Track project status (Active/Completed/Delayed/Cancelled)
- View project progress with completion percentages
- Auto-complete projects when all tasks are done

### Task Management
- Create tasks with titles, deadlines, and categories
- Assign multiple team members to tasks
- Auto-categorization based on keywords
- Priority levels (High/Medium/Low) based on deadlines
- Edit and delete tasks inline

### Dashboard
- Overall completion rate
- Active projects count
- Team workload visualization
- Upcoming deadlines
- Project progress overview

### Team View
- Team member cards with status indicators
- Individual workload tracking
- Task assignment statistics

## 🔒 Environment Variables

Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 📝 Database Schema

### Projects Table
- `id` (UUID)
- `name` (Text)
- `description` (Text)
- `team_ids` (Array)
- `status` (Enum: active/completed/delayed/cancelled)
- `created_at`, `updated_at` (Timestamps)

### Tasks Table
- `id` (UUID)
- `title` (Text)
- `due_date` (Date)
- `category` (Text)
- `assignees` (Array)
- `project_id` (UUID, Foreign Key)
- `is_blocker` (Boolean)
- `completed` (Boolean)
- `created_at`, `updated_at` (Timestamps)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ by [Zaheer Abbas]

## 🙏 Acknowledgments

- Design inspired by Linear, Asana, and Notion
- Built with Supabase for backend infrastructure
- Icons and UI components custom-built

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Note**: Make sure to set up your Supabase credentials before running the application. See `SUPABASE_SETUP.md` for detailed instructions.
