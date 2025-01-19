'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Home, MessageCircle, Users, BookOpen, BarChart2, Sun, Moon, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const SidebarComponent = () => {
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger className="p-2">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {tabs.map((tab) => (
            <SidebarMenuItem key={tab.name}>
              <SidebarMenuButton
                asChild
                isActive={activeTab === tab.name.toLowerCase()}
                onClick={() => setActiveTab(tab.name.toLowerCase())}
              >
                <Link href={tab.href} className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SidebarComponent

