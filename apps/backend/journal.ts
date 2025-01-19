import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Request, Response } from 'express';
import { authMiddleware } from './auth';

const prisma = new PrismaClient();

const journalEntrySchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  date: z.string().transform((str) => new Date(str)),
  tags: z.array(z.string()),
  sentiment: z.number().min(0).max(10),
});

// Add this interface
interface AuthRequest extends Request {
  user: { id: string };
}

export async function createJournalEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const validation = journalEntrySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const entry = await prisma.journalEntry.create({
      data: {
        content: validation.data.content,
        date: validation.data.date,
        tags: validation.data.tags,
        sentiment: validation.data.sentiment,
        userId: req.user.id
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
}

export async function getJournalEntries(req: AuthRequest, res: Response): Promise<void> {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
}

export async function getEntriesByDateRange(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
}

export async function getEntriesByTag(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { tag } = req.params;

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: req.user.id,
        tags: {
          has: tag,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
}

export async function updateJournalEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const validation = journalEntrySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors });
      return;
    }

    const entry = await prisma.journalEntry.update({
      where: {
        id,
        userId: req.user.id,
      },
      data: validation.data,
    });

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
}

export async function deleteJournalEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.journalEntry.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
}
