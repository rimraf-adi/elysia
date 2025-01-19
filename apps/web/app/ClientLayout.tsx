'use client'

import { usePathname } from 'next/navigation'
import { SidebarInset } from "@/components/ui/sidebar"
import dynamic from 'next/dynamic'
import Footer from './components/Footer'

const Sidebar = dynamic(() => import('./components/Sidebar'), { ssr: false })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  if (pathname === '/landing') {
    return <>{children}</>
  }
  
  return (
    <>
      <Sidebar />
      <SidebarInset>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </>
  )
} 