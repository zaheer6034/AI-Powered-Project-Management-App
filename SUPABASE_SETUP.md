# Supabase Integration Setup Guide

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL Editor and click **Run**
4. This will create:
   - `projects` table
   - `tasks` table
   - Indexes for performance
   - Row Level Security policies
   - Auto-update triggers

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Configure Backend

1. Navigate to the `backend` folder
2. Create a `.env` file (copy from `.env.example`):
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 5: Install Dependencies

Run in your terminal (in the `backend` folder):
```bash
npm install @supabase/supabase-js dotenv
```

## Step 6: Update server.js to Load Environment Variables

Add this at the top of `server.js`:
```javascript
require('dotenv').config();
```

## Step 7: Start the Server

```bash
cd backend
node server.js
```

## Features

✅ **Dynamic Data Storage**: All data stored in PostgreSQL database  
✅ **Real-time Capabilities**: Supabase supports real-time subscriptions  
✅ **Scalable**: Can handle thousands of projects and tasks  
✅ **Secure**: Row Level Security enabled  
✅ **Auto-timestamps**: Created/updated timestamps managed automatically  

## Database Schema

### Projects Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `description` (Text)
- `team_ids` (Array of Text)
- `status` (active/completed/delayed/cancelled)
- `created_at`, `updated_at` (Timestamps)

### Tasks Table
- `id` (UUID, Primary Key)
- `title` (Text)
- `due_date` (Date)
- `category` (Text)
- `assignees` (Array of Text)
- `project_id` (UUID, Foreign Key)
- `is_blocker` (Boolean)
- `completed` (Boolean)
- `created_at`, `updated_at` (Timestamps)

## Troubleshooting

- **Connection Error**: Check your SUPABASE_URL and SUPABASE_ANON_KEY
- **Table Not Found**: Make sure you ran the SQL schema in Supabase
- **CORS Issues**: Supabase allows all origins by default, but check your project settings

## Next Steps

- Add authentication with Supabase Auth
- Enable real-time subscriptions for live updates
- Add file storage for project attachments
- Implement team member management
