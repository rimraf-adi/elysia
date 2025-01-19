import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const user = { name: 'Sarah' } // This would come from authentication
  const events = [
    { id: 1, title: 'Stress Management Workshop', time: '2023-05-15 14:00', description: 'Learn techniques to manage exam stress' },
    { id: 2, title: 'Group Meditation Session', time: '2023-05-17 18:00', description: 'Join us for a calming group meditation' },
  ]
  const topPosts = [
    { id: 1, title: '5 Tips for Better Sleep', summary: 'Improve your sleep quality with these simple tips' },
    { id: 2, title: 'Dealing with Homesickness', summary: 'Strategies to cope with feeling homesick in your hostel' },
  ]

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Welcome, {user.name}!</h1>
        <p className="text-xl text-muted-foreground">We're here to support you. Take care of your mind, it's as important as your body!</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{new Date(event.time).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
                <Button className="mt-4">Join Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Posts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {topPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.summary}</p>
                <Link href={`/community/post/${post.id}`} className="text-primary hover:underline mt-2 inline-block">
                  Read More
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/chat">Anonymous Chat</Link>
          </Button>
          <Button asChild>
            <Link href="/mood">Mood Tracking</Link>
          </Button>
          <Button asChild>
            <Link href="/resources">Resources</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

