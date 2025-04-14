import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";
import { userRegister } from "../../features/user/userSlice";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "You must accept the Terms of Use and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(userRegister(formData)).unwrap();
        toast.success("Account created successfully");
        localStorage.setItem("emailForSignIn", formData.email);
        navigate("/otp");
      } catch (error) {
        console.error("Sign up error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {loading && <GlobalLoading />}
      {/* Left Side - Image */}
      <div className="hidden md:block relative bg-gray-50">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t2Y6hJ1oTOz4zsKWDxUs78AY5ceTbz.png"
          alt="Elegant armchair with throw blanket"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side - Form */}
      <div className="p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center">
        <div className="max-w-[400px] mx-auto w-full h-full">
          <div className="mb-12 md:hidden">
            <Link to="/" className="text-2xl font-semibold">
              3legant.
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Sign up</h2>
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-green-600 hover:text-green-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your full name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                  ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">
                    I agree with{" "}
                    <Link
                      to="/privacy"
                      className="text-gray-900 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/terms" className="text-gray-900 hover:underline">
                      Terms of Use
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>
              {error && (
                <div className="text-red-500 text-center">{error.message}</div>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
