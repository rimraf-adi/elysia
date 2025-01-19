'use client'

import './globals.css'
import { Providers } from './providers'
import { Poppins } from 'next/font/google'
import ClientLayout from './ClientLayout'
import { SidebarProvider } from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const metadata = {
  title: 'Elysia - Mental Health Support for Hostel Students',
  description: 'A friendly platform for mental health support and community building',
}
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSimplePage = pathname === '/' || pathname === '/signup' || pathname === '/signin'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans bg-background text-foreground min-h-screen w-full`}>
        {isSimplePage ? (
          children
        ) : (
          <Providers>
            <SidebarProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </SidebarProvider>
          </Providers>
        )}
      </body>
    </html>
  )
}

