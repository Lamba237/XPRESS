import Logo from '../components/logo'
import SignupForm from '../components/signup-form'
import '../styles/signupStyle.css';

export default function Signup() {
    return (
        <div className="signup-page-container">
            <Logo />

            <SignupForm />
        </div>
    )
}