'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageCircle, BarChart2, Users, Calendar, Lock } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Check for authentication in localStorage
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    // If authenticated, redirect to home
    if (token && user) {
      router.push('/home')
    }
  }, [router])

  const features = [
    { icon: BookOpen, title: 'Resource Library', description: 'Access articles, self-help tools, and guides on mental health topics.' },
    { icon: MessageCircle, title: 'Anonymous Chat Service', description: 'Connect with trained counselors anonymously for confidential support.' },
    { icon: BarChart2, title: 'Mood Tracking', description: 'Log and track your emotional well-being over time with visual insights.' },
    { icon: Users, title: 'Peer Support Community', description: 'Share experiences and offer support in a safe, moderated environment.' },
    { icon: Calendar, title: 'Event Calendar', description: 'Stay updated on mental health workshops, events, and resources.' },
    { icon: Lock, title: 'Privacy & Security', description: 'All user data is encrypted and stored securely.' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 sm:py-16 md:py-20">
          <div className="container mx-auto text-center px-4">
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-wide">Elysia</h1>
            <p className="text-xl sm:text-2xl mb-6 sm:mb-8">Your Safe Space for Mental Well-Being</p>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 italic">"A Place of Peace, A Path to Healing"</p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-secondary">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-secondary py-12 sm:py-16 md:py-20">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Key Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {['Confidentiality', 'Professional Support', 'Personalized Experience', 'User-Centered'].map((benefit, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{benefit}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-12 sm:py-16 md:py-20">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8">Join Elysia today and take the first step towards better mental health.</p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-secondary">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-accent text-accent-foreground py-6 sm:py-8">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2025 Elysia. All rights reserved.</p>
          <p className="mt-2 text-sm sm:text-base">For any questions or suggestions, feel free to reach out to kinjawadekaradi112@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}

