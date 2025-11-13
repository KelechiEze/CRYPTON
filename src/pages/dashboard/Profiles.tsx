import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, Globe, Edit2, Save, X } from 'lucide-react';
import gsap from 'gsap';
import { subscribeToUserData, updateUserProfile } from '../auth/authService';
import { auth } from '../../firebase';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  createdAt?: any;
  lastLogin?: any;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      // Subscribe to real-time user data
      const unsubscribe = subscribeToUserData(currentUser.uid, (data) => {
        if (data) {
          setUserProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            country: data.country || '',
            createdAt: data.createdAt,
            lastLogin: data.lastLogin
          });
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && profileRef.current) {
      gsap.fromTo(profileRef.current.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (user) {
      const unsubscribe = subscribeToUserData(user.uid, (data) => {
        if (data) {
          setUserProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            country: data.country || '',
            createdAt: data.createdAt,
            lastLogin: data.lastLogin
          });
        }
        unsubscribe();
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      const result = await updateUserProfile(user.uid, {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        country: userProfile.country
      });

      if (result.success) {
        setIsEditing(false);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = (): string => {
    const first = userProfile.firstName?.charAt(0) || '';
    const last = userProfile.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Unknown date';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getAvatarColor = (): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = (userProfile.firstName?.length + userProfile.lastName?.length) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div ref={profileRef} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              {/* Avatar and Name Row */}
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 ${getAvatarColor()} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                  {getInitials()}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="w-full mt-1 bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="First Name"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {userProfile.firstName || 'Not set'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="w-full mt-1 bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Last Name"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {userProfile.lastName || 'Not set'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {userProfile.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full mt-1 bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {userProfile.phone || 'Not set'}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Globe size={16} />
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full mt-1 bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Country"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {userProfile.country || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(userProfile.createdAt)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(userProfile.lastLogin)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">Security</h3>
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              Your profile information is securely stored and encrypted. 
              For security reasons, email addresses cannot be changed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;