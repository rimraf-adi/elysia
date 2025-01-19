//express server
import express from 'express';
import cors from 'cors';



import { signin, signup } from './auth';
import { authMiddleware } from './auth';
import { PrismaClient } from '@prisma/client';
import {
    createJournalEntry,
    getJournalEntries,
    getEntriesByDateRange,
    getEntriesByTag,
    updateJournalEntry,
    deleteJournalEntry
} from './journal';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from './blogs';
import {
  createPost,
  getPosts,
  addComment,
  vote
} from './reddit';
import {
    createProfileNote,
    getProfileNotes,
    updateProfileNote,
    deleteProfileNote,
    cleanupExpiredNotes
} from './profileNotes';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from './events';

import http from 'http';
import AnonChat from './anonChat';


const app = express();
const server = http.createServer(app);  // Create server from express app
const anonChat = new AnonChat(server);



export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  credentials: true,
}));
app.post('/signup', signup);
app.post('/signin', signin);

// Add authMiddleware to protect journal routes
app.post('/journal', authMiddleware, createJournalEntry);
app.get('/journal', authMiddleware, getJournalEntries);
app.get('/journal/date-range', authMiddleware, getEntriesByDateRange);
app.get('/journal/tag/:tag', authMiddleware, getEntriesByTag);
app.put('/journal/:id', authMiddleware, updateJournalEntry);
app.delete('/journal/:id', authMiddleware, deleteJournalEntry);

// Blog routes
app.post('/blogs', authMiddleware, createBlog);
app.get('/blogs', getAllBlogs);
app.get('/blogs/:id', getBlogById);
app.put('/blogs/:id', authMiddleware, updateBlog);
app.delete('/blogs/:id', authMiddleware, deleteBlog);

// Reddit-like feature routes
app.post('/posts', authMiddleware, createPost);
app.get('/posts', getPosts);
app.post('/comments', authMiddleware, addComment);
app.post('/vote', authMiddleware, vote);

// Profile Notes routes
app.post('/profile-notes', authMiddleware, createProfileNote);
app.get('/profile-notes/:userId?', authMiddleware, getProfileNotes);
app.put('/profile-notes/:id', authMiddleware, updateProfileNote);
app.delete('/profile-notes/:id', authMiddleware, deleteProfileNote);

// Event routes
app.post('/events', authMiddleware, createEvent);
app.get('/events', getEvents);
app.get('/events/:id', getEventById);
app.put('/events/:id', authMiddleware, updateEvent);
app.delete('/events/:id', authMiddleware, deleteEvent);

// Remove the separate server.listen() call and keep only the Express server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add cleanup on server shutdown
process.on('SIGTERM', () => {
  anonChat.cleanup();
  server.close();
});

process.on('SIGINT', () => {
  anonChat.cleanup();
  server.close();
});