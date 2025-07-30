import Logo from '../components/logo.jsx';
import Login_form from '../components/login_form.jsx';
import "../styles/loginStyle.css";

export default function Login() {
    return (
        <div className="login-page-container">
            <Logo />

            <Login_form />
        </div>
    )
}