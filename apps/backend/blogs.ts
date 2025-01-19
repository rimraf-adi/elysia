import { z } from 'zod';
import { prisma } from './index';
import { Request, Response } from 'express';

interface BlogData {
  title: string;
  content: string;
  published?: boolean;
}

const BlogSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  published: z.boolean().optional().default(false),
});

export const createBlog = async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    const validatedData = BlogSchema.parse(req.body) as BlogData;
    const blog = await prisma.blog.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        published: validatedData.published,
        authorId: req.user!.id
      },
    });
    res.status(201).json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
    }
    res.status(500).json({ error: 'Failed to create blog' });
    return;
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: true,
      },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await prisma.blog.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

