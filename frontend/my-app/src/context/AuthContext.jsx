import React, { useEffect, useState, useCallback } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthContext, SUPER_ADMIN_EMAIL, ROLE_PERMISSIONS } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine effective role with super admin override
  const resolveRole = useCallback((email, storedRole) => {
    if (!email) return null;
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return 'admin';
    }
    return storedRole || 'cashier';
  }, []);

  useEffect(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('xpress_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setRole(resolveRole(parsed.email, parsed.role));
        }
      } catch (error) {
        console.warn('Failed to parse stored user:', error);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Get stored role or default to cashier
        let storedRole = 'cashier';
        const stored = localStorage.getItem('xpress_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            storedRole = parsed?.role || 'cashier';
          } catch (error) {
            console.warn('Failed to parse stored role:', error);
          }
        }

        const effectiveRole = resolveRole(firebaseUser.email, storedRole);
        setUser(firebaseUser);
        setRole(effectiveRole);

        // Persist user info
        localStorage.setItem('xpress_user', JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: effectiveRole
        }));
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('xpress_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [resolveRole]);

  // Check if user can access a specific page
  const canAccessPage = useCallback((pageKey) => {
    if (!role) return false;
    const allowedPages = ROLE_PERMISSIONS[role] || [];
    return allowedPages.includes(pageKey);
  }, [role]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = {
    user,
    role,
    loading,
    canAccessPage,
    logout,
    SUPER_ADMIN_EMAIL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}