import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function SignupForm() {

    // Used for navigation to link to login page

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin' //This is the default role vale
    })
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Handle input changes
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
    // Password Validation function
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Must be at least 8 characters.'
        }
        return '';
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        const passwordError = validatePassword(formData.password);
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (passwordError) {
            newErrors.password = passwordError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);

            // Here you would typically send data to your backend
            console.log('Form submitted:', formData);
            
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                alert('Account created successfully!');
            }, 1000);
        }
    };

    return (
        <>
        <div className="signup-form-container">
            <div className="form-header">
                <div className="form-logo">
                    <img src="./src/assets/xpress_logo.png" alt="login form logo" className="form-logo-icon" />

                <div className="form-logo-text">
                    <p className="login_form_header">Create an account</p>
                    <p className="login_form_text">Start your 30-day free trial.</p>
                    
                </div>
            </div>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="name-field fields">
                        <label htmlFor="name" className="label">Name*</label>
                        <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name" 
                        className={`input ${errors.name ? 'input-error' : ''}`}
                         /> 
                         {errors.name && <span className="error-message">{errors.name}</span>}
                    </div> 

                    <div className="email-field fields">
                        <label htmlFor="email" className="label">Email*</label>
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
                        <label htmlFor="password" className="label">Password*</label>
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
                        {formData.password.length > 0 && formData.password.length < 8 && (
                            <span className="password-hint">
                                {8 - formData.password.length} more characters needed
                            </span>
                        )}
                    </div>

                    <div className="select-field">
                        <label htmlFor="role" className="label">Option*</label>
                        <select 
                        className="input-select"
                        
                        onChange={handleInputChange}
                        >
                            <option className="admin-option" value="admin">Admin</option>
                            <option className="cashier-option" value="cashier">Cashier</option>
                        </select>
                    </div>

                    <div className="button-container">
                        <button 
                        type="submit" 
                        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Getting started' : 'Get started'}
                    </button>
                    </div>
                        <div className="login-link">
                            <p>Already have an account?</p>
                            <Link to="/login">
                                <p>Log in</p>
                            </Link>
                            
                        </div>
                </div>
                
            </form>
                
        </div>
        </>
    
    )
}