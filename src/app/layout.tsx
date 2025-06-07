import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { PropertyProvider } from '@/context/PropertyContext'
import { MaintenanceProvider } from '@/context/MaintenanceContext'

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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PropertyProvider>
            <MaintenanceProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </MaintenanceProvider>
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 