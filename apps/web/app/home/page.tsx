'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface User {
  username: string;
  email: string;
  id: string;
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState([
    { id: 1, title: 'Stress Management Workshop', time: '2023-05-15 14:00', description: 'Learn techniques to manage exam stress' },
    { id: 2, title: 'Group Meditation Session', time: '2023-05-17 18:00', description: 'Join us for a calming group meditation' },
  ])
  const [topPosts, setTopPosts] = useState([
    { id: 1, title: '5 Tips for Better Sleep', summary: 'Improve your sleep quality with these simple tips' },
    { id: 2, title: 'Dealing with Homesickness', summary: 'Strategies to cope with feeling homesick in your hostel' },
  ])

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userStr || !token) {
      router.push('/signin')
      return
    }

    setUser(JSON.parse(userStr))
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <section className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">Welcome, {user.username}!</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">We're here to support you. Take care of your mind, it's as important as your body!</p>
      </section>

      <div className="grid gap-4 sm:gap-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 sm:gap-6">
          {/* Upcoming Events - 70% width */}
          <Card className="col-span-full md:col-span-7 bg-accent text-accent-foreground h-[22rem]">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(22rem-4rem)] overflow-y-auto">
              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-card p-3 sm:p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm mb-2">{new Date(event.time).toLocaleString()}</p>
                    <p className="text-sm mb-3 sm:mb-4">{event.description}</p>
                    <Button variant="secondary" size="sm">Join Now</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Mood Check and Anonymous Chat - 30% width */}
          <div className="col-span-full md:col-span-3 space-y-4">
            <Card className="bg-secondary text-secondary-foreground h-[10rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl">Quick Mood Check</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">How are you feeling today?</p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/mood">Journal Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-secondary-foreground h-[10rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl">Anonymous Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">Need someone to talk to?</p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/chat">Start Chatting</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Posts section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Top Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {topPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm sm:text-base">{post.summary}</p>
                    <Link href={`/community/post/${post.id}`} className="text-primary hover:underline">
                      Read More
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

