import React, { useState, useRef, useEffect } from 'react';
import { Bell, Shield, Palette, Key, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const { theme, setTheme } = useTheme();

    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(settingsRef.current?.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
        );
    }, []);

    const handleSave = () => {
        alert('Settings saved! (This is a mock action)');
    }
    
    const handleDeleteAccount = () => {
        if(window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            alert('Account deletion initiated. (This is a mock action)');
        }
    }

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        console.log('Changing theme to:', newTheme);
        setTheme(newTheme);
    }

    return (
        <div ref={settingsRef} className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

            {/* Notifications */}
            <SettingsCard icon={Bell} title="Notifications">
                <SettingRow title="Push Notifications" description="Receive updates on your device.">
                    <ToggleSwitch enabled={notifications} setEnabled={setNotifications} />
                </SettingRow>
                <SettingRow title="Email Notifications" description="Get important account updates via email.">
                    <ToggleSwitch enabled={true} setEnabled={() => {}} />
                </SettingRow>
            </SettingsCard>
            
            {/* Security */}
            <SettingsCard icon={Shield} title="Security">
                <SettingRow title="Two-Factor Authentication (2FA)" description="Add an extra layer of security to your account.">
                     <ToggleSwitch enabled={twoFactorAuth} setEnabled={setTwoFactorAuth} />
                </SettingRow>
                <SettingRow title="Change Password" description="Update your password regularly to keep your account secure.">
                     <button className="bg-blue-600/80 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                        Change
                     </button>
                </SettingRow>
            </SettingsCard>

            {/* Appearance */}
            <SettingsCard icon={Palette} title="Appearance">
                 <SettingRow title="Theme" description="Customize the look and feel of the dashboard.">
                     <div className="flex gap-2">
                        <button 
                            onClick={() => handleThemeChange('light')} 
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                                theme === 'light' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}
                        >
                            Light
                        </button>
                        <button 
                            onClick={() => handleThemeChange('dark')} 
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                                theme === 'dark' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}
                        >
                            Dark
                        </button>
                     </div>
                </SettingRow>
            </SettingsCard>

            <div className="flex justify-between items-start flex-wrap gap-4 pt-4">
                <div className="text-red-500 dark:text-red-400">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Trash2 size={20}/> Delete Account</h3>
                    <p className="text-sm text-red-400/80 dark:text-red-300/80">Permanently delete your account and all associated data.</p>
                </div>
                <button onClick={handleDeleteAccount} className="bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Delete
                </button>
            </div>

            <div className="flex justify-end pt-4">
                 <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

interface SettingsCardProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}
const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, children }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white"><Icon size={24} className="text-blue-500 dark:text-blue-400"/> {title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

interface SettingRowProps {
    title: string;
    description: string;
    children: React.ReactNode;
}
const SettingRow: React.FC<SettingRowProps> = ({ title, description, children }) => (
    <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-200/50 dark:border-gray-700/50 pb-6 last:border-b-0 last:pb-0">
        <div>
            <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div>
            {children}
        </div>
    </div>
)

interface ToggleSwitchProps {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => {
    return (
        <div
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </div>
    );
};

export default Settings;