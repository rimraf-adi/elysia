'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Home, MessageCircle, Users, BookOpen, BarChart2, Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Header = () => {
  const [activeTab, setActiveTab] = useState('home')
  const { theme, setTheme } = useTheme()

  const tabs = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Anonymous Chat', icon: MessageCircle, href: '/chat' },
    { name: 'Community', icon: Users, href: '/community' },
    { name: 'My Blogs', icon: BookOpen, href: '/blogs' },
    { name: 'Mood Tracking', icon: BarChart2, href: '/mood' },
  ]

  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-between items-center">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <Link href={tab.href}>
                <span
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    activeTab === tab.name.toLowerCase()
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setActiveTab(tab.name.toLowerCase())}
                >
                  <tab.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{tab.name}</span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header

