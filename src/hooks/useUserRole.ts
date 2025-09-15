import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'buyer' | 'seller' | 'admin' | null;

export interface User {
  id: string;
  displayName: string;
  role: UserRole;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  photoURL?: string;
  language: string;
  phone?: string;
  kycStatus?: 'pending' | 'verified' | 'rejected';
}

export const useUserRole = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              displayName: profile.display_name || session.user.email || 'User',
              role: profile.role as UserRole,
              points: profile.points || 0,
              tier: profile.tier as 'Bronze' | 'Silver' | 'Gold',
              photoURL: profile.photo_url || undefined,
              language: profile.language || 'en',
              phone: profile.phone || undefined,
              kycStatus: profile.kyc_status as 'pending' | 'verified' | 'rejected'
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // The onAuthStateChange will handle this
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const switchRole = async (newRole: UserRole) => {
    if (user && session) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('user_id', session.user.id);

        if (!error) {
          setUser({
            ...user,
            role: newRole
          });
        }
      } catch (error) {
        console.error('Error switching role:', error);
      }
    }
  };

  const updatePoints = async (pointsToAdd: number) => {
    if (user && session) {
      try {
        const newPoints = user.points + pointsToAdd;
        let tier: 'Bronze' | 'Silver' | 'Gold' = 'Bronze';
        
        if (newPoints >= 1000) tier = 'Gold';
        else if (newPoints >= 500) tier = 'Silver';

        const { error } = await supabase
          .from('profiles')
          .update({ points: newPoints, tier })
          .eq('user_id', session.user.id);

        if (!error) {
          setUser({
            ...user,
            points: newPoints,
            tier
          });

          // Add entry to points ledger
          await supabase
            .from('points_ledger')
            .insert({
              user_id: session.user.id,
              type: 'earn',
              points: pointsToAdd,
              note: 'Points earned'
            });
        }
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    switchRole,
    updatePoints, 
    signOut,
    isAuthenticated: !!session,
    isBuyer: user?.role === 'buyer',
    isSeller: user?.role === 'seller',
    isAdmin: user?.role === 'admin'
  };
};