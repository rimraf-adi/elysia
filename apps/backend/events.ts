import { Request, Response } from 'express';
import { prisma } from './index';

interface AuthRequest extends Request {
  user: { id: string };
}

// Create a new event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, startTime, endTime, type, location } = req.body;
  const userId = req.user.id;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        location,
        userId,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events with optional filtering
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const { type, startDate, endDate } = req.query;

  try {
    const events = await prisma.event.findMany({
      where: {
        ...(type && { type: String(type) }),
        ...(startDate && endDate && {
          startTime: {
            gte: new Date(String(startDate)),
            lte: new Date(String(endDate)),
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Update event
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, startTime, endTime, type, location } = req.body;
  const userId = req.user.id;

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    if (event.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to update this event' });
      return;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
        location,
      },
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    if (event.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this event' });
      return;
    }

    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
