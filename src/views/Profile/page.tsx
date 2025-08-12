import { Button, Label, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Toast } from 'src/components/Toast';
import Spinner from '../spinner/Spinner';

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
};

const Profile: React.FC = () => {

  // if (!profile) {
  //   return (
  //     <div>
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    // <div className="flex justify-start px-4 py-8">
    //   {isLoading ? (
    //     <Spinner />
    //   ) : isEditing ? (
    //     <div>
    //       <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>
    //       <div className="space-y-4">
    //         <div>
    //           <Label>Name</Label>
    //           <TextInput type="text" name="name" value={formData.name} onChange={handleChange} />
    //           {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
    //         </div>
    //         <div>
    //           <Label>Email</Label>
    //           <TextInput type="email" name="email" value={formData.email} onChange={handleChange} />
    //           {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
    //         </div>
    //         <div>
    //           <Label>Phone</Label>
    //           <TextInput type="tel" name="phone" value={formData.phone} onChange={handleChange} />
    //           {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
    //         </div>

    //         <div className="flex items-center gap-5">
    //           <div>
    //             {formData.avatar && (
    //               <div>
    //                 <img
    //                   src={formData.avatar}
    //                   alt="Avatar Preview"
    //                   className="mt-2 w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
    //                 />
    //               </div>
    //             )}
    //           </div>
    //           <div>
    //             <input
    //               type="file"
    //               accept="image/*"
    //               onChange={(e) => {
    //                 const file = e.target.files?.[0];
    //                 if (file) {
    //                   const previewURL = URL.createObjectURL(file);
    //                   setFormData((prev) => ({ ...prev, avatar: previewURL }));
    //                 }
    //               }}
    //               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
    //             />
    //             {errors.avatar && <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>}
    //           </div>
    //         </div>

    //         <div className="flex gap-3 mt-6">
    //           <Button color="primary" onClick={handleUpdate}>
    //             Save
    //           </Button>
    //           <Button color="gray" onClick={() => setIsEditing(false)}>
    //             Cancel
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   ) : isChangingPassword ? (
    //     <div>
    //       <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
    //       <div className="space-y-4">
    //         <div>
    //           <Label>Old Password</Label>
    //           <div className="relative">
    //             <TextInput
    //               id="oldPassword"
    //               type={showOldPassword ? 'text' : 'password'}
    //               name="oldPassword"
    //               value={passwordData.oldPassword}
    //               onChange={handlePasswordChange}
    //             />
    //             <button
    //               type="button"
    //               className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
    //               onClick={() => setShowOldPassword(!showOldPassword)}
    //             >
    //               {showOldPassword ? (
    //                 <HiEye className="h-5 w-5 text-gray-500" />
    //               ) : (
    //                 <HiEyeOff className="h-5 w-5 text-gray-500" />
    //               )}
    //             </button>
    //           </div>
    //           {errors.oldPassword && (
    //             <p className="text-sm text-red-500 mt-1">{errors.oldPassword}</p>
    //           )}
    //         </div>
    //         <div>
    //           <Label>New Password</Label>
    //           <div className="relative">
    //             <TextInput
    //               id="newPassword"
    //               type={showNewPassword ? 'text' : 'password'}
    //               name="newPassword"
    //               value={passwordData.newPassword}
    //               onChange={handlePasswordChange}
    //             />
    //             <button
    //               type="button"
    //               className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
    //               onClick={() => setShowNewPassword(!showNewPassword)}
    //             >
    //               {showNewPassword ? (
    //                 <HiEye className="h-5 w-5 text-gray-500" />
    //               ) : (
    //                 <HiEyeOff className="h-5 w-5 text-gray-500" />
    //               )}
    //             </button>
    //           </div>
    //           {errors.newPassword && (
    //             <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
    //           )}
    //         </div>

    //         {apiPasswordError && <p className="text-sm text-red-600 mt-2">{apiPasswordError}</p>}

    //         <div className="flex gap-3 mt-6">
    //           <Button color="primary" onClick={handlePasswordSubmit}>
    //             Change Password
    //           </Button>
    //           <Button color="gray" onClick={() => setIsChangingPassword(false)}>
    //             Cancel
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="flex justify-start">
    //       <div className="flex flex-col items-center gap-6">
    //         <img
    //           className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md object-cover"
    //           src={profile.avatar}
    //           alt="Profile Avatar"
    //         />
    //         <div className="flex-1 space-y-3">
    //           <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
    //           <p className="text-sm text-gray-700">
    //             <span className="font-semibold">ID:</span> {profile.uniqueId}
    //           </p>
    //           <div className="text-gray-700 text-base space-y-1 mt-4">
    //             <p>
    //               <span className="font-semibold">Email:</span> {profile.email}
    //             </p>
    //             <p>
    //               <span className="font-semibold">Phone:</span> {profile.phone}
    //             </p>
    //             <p>
    //               <span className="font-semibold">Joined:</span>{' '}
    //               {new Date(profile.createdAt).toLocaleDateString()}
    //             </p>
    //             <p>
    //               <span className="font-semibold">Last Login:</span>{' '}
    //               {new Date(profile.lastLogin).toLocaleDateString()}
    //             </p>
    //           </div>

    //           <div className="flex items-center gap-3">
    //             <Button color="primary" onClick={() => setIsEditing(true)}>
    //               Update Profile
    //             </Button>
    //             <Button color="primary" onClick={() => setIsChangingPassword(true)}>
    //               Change Password
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div>
      Hello
    </div>
  );
};

export default Profile;
