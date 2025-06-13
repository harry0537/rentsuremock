import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Maintenance Request | Rentsure',
  description: 'Submit a new maintenance request for your property.',
};

export default function NewMaintenanceRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 