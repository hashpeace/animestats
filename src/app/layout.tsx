import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CSPostHogProvider } from './providers'
import { ContainerProvider } from '@/contexts/ContainerContext'
import { FetchingMethodProvider } from '@/contexts/FetchingMethodContext'
import ContainerWrapper from '@/components/ContainerWrapper'
import Header from '@/components/Header'
import { Toaster } from 'sonner'
import './globals.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyAnimeList Episode Ratings',
  description: 'Fetch episode ratings from MyAnimeList',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={inter.className}>
          <ContainerProvider>
            <FetchingMethodProvider>
              <TooltipProvider delayDuration={0}>
                <div className="min-h-screen md:bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-gradient-x">
                  <Header />
                  <main className="flex-1 md:py-4">
                    <ContainerWrapper>
                      {children}
                    </ContainerWrapper>
                  </main>
                </div>
              </TooltipProvider>
            </FetchingMethodProvider>
          </ContainerProvider>
          <Toaster />
        </body>
      </CSPostHogProvider>
    </html>
  )
}