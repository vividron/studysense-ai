import { Eye, EyeOff, Flame, Lock, LogOut, Mail, User, UserPen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button';
import { changePasswordSchema, updateProfileSchema } from '../schemas/authSchema';
import { changePassword, updateProfile } from '../api/auth.api';
import toast from 'react-hot-toast';

const ProfilePage = () => {

  const { user, logout, updateUser } = useAuth()

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const {
    register: registerUser,
    handleSubmit: handleSubmitProfile,
    watch,
    formState: { errors: userErrors, isSubmitting: userSubmitting }
  } = useForm({ resolver: zodResolver(updateProfileSchema) });

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPasswordFields,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting }
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const isUserUpdated = watch("username") !== user?.username || watch("email") !== user?.email;

  const handleUpdateUser = async (data) => {

    // Check which field changed
    const { username, email } = data;
    let userData;
    if(username === user?.username) userData = {email}
    else if(email === user?.email) userData = {username}
    else userData = {username, email}

    try {
      const data = await updateProfile(userData);
      updateUser(data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  }

  const handdleChangePassword = async (data) => {
    const {currentPassword, newPassword} = data
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      resetPasswordFields()
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    }
  }

  return (

    <div className="min-h-full max-w-4xl mx-auto space-y-8 flex flex-col justify-center">

      {/* Header */}
      <div className='space-y-1'>
        <h1 className="text-2xl font-bold text-white">
          Profile
        </h1>
        <div className='tablet:hidden mt-2 h-px gradient bg-linear-to-r from-white/10 via-white/20 to-white/10' />
      </div>

      <div className="bg-(--bg-surface) border border-white/10 rounded-2xl p-6">

        <div className='space-y-6'>

          <h2 className="text-xl font-semibold">User Information</h2>

          {/* User information */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-3 border-(--primary) flex items-center justify-center text-3xl font-semibold">
              {user?.username?.trim()[0].toUpperCase()}
            </div>

            <div className='flex flex-col items-start'>
              <p className="text-lg font-semibold">{user?.username ?? "xyz"}</p>
              <p className="text-sm text-white/80 flex items-center gap-2">
                <Mail size={14} /> {user?.email ?? "xyz@gmail.com"}
              </p>
              <div className="flex items-center gap-1 text-sm text-orange-400 mt-1.5">
                <Flame size={16} className='mb-1' />
                <span className="leading-none">{user?.streak ?? 0} day Quiz streak</span>
              </div>
            </div>
          </div>

          {/* Update user form */}
          <form onSubmit={handleSubmitProfile(handleUpdateUser)} className="space-y-5">

            {/* Username */}
            <div className='flex flex-col gap-2'>
              <label className="block text-sm text-white/70">
                Username
              </label>
              <input
                type="text"
                defaultValue={user?.username ?? "xyz"}
                {...registerUser("username")}
                className={`w-full rounded-xl bg-transparent border px-5 py-2.5 text-white focus:outline-none transition ${userErrors.username ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
              {userErrors.username && (
                <p className="text-sm text-red-400 mt-1">
                  {userErrors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className='flex flex-col gap-2'>
              <label className="block text-sm text-white/70">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email ?? "xyz@gmail.com"}
                {...registerUser("email")}
                className={`w-full rounded-xl bg-transparent border px-5 py-2.5 text-white focus:outline-none transition ${userErrors.email ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
              {userErrors.email && (
                <p className="text-sm text-red-400">
                  {userErrors.email.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              label={"Save Changes"}
              className={!isUserUpdated ? "opacity-60 pointer-events-none" : ""}
              isSubmitting={userSubmitting}
              onSubmittingText={"Saving..."}
            />
          </form>
        </div>
      </div>

      {/*Change password form*/}
      <div className="bg-(--bg-surface) border border-white/10 rounded-2xl p-6 flex flex-col gap-2">

        <h2 className="text-xl font-semibold mb-2">Change Password</h2>

        <form onSubmit={handleSubmitPass(handdleChangePassword)} className="space-y-5">
          {/* current password */}
          <div className='flex flex-col gap-2'>
            <label className="block text-sm text-white/70">
              Current Password
            </label>
            <input
              type="text"
              {...registerPass("currentPassword")}
              className={`w-full rounded-xl bg-transparent border px-5 py-2.5 text-white focus:outline-none transition ${passwordErrors.currentPassword ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
            />
            {passwordErrors.currentPassword && (
              <p className="text-sm text-red-400">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div className='flex flex-col gap-2'>
            <label className="block text-sm text-white/70">
              New Password
            </label>
            <div className="relative group">
              <input
                type={showNewPass ? "text" : "password"}
                {...registerPass("newPassword")}
                className={`w-full rounded-xl ${showNewPass ? "" : "text-xl font-bold tracking-widest"} bg-transparent border px-5 py-2 text-white focus:outline-none focus:border-(--primary) transition ${passwordErrors.newPassword ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
              {/* Show password button*/}
              <button
                type="button"
                onClick={() => setShowNewPass(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                 text-white/60 hover:text-white transition"
                tabIndex={-1}
              >
                {showNewPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-sm text-red-400">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='flex flex-col gap-2'>
            <label className="block text-sm text-white/70">
              Confirm New Password
            </label>
            <div className="relative group">
              <input
                type={showConfirmPass ? "text" : "password"}
                {...registerPass("confirmNewPassword")}
                className={`w-full rounded-xl ${showConfirmPass ? "" : "text-xl font-bold tracking-widest"} bg-transparent border px-5 py-2 text-white focus:outline-none focus:border-(--primary) transition ${passwordErrors.confirmNewPassword ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
              {/* Show password button*/}
              <button
                type="button"
                onClick={() => setShowConfirmPass(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                 text-white/60 hover:text-white transition"
                tabIndex={-1}
              >
                {showConfirmPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {passwordErrors.confirmNewPassword && (
              <p className="text-sm text-red-400">
                {passwordErrors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            label={"Change Password"}
            isSubmitting={passwordSubmitting}
            onSubmittingText={"Saving..."}
          />
        </form>
      </div>

      {/* Sign out button*/}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-medium">
        <LogOut size={18} />
        Sign Out
      </button>

    </div>
  );
}

export default ProfilePage