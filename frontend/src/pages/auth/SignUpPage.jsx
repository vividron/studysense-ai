import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import * as authService from "../../api/auth.api.js";
import toast from "react-hot-toast";
import { ArrowRight, BookOpenText, Mail, Lock, UserPen, EyeOff, Eye } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "../../schemas/authSchema.js";
import { useState } from "react";

const SignUpPage = () => {

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const { token, user } = await authService.signup(
        data.username,
        data.email,
        data.password
      );
      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/activity");
    } catch (error) {
      toast.error(error.message || "Failed to login");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema), mode: "onBlur" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-(--bg-surface) border border-white/5 rounded-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <BookOpenText className="mx-auto text-white mb-4 h-12 w-12" />
          <h1 className="text-2xl font-semibold text-white">
            Create your account
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Sign up to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Username
            </label>
            <div className="relative group">
              <UserPen
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${errors.username
                  ? "text-red-400 group-focus-within:text-red-400"
                  : "text-white/70 group-focus-within:text-(--primary-soft)"
                  }`}
              />
              <input
                type="text"
                {...register("username")}
                className={`w-full rounded-xl bg-transparent border px-11 py-2.5 text-white focus:outline-none transition ${errors.username ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-400 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email
            </label>
            <div className="relative group">
              <Mail
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${errors.email
                  ? "text-red-400 group-focus-within:text-red-400"
                  : "text-white/70 group-focus-within:text-(--primary-soft)"
                  }`}
              />
              <input
                type="email"
                {...register("email")}
                className={`w-full rounded-xl bg-transparent border px-11 py-2.5 text-white focus:outline-none transition ${errors.email ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${errors.password
                  ? "text-red-400 group-focus-within:text-red-400"
                  : "text-white/70 group-focus-within:text-(--primary-soft)"
                  }`}
              />
              <input
                type={showPassword? "text" : "password"}
                {...register("password")}
                className={`w-full rounded-xl ${showPassword? "" : "text-xl font-bold tracking-widest"} bg-transparent border px-11 py-2 text-white focus:outline-none focus:border-(--primary) transition ${errors.password ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-(--primary)"}`}
              />
              {/* Show password button*/}
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                 text-white/60 hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2
           rounded-xl bg-(--primary) bg-linear-to-r from-(--primary) to-purple-500 py-2.5
           font-medium text-white
           hover:opacity-90 disabled:opacity-60
           transition;"
          >
            {isSubmitting ? "Signing in..." : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/signin" className="text-(--primary-soft) hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage