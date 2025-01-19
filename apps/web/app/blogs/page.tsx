'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Blog {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    name: string
  }
}

export default function UserBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/blogs', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setBlogs(data)
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">My Blogs</h1>
        <p className="text-gray-600 mb-4">
          Share your thoughts, experiences, and insights with the community.
        </p>
        <Button asChild>
          <Link href="/blogs/create">Write New Blog</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  Posted on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-4">{blog.content.substring(0, 150)}...</p>
                <div className="flex space-x-2">
                  <Button asChild variant="outline">
                    <Link href={`/blogs/${blog.id}`}>Read</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/blogs/${blog.id}/edit`}>Edit</Link>
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

