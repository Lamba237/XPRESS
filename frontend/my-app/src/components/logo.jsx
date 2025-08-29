import { useAppSettings } from '../context/app/useAppSettings.js';

export default function Logo() {
    const { orgName } = useAppSettings();
    return (
        <div className="login-page-logo">
            <img src="./src/assets/xpress_logo.png" alt={orgName + ' Logo'} className="login-logo" />
            {orgName?.toUpperCase() || 'APP'}
        </div>
    );
}