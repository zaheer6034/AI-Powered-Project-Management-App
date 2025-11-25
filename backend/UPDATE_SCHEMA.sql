-- Run this in your Supabase SQL Editor to update the tasks table

-- Add status column for Kanban board (todo, in_progress, done)
ALTER TABLE tasks 
ADD COLUMN status text DEFAULT 'todo';

-- Add description column for AI breakdowns and details
ALTER TABLE tasks 
ADD COLUMN description text;

-- Update existing completed tasks to have 'done' status
UPDATE tasks 
SET status = 'done' 
WHERE completed = true;

-- Update existing incomplete tasks to have 'todo' status
UPDATE tasks 
SET status = 'todo' 
WHERE completed = false;
