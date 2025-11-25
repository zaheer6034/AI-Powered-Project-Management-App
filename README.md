# Orbit - Intelligent Project Management

Orbit is a modern, AI-powered project management platform designed to streamline team collaboration and productivity. Built with a focus on futuristic UI and intelligent automation, Orbit goes beyond simple task tracking by integrating context-aware AI to assist with workload management, task breakdown, and navigation.

![Orbit Dashboard](https://via.placeholder.com/1200x600/0f1115/3b82f6?text=Orbit+Dashboard+Preview)

## 🚀 Key Features

### 🧠 AI Copilot & Automation
*   **Context-Aware Assistant**: The built-in AI (powered by Gemini 2.5 Flash) understands your project context, team members, and deadlines. Ask it to "Show me who is overloaded" or "Create a high-priority task for the redesign."
*   **✨ Magic Breakdown**: Stuck on a big task? One click generates a detailed checklist of actionable subtasks, automatically populated into your task description.
*   **Smart Navigation**: Control the app with natural language commands like "Go to the marketing project."

### 📊 Advanced Visualization
*   **Kanban Board**: A fully interactive, drag-and-drop board to visualize workflow stages (To Do, In Progress, Done).
*   **Team Workload Charts**: Dynamic line charts visualize team capacity and active task distribution in real-time.
*   **Project Dashboard**: A high-level overview of all active projects, progress stats, and team availability.

### ⚡ Modern Workflow
*   **Real-time Updates**: Instant status changes and task updates.
*   **Deadline Alerts**: Intelligent notifications for tasks due within 24 hours.
*   **Sleek UI**: A "Neon-Glass" aesthetic with dark mode by default, designed for focus and clarity.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Vanilla CSS (Custom Design System)
*   **Backend**: Node.js, Express
*   **Database**: Supabase (PostgreSQL)
*   **AI Engine**: Google Gemini API
*   **State Management**: React Hooks

## 🏁 Getting Started

### Prerequisites
*   Node.js (v16+)
*   npm or yarn
*   A Supabase account
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/zaheer6034/AI-Powered-Project-Management-App.git
    cd AI-Powered-Project-Management-App
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory:
        ```env
        SUPABASE_URL=your_supabase_url
        SUPABASE_ANON_KEY=your_supabase_key
        GEMINI_API_KEY=your_gemini_key
        ```
    *   Run the SQL script in `supabase-schema.sql` and `UPDATE_SCHEMA.sql` in your Supabase SQL Editor to set up the database.
    *   Start the server:
        ```bash
        npm start
        ```

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    ```
    *   Create a `.env` file in the `frontend` directory:
        ```env
        VITE_API_URL=http://localhost:5000
        ```
    *   Start the development server:
        ```bash
        npm run dev
        ```

4.  **Launch**: Open `http://localhost:5173` in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built by [Zaheer Abbas](https://github.com/zaheer6034)**
