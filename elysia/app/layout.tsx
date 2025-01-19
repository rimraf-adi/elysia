import './globals.css'
import { Providers } from './providers'
import { Poppins } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Elysia - Mental Health Support for Hostel Students',
  description: 'A friendly platform for mental health support and community building',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans bg-background text-foreground min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

