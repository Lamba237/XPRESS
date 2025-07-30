import React from 'react';

export default function Login_form() {
    return (
        <div className="login-form-container">
            <div className="form-logo">
                <img src="./src/assets/xpress_logo.png" alt="login form logo" className="form-logo-icon" />

                <div className="form-logo-text">
                    <p className="login_form_header">Log in to your account</p>
                    <p className="login_form_text">Welcome back! Please enter your details.</p>
                    
                </div>
            </div>

            <form className="login-form">
                <div className="form-group">
                    <div className="email-field fields">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Enter your email" className="input" /> <br /> <br />
                    </div>

                    <div className="password-field fields">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="password input"/> <br />
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
                        <button type="submit" className="submit_btn">Sign in</button><br />
                        <button className="login-with-google input">
                            <img src="./src/assets/Social_icon.jpg" alt="Google icon" />
                            Sign in with Google
                        </button>
                    </div>
                    <div className="signup-link">
                        <p>Don’t have an account?</p>
                        <p>sign up</p>
                    </div>
                </div>
            </form>
        </div>
    )
}