import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const topics = [
  { id: 1, name: "Exam Stress", postCount: 15 },
  { id: 2, name: "Loneliness", postCount: 8 },
  { id: 3, name: "Mindfulness", postCount: 12 },
]

const recentPosts = [
  { id: 1, title: "How I overcame exam anxiety", author: "Alex", likes: 24, comments: 7 },
  { id: 2, title: "Finding friends in a new city", author: "Sam", likes: 18, comments: 5 },
]

export default function Community() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Community</h1>
        <p className="text-gray-600 mb-4">
          Connect with fellow students, share experiences, and support each other.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Topics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{topic.postCount} posts</p>
                <Button asChild className="mt-2">
                  <Link href={`/community/topic/${topic.id}`}>View Posts</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>By {post.author}</p>
                <p>{post.likes} likes • {post.comments} comments</p>
                <Button asChild className="mt-2">
                  <Link href={`/community/post/${post.id}`}>Read More</Link>
                </Button>
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

