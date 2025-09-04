import { useState, useEffect } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin' | null;

export interface User {
  id: string;
  displayName: string;
  role: UserRole;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  photoURL?: string;
  language: string;
}

// Mock user data - in real app this would come from Firebase Auth
const mockUser: User = {
  id: '1',
  displayName: 'Demo User',
  role: 'buyer',
  points: 800,
  tier: 'Silver',
  language: 'en'
};

export const useUserRole = () => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole
      });
    }
  };

  const updatePoints = (points: number) => {
    if (user) {
      const newPoints = user.points + points;
      let tier: 'Bronze' | 'Silver' | 'Gold' = 'Bronze';
      
      if (newPoints >= 1000) tier = 'Gold';
      else if (newPoints >= 500) tier = 'Silver';
      
      setUser({
        ...user,
        points: newPoints,
        tier
      });
    }
  };

  return {
    user,
    loading,
    switchRole,
    updatePoints,
    isAuthenticated: !!user,
    isBuyer: user?.role === 'buyer',
    isSeller: user?.role === 'seller',
    isAdmin: user?.role === 'admin'
  };
};