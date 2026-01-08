/**
 * AuthContext
 * 
 * Provides authentication state and methods throughout the app.
 * Handles login, signup, logout, social auth, and session persistence with Supabase.
 */

import { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { getAuthRedirectUrl, supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const redirectUrl = getAuthRedirectUrl();
      console.log('[Auth] Signup redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || '',
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('[Auth] Signup error:', error);
        return { error: new Error(error.message) };
      }

      // Log signup result for debugging
      console.log('[Auth] Signup successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        emailConfirmedAt: data.user?.email_confirmed_at,
        confirmationSentAt: data.user?.confirmation_sent_at,
      });

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        console.log('[Auth] Email confirmation required - confirmation email should be sent');
      } else if (data.user?.email_confirmed_at) {
        console.log('[Auth] Email already confirmed (confirmation disabled in Supabase)');
      }

      return { error: null };
    } catch (error) {
      console.error('[Auth] Signup exception:', error);
      return { error: error instanceof Error ? error : new Error('Sign up failed') };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign in failed') };
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      if (Platform.OS !== 'ios') {
        return { error: new Error('Apple Sign-In is only available on iOS') };
      }

      // Generate a random nonce for security
      const rawNonce = Crypto.getRandomBytes(32)
        .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      // Request Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        return { error: new Error('No identity token received from Apple') };
      }

      // Sign in to Supabase with the Apple ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: rawNonce,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      // Apple only provides the name on FIRST sign-in, so save it immediately
      if (credential.fullName && (credential.fullName.givenName || credential.fullName.familyName)) {
        const fullName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ].filter(Boolean).join(' ');

        if (fullName && data.user) {
          // Update user metadata with Apple name
          await supabase.auth.updateUser({
            data: { 
              full_name: fullName,
              apple_name: fullName, // Store separately as backup
            },
          });
        }
      }

      return { error: null };
    } catch (error) {
      if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
        return { error: new Error('Sign in was cancelled') };
      }
      console.error('[Auth] Apple sign-in error:', error);
      return { error: error instanceof Error ? error : new Error('Apple sign-in failed') };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = getAuthRedirectUrl();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Password reset failed') };
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      if (!user || !session) {
        return { error: new Error('No user logged in') };
      }

      console.log('[Auth] Attempting to delete account for user:', user.id);

      // Get the Supabase URL from environment
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

      // Try Edge Function first (most reliable)
      if (supabaseUrl) {
        try {
          const response = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            console.log('[Auth] Account deleted successfully via Edge Function');
            await supabase.auth.signOut();
            return { error: null };
          }
          
          // If Edge Function returns error, try SQL function
          console.log('[Auth] Edge Function not available, trying SQL function...');
        } catch (fetchError) {
          console.log('[Auth] Edge Function fetch failed, trying SQL function...');
        }
      }

      // Fallback: Try SQL function (delete_own_user)
      const { error: rpcError } = await supabase.rpc('delete_own_user');
      
      if (rpcError) {
        console.error('[Auth] SQL function error:', rpcError.message);
        return { error: new Error('Failed to delete account. Please contact support.') };
      }

      console.log('[Auth] Account deleted successfully via SQL function');
      await supabase.auth.signOut();
      return { error: null };
      
    } catch (error) {
      console.error('[Auth] Delete account error:', error);
      return { error: error instanceof Error ? error : new Error('Account deletion failed') };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signInWithApple,
    signOut,
    resetPassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
