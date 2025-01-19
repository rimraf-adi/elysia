import { prisma } from './index';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define custom interface for authenticated request
interface AuthRequest extends Request {
  user?: { id: string };
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email or username already exists' });
      return;
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    });

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.username },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (error: any, user: any) => {
    if (error) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    req.user = { id: user.userId };
    next();
  });
};
