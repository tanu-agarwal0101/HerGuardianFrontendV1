export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  relationship?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  street?: string;
  city?: string;
  country?: string;
  state?: string;
  zipCode?: string;
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  addresses?: Address[];
  contacts?: Contact[];
  safetyTimers?: SafetyTimer[];
  sosTriggers: SOSTrigger[];
  stealthType?: string;
  stealthMode?: boolean;
  dashboardPass?: string;
  sosPass?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SOSTrigger {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  triggeredAt: string;
  resolved: boolean;
}

export interface SafetyTimer {
  id: string;
  userId: string;
  duration: number; // Duration in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sharedLocation: boolean;
}