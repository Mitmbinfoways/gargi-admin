// export default Profile;
import { Button, Label, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
// import { Toast } from 'src/components/Toast';
import Spinner from '../spinner/Spinner';
import { getUserProfile, updateUserProfile } from 'src/AxiosConfig/AxiosConfig';

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [apiPasswordError, setApiPasswordError] = useState('');

  const adminString = sessionStorage.getItem('admin');
  const admin = adminString ? JSON.parse(adminString) : null;
  const userid = admin?._id;

  const fetchData = async () => {
    if (!userid) return;
    setIsLoading(true);
    try {
      const res = await getUserProfile(userid);
      const user = res.data.data;
      setProfile(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    } catch (error) {
      console.error(error);
      // Toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    return newErrors;
  };

  const handleUpdate = async () => {
    if (!userid) return;
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      setIsLoading(true);
      // Send data (modify if backend requires FormData for image)
      const res = await updateUserProfile(formData);
      setProfile(res.data.data);
      setIsEditing(false);
      sessionStorage.setItem('admin', JSON.stringify(res.data.data));
      // Toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      // Toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setErrors({
        oldPassword: !passwordData.oldPassword ? 'Required' : '',
        newPassword: !passwordData.newPassword ? 'Required' : '',
      });
      return;
    }
    try {
      setIsLoading(true);
      const res = await updateUserProfile({
        ...formData,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setProfile(res.data.data);
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
      sessionStorage.setItem('admin', JSON.stringify(res.data.data));
      // Toast.success('Password changed successfully');
    } catch (error: any) {
      setApiPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-start px-4 py-8">
      {isLoading ? (
        <Spinner />
      ) : isEditing ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <TextInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-96" // Fixed width (24rem)
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <TextInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-96"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <Button color="primary" onClick={handleUpdate} disabled={isLoading}>
                Save
              </Button>
              <Button color="gray" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : isChangingPassword ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <Label>Old Password</Label>
              <div className="relative">
                <TextInput
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <HiEye /> : <HiEyeOff />}
                </button>
              </div>
              {errors.oldPassword && <p className="text-sm text-red-500">{errors.oldPassword}</p>}
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <TextInput
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <HiEye /> : <HiEyeOff />}
                </button>
              </div>
              {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
            </div>
            {apiPasswordError && <p className="text-sm text-red-600">{apiPasswordError}</p>}

            <div className="flex gap-3 mt-6">
              <Button color="primary" onClick={handlePasswordSubmit}>
                Change Password
              </Button>
              <Button color="gray" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        profile && (
          <div className="flex flex-col items-center gap-6">
            {/* <img
              className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md object-cover"
              src={profile.avatar}
              alt="Profile Avatar"
            /> */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <div className="text-gray-700 text-base space-y-1 mt-4">
                <p>
                  <span className="font-semibold">Email:</span> {profile.email}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button color="primary" onClick={() => setIsEditing(true)}>
                  Update Profile
                </Button>
                <Button color="primary" onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Profile;
