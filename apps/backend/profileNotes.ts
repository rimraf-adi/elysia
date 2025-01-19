import { Request, Response } from 'express';
import { prisma } from './index';
import { subHours } from 'date-fns';
import cron from 'node-cron';

interface AuthRequest extends Request {
  user: { id: string };
}

// Create a profile note
export const createProfileNote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const note = await prisma.profileNote.create({
            data: {
                content: req.body.content,
                userId: req.user.id
            }
        });
        res.json(note);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create profile note' });
    }
};

// Get active profile notes for a user
export const getProfileNotes = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notes = await prisma.profileNote.findMany({
            where: {
                userId: req.params.userId || req.user.id,
                createdAt: { gte: subHours(new Date(), 24) }
            }
        });
        res.json(notes);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch profile notes' });
    }
};

// Update a profile note
export const updateProfileNote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const note = await prisma.profileNote.findUnique({
            where: { id }
        });

        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }

        if (note.userId !== userId) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        // Check if note is expired
        if (new Date(note.createdAt) < subHours(new Date(), 24)) {
            res.status(400).json({ error: 'Note has expired' });
            return;
        }

        const updatedNote = await prisma.profileNote.update({
            where: { id },
            data: { content }
        });

        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update profile note' });
    }
};

// Delete a profile note
export const deleteProfileNote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const note = await prisma.profileNote.findUnique({
            where: { id: req.params.id }
        });
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        if (note.userId !== req.user.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await prisma.profileNote.delete({ where: { id: req.params.id } });
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete profile note' });
    }
};

// Cleanup expired notes (should be called by a cron job)
export const cleanupExpiredNotes = async () => {
    const twentyFourHoursAgo = subHours(new Date(), 24);
    
    await prisma.profileNote.deleteMany({
        where: {
            createdAt: {
                lt: twentyFourHoursAgo
            }
        }
    });
};

// Run cleanup daily at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        await cleanupExpiredNotes();
        console.log('Cleaned up expired profile notes');
    } catch (error) {
        console.error('Failed to clean up expired notes:', error);
    }
});