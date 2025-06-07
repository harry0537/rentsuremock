import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'

// Dynamically import client components
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })
const AuthProvider = dynamic(() => import('@/context/AuthContext').then(mod => mod.AuthProvider), { ssr: false })
const PropertyProvider = dynamic(() => import('@/context/PropertyContext').then(mod => mod.PropertyProvider), { ssr: false })
const MaintenanceProvider = dynamic(() => import('@/context/MaintenanceContext').then(mod => mod.MaintenanceProvider), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RentSure - Residential Rental Platform',
  description: 'A modern, cloud-based residential rental platform that connects verified tenants with trusted landlords.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <PropertyProvider>
            <MaintenanceProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <Toaster position="bottom-right" />
              </div>
            </MaintenanceProvider>
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 