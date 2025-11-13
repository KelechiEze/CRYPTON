import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, Globe, Edit3 } from 'lucide-react';
import gsap from 'gsap';

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Satoshi',
        lastName: 'Nakamoto',
        email: 'satoshi@nakamoto.com',
        phone: '+1 123-456-7890',
        country: 'United States',
    });

    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(profileRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully! (This is a mock action)');
    };

    return (
        <div ref={profileRef} className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <Edit3 size={16}/> Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
                    <img src={`https://i.pravatar.cc/150?u=${profileData.email}`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500" />
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{profileData.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField icon={User} label="First Name" name="firstName" value={profileData.firstName} isEditing={isEditing} onChange={handleInputChange} />
                    <ProfileField icon={User} label="Last Name" name="lastName" value={profileData.lastName} isEditing={isEditing} onChange={handleInputChange} />
                    <ProfileField icon={Mail} label="Email Address" name="email" value={profileData.email} isEditing={isEditing} onChange={handleInputChange} type="email" />
                    <ProfileField icon={Phone} label="Phone Number" name="phone" value={profileData.phone} isEditing={isEditing} onChange={handleInputChange} type="tel" />
                    <ProfileField icon={Globe} label="Country" name="country" value={profileData.country} isEditing={isEditing} onChange={handleInputChange} />
                </div>
                
                {isEditing && (
                    <div className="flex justify-end gap-4 mt-8">
                        <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ProfileFieldProps {
    icon: React.ElementType;
    label: string;
    name: string;
    value: string;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon: Icon, label, name, value, isEditing, onChange, type = 'text' }) => {
    return (
        <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                <Icon size={16} /> {label}
            </label>
            {isEditing ? (
                <input 
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <p className="text-lg font-semibold bg-gray-200/50 dark:bg-gray-700/30 p-3 rounded-lg">{value}</p>
            )}
        </div>
    );
}

export default Profile;