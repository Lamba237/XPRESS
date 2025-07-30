import React from 'react';

export default function Login_form() {
    return (
        <div className="login-form-container">
            <div className="form-logo">
                <img src="./src/assets/xpress_logo.png" alt="login form logo" className="form-logo-icon" />

                <div className="form-logo-text">
                    <h3 className="login_form_header">Log in to your account</h3>
                    <p className="login_form_text">Welcome back! Please enter your details.</p>
                </div>
            </div>

            <form className="login-form">
                <div className="form-group">
                    <div className="email-field">
                        <label htmlFor="email">Email</label><br />
                        <input type="email" placeholder="Enter your email" /><br />
                    </div>

                    <div className="password-field">
                        <label htmlFor="password">Password</label><br />
                        <input type="password" />
                    </div>

                    <div className="checkbox-field">
                        <input type="checkbox" className="checkbox" />
                        <label htmlFor="remember-me">Remember for 30 days</label>

                        <div className="forgot-password">
                            Forgot password
                        </div>
                    </div>
                    
                    <div className="button-container">
                        <button type="submit">Sign in</button><br />
                        <button className="login-with-google">
                            <img src="./src/assets/Social_icon.jpg" alt="Google icon" />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}