import { Request, Response } from 'express';
import { prisma } from './index';

interface AuthRequest extends Request {
  user: { id: string };
}

// Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,

          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Add a comment
export const addComment = async (req: AuthRequest, res: Response) => {
  const { content, postId, parentId } = req.body;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
        parentId,
      },
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Vote on a post or comment
export const vote = async (req: AuthRequest, res: Response) => {
  const { value, postId, commentId } = req.body;
  const userId = req.user.id;

  try {
    const vote = await prisma.vote.upsert({
      where: {
        userId_postId: postId ? { userId, postId } : undefined,
        userId_commentId: commentId ? { userId, commentId } : undefined,
      },
      update: {
        value: value,
      },
      create: {
        value,
        userId,
        ...(postId ? { postId } : {}),
        ...(commentId ? { commentId } : {}),
      },
    });

    // Update score
    if (postId) {
      await updatePostScore(postId);
    } else if (commentId) {
      await updateCommentScore(commentId);
    }

    res.json(vote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote' });
  }
};

// Helper functions to update scores
async function updatePostScore(postId: string) {
  const votes = await prisma.vote.findMany({
    where: { postId },
  });
  const score = votes.reduce((acc, vote) => acc + vote.value, 0);
  await prisma.post.update({
    where: { id: postId },
    data: { score },
  });
}

async function updateCommentScore(commentId: string) {
  const votes = await prisma.vote.findMany({
    where: { commentId },
  });
  const score = votes.reduce((acc, vote) => acc + vote.value, 0);
  await prisma.comment.update({
    where: { id: commentId },
    data: { score },
  });
}
