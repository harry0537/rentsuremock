export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'appliance' | 'pest_control' | 'landscaping' | 'security' | 'other';

export interface MaintenanceTag {
  id: string;
  name: string;
  color: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  category: MaintenanceCategory;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  notes: MaintenanceNote[];
  completedAt?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
}

export interface MaintenanceNote {
  id: string;
  requestId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
} 