//express server
import express from 'express';
import { signin, signup } from './auth';
import { authMiddleware } from './auth';
import {
    createJournalEntry,
    getJournalEntries,
    getEntriesByDateRange,
    getEntriesByTag,
    updateJournalEntry,
    deleteJournalEntry
} from './journal';
  
const app = express();
app.use(express.json());

app.post('/signup', signup);
app.post('/signin', signin);

// Add authMiddleware to protect journal routes
app.post('/journal', authMiddleware, createJournalEntry);
app.get('/journal', authMiddleware, getJournalEntries);
app.get('/journal/date-range', authMiddleware, getEntriesByDateRange);
app.get('/journal/tag/:tag', authMiddleware, getEntriesByTag);
app.put('/journal/:id', authMiddleware, updateJournalEntry);
app.delete('/journal/:id', authMiddleware, deleteJournalEntry);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
