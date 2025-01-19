'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostDialog } from "@/components/ui/PostDialog"
import api from "@/lib/axios"

interface Blog {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    username: string
  }
  _count: {
    comments: number
    votes: number
  }
}

export default function Community() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs')
      setBlogs(response.data)
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Community Blogs</h1>
        <p className="text-gray-600 mb-4">
          Explore blogs from the community. Share your thoughts and experiences.
        </p>
        <Button asChild>
          <Link href="/blogs/create">Write New Blog</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Blogs</h2>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  Posted by {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-2">{blog.content.substring(0, 150)}...</p>
                <div className="flex items-center space-x-4">
                  <Button 
                    asChild
                    className="mt-2"
                  >
                    <Link href={`/blogs/${blog.id}`}>Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}