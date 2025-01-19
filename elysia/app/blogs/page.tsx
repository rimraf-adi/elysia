import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const userBlogs = [
  { id: 1, title: "My Journey with Anxiety", createdAt: "2023-05-01", excerpt: "In this post, I share my personal experiences..." },
  { id: 2, title: "5 Mindfulness Techniques That Worked for Me", createdAt: "2023-05-10", excerpt: "Here are some mindfulness techniques I've found helpful..." },
]

export default function UserBlogs() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">My Blogs</h1>
        <p className="text-gray-600 mb-4">
          Share your thoughts, experiences, and insights with the community.
        </p>
        <Button asChild>
          <Link href="/blogs/new">Write New Blog</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
        <div className="space-y-4">
          {userBlogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">Posted on {new Date(blog.createdAt).toLocaleDateString()}</p>
                <p className="mb-4">{blog.excerpt}</p>
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

