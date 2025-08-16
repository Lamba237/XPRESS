import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

export default function Logout() {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return; // Guard against double-invocation in StrictMode
        hasRun.current = true;

        const doLogout = async () => {
            try {
                await signOut(auth);
            } catch (e) {
                console.error('Error during sign out:', e);
            } finally {
                // Clear any stored auth-related data
                try { 
                    localStorage.removeItem('userRole'); 
                } catch (err) {
                    console.warn('Failed to clear userRole from storage', err);
                }
                navigate('/login', { replace: true });
            }
        };
        doLogout();
    }, [navigate]);

    return (
        <div className="logout-container">
            <h1>Logging out...</h1>
        </div>
    );
}