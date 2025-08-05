import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login_form() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);

            try {
                // Sign in user with Firebase Auth
                const userCredential = await signInWithEmailAndPassword(
                    auth, 
                    formData.email, 
                    formData.password
                );
                
                const user = userCredential.user;
                console.log('User signed in successfully:', user);
                
                // Redirect to dashboard after successful login
                navigate('/');
                
            } catch (error) {
                console.error('Error signing in:', error);
                
                // Handle specific Firebase errors
                let errorMessage = 'Failed to sign in. Please try again.';
                
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No account found with this email address.';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Incorrect password. Please try again.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = 'This account has been disabled.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many failed attempts. Please try again later.';
                }
                
                alert(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    return (

        <div className="login-form-container">
            <div className="form-logo">
                <img src="./src/assets/xpress_logo.png" alt="login form logo" className="form-logo-icon" />

                <div className="form-logo-text">
                    <p className="login_form_header">Log in to your account</p>
                    <p className="login_form_text">Welcome back! Please enter your details.</p>
                    
                </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="email-field fields">
                        <label htmlFor="email">Email</label>
                        <input 
                        type="email" 
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email" 
                            className={`input ${errors.email ? 'input-error' : ''}`}

                         />
                         {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="password-field fields">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`password input ${errors.password ? 'input-error' : ''}`} 
                            placeholder="Enter your password"
                        
                        /> 
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="checkbox-field">
                        <div className="checkbox">
                            <input type="checkbox" className="checkbox" />
                            <label htmlFor="remember-me remember-me">Remember for 30 days</label>
                        </div>

                        <div className="forgot-password label">
                            Forgot password
                        </div>
                    </div>
                    
                    <div className="button-container">
                        <button type="submit" className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button><br />
                    </div>
                    <div className="signup-link">
                        <p>Don’t have an account?</p>
                        <Link to="/signup">
                            <p>sign up</p>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}