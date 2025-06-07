import './globals.css'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'

// Dynamically import client components
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true })
const AuthProvider = dynamic(() => import('@/context/AuthContext').then(mod => mod.AuthProvider), { ssr: true })
const PropertyProvider = dynamic(() => import('@/context/PropertyContext').then(mod => mod.PropertyProvider), { ssr: true })
const MaintenanceProvider = dynamic(() => import('@/context/MaintenanceContext').then(mod => mod.MaintenanceProvider), { ssr: true })

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RentSure - Property Management Made Simple',
  description: 'Streamline your property management with RentSure. Handle maintenance requests, tenant communications, and property management all in one place.',
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
              <Toaster position="top-center" />
            </MaintenanceProvider>
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 