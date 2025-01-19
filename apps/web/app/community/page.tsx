"use client"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { useEffect, useState } from 'react'

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
}

export default function Community() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await api.get('/blogs')
        setBlogPosts(response.data)
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      }
    }
    fetchBlogPosts()
  }, [])

  const recentBlogPosts = blogPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Community</h1>
        <p className="text-gray-600 mb-4">
          Connect with fellow students, share experiences, and support each other.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {recentBlogPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm">By {post.author.username}</p>
                  <Button asChild>
                    <Link href={`/blogs/${post.id}`}>Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Button asChild className="mt-8">
        <Link href="/community/new-post">Create New Post</Link>
      </Button>
    </div>
  )
}

