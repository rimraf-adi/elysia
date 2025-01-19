'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function BlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blogs/${params.id}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setBlog(data)
        }
      } catch (error) {
        console.error('Failed to fetch blog:', error)
      }
    }

    fetchBlog()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const response = await fetch(`http://localhost:5000/blogs/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        router.push('/blogs')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  if (!blog) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
          <p className="text-sm text-gray-500">
            By {blog.author?.name} • {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/blogs')}
            >
              Back to Blogs
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/blogs/${params.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 