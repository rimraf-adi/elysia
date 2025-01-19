'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import Link from 'next/link';

const BlogDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>Posted by {blog.author.name}</p>
      <p>Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
      <Link href="/community">Back to Community</Link>
    </div>
  );
};

export default BlogDetail; 